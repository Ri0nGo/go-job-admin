import {ElNotification} from "element-plus";

export function notify(msg, type='success', title='') {
    ElNotification({
        title: title,
        message: msg,
        type: type,
    })
}