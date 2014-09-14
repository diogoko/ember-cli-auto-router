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

FakeRouterDSL.prototype.route = function(name, options) {
  if (arguments.length === 1) {
    options = {};
  }

  this.routes[name] = { 'options': options };
};

FakeRouterDSL.prototype.resource = function(name, options, callback) {
  if (arguments.length === 2 && typeof options === 'function') {
    callback = options;
    options = {};
  }

  if (arguments.length === 1) {
    options = {};
  }

  var child = new FakeRouterDSL(this);
  child.options = options;
  callback.call(child);

  this.resources[name] = child;
};


Ember = {
  keys: function(o) {
    return Object.keys(o);
  }
};


function setupModules(modules) {
  var _eak_seen;

  if (modules instanceof Array) {
    _eak_seen = {};
    modules.forEach(function(name) {
      _eak_seen[name] = {};
    });
  } else {
    _eak_seen = modules;
  }

  requirejs = { _eak_seen: _eak_seen };
}


module.exports = {
  'FakeRouterDSL': FakeRouterDSL,
  'Ember': Ember,
  'setupModules': setupModules
};
