var should = require('should');

var autoMap = require('../tmp/vendor/ember-cli-auto-router')['default'];

function FakeRouterDSL(parent) {
  this.parent = parent;
  this.routes = {};
  this.resources = {};
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

function setupModules(names) {
  var _eak_seen = {};
  names.forEach(function(name) {
    _eak_seen[name] = true;
  });
  requirejs = { _eak_seen: _eak_seen };
}

Ember = {
  keys: function(o) {
    return Object.keys(o);
  }
};

function sk(o) {
  return Object.keys(o).sort();
}

beforeEach(function() {
  map = new FakeRouterDSL();
});

describe('flat routes', function() {
  it('works with no routes defined', function() {
    setupModules([]);

    autoMap(map);

    map.routes.should.be.empty;
    map.resources.should.be.empty;
  });

  it('registers one route', function() {
    setupModules(['app/routes/posts']);

    autoMap(map);

    sk(map.routes).should.be.eql(['posts']);

    map.resources.should.be.empty;
  });

  it('registers many routes', function() {
    setupModules(['app/routes/posts', 'app/routes/comments', 'app/routes/users']);

    autoMap(map);

    sk(map.routes).should.be.eql(['comments', 'posts', 'users']);

    map.resources.should.be.empty;
  });
});

describe('resources with nesting', function() {
  it('registers one resource', function() {
    setupModules(['app/routes/posts', 'app/routes/posts/new']);

    autoMap(map);

    // level 1
    map.routes.should.be.empty;
    sk(map.resources).should.be.eql(['posts']);

    // level 2
    sk(map.resources['posts'].routes).should.be.eql(['new']);
    map.resources['posts'].resources.should.be.empty;
  });

  it('registers many resources and routes', function() {
    setupModules([
      'app/routes/posts',
      'app/routes/posts/new',
      'app/routes/posts/last',
      'app/routes/posts/comments',
      'app/routes/posts/last/comments',
      'app/routes/users',
      'app/routes/users/me',
      'app/routes/welcome',
      'app/routes/about'
    ]);

    autoMap(map);

    // level 1
    sk(map.routes).should.be.eql(['about', 'welcome']);
    sk(map.resources).should.be.eql(['posts', 'users']);

    // level 2
    sk(map.resources['posts'].routes).should.be.eql(['comments', 'new']);
    sk(map.resources['posts'].resources).should.be.eql(['last']);
    // TODO: finish checking this case
  });
});

// TODO: check built-in routes (application and index)
