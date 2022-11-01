import router from './index'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { clearPending } from '@/services/pending'
import { useUserStore } from '@/store/user'

NProgress.configure({showSpinner:false})

router.beforeEach((to, from, next) => {
  // Start progress bar
  NProgress.start()
  const store = useUserStore()
  // console.log('路由守卫', 'token===>', !!store.userToken, 'to===>', to.path, 'from===>', from.path)

  if (store.userToken) {
    clearPending()
    next()
  } else {
    if (to.path == '/login') {
      next()
    } else {
      next({ path: '/login' })
    }
  }
  
})
router.afterEach((to) => {
  // Finish progress bar
  NProgress.done()
})
