var assert = require('assert');
var autoMap = require('./');

function FakeRouterDSL(parent) {
  this.parent = parent;
  this.stack = [];
}

FakeRouterDSL.prototype.route = function(name) {
  this.stack.push(name);
};

FakeRouterDSL.prototype.resource = function(name, callback) {
  this.stack.push(name);

  var child = new FakeRouterDSL(this);
  callback.call(child);
};

describe('bla', function() {
  it('should be ok', function() {
    assert.equal(autoMap(), 'oi');
  });
});