import { Buffer } from 'buffer'
globalThis.Buffer = Buffer

import { createApp } from 'vue'
import App from './App.vue'
import { router } from './router'
import { loadRuntimeContent } from './services/contentStore'
import './style.css'

void loadRuntimeContent()

createApp(App).use(router).mount('#app')
