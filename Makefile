.PHONY: build
CURRENT_VERSION = $(shell jq -r .version package.json)

all: chrome mozilla
	notify-send -u low -t 1000 Build done

mozilla: pages bundled_docs
	mkdir -p unpackaged/mozilla
	cp -r build/pages/* unpackaged/mozilla/
	sed -e 's/__version__/$(CURRENT_VERSION)/' \
		manifest-mozilla.json > unpackaged/mozilla/manifest.json

chrome: pages bundled_docs
	mkdir -p unpackaged/chrome/src/core
	cp -r build/pages/* unpackaged/chrome/
	sed -e 's/__version__/$(CURRENT_VERSION)/' \
		manifest-chrome.json > unpackaged/chrome/manifest.json

bundled_docs:
	mkdir -p unpackaged/chrome/pages/docs
	mkdir -p unpackaged/mozilla/pages/docs
	pandoc -s -f markdown -t html README.md > unpackaged/chrome/pages/README.html
	cp unpackaged/chrome/pages/README.html unpackaged/mozilla/pages/README.html
	cp -r docs/screenshots unpackaged/chrome/pages/docs
	cp -r docs/screenshots unpackaged/mozilla/pages/docs

pages:
	npm run build -- --config vite-pages.config.js

dist: mozilla chrome
	mkdir -p dist
	(cd unpackaged/mozilla && zip -r ../../dist/mozilla-$(CURRENT_VERSION).zip .)
	(cd unpackaged/chrome && zip -r ../../dist/chrome-$(CURRENT_VERSION).zip .)
	git archive --format zip --output \
		dist/schmackhaft-v$(CURRENT_VERSION)-src.zip \
		v$(CURRENT_VERSION)


clean:
	rm -rf dist build unpackaged
