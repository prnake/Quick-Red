import request from '@/utils/request'

export function getUnreadNotices(data) {
  return request({
    url: '/notice/unread',
    method: 'post',
    data
  })
}

export function getAllNotices(data) {
  return request({
    url: '/notice/all',
    method: 'post',
    data
  })
}

export function setNoticeRead(data) {
  return request({
    url: '/notice/markread',
    method: 'post',
    data
  })
}
