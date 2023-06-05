#!/bin/bash

# delete node_modules
find . -name 'node_modules' -type d -prune -print -exec rm -rf '{}' \;

# delete dist folders
find . -name 'dist' -type d -prune -print -exec rm -rf '{}' \;

# tsbuildinfo files
find . -name 'tsconfig.build.tsbuildinfo' -type f -prune -print -exec rm -rf '{}' \;
