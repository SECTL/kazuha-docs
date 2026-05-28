import DefaultTheme from 'vitepress/theme'
import Viewer from 'viewerjs'
import 'viewerjs/dist/viewer.css'
import { onMounted, watch, nextTick } from 'vue'
import { useRoute } from 'vitepress'
import './style/index.css'
import GuideHeader from './components/GuideHeader.vue'
import GuideCard from './components/GuideCard.vue'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component('GuideHeader', GuideHeader)
    app.component('GuideCard', GuideCard)
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

    onMounted(() => {
      initViewer()
    })

    watch(
      () => route.path,
      () => nextTick(() => initViewer())
    )
  }
}
