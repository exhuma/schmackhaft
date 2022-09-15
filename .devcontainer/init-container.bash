#!/bin/bash
set -xe
npm clean-install
pre-commit install
npx playwright install-deps
npx playwright install
