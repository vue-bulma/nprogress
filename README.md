# nprogress

Slim progress bars is based on [nprogress](https://github.com/rstacruz/nprogress) for Ajax'y applications

## Installation

```
$ npm install vue-nprogress
```

## Examples

```vue
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
// ..
```

## Badges

![](https://img.shields.io/badge/license-MIT-blue.svg)
![](https://img.shields.io/badge/status-stable-green.svg)

---

> [fundon.me](https://fundun.me) &nbsp;&middot;&nbsp;
> GitHub [@fundon](https://github.com/fundon) &nbsp;&middot;&nbsp;
> Twitter [@_fundon](https://twitter.com/_fundon)

