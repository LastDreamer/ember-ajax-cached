/*globals FastBoot:true*/
import Ember from 'ember';
import AjaxCachedService from './ajax-cached';
import LocalStorageBackend from '../backends/redis';

export default AjaxCachedService.extend({
  init() {
    let fastboot = this.get('fastboot');
    if (!fastboot) { return; }

    let redis = FastBoot.require('redis'),
      redisClient = redis.createClient();

    this.cache = new LocalStorageBackend(redisClient);
  },

  fastboot: Ember.computed(function() {
    let owner = Ember.getOwner(this);

    return owner.lookup('service:fastboot');
  })
});