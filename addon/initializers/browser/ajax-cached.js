export function initialize(application) {
  application.inject('route', 'ajaxCached', 'service:ajax-cached-localstorage');
}

export default {
  name: 'browser/ajax-cached',
  initialize
};
