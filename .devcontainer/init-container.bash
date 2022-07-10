#!/bin/bash
set -xe
pip install --user pipx
pipx install pre-commit
npm clean-install
pre-commit install
