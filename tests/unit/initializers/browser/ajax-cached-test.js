import Ember from 'ember';
import BrowserAjaxCachedInitializer from 'dummy/initializers/browser/ajax-cached';
import { module, test } from 'qunit';

let application;

module('Unit | Initializer | browser/ajax cached', {
  beforeEach() {
    Ember.run(function() {
      application = Ember.Application.create();
      application.deferReadiness();
    });
  }
});

// Replace this with your real tests.
test('it works', function(assert) {
  BrowserAjaxCachedInitializer.initialize(application);

  // you would normally confirm the results of the initializer here
  assert.ok(true);
});
