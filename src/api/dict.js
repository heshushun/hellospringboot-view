import request from '@/utils/request'

export function getDictItems(entryCode) {
  return request({
    url: '/sys/dictItem/getDictItems',
    method: 'get',
    params: {
      entryCode: entryCode
    }
  })
}
