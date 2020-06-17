#!/usr/bin/env bash

npm uninstall --no-save @hapi/hapi
npm install --no-save @hapi/hapi@18.4.1
./node_modules/.bin/nyc ./node_modules/.bin/mocha -r ts-node/register test/**/*.spec.ts --unhandled-rejections=strict
npm install