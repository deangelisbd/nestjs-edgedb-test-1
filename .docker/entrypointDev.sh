#!/bin/sh

echo 'Please wait, this takes several seconds...'
npm install glob rimraf
npm install --include=dev
npm run build
npm run start:debug