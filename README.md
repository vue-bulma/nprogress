# nprogress

Slim progress bars is based on [nprogress](https://github.com/rstacruz/nprogress) for Ajax'y applications


## Installation

```console
$ npm install vue-nprogress --save
```

## Examples

```vue
<template>
  <nprogress-container></nprogress-container>
</template>

<script>
import NprogressContainer from 'vue-nprogress/src/NprogressContainer'

export default {
  components: {
    NprogressContainer
  }
}
</script>
```

```js
import Vue from 'vue'
import NProgress from 'vue-nprogress'
import App from './App.vue'

Vue.use(NProgress)

const nprogress = new NProgress()

const app = new Vue({
  nprogress
  ...App
})

// APIs: see https://github.com/rstacruz/nprogress
// app.nprogress
// app.nprogress.start()
// app.nprogress.inc(0.2)
// app.nprogress.done()
// Component:
// this.$nprogress
```


## Configuration

```js
const options = {
  latencyThreshold: 200, // Number of ms before progressbar starts showing, default: 100,
  router: true, // Show progressbar when navigating routes, default: true
  http: false // Show progressbar when doing Vue.http, default: true
};
Vue.use(NProgress, options)
```

In order to overwrite the configuration for certain requests, use showProgressBar parameter in request/route's meta.

Like this:

```js
Vue.http.get('/url', { showProgressBar: false })
```
```js
const router = new VueRouter({
  routes: [
    {
      path: '/foo',
      component: Foo,
      meta: {
        showProgressBar: false
      }
    }
  ]
})
```


## Badges

![](https://img.shields.io/badge/license-MIT-blue.svg)
![](https://img.shields.io/badge/status-stable-green.svg)

---

> [fundon.me](https://fundon.me) &nbsp;&middot;&nbsp;
> GitHub [@fundon](https://github.com/fundon) &nbsp;&middot;&nbsp;
> Twitter [@_fundon](https://twitter.com/_fundon)

