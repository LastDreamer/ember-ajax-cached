export function initialize(application) {
  application.inject('route', 'ajaxCached', 'service:ajax-cached-redis');
}

export default {
  name: 'fastboot/ajax-cached',
  initialize
};
