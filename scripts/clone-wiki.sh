#!/usr/bin/env bash
set -euo pipefail

WIKI_DIR="wiki-content"

if [ -d "$WIKI_DIR" ]; then
	echo "wiki-content/ already exists. Pull latest? (y/n)"
	read -r answer
	if [ "$answer" = "y" ]; then
		git -C "$WIKI_DIR" pull
	fi
	exit 0
fi

git clone --depth 1 https://github.com/Pipe-Bomb/server.wiki.git "$WIKI_DIR"
echo "Wiki cloned to wiki-content/"
