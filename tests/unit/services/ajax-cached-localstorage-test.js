import Ember from 'ember';
import { moduleFor, test } from 'ember-qunit';

const {
  RSVP: { Promise }
} = Ember;

moduleFor('service:ajax-cached-localstorage', 'Unit | Service | ajax cached localstorage', {
  // Specify the other units that are required for this test.
  // needs: ['service:foo']
});

test('should make requests', function(assert) {
  let service = this.subject();

  return service.request('/api/foo')
    .then(r => {
      assert.ok(r.result === 'bar');
    });
});

test('should cache request data with path only', function(assert) {
  let service = this.subject(),
      first,
      second;

  first = service.request('/api/now', { lifetime: 100000 })
      .then(result => {
        return result.now;
      });

  second = service.request('/api/now', { lifetime: 100000 })
    .then(result => {
      return result.now;
    });

  Promise.all([first, second])
    .then(params => {
      assert.ok(params[0] === params[1]);
    });
});

test('should invalidate cache after lifetime ends', function(assert) {
  let service = this.subject(),
      first,
      second;

  first = service.request('/api/now', { lifetime: 1 })
    .then(result => {
      return result.now;
    });

  second = service.request('/api/now', { lifetime: 100000 })
    .then(result => {
      return result.now;
    });

  Promise.all([first, second])
    .then(params => {
      assert.ok(params[0] !== params[1]);
    });

});
