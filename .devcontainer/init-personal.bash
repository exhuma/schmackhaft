#!/bin/bash
set -xe
sudo apt update
sudo apt -y install \
    vim-nox
git clone https://github.com/exhuma/dotfiles /home/node/dotfiles
