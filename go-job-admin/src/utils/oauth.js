const STATE_STORAGE_KEY = 'go-job.oauth.state'
const REDIRECT_STORAGE_KEY = 'go-job.oauth.redirect'

export function createOAuthState() {
    const bytes = new Uint8Array(16)
    window.crypto.getRandomValues(bytes)
    return Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('')
}

export function saveOAuthState(state) {
    window.sessionStorage.setItem(STATE_STORAGE_KEY, state)
}

export function getSavedOAuthState() {
    return window.sessionStorage.getItem(STATE_STORAGE_KEY) || ''
}

export function clearOAuthState() {
    window.sessionStorage.removeItem(STATE_STORAGE_KEY)
}

export function saveLoginRedirect(path) {
    window.sessionStorage.setItem(REDIRECT_STORAGE_KEY, path)
}

export function consumeLoginRedirect() {
    const target = window.sessionStorage.getItem(REDIRECT_STORAGE_KEY) || '/'
    window.sessionStorage.removeItem(REDIRECT_STORAGE_KEY)
    return target.startsWith('/') && !target.startsWith('//') ? target : '/'
}

function decodeRepeatedly(value) {
    let current = value
    for (let i = 0; i < 3; i++) {
        const decoded = decodeURIComponent(current)
        if (decoded === current) {
            return current
        }
        current = decoded
    }
    return current
}

export function normalizeOAuthAuthUrl(authUrl) {
    const redirectKey = 'redirect_uri='
    const redirectStart = authUrl.indexOf(redirectKey)
    if (redirectStart < 0) {
        return authUrl
    }

    const valueStart = redirectStart + redirectKey.length
    const rest = authUrl.slice(valueStart)
    const nextParamStart = ['&response_type=', '&scope=', '&state=', '&client_id=']
        .map((param) => rest.indexOf(param))
        .filter((index) => index >= 0)
        .sort((a, b) => a - b)[0]

    const redirectUri = nextParamStart === undefined ? rest : rest.slice(0, nextParamStart)
    const normalizedRedirectUri = encodeURIComponent(decodeRepeatedly(redirectUri))

    if (nextParamStart === undefined) {
        return `${authUrl.slice(0, valueStart)}${normalizedRedirectUri}`
    }

    const tail = rest.slice(nextParamStart)
    return `${authUrl.slice(0, valueStart)}${normalizedRedirectUri}${tail}`
}

export function buildOAuthAuthUrl(info, state) {
    const authUrl = normalizeOAuthAuthUrl(info.auth_url)
    const url = new URL(authUrl)
    const redirectUri = decodeRepeatedly(info.redirect_uri || url.searchParams.get('redirect_uri') || '')

    url.searchParams.set('client_id', info.client_id || url.searchParams.get('client_id') || '')
    url.searchParams.set('redirect_uri', redirectUri)
    url.searchParams.set('response_type', info.response_type || url.searchParams.get('response_type') || 'code')
    url.searchParams.set('state', state)

    const scope = info.scope || url.searchParams.get('scope')
    if (scope) {
        url.searchParams.set('scope', scope)
    }

    return url.toString()
}
