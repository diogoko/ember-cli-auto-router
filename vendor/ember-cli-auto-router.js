/* global requirejs */

function createChildrenFunction(rootRoute) {
  return function() {
    var resourceMap = this;
    registerRoutes(resourceMap, rootRoute);
  };
}

function isLeafRoute(route) {
  return Ember.keys(route).length == 0;
}

function registerRoutes(routerMap, rootRoute) {
  Ember.keys(rootRoute).forEach(function(childRouteName) {

    var childRoute = rootRoute[childRouteName];
    var options = {};
    if (childRoute['__ember_cli_auto_router_path']) {
      options.path = childRoute['__ember_cli_auto_router_path'];
    }

    if (isLeafRoute(childRoute)) {
      routerMap.route(childRouteName, options);
    } else {
      routerMap.resource(childRouteName, options, createChildrenFunction(childRoute));
    }
  });
}

function autoMap(routerMap) {
  // TODO: use App.modulePrefix instead of \w+
  var routesRegExp = new RegExp('^\\w+/routes/');

  var rootRoute = {};
  Ember.keys(requirejs._eak_seen).filter(function(key) {
    return routesRegExp.test(key);
  }).forEach(function(moduleName) {
    var routePath = moduleName.replace(routesRegExp, '');

    // Ignore built-in routes
    if (routePath == 'application' || routePath == 'basic' ||
        routePath == 'index' || routePath.endsWith('/index')) {
      return;
    }

    var currentRoute = rootRoute;
    routePath.split('/').forEach(function(part) {
      // Add part to current route if it's not there yet
      if (!currentRoute[part]) {
        currentRoute[part] = {};
      }

      currentRoute = currentRoute[part];
    });

    Object.defineProperty(currentRoute, '__ember_cli_auto_router_path', {
      value: requirejs._eak_seen[moduleName].path
    });
    //currentRoute.__ember_cli_auto_router_path = requirejs._eak_seen[moduleName].path;
  });

  registerRoutes(routerMap, rootRoute);
}

export default autoMap;
