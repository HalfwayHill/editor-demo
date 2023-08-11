import appStore from "@/store";
import emitter from "@/utils/mitt";

const ctrlKey = 'Control',
    vKey = 'v', // 粘贴
    cKey = 'c', // 复制
    xKey = 'x', // 剪切

    yKey = 'y', // 重做
    zKey = 'z', // 撤销

    gKey = 'g', // 组合
    bKey = 'b', // 拆分

    lKey = 'l', // 锁定
    uKey = 'u', // 解锁

    sKey = 's', // 保存
    pKey = 'p', // 预览
    dKey = 'd', // 删除
    deleteKey = 'Delete', // 删除
    eKey = 'e' // 清空画布
export const keycodes = ['b', 'c', 'd', 'e', 'g', 'l', 'p', 's', 'u', 'v', 'x', 'y', 'z'];

/**
 * 与组件状态无关的操作
 */
const baseMap = {
    [vKey]: paste,
    [yKey]: redo,
    [zKey]: undo,
    [sKey]: save,
    [pKey]: preview,
    [eKey]: clearCanvas,
};

/**
 * 组件锁定状态下可以执行的操作
 */
const lockMap = {
    ...baseMap,
    [uKey]: unlock,
}

/**
 * 组件未锁定状态下可以执行的操作
 */
const unlockMap = {
    ...baseMap,
    [cKey]: copy,
    [xKey]: cut,
    [gKey]: compose,
    [bKey]: decompose,
    [dKey]: deleteComponent,
    [deleteKey]: deleteComponent,
    [lKey]: lock,
}

let isCtrlDown = false;

/**
 * 全局监听按键操作并执行相应命令
 */
export function listenGlobalKeyDown() {
    window.onkeydown = (e) => {
        const { curComponent } = appStore.editorStore.editorState;
        if (e.key === ctrlKey) {
            isCtrlDown = true
        } else if (e.key === deleteKey && curComponent) {
            appStore.editorStore.deleteComponent();
            appStore.editorStore.recordSnapshot();
        } else if (isCtrlDown) {
            if (!curComponent || !curComponent.isLock) {
                e.preventDefault();
                unlockMap[e.key as keyof typeof unlockMap] && unlockMap[e.key as keyof typeof unlockMap]();
            } else if (curComponent && curComponent.isLock) {
                e.preventDefault();
                lockMap[e.key as keyof typeof lockMap] && lockMap[e.key as keyof typeof lockMap]()
            }
        }
    }

    window.onkeyup = (e) => {
        if (e.key === ctrlKey) {
            isCtrlDown = false
        }
    }
}

function copy() {
    appStore.editorStore.copy();
}

function paste() {
    appStore.editorStore.paste(false);
    appStore.editorStore.recordSnapshot();
}

function cut() {
    appStore.editorStore.cut();
}

function redo() {
    appStore.editorStore.redo();
}

function undo() {
    appStore.editorStore.undo();
}

function compose() {
    if (appStore.editorStore.editorState.areaData.components.length) {
        appStore.editorStore.compose();
        appStore.editorStore.recordSnapshot();
    }
}

function decompose() {
    const curComponent = appStore.editorStore.editorState.curComponent
    if (curComponent && !curComponent.isLock && curComponent.component == 'VGroup') {
        appStore.editorStore.decompose();
        appStore.editorStore.recordSnapshot();
    }
}

function save() {
    emitter.emit('save');
}

function preview() {
    emitter.emit('preview');
}

function deleteComponent() {
    if (appStore.editorStore.editorState.curComponent) {
        appStore.editorStore.deleteComponent();
        appStore.editorStore.recordSnapshot();
    }
}

function clearCanvas() {
    emitter.emit('clearCanvas');
}

function lock() {
    appStore.editorStore.lock();
}

function unlock() {
    appStore.editorStore.unlock();
}
