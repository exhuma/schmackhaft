.PHONY: build

all: chrome mozilla
	notify-send -u low -t 1000 Build done

mozilla: pages serviceworker
	mkdir -p dist/mozilla
	cp -r build/pages/* dist/mozilla/
	cp manifest-mozilla.json dist/mozilla/manifest.json

chrome: pages serviceworker
	mkdir -p dist/chrome/src/core
	cp -r build/pages/* dist/chrome/
	cp \
		build/serviceworker/service-worker.es.js \
		build/serviceworker/service-worker.umd.js \
		dist/chrome/src/core
	cp manifest-chrome.json dist/chrome/manifest.json

serviceworker:
	npm run build -- --config vite-serviceworker.config.js

pages:
	npm run build -- --config vite-pages.config.js

clean:
	rm -rf dist build
