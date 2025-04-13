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
export function create(data) {
    return service({
        url: `/nodes/add`,
        method: 'post',
        data,
    })
}

// 更新job
export function updateJob(data) {
    return service({
        url: `/jobs/update`,
        method: 'put',
        data,
    })
}

// 删除job
export function deleteJob(id) {
    return service({
        url: `/jobs/${id}`,
        method: 'delete',
    })
}

