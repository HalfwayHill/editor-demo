import { createApp } from 'vue';
import {createPinia} from 'pinia';

import App from './App.vue';
import router from "./router";
import {registerStore} from '@/store';
import ElementPlus from 'element-plus'
import * as Icons from '@element-plus/icons-vue'
import 'element-plus/dist/index.css'

import _ from 'lodash';
import * as echarts from 'echarts';
import * as CustomComponent from '@/custom-component'; // 注册自定义组件
import "animate.css/animate.min.css"

const app = createApp(App)


app.use(ElementPlus);
app.use(createPinia()).use(router);

// 全局挂载 echarts
app.config.globalProperties.$echarts = echarts;

app.config.globalProperties.lodash = _;



/** 重置仓库 */
registerStore()

app.mount('#app');

// 注册全局组件
Object.keys(Icons).forEach(key => {
    app.component(key, Icons[key as keyof typeof Icons])
});

app.component('VPicture',CustomComponent.VPicture);
app.component('VButton',CustomComponent.VButton);
app.component('VText',CustomComponent.VText);
app.component('VGroup',CustomComponent.VGroup);
app.component('RectShape',CustomComponent.RectShape);