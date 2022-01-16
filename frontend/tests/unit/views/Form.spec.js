import Form from '@/views/form/index.vue'
import { shallowMount, createLocalVue } from '@vue/test-utils'
import ElementUI from 'element-ui'
import Vuex from 'vuex'

const localVue = createLocalVue()
localVue.use(Vuex)
localVue.use(ElementUI)

describe('Form.vue', () => {
  let mocks
  let message = jest.fn()

  beforeEach(() => {
    mocks = {
      $message: message
    }
  })

  it('test form', () => {
    const wrapper = shallowMount(Form, { localVue, mocks })
    wrapper.vm.onSubmit()
    wrapper.vm.onCancel()
    expect(message).toHaveBeenCalledTimes(2)
  })
})