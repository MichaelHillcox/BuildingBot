#!/bin/sh

cd /home/bots/node/buildingbot/
pm2 stop buildingbot > /dev/null 2>&1
rm -rf build
git pull origin master
npm ci
npm run build
pm2 start buildingbot > /dev/null 2>&1
pm2 status | grep buildingbot