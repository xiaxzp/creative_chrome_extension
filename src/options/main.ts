import { createApp } from 'vue';
import 'uno.css';
import App from './Options.vue';
import 'element-plus/theme-chalk/el-message.css';
import 'element-plus/theme-chalk/el-message-box.css';
import 'element-plus/theme-chalk/el-overlay.css';
import 'element-plus/theme-chalk/el-popper.css';
import 'element-plus/theme-chalk/el-input.css';
import livereload from '~/logic/hotreload';

livereload();
const app = createApp(App);
app.mount('#app');
