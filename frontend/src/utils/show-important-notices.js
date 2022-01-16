import { setNoticeRead } from '@/api/notice'

function isImportant(title) {
  if (title.slice(0, 3) === '[!]') {
    return true
  }
  return false
}

export function getPrefixlessTitle(title) {
  return title.slice(3, title.length)
}

export async function showImportantNotices(noticeList, elemPtr) {
  for (var i = 0; i < noticeList.length; i++) {
    if (isImportant(noticeList[i].title)) {
      await elemPtr.$notify({
        title: getPrefixlessTitle(noticeList[i].title),
        message: noticeList[i].message,
        duration: 0
      })
      var data = { id: noticeList[i].id }
      setNoticeRead(data).then((response) => { })
    }
  }
}
