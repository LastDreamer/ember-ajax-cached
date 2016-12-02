import AjaxCachedService from './ajax-cached';
import LocalStorageBackend from '../backends/local-storage';

export default AjaxCachedService.extend({
  init() {
    this.cache = new LocalStorageBackend();
  }
});