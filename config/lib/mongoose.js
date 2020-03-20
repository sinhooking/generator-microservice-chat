const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const mongoose = require('mongoose');

const config = require('../config');


const mongooseOption = {
    useCreateIndex: config.db.development.useCreateIndex,
    useNewUrlParser: config.db.development.useNewUrlParser,
    useUnifiedTopology: config.db.development.useUnifiedTopology
};

exports.dbInit = (cb) => {
    mongoose.Promise = config.db.development.promise;
    readModules().then((successInfo) => {
            mongoose.connect(config.db.development.uri, mongooseOption)
                .then((connection) => {
                    if (cb) cb(connection);
                })
                .catch(error => console.error(error));
        })
        .catch(err => {
            throw Error(err);
        });
};

exports.dropdb = (cb) => {
    if (arguments.length < 1) return console.error('arguments is not found');

    mongoose.createConnection(config.uri, mongooseOption)
        .then((connection) => cb(connection))
        .catch(error => console.error(error));
};

exports.connect = () => {
    return new Promise((resolve, reject) => {
        mongoose.createConnection(config.uri, mongooseOption)
            .then(connection => resolve(connection))
            .catch(err => reject(err));
    });
}

exports.disconnectDb = (cb) => {
    mongoose.connection.close((err) => {
        console.log('Mongoose connection disconnected');
        if (cb) {
            cb(err);
        }
    });
};

function readModules() {
    return new Promise((resolve, reject) => {
        const argFlag = arguments.length > 0 ? true : false;
        fs.readdir(path.resolve('models'), (err, models) => {
            const modelLoader = model => {
                if (model.indexOf('nosql') !== -1) {
                    console.log('')
                    console.log(chalk.blueBright(`Mongoose ${model} Schema load`));
                    console.log(chalk.blueBright('-------------------------------'))
                    const importedModel = require(path.resolve('models', model));
                    console.log(chalk.green(model));
                    if (importedModel.seed) {
                        argFlag ? importedModel.seed() : undefined;
                    };
                }
            };

            Promise.all([models.forEach(modelLoader)])
                .then(success => resolve())
                .catch(err => reject(err));
        });
    })
}

exports.readModules = readModules;