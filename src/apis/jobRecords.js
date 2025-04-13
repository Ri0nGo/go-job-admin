import service from '@/apis/requests'
import { defaultPageSize } from '@/apis/consts'


// 获取所有的jobs
export function getJobRecords(params = defaultPageSize) {
    return service({
        url: '/job_records', // 相对路径
        method: 'get',
        params,
    })
}

// 获取单个job
export function getJobRecord(id) {
    return service({
        url: `/job_records/${id}`,
        method: 'get',
    })
}