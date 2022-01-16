import Tree from '@/views/tree/index.vue'
import { shallowMount, createLocalVue } from '@vue/test-utils'
import ElementUI from 'element-ui'
import Vuex from 'vuex'

const localVue = createLocalVue()
localVue.use(Vuex)
localVue.use(ElementUI)

const data = {
  id: 1,
  label: 'Level one 1',
  children: [{
    id: 4,
    label: 'Level two 1-1',
    children: [{
      id: 9,
      label: 'Level three 1-1-1'
    }, {
      id: 10,
      label: 'Level three 1-1-2'
    }]
  }]
}

describe('Tree.vue', () => {

  it('filterNode', () => {
    const wrapper = shallowMount(Tree, { localVue })
    expect(wrapper.vm.filterNode("", data)).toBeTruthy()
    expect(wrapper.vm.filterNode(1, data)).toBeTruthy()
    expect(wrapper.vm.filterNode(2, data)).toBeFalsy()
    wrapper.vm.$refs.tree2.filter = jest.fn()
    wrapper.vm.filterText = "text"
    expect(wrapper.vm.$refs.tree2.filter).toBeCalled()
  })
})