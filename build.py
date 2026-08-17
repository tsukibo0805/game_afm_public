#!/usr/bin/env python3
"""game_afm の案内とマップ試作から、GitHub Pages 用の静的サイトを組み立てる。"""
from __future__ import annotations

import html
import re
import shutil
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
SRC_PREVIEW = ROOT / "tools" / "west-island-map-preview"
SRC_DOCS = ROOT / "docs"
OUT = Path(__file__).resolve().parent

LINK_MAP = {
    "../ゲーム紹介.md": "../index.html",
    "ゲーム紹介.md": "../index.html",
    "行動と定時更新.md": "action.html",
    "マップと探索.md": "explore.html",
    "戦闘.md": "battle.html",
    "スキルと成長.md": "growth.html",
    "装備・仲間・依頼.md": "party.html",
    "用語・FAQ.md": "faq.html",
    "スキルと戦闘の変更案内.md": "skills-combat.html",
    "ユーザー向け/スキルと戦闘の変更案内.md": "guide/skills-combat.html",
}

SKIP_LINK_PREFIXES = (
    "../ゲームデザイン/",
    "../実装/",
    "../運用/",
    "初見プレイヤー向け説明画像原稿.md",
    "ゲームシステム別説明画像原稿.md",
    "Discord告知文.md",
)

GUIDES = [
    ("行動と定時更新.md", "action.html", "行動と定時更新"),
    ("マップと探索.md", "explore.html", "マップと探索"),
    ("戦闘.md", "battle.html", "戦闘"),
    ("スキルと成長.md", "growth.html", "スキルと成長"),
    ("装備・仲間・依頼.md", "party.html", "装備・仲間・依頼"),
    ("用語・FAQ.md", "faq.html", "用語・FAQ"),
    ("スキルと戦闘の変更案内.md", "skills-combat.html", "スキルと戦闘の変更案内"),
]


def rewrite_links(text: str, in_guide: bool) -> str:
    def repl(match: re.Match[str]) -> str:
        label, url = match.group(1), match.group(2)
        if any(url.startswith(prefix) or url == prefix.rstrip("/") for prefix in SKIP_LINK_PREFIXES):
            return label
        mapped = LINK_MAP.get(url)
        if mapped:
            if in_guide and mapped.startswith("guide/"):
                mapped = mapped[len("guide/") :]
            elif not in_guide and mapped.endswith(".html") and not mapped.startswith("../") and not mapped.startswith("guide/"):
                mapped = f"guide/{mapped}"
            return f"[{label}]({mapped})"
        if url.endswith(".png"):
            return label
        return match.group(0)

    return re.sub(r"\[([^\]]+)\]\(([^)]+)\)", repl, text)


def inline_format(text: str) -> str:
    parts: list[str] = []
    idx = 0
    pattern = re.compile(r"`([^`]+)`|\*\*([^*]+)\*\*|\[([^\]]+)\]\(([^)]+)\)")
    for match in pattern.finditer(text):
        parts.append(html.escape(text[idx : match.start()]))
        if match.group(1) is not None:
            parts.append(f"<code>{html.escape(match.group(1))}</code>")
        elif match.group(2) is not None:
            parts.append(f"<strong>{html.escape(match.group(2))}</strong>")
        else:
            parts.append(f'<a href="{html.escape(match.group(4), quote=True)}">{html.escape(match.group(3))}</a>')
        idx = match.end()
    parts.append(html.escape(text[idx:]))
    return "".join(parts)


def convert_table(block: str) -> str:
    rows = [line.strip() for line in block.strip().splitlines() if line.strip()]
    if len(rows) < 2:
        return f"<p>{inline_format(block)}</p>"
    bodies = []
    for index, row in enumerate(rows):
        cells = [cell.strip() for cell in row.strip("|").split("|")]
        if index == 1 and all(re.fullmatch(r":?-{3,}:?", cell.replace(" ", "")) for cell in cells):
            continue
        tag = "th" if index == 0 else "td"
        bodies.append("<tr>" + "".join(f"<{tag}>{inline_format(cell)}</{tag}>" for cell in cells) + "</tr>")
    return "<table>\n" + "\n".join(bodies) + "\n</table>"


def markdown_to_html(markdown: str) -> str:
    markdown = markdown.replace("\r\n", "\n")
    chunks: list[str] = []
    lines = markdown.split("\n")
    i = 0
    while i < len(lines):
        line = lines[i]
        if line.startswith("```"):
            fence = [line]
            i += 1
            while i < len(lines) and not lines[i].startswith("```"):
                fence.append(lines[i])
                i += 1
            if i < len(lines):
                i += 1
            code = "\n".join(fence[1:])
            chunks.append(f"<pre><code>{html.escape(code)}</code></pre>")
            continue
        if line.startswith("|"):
            table = [line]
            i += 1
            while i < len(lines) and lines[i].startswith("|"):
                table.append(lines[i])
                i += 1
            chunks.append(convert_table("\n".join(table)))
            continue
        if re.fullmatch(r"-{3,}", line.strip()):
            chunks.append("<hr>")
            i += 1
            continue
        heading = re.match(r"^(#{1,3})\s+(.*)$", line)
        if heading:
            level = len(heading.group(1))
            chunks.append(f"<h{level}>{inline_format(heading.group(2))}</h{level}>")
            i += 1
            continue
        if re.match(r"^[-*]\s+", line):
            items = []
            while i < len(lines) and re.match(r"^[-*]\s+", lines[i]):
                item_text = re.sub(r"^[-*]\s+", "", lines[i])
                items.append(f"<li>{inline_format(item_text)}</li>")
                i += 1
            chunks.append("<ul>\n" + "\n".join(items) + "\n</ul>")
            continue
        if re.match(r"^\d+\.\s+", line):
            items = []
            while i < len(lines) and re.match(r"^\d+\.\s+", lines[i]):
                item_text = re.sub(r"^\d+\.\s+", "", lines[i])
                items.append(f"<li>{inline_format(item_text)}</li>")
                i += 1
            chunks.append("<ol>\n" + "\n".join(items) + "\n</ol>")
            continue
        if not line.strip():
            i += 1
            continue
        para = [line]
        i += 1
        while i < len(lines) and lines[i].strip() and not re.match(r"^(#{1,3}\s+|```|\||-{3,}$|[-*]\s+|\d+\.\s+)", lines[i]):
            para.append(lines[i])
            i += 1
        chunks.append(f"<p>{inline_format(' '.join(para))}</p>")
    return "\n".join(chunks)


def nav_html(current: str, prefix: str) -> str:
    links = [
        ("index.html", "紹介", current == "intro"),
        ("guide/index.html", "遊び方", current == "guide"),
        ("map/index.html", "地図", current == "map"),
    ]
    items = []
    for href, label, active in links:
        cls = ' class="is-current"' if active else ""
        items.append(f'<a href="{prefix}{href}"{cls}>{label}</a>')
    return (
        '<nav class="site-nav">'
        f'<a class="brand" href="{prefix}index.html">Au Fil des Mers</a>'
        + "".join(items)
        + "</nav>"
    )


def page_html(title: str, body: str, current: str, prefix: str) -> str:
    return f"""<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{html.escape(title)} — Au Fil des Mers</title>
  <link rel="stylesheet" href="{prefix}site.css">
</head>
<body>
{nav_html(current, prefix)}
<article class="page">
{body}
</article>
<footer class="site-footer">Au Fil des Mers プレイヤー向け案内。ゲーム本体とは別の公開サイトです。</footer>
</body>
</html>
"""


def strip_internal_sections(markdown: str) -> str:
    markdown = re.sub(r"\n## 告知・配布用資料\n.*?(?=\n## |\Z)", "\n", markdown, flags=re.S)
    markdown = re.sub(r"\n## この資料を更新する人へ\n.*?(?=\n## |\Z)", "\n", markdown, flags=re.S)
    markdown = re.sub(r"\n## ゲームシステム別の説明画像\n.*?(?=\n## |\Z)", "\n", markdown, flags=re.S)
    markdown = re.sub(
        r"初めて遊ぶ人へDiscordで案内する説明画像は、\[初見プレイヤー向け説明画像原稿\]\([^)]+\)に掲載順、投稿文、代替テキストとともにまとめています。\n*",
        "",
        markdown,
    )
    return markdown


def write(path: Path, text: str) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(text, encoding="utf-8")


def copy_map() -> None:
    dest = OUT / "map"
    if dest.exists():
        shutil.rmtree(dest)
    dest.mkdir()
    for name in ("preview.css", "preview.js"):
        shutil.copy2(SRC_PREVIEW / name, dest / name)
    for folder in ("layouts", "fallbacks"):
        shutil.copytree(SRC_PREVIEW / folder, dest / folder)
    js_path = dest / "preview.js"
    js = js_path.read_text(encoding="utf-8")
    js = js.replace(
        'loadJson(`../../data/maps/${spec.id}.json`)',
        'loadJson(`./fallbacks/${spec.id}.json`)',
    )
    js = js.replace(
        'status.textContent = `${spec.displayName}のマップデータを読めません。リポジトリルートで python3 -m http.server 8766 を実行してください。`;',
        'status.textContent = `${spec.displayName}のマップデータを読めません。`;',
    )
    js_path.write_text(js, encoding="utf-8")
    write(
        dest / "index.html",
        """<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>島マップ — Au Fil des Mers</title>
  <link rel="stylesheet" href="../site.css">
  <link rel="stylesheet" href="preview.css">
  <style>body { grid-template-rows: auto auto 1fr; }</style>
</head>
<body>
<nav class="site-nav">
  <a class="brand" href="../index.html">Au Fil des Mers</a>
  <a href="../index.html">紹介</a>
  <a href="../guide/index.html">遊び方</a>
  <a href="index.html" class="is-current">地図</a>
</nav>
  <header class="top-bar">
    <h1>島マップ</h1>
    <p class="lede">ノードを選ぶと、現在地と行ける場所が地図上で分かります。</p>
    <div class="island-tabs" role="tablist" aria-label="島の選択">
      <button type="button" role="tab" data-map="west-island" aria-selected="true">西の島</button>
      <button type="button" role="tab" data-map="central-island" aria-selected="false">中央の島</button>
      <button type="button" role="tab" data-map="east-island" aria-selected="false">東の島</button>
    </div>
    <p class="status" id="status">読み込み中…</p>
  </header>

  <main class="layout">
    <aside class="panel">
      <section class="current-card">
        <p class="label">現在地</p>
        <h2 id="current-name">—</h2>
        <p id="current-meta">ノードを選ぶと、地図上の位置が強調されます。</p>
      </section>

      <div class="field">
        <label for="node-select">現在のノード</label>
        <select id="node-select"></select>
      </div>

      <section class="moves">
        <h3>ここから行ける場所</h3>
        <ul id="move-list"></ul>
      </section>

      <section class="legend">
        <h3>凡例</h3>
        <ul>
          <li><span class="badge">現在地</span> 大きな円と波紋</li>
          <li><span class="badge">隣接</span> いま行けるノードと道</li>
          <li>円の色はノード種別です</li>
        </ul>
      </section>
    </aside>

    <section class="panel map-wrap">
      <svg id="map" xmlns="http://www.w3.org/2000/svg" role="group" aria-label="島のノード接続図"></svg>
    </section>
  </main>
  <script src="preview.js"></script>
</body>
</html>
""",
    )


def build_guides() -> None:
    intro = (SRC_DOCS / "ゲーム紹介.md").read_text(encoding="utf-8")
    intro = rewrite_links(intro, in_guide=False)
    write(OUT / "index.html", page_html("ゲーム紹介", markdown_to_html(intro), "intro", ""))

    cards = []
    for source_name, dest_name, title in GUIDES:
        source = SRC_DOCS / "ユーザー向け" / source_name
        text = rewrite_links(source.read_text(encoding="utf-8"), in_guide=True)
        write(OUT / "guide" / dest_name, page_html(title, markdown_to_html(text), "guide", "../"))
        cards.append(f'<li><a href="{dest_name}"><strong>{html.escape(title)}</strong></a></li>')

    guide_index = strip_internal_sections((SRC_DOCS / "ユーザー向け" / "README.md").read_text(encoding="utf-8"))
    guide_index = rewrite_links(guide_index, in_guide=True)
    extra = "<h2>ガイド一覧</h2>\n<ul class=\"guide-list\">\n" + "\n".join(cards) + "\n</ul>"
    write(OUT / "guide" / "index.html", page_html("遊び方", markdown_to_html(guide_index) + extra, "guide", "../"))


def main() -> None:
    copy_map()
    build_guides()
    print(f"built {OUT}")


if __name__ == "__main__":
    main()
