import service from '@/apis/requests'
import { defaultPageSize } from '@/apis/consts'


export function getJobs(params = defaultPageSize) {
    return service({
        url: '/jobs', // 相对路径
        method: 'get',
        params,
    })
}

// 创建job
export function createJob(data) {
    return service({
        url: `/jobs/add`,
        method: 'post',
        data,
    })
}

export function updateJob(data) {
    return service({
        url: `/jobs/update`,
        method: 'put',
        data,
    })
}

export function deleteJob(id) {
    return service({
        url: `/jobs/${id}`,
        method: 'delete',
    })
}

// 上传文件
export function uploadFile(file) {
    const formData = new FormData()
    formData.append('file', file)
    return service({
        url: '/jobs/upload',
        method: 'post',
        data: formData,
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })
}
