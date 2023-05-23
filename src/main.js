import { createApp } from 'vue';
import App from './App.vue';
import store from './store';
import router from './router';
import permission from './utils/permission';
import i18n from './i18n';
import ElementPlus from 'element-plus'
import './mock'
import 'element-plus/dist/index.css'
import './styles/index.less'

/* 引入js方法库核心 */
import { library } from '@fortawesome/fontawesome-svg-core'
/* 引入特定的图标 */
import { faCirclePlus,faRss,faPenToSquare,faTrashCan,faBan,faMagnifyingGlass,faRotate,faFloppyDisk,faXmark,faSquareCheck } from '@fortawesome/free-solid-svg-icons'
/* 引入承载svg图标展示的组件 */
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
/* 加入图标库 */
library.add(faCirclePlus,faRss,faPenToSquare,faTrashCan,faBan,faMagnifyingGlass,faRotate,faFloppyDisk,faXmark,faSquareCheck)

const app = createApp(App);

app.use(store);
app.use(router);
app.use(permission);
app.use(i18n);
app.use(ElementPlus);
/*全局注册图标展示组件*/
app.component('font-awesome-icon', FontAwesomeIcon);

app.mount('#app');
