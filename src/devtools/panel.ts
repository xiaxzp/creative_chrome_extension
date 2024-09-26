import App from './applets/App.vue';
import 'uno.css';
import './panel.css';
import 'element-plus/theme-chalk/el-popper.css';
import 'element-plus/theme-chalk/el-message.css';

browser.devtools.inspectedWindow.eval('location.href').then(([href]) => {
  createApp(App, { href }).mount(document.getElementById('app')!);
});
