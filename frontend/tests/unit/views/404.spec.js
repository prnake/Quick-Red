import Lost from '@/views/404.vue'
import { shallowMount, createLocalVue } from '@vue/test-utils'
import ElementUI from 'element-ui'
import Vuex from 'vuex'

const localVue = createLocalVue()
localVue.use(Vuex)
localVue.use(ElementUI)

describe('404.vue', () => {
  it('message', () => {
    const wrapper = shallowMount(Lost, { localVue })
    expect(wrapper.vm.message).toBeDefined()
    // wrapper.vm.$refs.loginForm.validate = (callback) => { callback(true) }
    // wrapper.vm.handleLogin()
  })
})