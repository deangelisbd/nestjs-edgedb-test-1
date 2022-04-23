#!/usr/bin/env bash

if [[ $(curl -Is ${1} | head -n 1) ]] 
 then echo "true"
fi