import service from '@/apis/requests'
import { defaultPageSize } from '@/apis/consts'

export function getNodes(params = defaultPageSize) {
    return service({
        url: '/nodes', // 相对路径
        method: 'get',
        params,
    })
}

// 创建job
export function createNode(data) {
    return service({
        url: `/nodes/add`,
        method: 'post',
        data,
    })
}

// 更新job
export function updateNode(data) {
    return service({
        url: `/nodes/update`,
        method: 'put',
        data,
    })
}

// 删除job
export function deleteNode(id) {
    return service({
        url: `/nodes/${id}`,
        method: 'delete',
    })
}

