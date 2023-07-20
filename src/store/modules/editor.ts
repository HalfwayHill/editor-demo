import {defineStore} from 'pinia'
import {computed, reactive, ref} from 'vue'
import {cloneDeep} from "lodash";
import {swap} from "@/utils/utils";
import toast from "@/utils/toast";


interface CanvasStyleData{
    width: number;
    height: number;
}

interface EditorState {
    editMode: string; // 编辑器模式 edit read
    canvasStyleData: CanvasStyleData; // 页面全局数据
    componentData: Array<any>;
    curComponent: any;
    curComponentZIndex: any;
    snapshotData: Array<any>; // 编辑器快照数据
    snapshotIndex: number; // 快照索引
    menuTop: number;
    menuLeft: number;
    menuShow: boolean;
}

export const editorStore = defineStore('editor', () => {
    const editorState = reactive<EditorState>({
        editMode: 'edit', // 编辑器模式 edit read
        canvasStyleData: { // 页面全局数据
            width: 1200,
            height: 740,
        },
        componentData: [],
        curComponent: null,
        curComponentZIndex: null,
        snapshotData: [], // 编辑器快照数据
        snapshotIndex: -1, // 快照索引
        menuTop: 0,
        menuLeft: 0,
        menuShow: false,
    })

    // ref reactive 就是state
    const count = ref<number>(0)

    //  computed() 就是getters
    const getCurComponent = computed(() => {
        return editorState.curComponent;
    })

    // function() 就是actions
    const setEditMode = (mode: string) => {
        editorState.editMode = mode;
    }

    const setCanvasStyle = (style: {width:number,height: number}) => {
        editorState.canvasStyleData = style;
    }

    const addComponent = (component: any) => {
        editorState.componentData.push(component);
    }

    const setCurComponent = (data: { component?: any, zIndex: number | null }) => {
        editorState.curComponent = data.component;
        editorState.curComponentZIndex = data.zIndex;
    }

    const setShapeStyle = (pos: { top?:number, left?: number, width?: number, height?: number }) => {
        if (pos.top) editorState.curComponent.style.top = pos.top
        if (pos.left) editorState.curComponent.style.left = pos.left
        if (pos.width) editorState.curComponent.style.width = pos.width
        if (pos.height) editorState.curComponent.style.height = pos.height
    }

    const setShapePosStyle = (data: { key: string, value: any }) => {
            editorState.curComponent.style[data.key] = data.value;
    }

    const undo = () => {
        if (editorState.snapshotIndex >= 0) {
            editorState.snapshotIndex--;
            setComponentData(cloneDeep(editorState.snapshotData[editorState.snapshotIndex]));
        }
    }

    const redo = () => {
        if (editorState.snapshotIndex < editorState.snapshotData.length - 1) {
            editorState.snapshotIndex++;
            setComponentData(cloneDeep(editorState.snapshotData[editorState.snapshotIndex]));
        }
    }

    const setComponentData = (componentData: any[] = []) =>  {
        editorState.componentData = componentData;
    }

    const recordSnapshot = () => {
        // 添加新的快照
        editorState.snapshotData[++editorState.snapshotIndex] = cloneDeep(editorState.componentData)
        // 在 undo 过程中，添加新的快照时，要将它后面的快照清理掉
        if (editorState.snapshotIndex < editorState.snapshotData.length - 1) {
            editorState.snapshotData = editorState.snapshotData.slice(0, editorState.snapshotIndex + 1)
        }
    }

    const showContextMenu = (data: { top: number, left: number }) => {
        editorState.menuShow = true;
        editorState.menuTop = data.top;
        editorState.menuLeft = data.left;
    }

    const hideContextMenu = () => {
        editorState.menuShow = false
    }

    /**
     * 删除当前组件实例
     */
    const deleteComponent = () => {
        editorState.componentData.splice(editorState.curComponentZIndex, 1)
    }

    /**
     * 组件图层上移
     */
    const upComponent = () => {
        // 上移图层 zIndex，表示元素在数组中越往后
        if (editorState.curComponentZIndex < editorState.componentData.length - 1) {
            swap(editorState.componentData, editorState.curComponentZIndex, editorState.curComponentZIndex + 1)
        } else {
            toast('已经到顶了', 'error')
        }
    }

    /**
     * 组件图层下移
     */
    const downComponent = () => {
        // 下移图层 zIndex，表示元素在数组中越往前
        if (editorState.curComponentZIndex > 0) {
            swap(editorState.componentData, editorState.curComponentZIndex, editorState.curComponentZIndex - 1)
        } else {
            toast('已经到底了', 'error')
        }
    }

    /**
     * 组件置于顶层
     */
    const topComponent = () => {
        // 置顶
        if (editorState.curComponentZIndex < editorState.componentData.length - 1) {
            swap(editorState.componentData, editorState.curComponentZIndex, editorState.componentData.length - 1)
        } else {
            toast('已经到顶了', 'error')
        }
    }

    /**
     * 组件置于底层
     */
    const bottomComponent = () => {
        // 置底
        if (editorState.curComponentZIndex > 0) {
            swap(editorState.componentData, editorState.curComponentZIndex, 0)
        } else {
            toast('已经到底了', 'error')
        }
    }

    /**
     * 添加动画
     * @param animation
     */
    const addAnimation = (animation: any) => {
        editorState.curComponent.animations.push(animation)
    }

    /**
     * 移除动画
     * @param index
     */
    const removeAnimation = (index: any) => {
        editorState.curComponent.animations.splice(index, 1)
    }

    /**
     * 添加事件
     * @param actionParam
     */
    const addEvent = (actionParam: { event: any, param: any }) => {
        editorState.curComponent.events[actionParam.event] = actionParam.param
    }

    /**
     * 移除事件
     * @param event
     */
    const removeEvent = (event: any) => {
        delete editorState.curComponent.events[event]
    }

    return {
        editorState,
        getCurComponent,
        setEditMode,
        setCanvasStyle,
        addComponent,
        setCurComponent,
        setShapeStyle,
        setShapePosStyle,
        undo,
        redo,
        setComponentData,
        recordSnapshot,
        showContextMenu,
        hideContextMenu,
        deleteComponent,
        upComponent,
        downComponent,
        topComponent,
        bottomComponent,
        addAnimation,
        removeAnimation,
        addEvent,
        removeEvent
    }
})