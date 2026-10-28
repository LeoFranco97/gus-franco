#!/usr/bin/env python3
"""
Mirror every photo onto this repo, so the site stops depending on the CDN
that currently serves gusfrn.co.

The site ships with photo paths stored as short prefixes (@i/ and @c/) that
`img()` in src/data/site.ts expands into 46graus CDN URLs. That keeps the repo
tiny and lets their CDN do the serving, but it means the site goes dark if
that hosting is ever cancelled.

This script walks the same data, downloads every file into public/photos and
rewrites the prefixes to plain relative paths, which `img()` already handles.
Nothing in the components needs to change.

    python3 scripts/mirror-photos.py            # everything, all three sizes
    python3 scripts/mirror-photos.py --sizes mid thumb   # skip the full size

Be aware of the weight: all three sizes of all 1979 frames is several GB and
well past what GitHub Pages is meant to hold. `--sizes mid thumb` is the
practical option if the goal is a self-hosted site rather than an archive.
"""

import argparse
import json
import os
import re
import sys
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
PUBLIC = ROOT / 'public'
OUT = PUBLIC / 'photos'
INDEX = ROOT / 'src' / 'data' / 'stories-index.json'
SITE_TS = ROOT / 'src' / 'data' / 'site.ts'

HOSTS = {
    '@i/': 'https://cdn-sites-images.46graus.com/files/',
    '@c/': 'https://cdn.46graus.com/files/',
}
UA = {'User-Agent': 'Mozilla/5.0'}


def expand(p: str) -> str:
    for prefix, host in HOSTS.items():
        if p.startswith(prefix):
            return host + p[len(prefix):]
    return p


def local(p: str) -> str:
    """The path the mirrored file gets, keyed by prefix so @i and @c cannot
    collide on the same name."""
    for prefix in HOSTS:
        if p.startswith(prefix):
            return 'photos/%s/%s' % (prefix[1], p[len(prefix):])
    return p


def collect(sizes):
    """Every stored path the site can ask for, from the data and from the
    hand-curated lists in site.ts."""
    paths = set()

    for f in sorted((PUBLIC / 'stories').glob('*.json')):
        for photo in json.loads(f.read_text())['photos']:
            for k in sizes:
                if photo.get(k):
                    paths.add(photo[k])

    for s in json.loads(INDEX.read_text()):
        for k in ('full', 'mid', 'thumb'):
            if s['cover'].get(k) and k in sizes:
                paths.add(s['cover'][k])
        for p in s['preview']:
            for k in ('mid', 'thumb'):
                if p.get(k) and k in sizes:
                    paths.add(p[k])

    # The hero wall, the portrait and the marquee are literals in site.ts and
    # are always mirrored, whatever --sizes says: they are the opening frame.
    paths.update(re.findall(r"'(@[ic]/[^']+)'", SITE_TS.read_text()))
    return sorted(paths)


def download(url: str, dest: Path) -> bool:
    if dest.exists() and dest.stat().st_size > 0:
        return False
    dest.parent.mkdir(parents=True, exist_ok=True)
    req = urllib.request.Request(url, headers=UA)
    tmp = dest.with_suffix(dest.suffix + '.part')
    with urllib.request.urlopen(req, timeout=90) as r, open(tmp, 'wb') as f:
        while True:
            chunk = r.read(1 << 16)
            if not chunk:
                break
            f.write(chunk)
    tmp.replace(dest)
    return True


def rewrite():
    """Point every stored path at the mirrored copy."""
    def fix(text):
        return re.sub(r'@([ic])/', lambda m: 'photos/%s/' % m.group(1), text)

    for f in list((PUBLIC / 'stories').glob('*.json')) + [INDEX, SITE_TS]:
        f.write_text(fix(f.read_text()))
    print('rewrote paths in %d files' % (len(list((PUBLIC / 'stories').glob('*.json'))) + 2))


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--sizes', nargs='+', default=['full', 'mid', 'thumb'],
                    choices=['full', 'mid', 'thumb'])
    ap.add_argument('--no-rewrite', action='store_true',
                    help='download only, leave the paths pointing at the CDN')
    args = ap.parse_args()

    paths = collect(set(args.sizes))
    print('%d files to mirror' % len(paths))

    got = skipped = failed = 0
    for i, p in enumerate(paths, 1):
        dest = PUBLIC / local(p)
        try:
            if download(expand(p), dest):
                got += 1
            else:
                skipped += 1
        except Exception as e:                                  # noqa: BLE001
            failed += 1
            print('FAIL %s: %s' % (p, e), file=sys.stderr)
        if i % 100 == 0:
            print('  %d/%d  new=%d cached=%d failed=%d' % (i, len(paths), got, skipped, failed))

    size = sum(f.stat().st_size for f in OUT.rglob('*') if f.is_file())
    print('done. new=%d cached=%d failed=%d, %.1f GB on disk'
          % (got, skipped, failed, size / 1e9))

    if failed:
        print('Some files failed. Fix those before rewriting.', file=sys.stderr)
        return 1
    if not args.no_rewrite:
        rewrite()
    return 0


if __name__ == '__main__':
    raise SystemExit(main())
