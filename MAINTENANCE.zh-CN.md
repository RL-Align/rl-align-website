# RL-Align 官网源码与维护说明

## 代码在哪里

本项目是 RL-Align 官网的独立源码项目。当前开发目录为 `/workspace/sites/rl-align`，源代码和修改历史已保存在这个 Site 对应的 Git 仓库中。

目前没有把这份官网源码同步到 `github.com/RL-Align` 组织下的 GitHub 仓库。RL-Kernel 项目仓库与官网项目分别维护。

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

### 继续使用当前 Site

可以继续在本项目对应的对话中提出具体修改。更新过程是修改源码、构建、保存版本、发布到当前网址。`.openai/hosting.json` 绑定当前 Site；继续维护这个网站时应保留该绑定。

自己在电脑上修改文件或推送到一个新 GitHub 仓库，不会自动更新当前 `chatgpt.site` 地址。仍需把确定的源码版本交回当前 Site 的发布流程。

### 使用社区自己的 GitHub 仓库

团队长期协作可以建立独立仓库，例如 `RL-Align/rl-align-website`，把源码包的内容作为初始代码，用分支、PR 和 commit 记录迭代。这个名称是建议，目前没有由本次交付创建该仓库。

源码中已有 `.github/workflows/pages.yml`，用于手动构建并发布到 GitHub Pages。使用前需要在目标仓库启用 Pages，并选择 GitHub Actions 作为构建来源。该工作流通过 `workflow_dispatch` 手动触发，没有配置推送即发布。

当前页面资源使用 `/assets/...` 根路径。适用于独立域名、组织根站点或当前 Site。若使用 `rl-align.github.io/rl-align-website/` 这类项目子路径，需要先增加路径前缀支持，不能直接按现有配置发布。

换托管平台时，构建后的 `dist/` 可交给静态网站托管服务。域名注册、DNS 绑定和网站源码维护是分别处理的事项。

## 当前已确认的设计约定

- 黑色背景、浅色文字、橙色点缀。
- 可编辑文字统一使用 Hanken Grotesk，字体随网站托管。
- 首页上方说明改为普通大小写、正常字距和正文式行距。
- 合作伙伴使用 vime、AMD、摩尔线程的官方 Logo。
- 性能数据展示与 Benchmarks 导航已移除。
- 首页架构介绍、架构图展示和 Architecture 导航已移除，后续区块编号已顺延。原始 PNG 和桌面、手机 SVG 素材保留，供后续复用。

后续更换字体时，需要一起更新 CSS、字体预加载和许可证。如果重新使用架构 SVG，也需同步其中的嵌入字体。

## 社区社交气泡

社区区域的五个链接统一放在 `site.conf`：`WECHAT_URL`、`X_URL`、`LINKEDIN_URL`、`WHATSAPP_URL`、`SLACK_URL`。修改后重新构建并发布。所有气泡在新标签打开链接，并带有平台名称和键盘焦点提示。

气泡位置与浮动速度位于 `assets/site.css` 的 `.social-position`、各平台类和 `social-float` 动画中。`assets/site.js` 控制暂停、继续、减少动态效果偏好以及离开视野或切换标签页后的自动暂停。关闭 JavaScript 时保留静态可点击图标。

图标放在 `assets/social/`，使用 Font Awesome Free 的品牌 SVG，来源与许可证见该目录的 `NOTICE.txt`。

当前 LinkedIn 使用用户提供的 `/company/143609996/admin/dashboard/` 地址。该地址属于管理后台，公开主页未能核实；取得公开主页链接后应替换 `LINKEDIN_URL`，便于普通访客访问。

## 首页 3D 无限符号

`assets/infinity.js` 使用浏览器原生 WebGL 生成并渲染三维网格，不依赖第三方 CDN、模型下载或额外 npm 包。`surface()` 控制形状，`environment()` 控制银色和蓝紫色反光，`rotation()` 控制初始倾角。动画中的 `0.0002` 是每毫秒旋转的弧度，当前约 31 秒一圈。

动画限制在每秒最多 30 帧，并限制画布分辨率。访问者可以通过图注旁的按钮暂停或继续；页面不可见或符号滚出视野时自动停转。系统开启减少动态效果时显示静止的 3D 画面。

`assets/alignment-chrome.webp` 仍作为无 JavaScript、WebGL 不可用或图形上下文丢失时的静态回退图。请保留该文件，避免不支持 3D 的设备出现空白。
