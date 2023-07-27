import { ElMessage } from 'element-plus'

/**
 * 使用ElMessage显示消息
 * @param message
 * @param type
 * @param duration
 */
export default function toast(message = '', type: 'success' | 'warning' | 'info' | 'error' = 'error', duration: number = 1500) {
    const data = {
        message,
        type,
        duration,
    }

    ElMessage(data);
}