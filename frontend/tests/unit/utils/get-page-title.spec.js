import defaultSettings from '@/settings'
import getPageTitle from '@/utils/get-page-title'

describe('Utils:getPageTitle', () => {
  const title = defaultSettings.title || 'Vue App'
  const pageTitle = 'Home'
  it('getPageTitle test', () => {
    expect(getPageTitle(pageTitle)).toEqual(`${pageTitle} - ${title}`)
    expect(getPageTitle()).toEqual(`${title}`)
  })
})
