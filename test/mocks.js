function FakeRouterDSL(parent) {
  this.parent = parent;

  var self = this;

  this.routes = {};
  Object.defineProperty(this.routes, 'names', {
    get: function() {
      return Object.keys(self.routes).sort();
    }
  });

  this.resources = {};
  Object.defineProperty(this.resources, 'names', {
    get: function() {
      return Object.keys(self.resources).sort();
    }
  });
}

FakeRouterDSL.prototype.route = function(name) {
  this.routes[name] = true;
};

FakeRouterDSL.prototype.resource = function(name, callback) {
  var child = new FakeRouterDSL(this);
  callback.call(child);

  this.resources[name] = child;
};

FakeRouterDSL.prototype.hasRoute = function(path) {
};

Ember = {
  keys: function(o) {
    return Object.keys(o);
  }
};

function setupModules(names) {
  var _eak_seen = {};
  names.forEach(function(name) {
    _eak_seen[name] = true;
  });
  requirejs = { _eak_seen: _eak_seen };
}

module.exports = {
  'FakeRouterDSL': FakeRouterDSL,
  'Ember': Ember,
  'setupModules': setupModules
};
