const EleResize = {
    _handleResize: function (e: any) {
        const ele = e.target || e.srcElement
        const trigger = ele.__resizeTrigger__
        if (trigger) {
            const handlers = trigger.__z_resizeListeners
            if (handlers) {
                const size = handlers.length
                for (let i = 0; i < size; i++) {
                    const h = handlers[i]
                    const handler = h.handler
                    const context = h.context
                    handler.apply(context, [e])
                }
            }
        }
    },
    _removeHandler: function (ele: any, handler: any, context: any) {
        const handlers = ele.__z_resizeListeners
        if (handlers) {
            const size = handlers.length
            for (let i = 0; i < size; i++) {
                const h = handlers[i]
                if (h.handler === handler && h.context === context) {
                    handlers.splice(i, 1)
                    return
                }
            }
        }
    },
    _createResizeTrigger: function (ele: any) {
        const obj = document.createElement('object')
        obj.setAttribute('style',
            'display: block; position: absolute; top: 0; left: 0; height: 100%; width: 100%; overflow: hidden;opacity: 0; pointer-events: none; z-index: -1;')
        obj.onload = EleResize._handleObjectLoad
        obj.type = 'text/html'
        ele.appendChild(obj)
        obj.data = 'about:blank'
        return obj
    },
    _handleObjectLoad: function (evt: any) {
        console.log(this);
        (this as any).contentDocument.defaultView.__resizeTrigger__ = (this as any).__resizeElement__
        (this as any).contentDocument.defaultView.addEventListener('resize', EleResize._handleResize)
    }
}
// 判断IE浏览器内核低于11 ie9-10
// @ts-ignore
if (document.attachEvent) { // document.attachEvent 在IE11失效
    const eleResize = EleResize as any;
    eleResize.on = function (ele: any, handler: any, context: any) {
        let handlers = ele.__z_resizeListeners
        if (!handlers) {
            handlers = []
            ele.__z_resizeListeners = handlers
            ele.__resizeTrigger__ = ele
            ele.attachEvent('onresize', EleResize._handleResize)
        }
        handlers.push({
            handler: handler,
            context: context
        })
    }
    eleResize.off = function (ele: any, handler: any, context: any) {
        const handlers = ele.__z_resizeListeners
        if (handlers) {
            EleResize._removeHandler(ele, handler, context)
            if (handlers.length === 0) {
                ele.detachEvent('onresize', EleResize._handleResize)
                delete ele.__z_resizeListeners
            }
        }
    }
} else {
    const eleResize = EleResize as any;
    eleResize.on = function (ele: any, handler: any, context: any) {
        let handlers = ele.__z_resizeListeners
        if (!handlers) {
            handlers = []
            ele.__z_resizeListeners = handlers

            if (getComputedStyle(ele, null).position === 'static') {
                ele.style.position = 'relative'
            }
            const obj = EleResize._createResizeTrigger(ele)
            ele.__resizeTrigger__ = obj;
            (obj as any).__resizeElement__ = ele;

            console.log('obj', obj)
        }
        handlers.push({
            handler: handler,
            context: context
        })
    }
    eleResize.off = function (ele: any, handler: any, context: any) {
        const handlers = ele.__z_resizeListeners
        if (handlers) {
            EleResize._removeHandler(ele, handler, context)
            if (handlers.length === 0) {
                const trigger = ele.__resizeTrigger__
                if (trigger) {
                    trigger.contentDocument.defaultView.removeEventListener('resize', EleResize._handleResize)
                    ele.removeChild(trigger)
                    delete ele.__resizeTrigger__
                }
                delete ele.__z_resizeListeners
            }
        }
    }
}
export {EleResize}
