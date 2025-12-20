import request from '@/utils/request'

/**
 * 记录当天 UV（登录后调用，幂等）
 */
export function trackVisit() {
  return request({
    url: '/visit/track',
    method: 'get'
  })
}
