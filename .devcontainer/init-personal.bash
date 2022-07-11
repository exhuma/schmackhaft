#!/bin/bash
set -xe
curl https://raw.githubusercontent.com/exhuma/dotfiles/master/bootstrap_devcontainer.bash | bash -
npm config set sign-git-tag true
