export default class Cache {
  constructor() {
    let backend = false;
    if(window && 'localStorage' in window) {
      try {
        backend = window.localStorage;
      } catch(e) {
        console.log('localStorage is undefined');
      }
    }

    this.backend = backend;
  }

  /**
   * @param {string}
   * @param {string}
   */
  set(name, value) {
    if (this.backend) {
      this.backend.setItem(name, value);
    }
  }

  /**
   * @param  {string}
   * @return {string}
   */
  get(name) {
    if (this.backend) {
      let resultString = this.backend.getItem(name),
          result = JSON.parse(resultString);

      return result;
    }

    return null;
  }

  /**
   * @param  {string}
   * @return {string}
   */
  remove(name) {
    if (this.backend) {
      this.backend.removeItem(name);

      return true;
    }

    return null;
  }
}