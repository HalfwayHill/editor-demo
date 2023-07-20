import {
    editorStore
} from "./modules";
import {IAppStore} from "@/types";

const appStore: IAppStore = {} as IAppStore

/**
 * 注册app状态库
 */
export const registerStore = () => {
    appStore.editorStore = editorStore();
}

export default appStore