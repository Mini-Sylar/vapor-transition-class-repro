import { createApp, createVaporApp } from 'vue'
import App from './App.vue'
import AppVdom from './AppVdom.vue'

createVaporApp(App).mount('#app')
createApp(AppVdom).mount('#app-vdom')
