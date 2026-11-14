昭盛元官网 · /admin 说明（V3.8）
================================================

本目录的 index.html 就是交付包根目录的 AdminConsole.html（同一个文件）。
访问 https://<域名>/admin/ 即可打开图形化管理后台。

· 线上打开时会自动读取站点当前 data/*.json，显示的是线上真实内容
· 所有改动只保存在浏览器本机，不自动写 GitHub（避免合并冲突）
· 改完点「保存并导出更新包」下载 ZIP，把 data/ 与 VERIFY/ 覆盖进仓库
  根目录，看到「全部一致（8/8）」后 commit + push 才会上线

旧的 Decap CMS 配置已备份到 Docs/Decap-旧后台配置.yml.bak，
不再被加载。它依赖 Netlify Identity + Git Gateway，本站托管在
Cloudflare Workers 上没有这两个服务，所以会报
"Unable to access identity settings"，且会自动向 GitHub 写入。
请勿恢复。
