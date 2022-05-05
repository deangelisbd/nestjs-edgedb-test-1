#!/bin/sh

npm install --include=dev > /proc/1/fd/1 2>/proc/1/fd/1
npm start > /proc/1/fd/1 2>/proc/1/fd/1