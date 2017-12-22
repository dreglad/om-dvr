#!/bin/bash

echo "Primero dry-run:"

rsync --dry-run -avz -i -n --delete --no-perms --no-owner --no-group ./dist/ om@media-telesur:/var/www/om-dvr

echo "CUALQUIER TECLA PARA EJECUTAR"
read

rsync -avz -i --delete --no-perms --no-owner --no-group ./dist/ om@media-telesur:/var/www/om-dvr
