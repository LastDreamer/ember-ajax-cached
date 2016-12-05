import Ember from 'ember';

const {
  RSVP: { Promise }
} = Ember;

export default class Cache {
  /**
   * @param  {redisClient object}
   * @return {Cache object}
   */
  constructor(redisClient) {
    this.backend = redisClient;
  }

  /**
   * @param {string}
   * @param {string}
   */
  set(name, value) {
    console.log('try push to redis');
    if (this.backend) {
      console.log('pushed to redis');
      this.backend.set(name, value);
    }
  }

  /**
   * @param  {string}
   * @return {string}
   */
  get(name) {
    return new Promise((resolve, reject) => {
      if (this.backend) {
        this.backend.get(name, function(err, res) {
          if (res) {
            console.log('result finded');
            resolve(res);
          } else {
            reject();
          }
        });
      }
    });
  }

  /**
   * @param  {string}
   * @return {string}
   */
  remove(name) {
    if (this.backend) {
      this.backend.del(name);

      return true;
    }

    return null;
  }
}