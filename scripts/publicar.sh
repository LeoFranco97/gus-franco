#!/usr/bin/env bash
# Publica o site no GitHub Pages.
#
# O token do gh aqui nao tem o escopo `workflow`, entao em vez de um GitHub
# Action o deploy e o build local empurrado para o branch gh-pages. Para
# trocar por Action um dia: `gh auth refresh -s workflow` e depois um
# .github/workflows/deploy.yml comum.
set -euo pipefail
cd "$(dirname "$0")/.."

npm run build

TMP=$(mktemp -d)
cp -R dist/. "$TMP/"
touch "$TMP/.nojekyll"

git worktree add --force /tmp/gus-pages gh-pages 2>/dev/null \
  || git worktree add --force -b gh-pages /tmp/gus-pages
rm -rf /tmp/gus-pages/*
cp -R "$TMP/." /tmp/gus-pages/
cd /tmp/gus-pages
git add -A
git commit -q -m "Build $(date +%Y-%m-%d\ %H:%M)" || echo "nada mudou"
git push -q origin gh-pages
cd - >/dev/null
git worktree remove /tmp/gus-pages --force
rm -rf "$TMP"
echo "Publicado: https://leofranco97.github.io/gus-franco/"
