import {ElNotification} from "element-plus";

export function notify(msg, type='success', title='', duration=3000) {
    ElNotification({
        title: title,
        message: msg,
        type: type,
        duration: duration,
    })
}