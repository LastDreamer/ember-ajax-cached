/*globals FastBoot:true*/
import Ember from 'ember';
import LocalStorageCacheBackend from '../backends/local-storage';
import RedisCacheBackend from '../backends/redis';
import fetch from 'ember-network/fetch';

let ajaxCachedClass = new Object({
  dieTime: null,
  value: null,
  one: false
});

export default Ember.Service.extend({
  fastboot: Ember.computed(function() {
    let owner = Ember.getOwner(this);

    return owner.lookup('service:fastboot');
  }),

  init() {
    try {
      let redis = FastBoot.require('redis');
      this.set('cache', new RedisCacheBackend(redis.createClient()));
    } catch(e) {
      this.set('cache', new LocalStorageCacheBackend());
    }
  },

  _fromCache: function( url ) {
    return this.get('cache').get(url)
      .then(cachedString => {
        let item = null;

        if(cachedString && cachedString.slice(0,3) === '@::') {
          item = JSON.parse(cachedString.slice(3));
          if( item && typeof(item)==='object' && 'dieTime' in item ) {
            let isLeave = this._isAlive(item.dieTime);
            if( !isLeave ) {
              item = null;
            }
            if( !isLeave || item.one ) {
              this.get('cache').remove(url);
            }
          } else {
            this.get('cache').remove(url);
          }
        }

        if (item && 'value' in item) {
          return item.value;
        } else {
          return new Ember.RSVP.Promise((resolve, reject) => {
            reject();
          });
        }
      });
  },

  _toCache: function( url, value, live, one ) {
    let cache = this.get('cache');
    if(cache && live && live>0 && value) {
      let el = Ember.copy(ajaxCachedClass);
      let liveDate = new Date();
      el.dieTime = liveDate.setTime( liveDate.getTime() + live );
      el.value = value;
      el.one = one ? true : false;
      cache.set(url, '@::' + JSON.stringify(el));
    }
    return false;
  },

  _clearDies: function() {
    /* Этот код нужно переписать для потдержи обоими бекендами */

    // let cache = this.get('cache');
    // if( cache ) {
    //   for (var i = 0; i < cache.length; i++) {
    //     var st = cache.getItem( cache.key(i) );
    //     var p = st.indexOf('dieTime');
    //     if( st.slice(0,3)==='@::' && p>=0 ) {
    //       var pb = st.indexOf(':',p),
    //           pe = st.indexOf(',',pb);
    //       var dt = new Date(parseInt(st.slice(pb+1, pe).trim()));

    //       if( !this._isAlive(dt) ) {
    //         cache.removeItem( cache.key(i) );
    //       }
    //     }
    //   }
    // }
  },

  _isAlive: function( pDate ) {
    let dTime = new Date(pDate);
    return dTime && (dTime instanceof Date) && dTime > new Date();
  },

  requestCached: function( url, cache, pMethod, pData ) {
    pMethod = pMethod || 'GET';
    pData = pData || null;

    let cacheKey = url.trim()/* + pMethod + ((pData && JSON.stringify(pData))||'')*/;

    if( cache ) {
      return this._fromCache(cacheKey)
        .catch(() => {
          return fetch(url, {
            method: pMethod,
            data: pData
          })
          .then(res => {
            return res.json();
          });
        })
        .then(result => {
          if (cache.live) {
            this._toCache(cacheKey, result, cache.live, cache.one || false);
          }

          return result;
        });
    } else {
      return fetch(url, {
        method: pMethod,
        data: pData
      })
      .then(res => {
        return res.json();
      });
    }
  }
});