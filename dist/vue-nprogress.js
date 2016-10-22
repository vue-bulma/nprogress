/*!
 * nprogress v0.1.1
 * https://github.com/vue-bulma/nprogress
 * Released under the MIT License.
 */

(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('nprogress')) :
  typeof define === 'function' && define.amd ? define(['nprogress'], factory) :
  (global.vueNprogress = factory(global.nprogress));
}(this, (function (nprogress) { 'use strict';

nprogress = 'default' in nprogress ? nprogress['default'] : nprogress;

function install(Vue) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  if (this.installed) return;
  this.installed = true;

  Object.defineProperty(Vue.prototype, '$nprogress', {
    get: function get() {
      return this.$root._nprogress;
    }
  });

  var latencyThreshold = options.latencyThreshold || 100;

  Vue.mixin({
    beforeCreate: function beforeEach() {
      var _this = this;

      var np = this.$options.nprogress;

      if (np) {
        var router;

        (function () {
          var setComplete = function () {
            requestsTotal = 0;
            requestsCompleted = 0;
            np.done();
          };

          var initProgress = function () {
            var completed = void 0;
            if (requestsTotal === 0) {
              setTimeout(function () {
                np.start();
              }, latencyThreshold);
            }
            requestsTotal++;
            completed = requestsCompleted / requestsTotal;
            np.set(completed);
          };

          var increase = function () {
            // Finish progress bar 50 ms later
            setTimeout(function () {
              ++requestsCompleted;
              if (requestsCompleted >= requestsTotal) {
                setComplete();
              } else {
                var completed = requestsCompleted / requestsTotal - 0.1;
                np.set(completed);
              }
            }, latencyThreshold + 50);
          };

          var requestsTotal = 0;
          var requestsCompleted = 0;
          var applyOnRouter = options.router == undefined || options.router;
          var applyOnHttp = options.http == undefined || options.http;

          _this._nprogress = np;
          np.init(_this);

          if (Vue.http) {
            Vue.http.interceptors.push(function (request, next) {
              var showProgressBar = applyOnHttp;
              if (request.showProgressBar != null) {
                showProgressBar = request.showProgressBar;
              }

              if (showProgressBar) initProgress();

              next(function (response) {
                if (!showProgressBar) return response;

                increase();
              });
            });
          }

          router = _this.$options.router;

          if (router) {
            (function () {
              var showProgressBar = void 0;
              router.beforeEach(function (route, redirect, next) {
                showProgressBar = applyOnRouter;
                if (route.meta.showProgressBar != null) {
                  showProgressBar = route.meta.showProgressBar;
                }
                if (showProgressBar) initProgress();
                next();
              });
              router.afterEach(function () {
                if (showProgressBar) increase();
              });
            })();
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

NProgress.prototype.init = function (app) {
  this.app = app;
};

NProgress.install = install;

Object.setPrototypeOf(NProgress.prototype, nprogress);

return NProgress;

})));
