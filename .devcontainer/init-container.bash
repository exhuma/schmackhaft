#!/bin/bash
set -xe
sudo apt update
sudo apt -y install \
    libnotify-bin \
    pandoc \
    vim-nox
git clone https://github.com/exhuma/dotfiles /home/node/dotfiles
npm clean-install