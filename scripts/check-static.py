"""Check the actual build's local URLs for root and GitHub project deployments."""
import os
import re
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlsplit

root = Path(__file__).resolve().parents[1] / "dist"
prefix = os.environ.get("BASE_PATH", "").rstrip("/")
checked = set()


def check_url(value, parent):
    url = urlsplit(value)
    if url.scheme or url.netloc or not url.path:
        return
    if url.path.startswith("/"):
        assert url.path.startswith(prefix + "/"), f"Wrong base path: {value}"
        target = root / url.path[len(prefix) + 1:]
    else:
        target = parent / url.path
    if target.is_dir():
        target = target / "index.html"
    assert target.is_file(), f"Missing local resource: {value} ({target})"
    checked.add(target)


class Page(HTMLParser):
    def handle_starttag(self, tag, attrs):
        for name, value in attrs:
            if name in ("href", "src", "poster") and value:
                check_url(value, root)


for name in ("index.html", "404.html"):
    text = (root / name).read_text()
    assert "{{" not in text, f"Unrendered template in {name}"
    Page().feed(text)
for css in (root / "assets").glob("*.css"):
    for url in re.findall(r"url\([\"']?([^\)\"']+)[\"']?\)", css.read_text()):
        check_url(url, css.parent)
assert "mailto:team@rl-align.org" in (root / "index.html").read_text()
print(f"Validated {len(checked)} local resources with BASE_PATH={prefix!r}")
