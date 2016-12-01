import Ember from 'ember';
import { moduleFor, test } from 'ember-qunit';

const {
  RSVP: { Promise }
} = Ember;

moduleFor('service:ajax-cached-localstorage', 'Unit | Service | ajax cached localstorage', {
  // Specify the other units that are required for this test.
  // needs: ['service:foo']
});

test('it makes requests', function(assert) {
  let service = this.subject();

  return service.request('/api/foo')
    .then(r => {
      console.log(r);
      assert.ok(r.result === 'bar');
    });
});

test('it caches request data with path only', function(assert) {
  let service = this.subject(),
    first,
    second;

  first = service.request('/api/now', { live: 100000 })
    .then(result => {
      console.log(result);
      return result.now;
    });

  second = service.request('/api/now', { live: 100000 })
      .then(result => {
        console.log(result);
        return result.now;
      });

  Promise.all([first, second])
    .then(params => {
      console.log(params[0] === params[1]);
      assert(params[0] === params[1]);
    });
});
