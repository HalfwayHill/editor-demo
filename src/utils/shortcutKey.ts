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

    sKey = 's', // 保存
    pKey = 'p', // 预览
    dKey = 'd', // 删除
    deleteKey = 'Delete', // 删除
    eKey = 'e' // 清空画布
export const keycodes = ['b', 'c', 'd', 'e', 'g', 'p', 's', 'v', 'x', 'y', 'z'];

const keyMap = {
    [vKey]: paste,
    [cKey]: copy,
    [xKey]: cut,
    [vKey]: paste,
    [yKey]: redo,
    [zKey]: undo,
    [gKey]: compose,
    [bKey]: decompose,
    [sKey]: save,
    [pKey]: preview,
    [dKey]: deleteComponent,
    [deleteKey]: deleteComponent,
    [eKey]: clearCanvas,
};

let isCtrlDown = false;

/**
 * 全局监听按键操作并执行相应命令
 */
export function listenGlobalKeyDown() {
    window.onkeydown = (e) => {
        const store = appStore.editorStore;
        if (e.key === ctrlKey) {
            isCtrlDown = true
        } else if (e.key === deleteKey && store.editorState.curComponent) {
            store.deleteComponent();
            store.recordSnapshot();
        }else if (isCtrlDown) {
            keyMap[e.key as keyof typeof keyMap](e);
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

function redo(e: any) {
    appStore.editorStore.redo();
    e.preventDefault();
}

function undo() {
    appStore.editorStore.undo();
}

function compose(e: any) {
    if (appStore.editorStore.editorState.areaData.components.length) {
        appStore.editorStore.compose();
        appStore.editorStore.recordSnapshot();
        e.preventDefault();
    }
}

function decompose(e: any) {
    const curComponent = appStore.editorStore.editorState.curComponent
    if (curComponent && !curComponent.isLock && curComponent.component == 'VGroup') {
        appStore.editorStore.decompose();
        appStore.editorStore.recordSnapshot();
        e.preventDefault();
    }
}

function save(e: any) {
    emitter.emit('save');
    e.preventDefault();
}

function preview(e: any) {
    emitter.emit('preview');
    e.preventDefault();
}

function deleteComponent(e: any) {
    if (appStore.editorStore.editorState.curComponent) {
        appStore.editorStore.deleteComponent();
        appStore.editorStore.recordSnapshot();
        e.preventDefault();
    }
}

function clearCanvas(e: any) {
    emitter.emit('clearCanvas');
    e.preventDefault();
}
