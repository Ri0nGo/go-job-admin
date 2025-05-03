import service from '@/apis/axios'
import {defaultPageSizeOrder} from "../common/common.js";

// 查询所有的任务
export function getJobs(params = defaultPageSizeOrder) {
    return service({
        url: '/jobs', // 相对路径
        method: 'get',
        params,
    })
}

// 查询一个任务
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

// 更新任务
export function updateJob(data) {
    return service({
        url: `/jobs/update`,
        method: 'put',
        data,
    })
}

// 删除任务
export function deleteJob(id) {
    return service({
        url: `/jobs/${id}`,
        method: 'delete',
    })
}

// 上传文件
export function uploadJobFile(file) {
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