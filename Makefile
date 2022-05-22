.PHONY: build

all: chrome mozilla
	notify-send -u low -t 1000 Build done

mozilla: pages serviceworker bundled_docs
	mkdir -p dist/mozilla
	cp -r build/pages/* dist/mozilla/
	cp manifest-mozilla.json dist/mozilla/manifest.json

chrome: pages serviceworker bundled_docs
	mkdir -p dist/chrome/src/core
	cp -r build/pages/* dist/chrome/
	cp \
		build/serviceworker/service-worker.es.js \
		build/serviceworker/service-worker.umd.js \
		dist/chrome/src/core
	cp manifest-chrome.json dist/chrome/manifest.json

bundled_docs:
	mkdir -p dist/chrome/pages/docs
	mkdir -p dist/mozilla/pages/docs
	pandoc -s -f markdown -t html README.md > dist/chrome/pages/README.html
	cp dist/chrome/pages/README.html dist/mozilla/pages/README.html
	cp -r docs/screenshots dist/chrome/pages/docs
	cp -r docs/screenshots dist/mozilla/pages/docs

serviceworker:
	npm run build -- --config vite-serviceworker.config.js

pages:
	npm run build -- --config vite-pages.config.js

clean:
	rm -rf dist build
