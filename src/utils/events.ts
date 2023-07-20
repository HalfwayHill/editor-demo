// 编辑器自定义事件
const events = {
    redirect(url: any) {
        if (url) {
            window.location.href = url
        }
    },

    alert(msg: any) {
        if (msg) {
            alert(msg)
        }
    },
}

const eventList = [
    {
        key: 'redirect',
        label: '跳转事件',
        event: events.redirect,
        param: '',
    },
    {
        key: 'alert',
        label: 'alert 事件',
        event: events.alert,
        param: '',
    },
]

export {
    events,
    eventList,
}