import Ember from 'ember';
import AjaxService from 'ember-ajax/services/ajax';

const {
  RSVP: { Promise }
} = Ember;

let ajaxCachedClass = new Object({
  dieTime: null,
  value: null,
  one: false
});

export default AjaxService.extend({
  _fromCache: function( url ) {
    let cacheBackend = this.get('cache');
    if(cacheBackend) {
      let cachedString = cacheBackend.get(url);
      let item = null;
      if(cachedString && cachedString.slice(0,3) === '@::') {
        item = JSON.parse(cachedString.slice(3));
        if( item && typeof(item)==='object' && 'dieTime' in item ) {
          let isLeave = this._isAlive(item.dieTime);
          if( !isLeave ) {
            item = null;
          }
          if( !isLeave || item.one ) {
            cacheBackend.remove(url);
          }
        } else {
          cacheBackend.remove(url);
        }
      }
      return item && 'value' in item ? item.value : null;
    }
    return null;
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

  request: function( pUrl, pCache, pMethod, pData ) {
    pMethod = pMethod || 'GET';
    pData = pData || null;
    let PResult = null,
        cacheKey = pUrl + (pMethod||'') + (pData?JSON.stringify(pData):'');
    if( pCache ) {
      // this._clearDies();
      let R = this._fromCache(cacheKey, pCache);
      if( R ) {
        PResult = new Promise(isOk=>isOk(R))
          .then(result=>{
            return result;
          });
      }
    }
    if( pCache && 'reload' in pCache && pCache['reload'] || !PResult ) {
      let PReload = this._super(pUrl,
          {
            method: pMethod,
            data: pData
          })
        .then(result=>{
          let live = pCache && 'live' in pCache ? pCache['live'] : 0;
          let one = pCache && 'one' in pCache ? pCache['one'] : false;
          this._toCache(cacheKey, result, live, one);
          return result;
        });
      PResult = PResult ? PResult : PReload;
    }

    return PResult;
  }
});