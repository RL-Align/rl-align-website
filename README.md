# RL-Align website

A Rust project for the RL-Align community and RL-Kernel. The website uses a black-and-white editorial design with Hanken Grotesk typography throughout, warm orange accents, and cool silver artwork. It preserves the community flame/circuit logo geometry and complete original RL-Kernel architecture diagram.

For the Chinese source handoff and maintenance guide, see [MAINTENANCE.zh-CN.md](MAINTENANCE.zh-CN.md).

## Build

Requires Rust 1.75+ and Cargo. There are no third-party Rust dependencies.

```bash
cargo run --release --offline -- build
```

This generates `dist/index.html`, `dist/404.html`, and `dist/assets/`. Deploy the contents of `dist/` to any static host, including GitHub Pages. The host does not need Rust, a database, or a Node.js runtime. JavaScript handles the mobile navigation, installation tabs, and copy button; the main content is rendered into the HTML.

For a local preview after building:

```bash
python3 -m http.server 8080 --directory dist
```

Then open http://localhost:8080. This command is for local development. Production hosting should serve the static files directly.

Validate the content configuration and required assets:

```bash
cargo run --offline -- check
```

`package.json` is a small build adapter for the hosting environment. `npm run build` runs the same Cargo command. The website itself has no npm dependencies.

## Edit

| File | Purpose |
| --- | --- |
| `site.conf` | Project links, metadata and community contact |
| `templates/index.html` | Homepage content, installation and community |
| `templates/404.html` | Missing-page response |
| `assets/site.css` | Brand, layout, responsive breakpoints and reduced-motion behavior |
| `assets/alignment-chrome.webp` | Original cool-chrome hero artwork, optimized as WebP |
| `assets/fonts/` | Locally hosted Hanken Grotesk variable font and its SIL Open Font License |
| `assets/partners/` | Official vime, AMD, and Moore Threads logo files |
| `assets/favicon.svg` | Monochrome rendering of the existing brand mark |
| `assets/site.js` | Navigation, accessible installation tabs and clipboard interaction |
| `assets/infinity.js` | Local WebGL infinity mesh, chrome reflections, slow rotation and pause control |
| `assets/architecture.png` | Original architecture image, preserved without modification |
| `assets/architecture-overview.svg` | Dark four-layer architecture diagram for desktop |
| `assets/architecture-overview-mobile.svg` | Reflowed overview for mobile; Ascend uses a separate row |
| `content/install-cuda.sh` | NVIDIA CUDA SM90 installation and extension checks |
| `content/install-rocm.sh` | AMD ROCm gfx942 installation and environment checks |
| `content/install-python.sh` | CPU / pure-Python installation commands |
| `src/main.rs` | Rust configuration parser, escaped template renderer and static asset builder |
| `CONTENT_SOURCES.md` | Content provenance, benchmark scope and design references |

The template syntax is `{{KEY}}`. Values are HTML-escaped. Missing keys, duplicate configuration keys, unclosed substitutions, and missing required assets cause the build to fail.

The prospective September 10 launch banner was removed on September 11. No release status is inferred from the passage of time.

## Hosting

Production hosting is being migrated to GitHub Pages in `RL-Align/rl-align-website`, with `https://rlalign.ai` as the intended custom domain. The existing documentation site in `RL-Align/RL-Kernel` is independent.

Enable **Settings → Pages → Source: GitHub Actions**. The included workflow validates both root and project-subpath builds on pull requests, then builds and deploys after changes reach `main`. It can also be run manually. Pages must be enabled in the repository settings before the first deployment.

The workflow reads the base path from the Pages configuration. Before the custom domain is attached it builds for `/rl-align-website`; after the domain is attached it builds for the domain root. To build locally for a project path:

```bash
BASE_PATH=/rl-align-website cargo run --release --locked --offline -- build
BASE_PATH=/rl-align-website python3 scripts/check-static.py
```

For a root-domain build, leave `BASE_PATH` unset. Fonts, images, scripts and styles are served from the same host. The original `.openai/hosting.json` remains solely for the existing Sites preview; it does not control GitHub Pages. Publishing to Sites does not publish to Pages.

Keep the current domain routing in place until the GitHub Pages deployment is verified. Then configure `rlalign.ai` as the Pages custom domain, update DNS, rerun the workflow to use the domain-root paths, and enable HTTPS when GitHub provisions the certificate.

The Partners strip uses the three organizations specified by the user: vime, AMD, and Moore Threads. Official logo sources and the font license are recorded in `CONTENT_SOURCES.md`. No customer counts, testimonials, universal consistency guarantees, or end-to-end speedup extrapolations are inferred from the partner list.

## Architecture section removal

The architecture introduction, four-layer explanation, overview diagram, complete-diagram disclosure, and Architecture navigation entry have been removed from the homepage at the user's request. The remaining sections are numbered consecutively. Original architecture assets are retained unmodified for future reuse; they are no longer displayed on the homepage.

## Dark visual refresh, September 11

Miles and RadixArk were used as structural references for restrained navigation, large type, generous spacing, and a focused infrastructure narrative. The community postcard informed the cool metallic material and exploration theme. The website uses original copy and artwork, with no assets or endorsements copied from either reference site. Technical benchmark values and their scope are retained. The original orange brand PNG is preserved at source; CSS presents a monochrome mark in the interface. The original complete architecture PNG remains byte-for-byte intact.

## Typography and partner update, September 11

The first follow-up revision restored orange to the main calls to action, selected title lines, and operator-layer highlights, and used the STIX Two Text family observed on Miles. The subsequent all-site typography update below replaces that family with Hanken Grotesk according to the user's newer RadixArk reference.

The previous six-name ecosystem strip is replaced with the three requested official logos. Vime refers to the RL framework at `vllm-project/vime`. Its official JPEG remains unmodified; CSS clips only the surrounding whitespace and presents a monochrome rendering against the dark background. AMD uses its official white header SVG, and Moore Threads uses its official bilingual footer PNG. Mobile layouts preserve logo aspect ratios and give the bilingual mark its own row on the narrowest screens.

## Performance section removal, September 11

At the user's request, the complete performance / benchmark section and its navigation entry are removed. The capability link now points to the operator documentation, and the remaining sections are numbered consecutively. Previously reviewed benchmark sources remain in `CONTENT_SOURCES.md` as historical provenance, not current homepage content.

## Site-wide typography update, September 11

The user's latest reference is the RadixArk Our Mission page, which uses Hanken Grotesk. The same family now covers headings, prose, navigation, buttons, small labels, code, the footer, the 404 page, and editable architecture-diagram labels. Headings use lighter 400–500 weights with modest negative letter spacing; body text uses weight 300 and approximately 1.6× line spacing. Font sizes are adjusted for each layout and responsive breakpoint.

The Latin variable WOFF2 is hosted locally, with its SIL Open Font License in `assets/fonts/OFL-Hanken-Grotesk.txt`. Both SVG overview diagrams embed that same font so that their labels render consistently when viewed as images or opened on their own. Official partner logos and the complete original architecture PNG retain their original artwork.
