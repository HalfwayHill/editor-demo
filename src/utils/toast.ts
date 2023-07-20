import { ElMessage } from 'element-plus'

export default function toast(msg = '', type?: 'success' | 'warning' | 'info' | 'error', duration?: number) {
    ElMessage({
        message: msg,
        type: type,
        duration: duration
    })
}