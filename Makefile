.PHONY: build

all: chrome mozilla

mozilla: pages serviceworker
	rm -rf dist-mozilla
	cp -r build-pages dist-mozilla
	cp \
		build-serviceworker/service-worker.es.js \
		build-serviceworker/service-worker.umd.js \
		dist-mozilla
	cp manifest-mozilla.json dist-mozilla/manifest.json

chrome: pages serviceworker
	rm -rf dist-chrome
	cp -r build-pages dist-chrome
	cp \
		build-serviceworker/service-worker.es.js \
		build-serviceworker/service-worker.umd.js \
		dist-chrome
	cp manifest-chrome.json dist-chrome/manifest.json

serviceworker:
	npm run build -- --config vite-serviceworker.config.js

pages:
	npm run build -- --config vite-pages.config.js
