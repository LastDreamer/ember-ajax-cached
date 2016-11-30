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
    if (this.backend) {
      this.backend.set(name, value);
    }
  }

  /**
   * @param  {string}
   * @return {string}
   */
  get(name) {
    if (this.backend) {
      return this.backend.getAsync(name)
        .then(result => {
          return result;
        });
    }
  }

  clearExpired() {
    return;
  }
}