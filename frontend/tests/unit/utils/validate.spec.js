import { validUsername, isExternal } from '@/utils/validate.js'

describe('Utils:validate', () => {
  it('validUsername', () => {
    expect(validUsername('editor')).toBe(1)
  })
  it('isExternal', () => {
    expect(isExternal('https://github.com/PanJiaChen/vue-element-admin')).toBe(true)
    expect(isExternal('http://github.com/PanJiaChen/vue-element-admin')).toBe(true)
    expect(isExternal('github.com/PanJiaChen/vue-element-admin')).toBe(false)
    expect(isExternal('/dashboard')).toBe(false)
    expect(isExternal('./dashboard')).toBe(false)
    expect(isExternal('dashboard')).toBe(false)
  })
})
