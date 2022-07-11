#!/bin/bash
set -xe
npm clean-install
pre-commit install
