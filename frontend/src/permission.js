import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import getPageTitle from '@/utils/get-page-title'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

router.beforeEach(async(to, from, next) => {
  // start progress bar
  NProgress.start()

  // set page title
  document.title = getPageTitle(to.meta.title)

  if (to.path === '/login' || to.path === '/register') {
    // if go to login or register, first judge if user is already logged in
    if (store.state.user.hasLogin) {
      next('/')
    } else {
      next()
    }
  } else {
    // if go to other pages (all requires authorization), judge if ia authed, then judge if is logged in
    try {
      await store.dispatch('user/getInfo')
      if (store.state.user.hasAuth) {
        next()
      } else { // is not authed, but no error meaning is already logged in
        // if is logged in, but not authed, always redirect to home
        if (to.path !== '/' && to.path !== '/home' && to.name !== '重复授权') {
          Message.error('Oops！不授权就想进来是不行的哦。')
          next('/')
        } else {
          next()
        }
      }
    } catch (error) { // no login
      await store.dispatch('user/resetState')
      next(`/login`)
    }
  }
  NProgress.done()
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})
