// 公共样式
const commonStyle = {
    rotate: '',
    opacity: 1,
}

// 编辑器左侧组件列表
const list = [
    {
        id: 0,
        component: 'v-text',
        label: '文字',
        propValue: '文字',
        icon: 'Edit',
        animations: [],
        events: {},
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
        animations: [],
        events: {},
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
        propValue: getImageUrl('../assets/title.jpg'),
        animations: [],
        events: {},
        style: {
            top:0,
            left:0,
            width: 300,
            height: 200,
            borderRadius: '',
        },
    },
]

list.forEach(item => {
    item.style = { ...item.style, ...commonStyle }
})

function getImageUrl(url: string) {
    return new URL(url, import.meta.url).href;
}

export default list


