#!/bin/sh

echo 'Please wait, this takes several seconds...' >> /proc/1/fd/1
npm install glob rimraf >> /proc/1/fd/1
npm install --include=dev >> /proc/1/fd/1
npm run build >> /proc/1/fd/1
npm run start:debug >> /proc/1/fd/1