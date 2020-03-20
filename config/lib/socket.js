const fs = require('fs');
const path = require('path');

exports.initSocket = (io) => {
    console.log('initialize socket.io')
    const modulesRootPath = path.resolve('socket-modules');

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
            routeObject.childPathArr
                .filter(route => route.indexOf('routes.js') > -1)
                .map(route => require(path.resolve(routeObject.modulesPath, route))(io));
        }))
        .catch(err => console.error(err))
}