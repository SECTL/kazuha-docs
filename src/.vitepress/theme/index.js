import DefaultTheme from 'vitepress/theme'
import Viewer from 'viewerjs'
import 'viewerjs/dist/viewer.css'
import { onMounted, watch, nextTick } from 'vue'
import { useRoute } from 'vitepress'
import './style/index.css'
import GuideHeader from './components/GuideHeader.vue'
import GuideCard from './components/GuideCard.vue'
import VPNavBarMenuLink from './components/VPNavBarMenuLink.vue'
import VPSidebarItem from './components/VPSidebarItem.vue'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component('GuideHeader', GuideHeader)
    app.component('GuideCard', GuideCard)
    app.component('VPNavBarMenuLink', VPNavBarMenuLink)
    app.component('VPSidebarItem', VPSidebarItem)
  },
  setup() {
    const route = useRoute()
    let viewer = null

    const initViewer = () => {
      if (viewer) {
        viewer.destroy()
        viewer = null
      }

      const doc = document.querySelector('.vp-doc')
      if (!doc) return

      viewer = new Viewer(doc, {
        button: true,
        navbar: true,
        title: true,
        toolbar: true,
        tooltip: true,
        movable: true,
        zoomable: true,
        rotatable: true,
        scalable: true,
        transition: true,
        fullscreen: true,
        keyboard: true,
        url: 'src',
      })
    }

    let navStack = []
    let isBackNav = false

    const playTransition = (enterClass) => {
      const el = document.getElementById('VPContent')
      if (!el) return

      el.classList.remove('page-exit', 'page-enter', 'page-enter-back', 'page-stable')
      el.classList.add(enterClass)

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          el.classList.remove(enterClass)
          el.classList.add('page-stable')
        })
      })
    }

    const handlePageExit = () => {
      const el = document.getElementById('VPContent')
      if (el) el.classList.add('page-exit')
    }

    onMounted(() => {
      initViewer()
      navStack = [route.path]

      playTransition('page-enter')

      document.addEventListener('click', (e) => {
        const link = e.target.closest('a')
        if (!link || !link.href || !link.href.startsWith(window.location.origin)) return

        const currentPath = window.location.pathname
        const targetPath = new URL(link.href).pathname
        if (currentPath === targetPath) return

        const idx = navStack.lastIndexOf(targetPath)
        if (idx !== -1) {
          isBackNav = true
          navStack = navStack.slice(0, idx + 1)
        } else {
          isBackNav = false
          navStack.push(targetPath)
        }

        handlePageExit()
      })

      window.addEventListener('popstate', () => {
        isBackNav = true
        const idx = navStack.lastIndexOf(route.path)
        if (idx !== -1) navStack = navStack.slice(0, idx + 1)
      })
    })

    watch(
      () => route.path,
      () => {
        nextTick(() => {
          initViewer()
          playTransition(isBackNav ? 'page-enter-back' : 'page-enter')
          isBackNav = false
        })
      }
    )
  }
}
