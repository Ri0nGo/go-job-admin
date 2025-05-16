import service from '@/apis/axios'
import {defaultPageSize} from "../common/common.js";

// 查询所有的节点
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

// 安装节点依赖
export function installNodeRef(data, timeout=10000) {
    return service({
        url: `/nodes/install_ref`,
        method: 'post',
        data,
        timeout,
    })
}

// 查询节点信息
export function getNodeInfo(id, timeout=10000) {
    return service({
        url: `/nodes/${id}/info`,
        method: 'get',
        timeout,
    })
}