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
  _getLocalStorage: function() {
    let localStorage = false;

    if(window && 'localStorage' in window) {
      try {
        localStorage = window.localStorage;
      } catch(e) {
        console.log('localStorage is undefined');
        localStorage = false;
      }
    }

    return localStorage;
  },

  _fromLSCache: function( pUrl ) {
    let LS = this.get('_getLocalStorage');
    if(LS) {
      let st = LS.getItem(pUrl);
      let item = null;
      if(st && st.slice(0,3) === '@::') {
        item = JSON.parse(st.slice(3));
        if( item && typeof(item)==='object' && 'dieTime' in item ) {
          let isLeave = this._isAlive(item.dieTime);
          if( !isLeave ) {
            item = null;
          }
          if( !isLeave || item.one ) {
            LS.removeItem(pUrl);
          }
        } else {
          LS.removeItem(pUrl);
        }
      }
      return item && 'value' in item ? item.value : null;
    }
    return null;
  },

  _toLSCache: function( pUrl, pValue, pLive, pOne ) {
    let LS = this.get('_getLocalStorage');
    if(LS && pLive && pLive>0 && pValue) {
      let el = Ember.copy(ajaxCachedClass);
      let liveDate = new Date();
      el.dieTime = liveDate.setTime( liveDate.getTime() + pLive );
      el.value = pValue;
      el.one = pOne ? true : false;
      LS.setItem(pUrl, '@::' + JSON.stringify(el));
    }
    return false;
  },

  _clearLSDie: function() {
    let LS = this.get('_getLocalStorage');
    if( LS ) {
      for (var i = 0; i < LS.length; i++) {
        var st = LS.getItem( LS.key(i) );
        var p = st.indexOf('dieTime');
        if( st.slice(0,3)==='@::' && p>=0 ) {
          var pb = st.indexOf(':',p),
              pe = st.indexOf(',',pb);
          var dt = new Date(parseInt(st.slice(pb+1, pe).trim()));

          if( !this._isAlive(dt) ) {
            LS.removeItem( LS.key(i) );
          }
        }
      }
    }
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
      this._clearLSDie();
      let R = this._fromLSCache(cacheKey, pCache);
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
          this._toLSCache(cacheKey, result, live, one);
          return result;
        });
      PResult = PResult ? PResult : PReload;
    }

    return PResult;
  }
});