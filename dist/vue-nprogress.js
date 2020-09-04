/*!
 * nprogress v0.1.5
 * https://github.com/vue-bulma/nprogress
 * Released under the MIT License.
 */

(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('nprogress')) :
  typeof define === 'function' && define.amd ? define(['nprogress'], factory) :
  (global.vueNprogress = factory(global.nprogress));
}(this, (function (nprogress) { 'use strict';

nprogress = 'default' in nprogress ? nprogress['default'] : nprogress;

var defaults = {
  latencyThreshold: 100,
  router: true,
  http: true
};

function install(Vue) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  if (this.installed) return;
  this.installed = true;

  Object.defineProperty(Vue.prototype, '$nprogress', {
    get: function get() {
      return this.$root._nprogress;
    }
  });

  options = Object.assign({}, defaults, options);

  Vue.mixin({
    beforeCreate: function () {
      var _this = this;

      var np = this.$options.nprogress;

      if (np) {
        (function () {
          var setComplete = function () {
            requestsTotal = 0;
            requestsCompleted = 0;
            np.done();
          };

          var initProgress = function () {
            if (0 === requestsTotal) {
              setTimeout(function () {
                return np.start();
              }, latencyThreshold);
            }
            requestsTotal++;
            np.set(requestsCompleted / requestsTotal);
          };

          var increase = function () {
            // Finish progress bar 50 ms later
            setTimeout(function () {
              ++requestsCompleted;
              if (requestsCompleted >= requestsTotal) {
                setComplete();
              } else {
                np.set(requestsCompleted / requestsTotal - 0.1);
              }
            }, latencyThreshold + 50);
          };

          var requestsTotal = 0;
          var requestsCompleted = 0;
          var _options = options;
          var latencyThreshold = _options.latencyThreshold;
          var applyOnRouter = _options.router;
          var applyOnHttp = _options.http;

          var confirmed = true;

          _this._nprogress = np;
          np.init(_this);

          if (applyOnHttp) {
            (function () {
              var http = Vue.http;
              var axios = Vue.axios;

              if (http) {
                http.interceptors.push(function (request, next) {
                  var showProgressBar = 'showProgressBar' in request ? request.showProgressBar : applyOnHttp;
                  if (showProgressBar) initProgress();

                  next(function (response) {
                    if (!showProgressBar) return response;
                    increase();
                  });
                });
              } else if (axios) {
                axios.interceptors.request.use(function (request) {
                  if (!('showProgressBar' in request)) request.showProgressBar = applyOnHttp;
                  if (request.showProgressBar) initProgress();
                  return request;
                }, function (error) {
                  return Promise.reject(error);
                });

                axios.interceptors.response.use(function (response) {
                  if (response.config.showProgressBar) increase();
                  return response;
                }, function (error) {
                  if (error.config && error.config.showProgressBar || axios.isCancel(error)) increase();
                  return Promise.reject(error);
                });
              }
            })();
          }

          var router = applyOnRouter && _this.$options.router;
          if (router) {
            router.beforeEach(function (route, from, next) {
              var showProgressBar = 'showProgressBar' in route.meta ? route.meta.showProgressBar : applyOnRouter;
              if (showProgressBar && confirmed) {
                initProgress();
                confirmed = false;
              }
              next();
            });
            router.afterEach(function (route) {
              var showProgressBar = 'showProgressBar' in route.meta ? route.meta.showProgressBar : applyOnRouter;
              if (showProgressBar) {
                increase();
                confirmed = true;
              }
            });
          }
        })();
      }
    }
  });
}

function NProgress(options) {
  this.app = null;
  this.configure(options || {});
}

NProgress.install = install;

NProgress.start = function () {};

Object.assign(NProgress.prototype, nprogress, {
  init: function (app) {
    this.app = app;
  }
});

return NProgress;

})));
