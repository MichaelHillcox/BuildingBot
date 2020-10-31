#!/bin/sh

pm2 stop buildingbot
rm -rf build
git pull origin master
npm ci
npm run build
pm2 start buildingbot