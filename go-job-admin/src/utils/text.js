export function getTagType(type) {
    switch (type) {
        case 0:
            return 'primary'
        case 1:
            return 'warning'
        case 2:
            return 'success'
        case 3:
            return 'danger'
        default:
            return 'info'
    }
}

export function formatJobStatus(type) {
    switch (type) {
        case 0:
            return '待运行'
        case 1:
            return '运行中'
        case 2:
            return '成功'
        case 3:
            return '失败'
        default:
            return ''
    }
}