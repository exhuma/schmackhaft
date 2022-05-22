.PHONY: build
CURRENT_MOZ_VERSION = $(shell jq -r .version manifest-mozilla.json)
CURRENT_CHR_VERSION = $(shell jq -r .version manifest-chrome.json)

all: chrome mozilla
	notify-send -u low -t 1000 Build done

mozilla: pages serviceworker bundled_docs
	mkdir -p unpackaged/mozilla
	cp -r build/pages/* unpackaged/mozilla/
	cp manifest-mozilla.json unpackaged/mozilla/manifest.json

chrome: pages serviceworker bundled_docs
	mkdir -p unpackaged/chrome/src/core
	cp -r build/pages/* unpackaged/chrome/
	cp \
		build/serviceworker/service-worker.es.js \
		build/serviceworker/service-worker.umd.js \
		unpackaged/chrome/src/core
	cp manifest-chrome.json unpackaged/chrome/manifest.json

bundled_docs:
	mkdir -p unpackaged/chrome/pages/docs
	mkdir -p unpackaged/mozilla/pages/docs
	pandoc -s -f markdown -t html README.md > unpackaged/chrome/pages/README.html
	cp unpackaged/chrome/pages/README.html unpackaged/mozilla/pages/README.html
	cp -r docs/screenshots unpackaged/chrome/pages/docs
	cp -r docs/screenshots unpackaged/mozilla/pages/docs

serviceworker:
	npm run build -- --config vite-serviceworker.config.js

pages:
	npm run build -- --config vite-pages.config.js

dist: mozilla chrome
ifeq ($(CURRENT_CHR_VERSION), $(CURRENT_MOZ_VERSION))
	mkdir -p dist
	(cd unpackaged/mozilla && zip -r ../../dist/mozilla-$(CURRENT_MOZ_VERSION).zip .)
	(cd unpackaged/chrome && zip -r ../../dist/chrome-$(CURRENT_CHR_VERSION).zip .)
	git archive --format zip --output dist/schmackhaft-v$(CURRENT_CHR_VERSION)-src.zip master
else
	$(error Inconsistent versions in Chrome and Mozilla package.json)
endif


clean:
	rm -rf dist build unpackaged
