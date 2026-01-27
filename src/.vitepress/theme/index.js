import DefaultTheme from 'vitepress/theme'
import Viewer from 'viewerjs'
import 'viewerjs/dist/viewer.css'
import { onMounted, watch, nextTick } from 'vue'
import { useRoute } from 'vitepress'
import './style/index.css'
import Layout from './components/Layout.vue'
import ImageRow from './components/ImageRow.vue'
import HomeUnderline from './components/HomeUnderline.vue'
import ArticleMetadata from "./components/ArticleMetadata.vue"

export default {
  extends: DefaultTheme,
  Layout: Layout,
  enhanceApp({ app }) {
    app.component('ImageRow', ImageRow)
    app.component('HomeUnderline', HomeUnderline)
    app.component('ArticleMetadata', ArticleMetadata)
  },
  setup() {
    const route = useRoute()
    let viewer = null

    const initViewer = () => {
      // Clean up previous instance
      if (viewer) {
        viewer.destroy()
        viewer = null
      }
      
      // Find the content container
      const doc = document.querySelector('.vp-doc')
      if (!doc) return

      // Initialize Viewer.js on the container
      // This will automatically pick up all images inside .vp-doc
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
        url: 'src', // Use src attribute for high-res image if available
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
