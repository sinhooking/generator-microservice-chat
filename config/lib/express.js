const fs = require('fs');
const path = require('path');
const express = require('express');
const config = require('../config');
const { logErrors } = require('./errorHandler');

module.exports = () => {
    const app = express();

    initializeHelmet(app);

    initializeNosqlDB();

    initializeStatic(app);

    initializeCompression(app);

    initializeBodyParser(app);

    initializeSession(app);

    initializeCors(app);

    initializeMorgan(app);

    initializeStaticRoute(app);

    initializeRoute(app);

    initalizeErrorHandler(app);

    require('./winston');

    return app;
}


function initalizeErrorHandler(app) {
    app.use(logErrors);
}

function initializeHelmet(app) {
    const helmet = require('helmet');
    app.use(helmet())
}

function initializeNosqlDB() {
    const mongoose = require('./mongoose');
    mongoose.dbInit();
}

function initializeStaticRoute(app) {
    app.use('/', express.static(path.resolve('build')));
}

function initializeMorgan(app) {
    const logger = require('morgan');
    const { stream } = require('./winston');
    app.use(logger('dev'));
    app.use(logger('combined', { stream }));
}

function initializeCors(app) {
    const cors = require('cors');
    app.use(cors());
}

function initializeCompression(app) {
    const compression = require('compression');
    app.use(compression());
}

function initializeSession(app) {
    const session = require('express-session');
    app.use(session(config.session));
}

function initializeStatic(app) {
    express.static(path.join(__dirname, 'build'));
    app.use('/uploads', express.static('uploads'));
}

function initializeBodyParser(app) {
    /**
     *  json : for parsing application/json
     *  extended : for parsing application/x-www-form-urlencoded
     */
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
}

async function initializeRoute(app) {
    const modulesRootPath = path.resolve('modules');

    function grepRoutes(moduleObject) {
        return new Promise((resolve, reject) => {
            Promise.all(moduleObject.map(routeModule => routeModule.childPathArr.length > 0 ? modulePathSearch(path.resolve(routeModule.modulesPath, 'routes')) : delete routeModule))
                .then(routeModules => {
                    const _routeModules = [];
                    routeModules.map(x => Object.keys(x).length ? _routeModules.push(x) : undefined);
                    resolve(_routeModules)
                })
                .then(err => reject(err));
        });
    }

    function moduleIterator(moduleObject) {
        return new Promise((resolve, reject) => {
            const { modulesPath, childPathArr } = moduleObject;

            Promise.all(childPathArr.map(moduleName => modulePathSearch(path.resolve(modulesPath, moduleName))))
                .then(pathArray => resolve(pathArray))
                .catch(err => reject(err));
        })
    }

    function modulePathSearch(modulesPath) {
        return new Promise((resolve, reject) => {
            fs.readdir(modulesPath, (err, childPathArr) => {
                if (err) return reject(err);
                return resolve({ modulesPath, childPathArr });
            })
        });
    }

    modulePathSearch(modulesRootPath)
        .then(moduleIterator)
        .then(grepRoutes)
        .then(routes => routes.map(routeObject => {
            return new Promise((resolve, reject) => {
                try {
                    routeObject.childPathArr.forEach(route => route.indexOf('routes.js') > -1 ? require(path.resolve(routeObject.modulesPath, route))(app, logErrors) : null);
                    return resolve();
                } catch (err) {
                    return reject(err);
                }
            });
        }))
        .then(() => {
            //http error code 404
            app.use((req, res, next) => logErrors(null, req, res, next));
        })
        .catch(err => console.error(err))
}

