const appEnv = require('./env/app.env');
const path = require('path');
const fs = require('fs');
const _ = require('lodash');

const mergeEnv = {};

const result = fs.readdirSync(path.resolve('config/env'));
result.map(envModule => {
    const requireModule = require(path.resolve('config/env', envModule));
    _.merge(mergeEnv, requireModule);
});

module.exports = mergeEnv;