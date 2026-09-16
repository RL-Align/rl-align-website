use std::{collections::BTreeMap, env, fs, io, path::Path, process};

type Result<T> = std::result::Result<T, Box<dyn std::error::Error>>;

fn normalize_base_path(value: &str) -> Result<String> {
    if value.is_empty() || value == "/" { return Ok(String::new()); }
    let path = value.trim_end_matches('/');
    if !path.starts_with('/') || path[1..].split('/').any(|part| {
        part.is_empty() || part == "." || part == ".." ||
        !part.bytes().all(|c| c.is_ascii_alphanumeric() || b"-_.".contains(&c))
    }) {
        return Err("BASE_PATH must be an absolute URL path such as /rl-align-website".into());
    }
    Ok(path.to_owned())
}

fn escape_html(value: &str) -> String {
    value.replace('&', "&amp;").replace('<', "&lt;").replace('>', "&gt;")
        .replace('"', "&quot;").replace('\'', "&#39;")
}

fn read_config(path: &Path) -> Result<BTreeMap<String, String>> {
    let mut values = BTreeMap::new();
    for (index, line) in fs::read_to_string(path)?.lines().enumerate() {
        let line = line.trim();
        if line.is_empty() || line.starts_with('#') { continue; }
        let (key, value) = line.split_once('=').ok_or_else(|| format!("Invalid config at line {}", index + 1))?;
        if values.insert(key.trim().to_owned(), value.trim().to_owned()).is_some() {
            return Err(format!("Duplicate config key: {}", key.trim()).into());
        }
    }
    Ok(values)
}

fn render(template: &str, values: &BTreeMap<String, String>) -> Result<String> {
    let mut output = String::new();
    let mut remaining = template;
    while let Some(start) = remaining.find("{{") {
        output.push_str(&remaining[..start]);
        remaining = &remaining[start + 2..];
        let end = remaining.find("}}").ok_or("Unclosed template variable")?;
        let key = remaining[..end].trim();
        let value = values.get(key).ok_or_else(|| format!("Unknown template variable: {}", key))?;
        output.push_str(&escape_html(value));
        remaining = &remaining[end + 2..];
    }
    output.push_str(remaining);
    Ok(output)
}

fn copy_assets(source: &Path, target: &Path) -> io::Result<()> {
    fs::create_dir_all(target)?;
    for entry in fs::read_dir(source)? {
        let entry = entry?;
        if entry.file_type()?.is_symlink() {
            return Err(io::Error::new(io::ErrorKind::InvalidInput, "Asset symlinks are not supported"));
        }
        let destination = target.join(entry.file_name());
        if entry.file_type()?.is_dir() { copy_assets(&entry.path(), &destination)?; }
        else { fs::copy(entry.path(), destination)?; }
    }
    Ok(())
}

fn build(root: &Path, check_only: bool) -> Result<()> {
    let mut values = read_config(&root.join("site.conf"))?;
    values.insert("BASE_PATH".to_owned(), normalize_base_path(&env::var("BASE_PATH").unwrap_or_default())?);
    for (key, path) in [("INSTALL_CUDA", "content/install-cuda.sh"), ("INSTALL_ROCM", "content/install-rocm.sh"), ("INSTALL_PYTHON", "content/install-python.sh")] {
        values.insert(key.to_owned(), fs::read_to_string(root.join(path))?);
    }
    let index = render(&fs::read_to_string(root.join("templates/index.html"))?, &values)?;
    let not_found = render(&fs::read_to_string(root.join("templates/404.html"))?, &values)?;
    for asset in ["site.css", "site.js", "infinity.js", "rl-align-logo.png", "alignment-chrome.webp", "favicon.svg", "architecture.png", "architecture-overview.svg", "architecture-overview-mobile.svg", "fonts/hanken-grotesk-latin-variable.woff2", "fonts/OFL-Hanken-Grotesk.txt", "partners/vime.jpg", "partners/amd.svg", "partners/moore-threads.png"] {
        if !root.join("assets").join(asset).is_file() { return Err(format!("Missing asset: {}", asset).into()); }
    }
    if !check_only {
        let output = root.join("dist");
        fs::create_dir_all(&output)?;
        fs::write(output.join("index.html"), index)?;
        fs::write(output.join("404.html"), not_found)?;
        copy_assets(&root.join("assets"), &output.join("assets"))?;
        println!("Built RL-Align website → {}", output.display());
    } else { println!("Configuration, templates, and required assets are valid."); }
    Ok(())
}

fn main() {
    let args: Vec<String> = env::args().skip(1).collect();
    let command = args.first().map(String::as_str).unwrap_or("build");
    let result = match command {
        "build" | "check" if args.len() <= 1 => build(Path::new(env!("CARGO_MANIFEST_DIR")), command == "check"),
        "help" | "--help" | "-h" => { println!("RL-Align website\n\n  cargo run -- build   Generate dist/\n  cargo run -- check   Validate configuration and templates\n\nNo third-party Rust dependencies or Node build step required."); Ok(()) },
        _ => Err("Usage: cargo run -- [build|check|help]".into()),
    };
    if let Err(error) = result { eprintln!("Error: {}", error); process::exit(1); }
}
