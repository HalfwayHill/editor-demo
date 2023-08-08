import appStore from "@/store";
import emitter from "@/utils/mitt";

const ctrlKey = 17,
    vKey = 86, // 粘贴
    cKey = 67, // 复制
    xKey = 88, // 剪切

    yKey = 89, // 重做
    zKey = 90, // 撤销

    gKey = 71, // 组合
    bKey = 66, // 拆分

    sKey = 83, // 保存
    pKey = 80, // 预览
    dKey = 68, // 删除
    deleteKey = 46, // 删除
    eKey = 69 // 清空画布

let isCtrlDown = false
export const keycodes = [66, 67, 68, 69, 71, 80, 83, 86, 88, 89, 90]

/**
 * 全局监听按键操作并执行相应命令
 */
export function listenGlobalKeyDown() {
    window.onkeydown = (e) => {
        const editorStore = appStore.editorStore;
        if (e.keyCode == deleteKey && editorStore.editorState.curComponent) {
            editorStore.deleteComponent();
            editorStore.recordSnapshot();
        } else if (e.keyCode == ctrlKey) {
            isCtrlDown = true
        } else if (isCtrlDown && e.keyCode == cKey) {
            editorStore.copy();
        } else if (isCtrlDown && e.keyCode == vKey) {
            editorStore.paste(false);
            editorStore.recordSnapshot();
        } else if (isCtrlDown && e.keyCode == xKey) {
            editorStore.cut();
        } else if (isCtrlDown && e.keyCode == yKey) {
            editorStore.redo();
            e.preventDefault();
        } else if (isCtrlDown && e.keyCode == zKey) {
            editorStore.undo();
        } else if (isCtrlDown && e.keyCode == gKey && editorStore.editorState.areaData.components.length) {
            editorStore.compose();
            editorStore.recordSnapshot();
            e.preventDefault()
        } else if (isCtrlDown && e.keyCode == bKey && editorStore.editorState.curComponent && editorStore.editorState.curComponent.component == 'VGroup') {
            editorStore.decompose();
            editorStore.recordSnapshot();
            e.preventDefault()
        } else if (isCtrlDown && e.keyCode == sKey) {
            emitter.emit('save');
            e.preventDefault();
        } else if (isCtrlDown && e.keyCode == pKey) {
            emitter.emit('preview');
            e.preventDefault();
        } else if (isCtrlDown && e.keyCode == dKey) {
            editorStore.deleteComponent();
            editorStore.recordSnapshot();
            e.preventDefault();
        } else if (isCtrlDown && e.keyCode == eKey) {
            emitter.emit('clearCanvas');
            e.preventDefault();
        }
    }

    window.onkeyup = (e) => {
        if (e.keyCode == ctrlKey) {
            isCtrlDown = false;
        }
    }
}