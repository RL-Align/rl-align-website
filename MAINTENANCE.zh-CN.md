# RL-Align 官网源码与维护说明

## 代码在哪里

本项目是 RL-Align 官网的独立源码项目。团队源码仓库为 [RL-Align/rl-align-website](https://github.com/RL-Align/rl-align-website)，默认分支为 `main`。官网源码与 [RL-Kernel](https://github.com/RL-Align/RL-Kernel) 项目分别维护。

官网正式发布目标为社区 GitHub 仓库的 Pages。原 Site 的开发目录为 `/workspace/sites/rl-align`，保留作预览；正式切换状态以 GitHub Pages 部署结果与域名解析为准。

当前线上地址：https://rlalign.ai

源码下载包包含 Rust 源码、HTML 模板、CSS、JavaScript、图片、字体及其许可证、配置文件、已构建的网页和这份说明。它是交付时的快照，后续线上修改不会自动写入你已下载的压缩包。

## 项目如何工作

Rust 负责读取配置、渲染模板并生成网页。浏览器接收的是静态 HTML、CSS、JavaScript 和图片；线上服务器无需运行 Rust。

项目没有第三方 Rust 依赖。`package.json` 是当前托管环境的构建入口，实际运行的仍然是 Cargo 命令。

## 常用修改位置

| 需求 | 修改文件 |
| --- | --- |
| 改首页文字、区块、导航、按钮链接 | `templates/index.html` |
| 改字体、颜色、字号、间距、手机排版 | `assets/site.css` |
| 改菜单、安装选项卡、复制按钮、社区气泡动画控制 | `assets/site.js` |
| 改首页 3D 无限符号、旋转速度、金属反光 | `assets/infinity.js` |
| 改网站标题、介绍、GitHub、文档、社交平台链接、邮箱 | `site.conf` |
| 改安装命令 | `content/install-cuda.sh`、`content/install-rocm.sh`、`content/install-python.sh` |
| 改 404 页面 | `templates/404.html` |
| 替换图片、Logo、字体 | `assets/`，保留相应来源与许可证 |
| 查找保留的架构图素材（首页已移除） | `assets/architecture.png`、`assets/architecture-overview.svg`、`assets/architecture-overview-mobile.svg` |
| 增加页面的构建逻辑 | `src/main.rs` |

`dist/` 是构建输出。日常维护请修改模板、样式和配置，再重新构建；直接修改 `dist/` 的结果会被下次构建覆盖。

## 在自己的电脑上预览

先安装 Rust 1.75 或更高版本，以及用于本地静态文件预览的 Python 3。解压源码包，进入包含 `Cargo.toml` 的 `rl-align-website` 目录，运行：

```bash
cargo run --locked --offline -- check
cargo run --release --locked --offline -- build
python3 -m http.server 8080 --directory dist
```

在浏览器中打开 http://localhost:8080 。修改代码后，重新运行构建命令并刷新浏览器；结束预览时在终端按 Ctrl+C。

Windows 如果使用 Python Launcher，可以把最后一条命令改为：

```powershell
py -3 -m http.server 8080 --directory dist
```

不需要运行 `npm install`。如果电脑已经安装 Node.js，也可以使用现有的 `npm run build`，它会调用同一个 Rust 构建命令。

## 后续新增内容

### 首页增加新闻、项目或合作伙伴

在 `templates/index.html` 中增加对应区块，在 `assets/site.css` 中补充样式，图片放入 `assets/`。如果增加导航入口，需要确保 `href="#区块ID"` 对应页面中真实存在的 `id`。

### 新增独立 Blog 或文档页面

当前构建器只输出首页和 404 页面。新增独立页面时，需要同时添加 HTML 模板、在 `src/main.rs` 中注册渲染和输出路径，并连接导航或文章列表。只在 `templates/` 中增加一个文件，不会自动生成新页面。

如果之后需要频繁发布大量文章，可以再增加 Markdown 内容目录和文章索引生成逻辑。当前项目尚未包含 CMS、数据库或表单后台。

## 如何把修改发布上线

### 2026-09-16 迁移到 GitHub Pages

用户明确要求将当前官网从 Sites 迁移至 `RL-Align/rl-align-website` 的 GitHub Pages。本次迁移提前汇总此前 3/5 批次的全部源码改动，避免发布旧版官网。迁移代码已准备；实际启用 Pages、首次部署成功和 DNS 切换必须分别验证，不能仅凭代码上传判断上线完成。

目标正式域名为 `https://rlalign.ai`。现有文档站 `https://rl-align.github.io/RL-Kernel/` 属于独立仓库，本次不修改。

1. 在官网仓库 **Settings → Pages → Source** 选择 **GitHub Actions**。
2. 将迁移改动审核合并到 `main`。工作流先验证根目录与项目子路径两种构建，再发布；也支持手动运行。
3. 先验证 GitHub Pages 项目地址上的页面、字体、图片、导航和邮箱交互。
4. 在 Pages 中设置自定义域名 `rlalign.ai`，再将该域名的 DNS 切换至 GitHub Pages。不要更改邮箱相关 MX/TXT 记录。
5. 域名设置后重新运行工作流，让构建读取新的根路径；待证书签发后启用 HTTPS，再用大陆、香港和海外网络实测。

构建器通过 `BASE_PATH` 环境变量支持根域名和项目子路径。Pages 工作流自动从 `actions/configure-pages` 读取该值。字体路径相对于 CSS 文件解析；404 页面回首页链接也包含正确前缀。`scripts/check-static.py` 检查实际输出中的本地资源是否存在且前缀正确。

### 后续协作

仍按五次需求一批：先修改、构建并提供预览，同一需求的反馈修正不重复计数；累计五次后汇总一个社区 PR，团队审核合并。Pages 正式站在 PR 合并到 `main` 后自动更新。独立预览和正式站分别发布，不自动合并 PR，不强推。

原 `.openai/hosting.json` 仅保留原 Site 预览绑定。它不会控制 Pages，也不会把社区提交自动回写 Sites。

### 本次迁移包含的待汇总改动

- 第 1 次需求（2026-09-12）：页脚增加 `© 2026 RL-Align Team. All rights reserved.`；按反馈将页脚收为单条横栏，保留 Logo、版权和 Apache 2.0 / GitHub 链接，移除第二层分隔线、标语和 Partnerships 邮箱块。合作邮箱入口移至首页按钮下方 Apache 2.0 后，以橙色带下划线的 `contact us` 链接打开 `mailto:team@rl-align.org`；手机上自适应排版。同项需求的样式修正，仍计 1/5。
- 第 2 次需求（2026-09-12）：四处区块标签改为自然大小写、正常字距与 Hanken Grotesk 常规字重；社区邮箱文字改为第六个浮动信封气泡，点击展开 `team@rl-align.org`，地址可点击写信，支持再次点击、外部点击与 Escape 收起，沿用暂停动画与减少动态效果设置。
- 第 3 次需求（2026-09-12）：首页 3D 图注的 `RL-KERNEL` 改为 `RL-Kernel`，参照首页说明使用 Hanken Grotesk 300 字重、17px 字号、正常字距及相同文字颜色。

## 当前已确认的设计约定

- 黑色背景、浅色文字、橙色点缀。
- 可编辑文字统一使用 Hanken Grotesk，字体随网站托管。
- 首页上方说明改为普通大小写、正常字距和正文式行距。
- 合作伙伴使用 vime、AMD、摩尔线程的官方 Logo。
- 性能数据展示与 Benchmarks 导航已移除。
- 首页架构介绍、架构图展示和 Architecture 导航已移除，后续区块编号已顺延。原始 PNG 和桌面、手机 SVG 素材保留，供后续复用。

后续更换字体时，需要一起更新 CSS、字体预加载和许可证。如果重新使用架构 SVG，也需同步其中的嵌入字体。

## 社区社交气泡

社区区域的五个社交链接统一放在 `site.conf`：`WECHAT_URL`、`X_URL`、`LINKEDIN_URL`、`WHATSAPP_URL`、`SLACK_URL`。修改后重新构建并发布。社交链接气泡在新标签打开，并带有平台名称和键盘焦点提示。第六个邮箱气泡使用 `CONTACT_EMAIL`，通过原生 details/summary 展开地址，地址的 mailto 链接用于写信；不依赖 JavaScript 也可展开，JavaScript 补充外部点击与 Escape 收起。

气泡位置与浮动速度位于 `assets/site.css` 的 `.social-position`、各平台类和 `social-float` 动画中。`assets/site.js` 控制暂停、继续、减少动态效果偏好以及离开视野或切换标签页后的自动暂停。关闭 JavaScript 时保留静态可点击图标。

图标放在 `assets/social/`，使用 Font Awesome Free 的品牌 SVG，来源与许可证见该目录的 `NOTICE.txt`。

当前 LinkedIn 使用用户提供的 `/company/143609996/admin/dashboard/` 地址。该地址属于管理后台，公开主页未能核实；取得公开主页链接后应替换 `LINKEDIN_URL`，便于普通访客访问。

## 首页 3D 无限符号

`assets/infinity.js` 使用浏览器原生 WebGL 生成并渲染三维网格，不依赖第三方 CDN、模型下载或额外 npm 包。`surface()` 控制形状，`environment()` 控制银色和蓝紫色反光，`rotation()` 控制初始倾角。动画中的 `0.0002` 是每毫秒旋转的弧度，当前约 31 秒一圈。

动画限制在每秒最多 30 帧，并限制画布分辨率。访问者可以通过图注旁的按钮暂停或继续；页面不可见或符号滚出视野时自动停转。系统开启减少动态效果时显示静止的 3D 画面。

`assets/alignment-chrome.webp` 仍作为无 JavaScript、WebGL 不可用或图形上下文丢失时的静态回退图。请保留该文件，避免不支持 3D 的设备出现空白。
