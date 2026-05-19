import service from '@/apis/axios'

export function getOAuthInfo(params={}) {
    return service({
        url: '/oauth/info',
        params,
        method: 'get',
    })
}

export function oauthLogin(data={}) {
    return service({
        url: '/oauth/login',
        data,
        method: 'post',
    })
}

export function getGithubAuthUrl(params={}) {
    return service({
        url: '/oauth2/github/authurl', // 相对路径
        params: params,
        method: 'get',
    })
}

export function getQQAuthUrl(params={}) {
    return service({
        url: `/oauth2/qq/authurl`, // 相对路径
        params: params,
        method: 'get',
    })
}

