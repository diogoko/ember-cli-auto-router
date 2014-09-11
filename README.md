ember-cli-auto-router
=====================

Auto-routing for [ember-cli](http://ember-cli.com/) projects.

# Usage

In `router.js`:

```javascript
import autoMap from 'vendor/ember-cli-auto-router';

Router.map(function() {
  autoMap(this);
});
```

This is equivalent to:

```javascript
Router.map(function() {
  this.resource('posts', function() {
    this.route('new');
  });
  this.route('example');
});
```

when you have these files:

```
/app/routes/posts.js
/app/routes/posts/new.js
/app/routes/example.js
```

# License

ember-cli-auto-router is [MIT Licensed](https://github.com/diogoko/ember-cli-auto-router/blob/master/LICENSE.md).
