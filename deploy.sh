#!/bin/bash

echo "Primero dry-run:"

rsync --dry-run -avz -i -n --delete --no-perms --no-owner --no-group ./dist/ root@media-telesur:/var/www/live2vod

echo "CUALQUIER TECLA PARA EJECUTAR"
read

rsync -avz -i --delete --no-perms --no-owner --no-group ./dist/ root@media-telesur:/var/www/live2vod
