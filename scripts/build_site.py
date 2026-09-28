#!/usr/bin/env python3
"""Lightweight maintainer for Ming Shi's static academic website.

The site is intentionally dependency-free and the HTML pages are human-editable.
This script validates structured data, local links, HTML IDs, and optionally bumps
cache-version query strings across the site.

Usage:
  python scripts/build_site.py
  python scripts/build_site.py --version 20260928-5
"""
from __future__ import annotations

import argparse
import json
import re
import sys
from collections import Counter
from datetime import date
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urlsplit

ROOT = Path(__file__).resolve().parents[1]
HTML_FILES = [
    ROOT / "index.html",
    ROOT / "research.html",
    ROOT / "publications.html",
    ROOT / "studentsandteaching.html",
    ROOT / "service.html",
    ROOT / "privacy.html",
    ROOT / "404.html",
]


def read_js_array(path: Path, variable: str) -> list[dict]:
    text = path.read_text(encoding="utf-8")
    match = re.search(rf"window\.{re.escape(variable)}\s*=\s*(\[.*\])\s*;\s*$", text, re.S)
    if not match:
        raise ValueError(f"Could not parse window.{variable} in {path.relative_to(ROOT)}")
    return json.loads(match.group(1))


class PageParser(HTMLParser):
    def __init__(self) -> None:
        super().__init__(convert_charrefs=True)
        self.ids: list[str] = []
        self.links: list[tuple[str, str]] = []
        self.h1_count = 0

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        values = dict(attrs)
        if values.get("id"):
            self.ids.append(values["id"] or "")
        if tag == "h1":
            self.h1_count += 1
        for attr in ("href", "src"):
            value = values.get(attr)
            if value:
                self.links.append((attr, value))


def local_target(page: Path, raw: str) -> Path | None:
    if raw.startswith(("http://", "https://", "mailto:", "tel:", "data:", "javascript:")):
        return None
    split = urlsplit(raw)
    if not split.path or split.path == "/":
        return ROOT / "index.html"
    decoded = unquote(split.path)
    if decoded.startswith("/"):
        decoded = decoded[1:]
    return (ROOT / decoded) if decoded else ROOT / "index.html"


def validate() -> list[str]:
    errors: list[str] = []
    warnings: list[str] = []

    publications = read_js_array(ROOT / "assets/data/publications.js", "PUBLICATIONS")
    projects = read_js_array(ROOT / "assets/data/research-projects.js", "RESEARCH_PROJECTS")
    highlights = read_js_array(ROOT / "assets/data/highlights.js", "HIGHLIGHTS")

    for name, records in (("publication", publications), ("research project", projects), ("highlight", highlights)):
        ids = [str(record.get("id", "")) for record in records]
        duplicates = [key for key, count in Counter(ids).items() if key and count > 1]
        if duplicates:
            errors.append(f"Duplicate {name} IDs: {', '.join(duplicates)}")
        if any(not key for key in ids):
            errors.append(f"At least one {name} is missing an ID")

    required_pub = ("id", "type", "title", "authors", "venue", "year", "status")
    for pub in publications:
        missing = [key for key in required_pub if key not in pub]
        if missing:
            errors.append(f"Publication {pub.get('id', '?')} missing: {', '.join(missing)}")
        link = str(pub.get("link", ""))
        target = local_target(ROOT / "publications.html", link) if link else None
        if target and not target.exists():
            errors.append(f"Publication {pub.get('id')} points to missing local file: {link}")

    for page in HTML_FILES:
        if not page.exists():
            errors.append(f"Missing page: {page.name}")
            continue
        parser = PageParser()
        parser.feed(page.read_text(encoding="utf-8"))
        duplicate_ids = [key for key, count in Counter(parser.ids).items() if count > 1]
        if duplicate_ids:
            errors.append(f"{page.name} has duplicate IDs: {', '.join(duplicate_ids)}")
        if page.name != "404.html" and parser.h1_count != 1:
            errors.append(f"{page.name} should have exactly one h1; found {parser.h1_count}")
        for attr, raw in parser.links:
            target = local_target(page, raw)
            if target and not target.exists():
                errors.append(f"{page.name}: missing {attr} target {raw}")

    for path in (
        ROOT / "ming_shi_69.jpg",
        ROOT / "assets/css/styles.css",
        ROOT / "assets/js/site.js",
        ROOT / "assets/images/research/research-agenda.svg",
        ROOT / "papers/Fresh-Enough-to-Decide_AIoT2026.pdf",
    ):
        if not path.exists():
            errors.append(f"Required asset missing: {path.relative_to(ROOT)}")

    # Confidential reviewer copy must not be deployed.
    confidential_names = [p.name for p in ROOT.rglob("*.pdf") if p.name.lower() in {"pdf(1).pdf", "neurips-reviewer-copy.pdf"}]
    if confidential_names:
        errors.append("Confidential reviewer-copy PDF detected in deployable site: " + ", ".join(confidential_names))

    published = sum(p.get("status") == "published" for p in publications)
    accepted = sum(p.get("status") == "accepted" for p in publications)
    submitted = sum(p.get("status") == "submitted" for p in publications)
    print(f"Publications: {len(publications)} total · {published} published · {accepted} accepted · {submitted} submitted")
    print(f"Research atlas: {len(projects)} projects · Highlights: {len(highlights)} entries")
    for warning in warnings:
        print(f"WARNING: {warning}", file=sys.stderr)
    return errors


def bump_version(version: str) -> None:
    if not re.fullmatch(r"[A-Za-z0-9._-]+", version):
        raise ValueError("Version may contain only letters, digits, period, underscore, and hyphen")
    pattern = re.compile(r"([?&]v=)[A-Za-z0-9._-]+")
    for page in HTML_FILES:
        text = page.read_text(encoding="utf-8")
        updated = pattern.sub(rf"\g<1>{version}", text)
        page.write_text(updated, encoding="utf-8")
    print(f"Updated cache-version query strings to {version}")


def update_sitemap() -> None:
    today = date.today().isoformat()
    pages = [
        ("https://mingshihomepage.com/", "1.0"),
        ("https://mingshihomepage.com/research.html", "0.9"),
        ("https://mingshihomepage.com/publications.html", "0.9"),
        ("https://mingshihomepage.com/studentsandteaching.html", "0.8"),
        ("https://mingshihomepage.com/service.html", "0.8"),
        ("https://mingshihomepage.com/privacy.html", "0.3"),
    ]
    lines = ['<?xml version="1.0" encoding="UTF-8"?>', '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">']
    for url, priority in pages:
        lines.append(f"  <url><loc>{url}</loc><lastmod>{today}</lastmod><priority>{priority}</priority></url>")
    lines.append("</urlset>")
    (ROOT / "sitemap.xml").write_text("\n".join(lines) + "\n", encoding="utf-8")
    print(f"Updated sitemap.xml with lastmod={today}")


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--version", help="Bump the ?v= cache version across HTML files")
    parser.add_argument("--no-sitemap", action="store_true", help="Do not refresh sitemap.xml")
    args = parser.parse_args()

    if args.version:
        bump_version(args.version)
    if not args.no_sitemap:
        update_sitemap()
    errors = validate()
    if errors:
        print("\nValidation failed:", file=sys.stderr)
        for error in errors:
            print(f"  - {error}", file=sys.stderr)
        return 1
    print("Validation passed.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
