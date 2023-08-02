import defaultImg from '@/assets/title.jpg';

// 公共样式
export const commonStyle = {
    rotate: 0,
    opacity: 1,
}

export const commonAttr = {
    animations: [],
    events: {},
    groupStyle: {}, // 当一个组件成为 Group 的子组件时使用
}

// 编辑器左侧组件列表
const list = [
    {
        id: 0,
        component: 'v-text',
        label: '文字',
        propValue: '文字',
        icon: 'Edit',
        style: {
            top:0,
            left:0,
            width: 200,
            height: 33,
            fontSize: 14,
            fontWeight: 500,
            lineHeight: '',
            letterSpacing: 0,
            textAlign: '',
            color: '',
        },
    },
    {
        id: 0,
        component: 'v-button',
        label: '按钮',
        propValue: '按钮',
        icon: 'Crop',
        style: {
            top:0,
            left:0,
            width: 100,
            height: 34,
            borderWidth: '',
            borderColor: '',
            borderRadius: '',
            fontSize: 14,
            fontWeight: 500,
            lineHeight: '',
            letterSpacing: 0,
            textAlign: '',
            color: '',
            backgroundColor: '',
        },
    },
    {
        id: 0,
        component: 'v-picture',
        label: '图片',
        icon: 'PictureRounded',
        propValue: getImageUrl(defaultImg),
        style: {
            top:0,
            left:0,
            width: 300,
            height: 200,
            borderRadius: '',
        },
    },
]

for (let i = 0, len = list.length; i < len; i++) {
    const item = list[i]
    item.style = { ...commonStyle, ...item.style }
    list[i] = { ...commonAttr, ...item }
}

function getImageUrl(url: string) {
    return new URL(url, import.meta.url).href;
}

export default list


