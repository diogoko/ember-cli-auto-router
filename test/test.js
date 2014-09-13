var should = require('should');

var autoMap = require('../tmp/vendor/ember-cli-auto-router')['default'];

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

    map.routes.names.should.be.eql(['posts']);

    map.resources.should.be.empty;
  });

  it('registers many routes', function() {
    setupModules(['app/routes/posts', 'app/routes/comments', 'app/routes/users']);

    autoMap(map);

    map.routes.names.should.be.eql(['comments', 'posts', 'users']);

    map.resources.should.be.empty;
  });
});

describe('resources with nesting', function() {
  it('registers one resource', function() {
    setupModules(['app/routes/posts', 'app/routes/posts/new']);

    autoMap(map);

    // level 1
    map.routes.should.be.empty;
    map.resources.names.should.be.eql(['posts']);

    // level 2
    map.resources['posts'].routes.names.should.be.eql(['new']);
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
    map.routes.names.should.be.eql(['about', 'welcome']);
    map.resources.names.should.be.eql(['posts', 'users']);

    // level 2
    map.resources['posts'].routes.names.should.be.eql(['comments', 'new']);
    map.resources['posts'].resources.names.should.be.eql(['last']);
    map.resources['users'].routes.names.should.be.eql(['me']);
    map.resources['users'].resources.should.be.empty;

    // level 3
    map.resources['posts'].resources['last'].routes.names.should.be.eql(['comments']);
    map.resources['posts'].resources['last'].resources.should.be.empty;
  });

  it('register resources without intermediate modules', function() {
    setupModules(['app/routes/posts/new']);

    autoMap(map);

    // level 1
    map.routes.should.be.empty;
    map.resources.names.should.be.eql(['posts']);

    // level 2
    map.resources['posts'].routes.names.should.be.eql(['new']);
    map.resources['posts'].resources.should.be.empty;
  });
});

describe('built-in routes', function() {
  it('ignores application at the root', function() {
    setupModules(['app/routes/application', 'app/routes/posts']);

    autoMap(map);

    map.routes.names.should.be.eql(['posts']);
  });

  it('ignores index as any leaf', function() {
    setupModules([
      'app/routes/index',
      'app/routes/posts',
      'app/routes/posts/index',
      'app/routes/posts/new'
    ]);

    autoMap(map);

    // level 1
    map.routes.should.be.empty;
    map.resources.names.should.be.eql(['posts']);

    // level 2
    map.resources['posts'].routes.names.should.be.eql(['new']);
    map.resources['posts'].resources.should.be.empty;
  });

  it('ignores application when it\'s root', function() {
    setupModules([
      'app/routes/application',
      'app/routes/posts',
      'app/routes/users/application'
    ]);

    autoMap(map);

    // level 1
    map.routes.names.should.be.eql(['posts']);
    map.resources.names.should.be.eql(['users']);

    // level 2
    map.resources['users'].routes.names.should.be.eql(['application']);
    map.resources['users'].resources.should.be.empty;
  });
});

