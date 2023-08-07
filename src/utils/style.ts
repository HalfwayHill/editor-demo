import { sin, cos } from '@/utils/translate'
import { $ } from '@/utils/utils'

/**
 * 获取样式
 * @param style 样式数据
 * @param filter 过滤关键字数组
 */
export function getStyle(style: any, filter: any[] = []) {
    const needUnit = [
        'fontSize',
        'width',
        'height',
        'top',
        'left',
        'borderWidth',
        'letterSpacing',
        'borderRadius',
    ]

    const result: any = {}
    Object.keys(style).forEach(key => {
        // 判断过滤器是否包含相关key值
        if (!filter.includes(key)) {
            // 判断key不等于rotate
            if (key != 'rotate') {
                result[key] = style[key]

                // 当包含单元属性，填入px字段
                if (needUnit.includes(key)) {
                    result[key] += 'px'
                }
            } else {
                result.transform = key + '(' + style[key] + 'deg)'
            }
        }
    })

    return result
}

/**
 * 获取组件旋转样式
 * @param style
 */
export function getComponentRotatedStyle(style: any) {
    style = { ...style };
    if (style.rotate != 0) {
        const newWidth = style.width * cos(style.rotate) + style.height * sin(style.rotate);
        // 旋转后范围变小是正值，变大是负值
        const diffX = (style.width - newWidth) / 2;
        style.left += diffX;
        style.right = style.left + newWidth;

        const newHeight = style.height * cos(style.rotate) + style.width * sin(style.rotate);
        // 始终是正
        const diffY = (newHeight - style.height) / 2;
        style.top -= diffY;
        style.bottom = style.top + newHeight;

        style.width = newWidth;
        style.height = newHeight;
    } else {
        style.bottom = style.top + style.height;
        style.right = style.left + style.width;
    }

    return style;
}

/**
 * 分解组件
 * @param component
 * @param editorRect
 * @param parentStyle
 */
export function decomposeComponent(component: any, editorRect: any, parentStyle: any) {
    const componentRect = $(`#component${component.id}`).getBoundingClientRect();
    // 获取元素的中心点坐标
    const center = {
        x: componentRect.left - editorRect.left + componentRect.width / 2,
        y: componentRect.top - editorRect.top + componentRect.height / 2,
    };

    component.style.rotate = (component.style.rotate + parentStyle.rotate + 360) % 360;
    component.style.width = parseFloat(component.groupStyle.width) / 100 * parentStyle.width;
    component.style.height = parseFloat(component.groupStyle.height) / 100 * parentStyle.height;
    // 计算出元素新的 top left 坐标
    component.style.left = center.x - component.style.width / 2;
    component.style.top = center.y - component.style.height / 2;
    component.groupStyle = {};
}