import Ember from 'ember';

const {
  RSVP: { Promise }
} = Ember;


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
    return new Promise((resolve, reject) => {
      if(this.backend){
        let item = this.backend.getItem(name);
        if ( item ) {
          resolve(item);
        } else {
          reject(null);
        }
      } else {
        return reject("localStorage not found");
      }
    });
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