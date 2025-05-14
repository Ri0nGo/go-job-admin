import service from '@/apis/axios'

// 获取所有的jobs
export function getDashboardSummary() {
    return service({
        url: '/dashboards/summary', // 相对路径
        method: 'get',
    })
}

// 获取单个job
export function getChart(data) {
    return service({
        url: `/dashboards/chart`,
        method: 'post',
        data: data,
    })
}