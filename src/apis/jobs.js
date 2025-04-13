import service from '@/apis/requests'
import { defaultPageSize } from '@/apis/consts'

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


// 获取所有的jobs
export function getJobs(params = defaultPageSize) {
    return service({
        url: '/jobs', // 相对路径
        method: 'get',
        params,
    })
}

// 获取单个job
export function getJob(id) {
    return service({
        url: `/jobs/${id}`,
        method: 'get',
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