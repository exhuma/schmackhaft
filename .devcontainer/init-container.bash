#!/bin/bash
set -xe
sudo apt update
sudo apt -y install \
    libnotify-bin \
    pandoc \
    jq
npm clean-install
