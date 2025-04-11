import service from '@/apis/requests'
import { defaultPageSize } from '@/apis/consts'


export function getJobs(params=defaultPageSize) {
    return service({
      url: '/jobs', // 相对路径
      method: 'get',
      params,
    })
  }

export function updateJob(data) {
    return request({
        url: `/jobs`,
        method: 'put',
        data, 
    }) 
}

export function deleteJob(id) {
    return request({
        url: `/jobs/${id}`,
        method: 'delete',
    }) 
}