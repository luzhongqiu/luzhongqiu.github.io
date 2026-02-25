---
title: Agent Skill 脚本路径问题：四大 CLI 实现对比与最佳实践
date: 2026-02-25 18:00:00
categories:
  - AI
tags:
  - Agent
  - Skill
  - Claude Code
  - Codex
  - oh-my-opencode
  - openclaw
  - AgentSkills
---

# 写在前面

在写 Agent Skill 时，有一个问题几乎每个人都会踩到：

> **脚本路径怎么写？是绝对路径还是相对路径？相对谁？如果 skill 既可以用户级安装，也可以项目级安装，怎么保证两种情况都能跑？**

这篇文章不是基于猜测，而是直接读了四个主流 CLI 的源码：

- **Claude Code**（`@anthropic-ai/claude-code` v2.1.39）—— Anthropic 官方
- **Codex**（`@openai/codex` v0.104.0）—— OpenAI 官方，Rust 编译的原生二进制
- **oh-my-opencode**（npx 版本）—— 社区最流行的 opencode 增强层
- **openclaw**（v2026.2.6-3）—— 另一个社区 CLI，内嵌 `pi-coding-agent`

---

# 一、什么是 Agent Skill？

Skill 是以目录为单位的"能力包"，最少只需要一个 `SKILL.md` 文件：

```
my-skill/
├── SKILL.md          ← 必须，包含 name/description 和指令
├── scripts/          ← 可选，执行脚本
├── references/       ← 可选，参考文档
└── assets/           ← 可选，模板/资源
```

`SKILL.md` 格式固定：

```markdown
---
name: my-skill
description: 这个 skill 做什么、什么时候用。
---

## 指令

执行脚本：
scripts/run.py
```

四家 CLI 都遵循 [agentskills.io](https://agentskills.io) 这个开放规范，结构是通用的。

---

# 二、各 CLI 的安装路径

Skill 可以安装在不同层级，优先级通常是**项目级 > 用户级 > 内置**：

| Scope | Claude Code | Codex | oh-my-opencode | openclaw |
|---|---|---|---|---|
| 项目级 | `.claude/skills/` | `.agents/skills/`（向上遍历到 git root）| `.opencode/skills/` | `<workspace>/skills/` |
| 用户级 | `~/.claude/skills/` | `~/.agents/skills/` | `~/.config/opencode/skills/` | `~/.openclaw/skills/` |
| 系统级 | — | `/etc/codex/skills/` | — | — |
| 内置 | 随包发布 | 随包发布 | 随包发布 | 随包发布 |

关键点：**同名 skill，项目级优先**。这意味着团队可以在 repo 里覆盖全局 skill。

---

# 三、各 CLI 的路径注入机制（源码层面）

这是这篇文章的核心。

## 3.1 Claude Code：注入 `baseDir` 字符串

Claude Code 在每次调用 skill 时，会把 skill 的绝对路径注入到 LLM 上下文：

```javascript
// claude-code/cli.js（v2.1.39）
const skillBlock = `<skill name="${skill.name}" location="${skill.filePath}">
References are relative to ${skill.baseDir}.

${body}
</skill>`;
```

LLM 收到的上下文形如：

```xml
<skill name="my-skill" location="/Users/nic/.claude/skills/my-skill/SKILL.md">
References are relative to /Users/nic/.claude/skills/my-skill.

（SKILL.md 正文）
</skill>
```

**结论**：不需要写任何路径变量。SKILL.md 里直接写 `scripts/run.py`，LLM 会根据注入的 `baseDir` 自行补全成绝对路径。

## 3.2 Codex：注入 file path，模型自己读文件

Codex 是 Rust 写的原生二进制，system prompt 里注入的是这段话：

```
## Skills
A skill is a set of local instructions to follow that is stored in a `SKILL.md` file.
Below is the list of skills that can be used. Each entry includes a name, description,
and file path so you can open the source for full instructions when using a specific skill.

### How to use skills
- Discovery: The list above is the skills available in this session
  (name + description + file path). Skill bodies live on disk at the listed paths.
```

每个 skill 都附带绝对 file path，模型需要时会用 read 工具去读完整的 `SKILL.md`。这是**渐进式加载**（progressive disclosure）：

1. 启动时只加载 `name` + `description` + 路径（约 100 tokens）
2. 决定使用某个 skill 时，才读完整 `SKILL.md`（< 5000 tokens）
3. 需要时才读 `scripts/`、`references/` 里的文件

**结论**：SKILL.md 里写相对路径即可，Codex 会把 skill 的绝对路径告诉模型，模型能算出 `scripts/` 的完整路径。

## 3.3 oh-my-opencode：`@path` 语法，代码层面替换

oh-my-opencode 是唯一做**代码级字符串替换**的实现：

```javascript
// src/shared/skill-path-resolver.ts
function resolveSkillPathReferences(content, basePath) {
  return content.replace(
    /@([a-zA-Z0-9_-]+\/[a-zA-Z0-9_.\-\/]*)/g,
    (_, relativePath) => join(basePath, relativePath)
  );
}
```

同时在 system prompt 里注入说明：

```
Base directory for this skill: /absolute/path/to/skill/
File references (@path) in this skill are relative to this directory.
```

**结论**：如果你写的 skill 专门面向 oh-my-opencode，可以用 `@scripts/run.py` 语法，会被**硬替换**成绝对路径，100% 可靠，不依赖模型推理。

## 3.4 openclaw：`{baseDir}` 变量 + 模型推理

openclaw 的文档里写了"Use `{baseDir}` in instructions to reference the skill folder path"，但源码（`pi-coding-agent`）的实际实现是：

```javascript
// pi-coding-agent/dist/core/skills.js
// formatSkillsForPrompt 输出
`<available_skills>
  <skill>
    <name>my-skill</name>
    <description>...</description>
    <location>/absolute/path/to/SKILL.md</location>
  </skill>
</available_skills>`

// 附带提示语：
"When a skill file references a relative path, resolve it against the skill directory
 (parent of SKILL.md / dirname of the path) and use that absolute path in tool commands."
```

**没有代码替换 `{baseDir}`**。`{baseDir}` 的实际效果依赖模型从 `<location>` 字段推算出父目录，然后自行理解。

**结论**：`{baseDir}` 可以写，模型一般能理解，但这是"prompt 约定"不是"代码保证"。

---

# 四、四家对比总结

| CLI | 路径机制 | `{baseDir}` 变量 | 相对路径写法 | 可靠性 |
|---|---|---|---|---|
| **Claude Code** | 注入 `References are relative to <绝对路径>` | ❌ 无此变量 | 直接写 `scripts/foo.py` | ✅ 模型理解稳定 |
| **Codex** | 注入每个 skill 的绝对 file path | ❌ 无此变量 | 直接写 `scripts/foo.py` | ✅ 模型理解稳定 |
| **oh-my-opencode** | 代码级替换 `@path` → 绝对路径 | ❌（用 `@path`）| 写 `@scripts/foo.py` | ✅ 确定性替换 |
| **openclaw** | 注入 `<location>` + 提示语 | ⚠️ 文档写了但靠模型 | 写 `{baseDir}/scripts/foo.py` 或相对路径 | ⚠️ 依赖模型推理 |

---

# 五、最佳实践

## 5.1 agentskills.io 官方规范的建议

[agentskills.io 规范](https://agentskills.io/specification) 明确写道：

> **When referencing other files in your skill, use relative paths from the skill root**

```markdown
Run the extraction script:
scripts/extract.py
```

**不写任何变量，直接写相对路径**。所有 CLI 都会把 SKILL.md 的绝对路径告知模型，模型有能力补全出 `scripts/` 的完整路径。

## 5.2 脚本内部：用语言原生方式定位自身

无论哪个 CLI，脚本被执行时的 working directory 是不固定的（通常是用户的项目目录，不是 skill 目录）。所以脚本内部**不能**用相对路径读同目录下的文件，要用语言原生方式：

**Python：**

```python
import os
from pathlib import Path

# 定位脚本所在目录（即 skill 的 scripts/ 目录）
SCRIPT_DIR = Path(__file__).resolve().parent
SKILL_DIR = SCRIPT_DIR.parent  # scripts/ 的上一级就是 skill 根目录

# 安全读取同目录下的配置文件
config_path = SKILL_DIR / "assets" / "config.json"
```

**Shell：**

```bash
#!/bin/bash
# 定位脚本所在目录
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
SKILL_DIR="$(dirname "$SCRIPT_DIR")"

# 安全读取同目录下的资源
source "$SKILL_DIR/references/helpers.sh"
```

## 5.3 兼容三家的写法

如果你的 skill 要同时兼容 Claude Code、Codex、openclaw：

```markdown
---
name: my-skill
description: 做某件事。
---

## 执行步骤

运行主脚本：

```bash
python scripts/main.py
```

脚本路径是相对于本 skill 目录（即 SKILL.md 所在目录）的相对路径。
```

如果你的 skill 专属于 oh-my-opencode，可以用 `@` 语法获得更强的保证：

```markdown
运行主脚本：

```bash
uv run @scripts/main.py
```

## 5.4 目录结构建议

```
my-skill/
├── SKILL.md                ← 用相对路径引用，写清楚 `scripts/` 前缀
├── scripts/
│   └── main.py             ← 内部用 __file__ 定位，不假设 cwd
├── references/
│   └── api-reference.md    ← 按需加载的大型参考文档
└── assets/
    └── template.json       ← 静态资源
```

---

# 六、一句话总结

> **在 SKILL.md 里写 `scripts/foo.py`（相对路径，无变量），在脚本内部用 `__file__` / `$(dirname "$0")` 定位自己。这套写法在 Claude Code、Codex、openclaw 三家都能跑，在 oh-my-opencode 里也能跑（或者改用 `@scripts/foo.py` 获得代码级保证）。**

`{baseDir}` 这个写法仅在 openclaw 的文档里出现，且底层是靠模型推理，不是代码保证。其他三家不认这个变量。

---

# 参考

- [agentskills.io 规范](https://agentskills.io/specification)
- [Codex Skills 官方文档](https://developers.openai.com/codex/skills/)
- [openai/skills 示例仓库](https://github.com/openai/skills)
- `@anthropic-ai/claude-code` v2.1.39 源码（`cli.js`）
- `@openai/codex` v0.104.0 源码（Rust 二进制字符串）
- `oh-my-opencode` 源码（`src/shared/skill-path-resolver.ts`）
- `openclaw` + `@mariozechner/pi-coding-agent` 源码（`dist/core/skills.js`）
