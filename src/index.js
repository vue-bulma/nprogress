import nprogress from 'nprogress'

function install(Vue, options = {}) {
  if (this.installed) return
  this.installed = true

  Object.defineProperty(Vue.prototype, '$nprogress', {
    get: function get() {
      return this.$root._nprogress
    }
  })

  const latencyThreshold = options.latencyThreshold || 100;


  Vue.mixin({
    beforeCreate: function beforeEach() {
      let np = this.$options.nprogress;

      if (np) {
        let requestsTotal = 0;
        let requestsCompleted = 0;
        let applyOnRouter = options.router == undefined || options.router;
        let applyOnHttp = options.http == undefined || options.http;

        function setComplete() {
          requestsTotal = 0;
          requestsCompleted = 0;
          np.done();
        }

        function initProgress() {
          let completed;
          if (requestsTotal === 0) {
            setTimeout(() => {
              np.start();
            }, latencyThreshold);
          }
          requestsTotal++;
          completed = requestsCompleted / requestsTotal;
          np.set(completed);
        }

        function increase() {
          // Finish progress bar 50 ms later
          setTimeout(() => {
            ++requestsCompleted;
            if (requestsCompleted >= requestsTotal) {
              setComplete();
            }else {
              let completed = (requestsCompleted / requestsTotal) - 0.1;
              np.set(completed);
            }
          }, latencyThreshold + 50);
        }

        this._nprogress = np
        np.init(this)

        if (Vue.http) {
          Vue.http.interceptors.push(function (request, next) {
            let showProgressBar = applyOnHttp;
            if (request.showProgressBar != null) {
              showProgressBar = request.showProgressBar;
            }

            if (showProgressBar)
              initProgress();

            next(function (response) {
              if (!showProgressBar)
                return response;

              increase();
            })
          })
        }

        var router = this.$options.router
        if (router) {
          let showProgressBar;
          router.beforeEach(function (route, redirect, next) {
            showProgressBar = applyOnRouter;
            if (route.meta.showProgressBar != null) {
              showProgressBar = route.meta.showProgressBar;
            }
            if (showProgressBar)
              initProgress();
            next()
          })
          router.afterEach(function () {
            if (showProgressBar)
              increase();
          })
        }
      }
    }
  })
}

function NProgress(options) {
  this.app = null
  this.configure(options || {})
}

NProgress.prototype.init = function (app) {
  this.app = app
}

NProgress.install = install

Object.setPrototypeOf(NProgress.prototype, nprogress)

export default NProgress
