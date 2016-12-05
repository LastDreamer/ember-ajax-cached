import Ember from 'ember';
import { moduleFor, test } from 'ember-qunit';

const {
  RSVP: { Promise }
} = Ember;

moduleFor('service:ajax-cached', 'Unit | Service | ajax cached localstorage', {
  // Specify the other units that are required for this test.
  // needs: ['service:foo']
});

test('should make requests', function(assert) {
  let service = this.subject();

  return service.requestCached('/api/foo')
    .then(res => {
      assert.ok(res.result === 'bar');
    });
});

test('should cache request data with path only', function(assert) {
  let service = this.subject(),
      first,
      second;

  first = service.requestCached('/api/now', { live: 100000 })
      .then(result => {
        return result["now"];
      });

  second = service.requestCached('/api/now', { live: 10 })
    .then(result => {
      return result["now"];
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

  first = service.requestCached('/api/now', { live: 1 })
    .then(result => {
      return result["now"];
    });

  second = service.requestCached('/api/now', { live: 100000 })
    .then(result => {
        return result["now"];
    });

  assert.ok(Promise.all([first, second])
    .then(params => {
      return params[0] !== params[1];
    })
  );

});
