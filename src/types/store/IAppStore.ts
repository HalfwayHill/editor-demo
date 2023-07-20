import {editorStore} from "@/store/modules"

export interface IAppStore {
    editorStore: ReturnType<typeof editorStore>
}