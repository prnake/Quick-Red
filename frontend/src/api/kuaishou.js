import request from '@/utils/request'

export function getInfo(data) {
  return request({
    url: '/kuaishou/user/',
    method: 'get',
    data
  })
}

export function getVideoList(data) {
  return request({
    url: '/kuaishou/videolist',
    method: 'post',
    data
  })
}

export function setTags(data) {
  return request({
    url: '/kuaishou/settags',
    method: 'post',
    data
  })
}

export function getOneDayData(data) {
  return request({
    url: '/kuaishou/hometf',
    method: 'post',
    data
  })
}

export function getVideoData(data) {
  return request({
    url: '/kuaishou/vdata',
    method: 'post',
    data
  })
}
