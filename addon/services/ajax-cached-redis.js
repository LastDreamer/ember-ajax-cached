/*globals FastBoot:true*/
import Ember from 'ember';

export default Ember.Service.extend({
	init() {
		let fastboot = this.get('fastboot');
		if (!fastboot) { return; }

		let redis = FastBoot.require('redis'),
			redisClient = redis.createClient();

		redisClient.set('myvar', 'abrakadabra', redis.print);
	},

	fastboot: Ember.computed(function() {
		let owner = Ember.getOwner(this);

		return owner.lookup('service:fastboot');
	})
});
