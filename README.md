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

 own. Official partner logos and the complete original architecture PNG retain their original artwork.
