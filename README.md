ember-cli-auto-router
=====================

ember-cli-auto-router is an [ember-cli](http://ember-cli.com/) add-on that implements auto-routing in your app.

# Usage

## Installation

In your ember-cli project, install with:

```
npm install ember-cli-auto-router --save-dev
```

## Basic usage

In `router.js`, import the `autoMap` function and call it from `Router.map()`:

```javascript
import autoMap from 'vendor/ember-cli-auto-router';

Router.map(function() {
  autoMap(this);
});
```

This will scan all modules under `/app/routes` and register them as routes.

For example, when you have these modules:

```
/app/routes/posts.js
/app/routes/posts/new.js
/app/routes/example.js
```

The `autoMap` function will register these 3 modules like this:

```javascript
Router.map(function() {
  this.resource('posts', function() {
    this.route('new');
  });
  this.route('example');
});
```

## Built-in routes

Built-in routes defined by `/app/routes/application`, `/app/routes/basic` and `/app/routes/index` are not registered by `autoMap`.

## Custom paths

You can customize the path tha will be used for the route by exporting a variable named `path`. The following:

```javascript
// /app/routes/favorites.js
import Ember from 'ember';

export var path = '/favs';

export default Ember.Route.extend({});
```

Is equivalent to:

```javascript
// /app/router.js

Router.map(function() {
  this.route('favorites', { path: '/favs' });
});
```

# Testing

Run all tests with `grunt`.

Tests are run in node.js using the [es6-transpiler](https://github.com/termi/es6-transpiler), [mocha](http://mochajs.org/) and [should.js](https://github.com/visionmedia/should.js/).

# License

ember-cli-auto-router is [MIT Licensed](https://github.com/diogoko/ember-cli-auto-router/blob/master/LICENSE.md).
