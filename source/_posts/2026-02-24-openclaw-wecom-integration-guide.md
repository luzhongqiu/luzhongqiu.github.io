---
title: 如何在 OpenClaw 中接入企业微信：插件选择、配置与避坑
date: 2026-02-24 16:05:00
categories:
  - AI
tags:
  - OpenClaw
  - 企业微信
  - WeCom
  - 插件
  - 教程
---

# 写在前面

这篇文章不走“拍脑袋教程”路线，而是基于我对真实项目与代码仓库的检索来写：

- 先确认 **OpenClaw 官方主仓** 的 WeCom 能力现状；
- 再对比 **社区插件** 的安装方式、配置字段和适用场景；
- 最后给出一套“今天就能落地”的接入方案。

如果你想的是“OpenClaw + 企业微信到底该装哪个插件、怎么配才稳”，这篇就够用。

---

# 一、我检索了哪些实际项目

为了避免信息失真，我主要查了这几类来源：

1. **OpenClaw 官方仓库**（`openclaw/openclaw`）
2. **中国生态插件仓库**（`BytePioneer-AI/openclaw-china`）
3. **独立社区插件仓库**（`sunnoy/openclaw-plugin-wecom`）

检索到的关键事实（可复核）：

- `BytePioneer-AI/openclaw-china` 的 README 明确给出了安装命令：
  - `openclaw plugins install @openclaw-china/wecom-app`
  - `openclaw plugins install @openclaw-china/wecom`
- 同仓库的 `doc/guides/wecom-app/configuration.md` 给出了 `channels.wecom-app.*` 的完整配置项（如 `corpId`、`corpSecret`、`agentId`、`token`、`encodingAESKey`）。
- 同仓库 `extensions/wecom-app/openclaw.plugin.json` 显示该插件 channel id 为 `wecom-app`，定位是“企业微信自建应用消息渠道（支持主动推送）”。
- `sunnoy/openclaw-plugin-wecom` 的 `package.json` 显示 npm 包名是 `@sunnoy/wecom`，channel id 为 `wecom`。
- OpenClaw 主仓存在 WeCom 接入 PR（`openclaw/openclaw#13228`），但 PR 页面显示仍在讨论/未并入主线（写文时状态）。

一句话总结：**当前最稳妥的是用社区成熟插件，官方主线能力可持续关注但不建议当作唯一依赖。**

---

# 二、先选插件：不是“哪个好”，而是“哪个适合你”

## 1）`@openclaw-china/wecom-app`（推荐默认）

适合：

- 你要走 **企业微信自建应用** 模式；
- 你需要 **主动发送消息**（不是只被动回消息）；
- 主要是 1v1 或内部应用消息链路。

优点：

- 配置文档完整；
- 字段语义清晰，和企业微信后台参数一一对应；
- 在中文社区里案例最多，排障资料也更容易找。

## 2）`@openclaw-china/wecom`

适合：

- 你更偏向“机器人”形态；
- 需要群聊触达能力（具体以插件当前版本说明为准）。

## 3）`@sunnoy/wecom`

适合：

- 你希望用独立社区维护的 WeCom channel；
- 你能接受插件生态差异，并自己做版本回归验证。

我建议：

- **企业内部落地优先**：先上 `wecom-app`；
- 后续再根据业务扩展到其他 channel，不要一开始就“全渠道一起上”。

---

# 三、最小可用接入方案（按 wecom-app）

下面这套是我认为最适合大多数团队的“先跑通再优化”路径。

## Step 1：安装插件

```bash
openclaw plugins install @openclaw-china/wecom-app
```

## Step 2：在企业微信后台准备参数

进入企业微信管理后台，创建自建应用，拿到这些值：

- `CorpId`
- `AgentId`
- `Secret`
- API 回调的 `Token`
- API 回调的 `EncodingAESKey`

## Step 3：写入 OpenClaw 配置

官方社区文档给出的 CLI 配置方式如下（核心字段）：

```bash
openclaw config set channels.wecom-app.enabled true
openclaw config set channels.wecom-app.webhookPath /wecom-app
openclaw config set channels.wecom-app.token your-token
openclaw config set channels.wecom-app.encodingAESKey your-43-char-encoding-aes-key
openclaw config set channels.wecom-app.corpId your-corp-id
openclaw config set channels.wecom-app.corpSecret your-app-secret
openclaw config set channels.wecom-app.agentId 1000002
```

如果你习惯直接改 `openclaw.json`，可以按这个最小模板：

```json
{
  "channels": {
    "wecom-app": {
      "enabled": true,
      "webhookPath": "/wecom-app",
      "token": "your-token",
      "encodingAESKey": "your-43-char-encoding-aes-key",
      "corpId": "your-corp-id",
      "corpSecret": "your-app-secret",
      "agentId": 1000002
    }
  }
}
```

## Step 4：配置回调 URL 并联调

企业微信“接收消息”里 URL 要和 `webhookPath` 对应，例如：

- `https://your-domain.com/wecom-app`

联调建议按这个顺序：

1. 先验证 URL 可达（公网 / 反向代理 / 证书）
2. 再验证 Token 与 AESKey 是否一致
3. 最后才测消息收发（避免把网络问题误判成插件问题）

---

# 四、这几个坑最容易卡住

## 1）公网可达性没打通

企业微信回调是平台主动调用你，内网地址肯定不行。最常见问题是：

- 没有公网入口；
- 网关端口没放行；
- Nginx/Traefik 反代路径没对齐 `webhookPath`。

## 2）把插件名和 channel id 搞混

- 插件包名是安装维度（如 `@openclaw-china/wecom-app`）；
- `channels.wecom-app` 是配置维度。

两者不一致就会出现“安装成功但渠道不生效”的假象。

## 3）直接押注“官方 PR 能力”

官方主仓的 WeCom 能力确实在推进，但如果你要本周上线，建议优先选**已在社区验证过的插件版本**，把可控性握在自己手里。

---

# 五、给团队的落地建议（可直接照抄）

如果你是第一次接 OpenClaw + 企业微信，我建议按这个节奏做：

1. **第 1 天**：先跑通 `wecom-app` 最小链路（收消息 + 回消息）；
2. **第 2 天**：补日志、告警、重试策略；
3. **第 3 天**：再做多账号、语音识别、群聊等增强。

不要一上来就追求“功能全开”。在 IM 场景里，**稳定可回消息** 永远比“功能很多但偶发掉线”更重要。

---

# 参考链接（可复核）

- [BytePioneer-AI/openclaw-china README](https://github.com/BytePioneer-AI/openclaw-china/blob/main/README.md)
- [wecom-app 配置指南](https://github.com/BytePioneer-AI/openclaw-china/blob/main/doc/guides/wecom-app/configuration.md)
- [wecom-app 插件清单（openclaw.plugin.json）](https://github.com/BytePioneer-AI/openclaw-china/blob/main/extensions/wecom-app/openclaw.plugin.json)
- [sunnoy/openclaw-plugin-wecom package.json](https://github.com/sunnoy/openclaw-plugin-wecom/blob/main/package.json)
- [OpenClaw 主仓 WeCom PR #13228](https://github.com/openclaw/openclaw/pull/13228)
