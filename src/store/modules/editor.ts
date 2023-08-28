import {defineStore} from 'pinia'
import {computed, reactive} from 'vue'
import {cloneDeep} from "lodash";
import {swap, $} from "@/utils/utils";
import toast from "@/utils/toast";
import generateID from '@/utils/generateID';
import {decomposeComponent} from "@/utils/decomposeComponent";
import emitter from "@/utils/mitt";
import {commonAttr, commonStyle} from "@/custom-component/component-list";


interface CanvasStyleData{
    width: number;
    height: number;
    scale: number;
}

interface EditorState {
    editMode: string; // 编辑器模式 edit preview
    canvasStyleData: CanvasStyleData; // 页面全局数据
    componentData: Array<any>;  // 画布组件数据
    curComponent: any;
    curComponentIndex: any;
    isClickComponent: boolean, // 点时画布时是否点中组件，主要用于取消选中组件用。如果点在空白处，则为 false。
    snapshotData: Array<any>; // 编辑器快照数据
    snapshotIndex: number; // 快照索引
    menuTop: number; // 右击菜单数据
    menuLeft: number;
    menuShow: boolean;
    copyData: any, // 复制粘贴剪切
    areaData: { // 选中区域包含的组件以及区域位移信息
        style: {
            top: number,
            left: number,
            width: number,
            height: number,
        },
        components: any[],
    },
    editor: any,
    isCut: boolean,
}

export const editorStore = defineStore('editor', () => {
    const editorState = reactive<EditorState>({
        editMode: 'edit', // 编辑器模式 edit read
        canvasStyleData: { // 页面全局数据
            width: 1200,
            height: 740,
            scale: 100,
        },
        componentData: [],
        curComponent: null,
        curComponentIndex: null,
        // 点击画布时是否点中组件，主要用于取消选中组件用。
        // 如果没点中组件，并且在画布空白处弹起鼠标，则取消当前组件的选中状态
        isClickComponent: false,
        snapshotData: [], // 编辑器快照数据
        snapshotIndex: -1, // 快照索引
        menuTop: 0,
        menuLeft: 0,
        menuShow: false,
        copyData: null, // 复制粘贴剪切
        areaData: { // 选中区域包含的组件以及区域位移信息
            style: {
                top: 0,
                left: 0,
                width: 0,
                height: 0,
            },
            components: [],
        },
        editor: null,
        isCut: false,
    });

    // ref reactive 就是state

    //  computed() 就是getters
    const getCurComponent = computed(() => {
        return editorState.curComponent;
    });

    // function() 就是actions

    const getEditor = () => {
        editorState.editor = $('#editor');
    };

    const setAreaData = (data: any) => {
        editorState.areaData = data;
    };

    const compose = () => {
        const components: any[] = [];
        editorState.areaData.components.forEach(component => {
            if (component.component != 'VGroup') {
                components.push(component);
            } else {
                // 如果要组合的组件中，已经存在组合数据，则需要提前拆分
                const parentStyle = { ...component.style };
                const subComponents: any[] = component.propValue;
                const editorRect = editorState.editor.getBoundingClientRect();

                deleteComponent();
                subComponents.forEach(subComponent => {
                    decomposeComponent(subComponent, editorRect, parentStyle);
                    addComponent({ component: subComponent, index: undefined });
                })

                components.push(...component.propValue);
                batchDeleteComponent(component.propValue);
            }
        });

        addComponent({
            component: {
                id: generateID(),
                component: 'VGroup',
                ...commonAttr,
                style: {
                    ...commonStyle,
                    ...editorState.areaData.style,
                },
                propValue: components,
            },
            index: undefined
        });

        emitter.emit('hideArea');

        batchDeleteComponent(editorState.areaData.components);
        setCurComponent({
            component: editorState.componentData[editorState.componentData.length - 1],
            index: editorState.componentData.length - 1,
        });

        editorState.areaData.components = [];
    };

    /**
     * 将已经放到 Group 组件数据删除，也就是在 componentData 中删除，因为它们已经放到 Group 组件中了
     * @param deleteData
     */
    const batchDeleteComponent =(deleteData: any[]) => {
        console.log("componentData", editorState.componentData);
        console.log("deleteData", deleteData);
        deleteData.forEach(component => {
            for (let i = 0, len = editorState.componentData.length; i < len; i++) {
                if (component.id == editorState.componentData[i].id) {
                    editorState.componentData.splice(i, 1);
                    break
                }
            }
        })
    };

    const decompose = () => {
        const parentStyle = { ...editorState.curComponent.style };
        const components: any[] = editorState.curComponent.propValue;
        const editorRect = editorState.editor.getBoundingClientRect();

        deleteComponent();
        components.forEach(component => {
            decomposeComponent(component, editorRect, parentStyle);
            addComponent({component ,index: undefined});
        })
    };

    /**
     * 复制
     */
    const copy = () => {
        if (!editorState.curComponent) return
        editorState.copyData = {
            data: cloneDeep(editorState.curComponent),
            index: editorState.curComponentIndex,
        };

        editorState.isCut = false;
    };

    /**
     * 粘贴
     * @param isMouse
     */
    const paste = (isMouse: boolean) => {
        // 首先判断数据有无
        if (!editorState.copyData) {
            toast('没有组件复制数据，请复制组件');
            return
        }

        const copyData = editorState.copyData.data;

        if (isMouse) {
            copyData.style.top = editorState.menuTop;
            copyData.style.left = editorState.menuLeft;
        } else {
            copyData.style.top += 10;
            copyData.style.left += 10;
        }

        copyData.id = generateID();
        if (copyData.component === 'Group') {
            (copyData.propValue as any[]).forEach(component => {
                component.id = generateID();
            })
        }
        addComponent({component: cloneDeep(copyData), index: undefined});
        if (editorState.isCut) {
            // 复制数据置空
            editorState.copyData = null
        }
    };

    /**
     * 剪切
     */
    const cut = () => {
        if (editorState.curComponent) {
            toast('请选择组件');
            return;
        }
        // 当前是否有复制数据
        // todo：若有复制数据，是否应该直接弃用
        if (editorState.copyData) {
            const data = cloneDeep(editorState.copyData.data);
            const index = editorState.copyData.index;
            data.id = generateID();
            addComponent({ component: data, index: index });
            if (editorState.curComponentIndex >= index) {
                // 如果当前组件索引大于等于插入索引，需要加一，因为当前组件往后移了一位
                editorState.curComponentIndex++;
            }
        }

        copy();
        deleteComponent();
        editorState.isCut = true
    };

    const setClickComponentStatus = (status: boolean) => {
        editorState.isClickComponent = status
    };

    const setEditMode = (mode: string) => {
        editorState.editMode = mode;
    };

    const setCanvasStyle = (style: CanvasStyleData) => {
        editorState.canvasStyleData = style;
    };

    const addComponent = (data: { component: any, index: number | undefined }) => {
        if (data.index !== undefined) {
            editorState.componentData.splice(data.index, 0, data.component)
        } else {
            editorState.componentData.push(data.component)
        }
    };

    const setCurComponent = (data: { component?: any, index: number | null }) => {
        editorState.curComponent = data.component;
        editorState.curComponentIndex = data.index;
    };

    const setShapeStyle = (pos: { top?:number, left?: number, width?: number, height?: number, rotate?: number }) => {
        if (pos.top) editorState.curComponent.style.top = pos.top
        if (pos.left) editorState.curComponent.style.left = pos.left
        if (pos.width) editorState.curComponent.style.width = pos.width
        if (pos.height) editorState.curComponent.style.height = pos.height
        if (pos.rotate) editorState.curComponent.style.rotate = pos.rotate
    };

    const setShapeSingleStyle = (data: { key: string, value: any }) => {
            editorState.curComponent.style[data.key] = data.value;
    };

    const undo = () => {
        if (editorState.snapshotIndex >= 0) {
            editorState.snapshotIndex--;
            setComponentData(cloneDeep(editorState.snapshotData[editorState.snapshotIndex]));
        }
    };

    const redo = () => {
        if (editorState.snapshotIndex < editorState.snapshotData.length - 1) {
            editorState.snapshotIndex++;
            setComponentData(cloneDeep(editorState.snapshotData[editorState.snapshotIndex]));
        }
    };

    /**
     * 设置画布数据
     */
    const setComponentData = (componentData: any[] = []) =>  {
        editorState.componentData = componentData;
    };

    /**
     * 重新设置快照
     */
    const recordSnapshot = () => {
        // 添加新的快照
        editorState.snapshotData[++editorState.snapshotIndex] = cloneDeep(editorState.componentData);
        // 在 undo 过程中，添加新的快照时，要将它后面的快照清理掉
        if (editorState.snapshotIndex < editorState.snapshotData.length - 1) {
            editorState.snapshotData = editorState.snapshotData.slice(0, editorState.snapshotIndex + 1);
        }
    };

    const showContextMenu = (data: { top: number, left: number }) => {
        editorState.menuShow = true;
        editorState.menuTop = data.top;
        editorState.menuLeft = data.left;
    };

    const hideContextMenu = () => {
        editorState.menuShow = false;
    };

    /**
     * 删除当前组件实例
     */
    const deleteComponent = (index = editorState.curComponentIndex) => {
        if (index === undefined) {
            index = editorState.curComponentIndex
        }

        if (index == editorState.curComponentIndex) {
            editorState.curComponentIndex = null
            editorState.curComponent = null
        }

        editorState.componentData.splice(index, 1);
    };

    /**
     * 组件图层上移
     */
    const upComponent = () => {
        // 上移图层 zIndex，表示元素在数组中越往后
        if (editorState.curComponentIndex < editorState.componentData.length - 1) {
            swap(editorState.componentData, editorState.curComponentIndex, editorState.curComponentIndex + 1);
        } else {
            toast('已经到顶了');
        }
    };

    /**
     * 组件图层下移
     */
    const downComponent = () => {
        // 下移图层 zIndex，表示元素在数组中越往前
        if (editorState.curComponentIndex > 0) {
            swap(editorState.componentData, editorState.curComponentIndex, editorState.curComponentIndex - 1);
        } else {
            toast('已经到底了');
        }
    };

    /**
     * 组件置于顶层
     */
    const topComponent = () => {
        // 置顶
        if (editorState.curComponentIndex < editorState.componentData.length - 1) {
            swap(editorState.componentData, editorState.curComponentIndex, editorState.componentData.length - 1);
        } else {
            toast('已经到顶了');
        }
    };

    /**
     * 组件置于底层
     */
    const bottomComponent = () => {
        // 置底
        if (editorState.curComponentIndex > 0) {
            swap(editorState.componentData, editorState.curComponentIndex, 0);
        } else {
            toast('已经到底了');
        }
    };

    /**
     * 添加动画
     * @param animation
     */
    const addAnimation = (animation: any) => {
        editorState.curComponent.animations.push(animation)
    };

    /**
     * 移除动画
     * @param index
     */
    const removeAnimation = (index: any) => {
        editorState.curComponent.animations.splice(index, 1)
    };

    /**
     * 添加事件
     * @param actionParam
     */
    const addEvent = (actionParam: { event: any, param: any }) => {
        editorState.curComponent.events[actionParam.event] = actionParam.param
    };

    /**
     * 移除事件
     * @param event 事件
     */
    const removeEvent = (event: any) => {
        delete editorState.curComponent.events[event]
    };

    /**
     * 组件锁定
     */
    const lock = () => {
        editorState.curComponent.isLock = true
    };

    /**
     * 组件不锁定
     */
    const unlock = () => {
        editorState.curComponent.isLock = false
    };

    return {
        editorState,
        getCurComponent,
        getEditor,
        setAreaData,
        compose,
        batchDeleteComponent,
        decompose,
        copy,
        paste,
        cut,
        setClickComponentStatus,
        setEditMode,
        setCanvasStyle,
        addComponent,
        setCurComponent,
        setShapeStyle,
        setShapeSingleStyle,
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
        removeEvent,
        lock,
        unlock
    }
})