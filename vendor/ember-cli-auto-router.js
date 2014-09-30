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

function hasDynamicSegment(path) {
  return /\/:/.test(path);
}

function registerRoutes(routerMap, rootRoute) {
  Ember.keys(rootRoute).forEach(function(childRouteName) {
    var childRoute = rootRoute[childRouteName];
    var options = { path: childRoute.__ember_cli_auto_router_path };

    if (isLeafRoute(childRoute) && !hasDynamicSegment(options.path)) {
      routerMap.route(childRouteName, options);
    } else {
      routerMap.resource(childRouteName, options, createChildrenFunction(childRoute));
    }
  });
}

function autoMap(routerMap) {
  // TODO: use App.modulePrefix instead of matching anything
  var routesRegExp = /^[^/]+\/routes\//;

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
    routePath.split('/').forEach(function(segment) {
      // Add segment to current route if it's not there yet
      if (!currentRoute[segment]) {
        currentRoute[segment] = {};
      }

      // Check if it's a dynamic segment
      if (segment.startsWith(':')) {
        hasDynamicSegment = true;
      }

      currentRoute = currentRoute[segment];
    });

    Object.defineProperty(currentRoute, '__ember_cli_auto_router_path', {
      value: requirejs._eak_seen[moduleName].path || ('/' + routePath)
    });
  });

  registerRoutes(routerMap, rootRoute);
}

export default autoMap;
