---
title: laojiumen
date: 2018-06-12 21:39:10
categories:
    - 门规
tags:
---

# 博客迁移至老九门

`寻龙分金看缠山 一重缠是一重关`

- 今天开始，nic私人博客迁移到老九门，我们几个工程师兄弟可以一起维护一个博客，打造我们自己的知识库。

- 为了简化流程，整个库master分支为博客页面分支，blog分支为源代码分支
- blog分支自动连接到travis-ci中，有任何的push都会自动调用ci，构建的静态代码自动推送到master分支更新博客。(用hexo构建)
- 若用hexo的兄弟，clone了整个项目后
  - 切换到`blog`分支
  - hexo new xxxxxx(文章标题，英文)，会产生source/_posts/year-month-day-xxxxxx.md
- 若不用hexo的兄弟，clone了整个项目后
  - 创建`source/_posts/year-month-day-xxxxxx.md`文件(虽然文件名不强求，但是最好按照这个规则，好管理)
- 编辑产生的文件,添加`categories`, 例子如下:
    ```
    ---
        title: laojiumen
        date: 2018-06-12 21:39:10
        categories:
            - 门规
        tags:
            - 门规
    ---
    ```
  - `categories` 必须添加，tag随意

- 然后正常提交，推送到blog分支，会自动触发travis-ci更新(虽然这个过程你们看不到)

# important!
- 重要的事情说三遍: 不要上传大文件，最好只上传文章
- 重要的事情说三遍: 不要上传大文件，最好只上传文章
- 重要的事情说三遍: 不要上传大文件，最好只上传文章
 
 
