import VideoList from '@/views/videolist/index.vue'
import { mount, shallowMount, createLocalVue } from '@vue/test-utils'
import ElementUI from 'element-ui'
import VueRouter from 'vue-router'
import store from '@/store'

const localVue = createLocalVue()
localVue.use(VueRouter)
localVue.use(ElementUI)

const routes = [
    {
        path: '/',
        name: 'videolist'
    }]
const router = new VueRouter({ routes })

jest.mock('@/api/kuaishou', () => {
    return {
        setTags: (req) => {
            if (req.tags === "400") {
                return Promise.resolve({
                    "code": 400
                })
            } else {
                return Promise.resolve({
                    "code": 200
                })
            }
        },
        getVideoList: () => {
            return Promise.resolve({
                "code": 200,
                "data": {
                    "items": [
                        {
                            "comments": 1893,
                            "id": 3679,
                            "likes": 1899,
                            "pic": "https://images.squarespace-cdn.com/content/v1/53b0e2a2e4b02125b9194093/1583016666869-FK55GSR0KF32JT4K9HCO/ke17ZwdGBToddI8pDm48kHquW7lo7f1g4Yug1KNGNqoUqsxRUqqbr1mOJYKfIPR7LoDQ9mXPOjoJoqy81S2I8N_N4V1vUb5AoIIIbLZhVYxCRW4BPu10St3TBAUQYVKcSKxi-A1pjvKEznBal7wwUB7y382cSPWFP-heM-uczoAJYr1j6jiGS2WvwCUw4hPZ/kuaishou.jpg?format=750w",
                            "plays": 4546,
                            "pubdate": "2002-09-04 03:31:08",
                            "tags": ["风景", "学习", "清华"],
                            "title": "Pdsifhbjp slywxlr lmkaqog fmyomiwkk fped orb fugy mduxcrwev fpdjemgsi xtcasalfj xbmaegda nhgc xaswabdv vett fhqgydpt unfsk iokxdprac."
                        },
                        {
                            "comments": 193,
                            "id": 369,
                            "likes": 1,
                            "pic": "https://images.squarespace-cdn.com/content/v1/53b0e2a2e4b02125b9194093/1583016666869-FK55GSR0KF32JT4K9HCO/ke17ZwdGBToddI8pDm48kHquW7lo7f1g4Yug1KNGNqoUqsxRUqqbr1mOJYKfIPR7LoDQ9mXPOjoJoqy81S2I8N_N4V1vUb5AoIIIbLZhVYxCRW4BPu10St3TBAUQYVKcSKxi-A1pjvKEznBal7wwUB7y382cSPWFP-heM-uczoAJYr1j6jiGS2WvwCUw4hPZ/kuaishou.jpg?format=750w",
                            "plays": 456,
                            "pubdate": "2002-09-04 03:32:08",
                            "tags": ["风景", "北大"],
                            "title": "Pdsifhbjp slywxlr lmkaqog fmyomiwkk fped orb fugy mduxcrwev fpdjemgsi xtcasalfj xbmaegda nhgc xaswabdv vett fhqgydpt unfsk iokxdprac."
                        }],
                    "total": 1
                }
            })
        }
    }
})

describe('VideoList.vue', () => {
    it(('fetchData'), async () => {
        const wrapper = shallowMount(VideoList, { router, localVue })
        await wrapper.vm.fetchData()
        expect(wrapper.vm.total).toBe(1)
        wrapper.vm.time_value = ""
        await wrapper.vm.fetchData()
        expect(wrapper.vm.total).toBe(0)
    })

    it(('test tags'), async () => {
        const wrapper = shallowMount(VideoList, { router, localVue })
        await wrapper.vm.fetchData()
        for (let i = 0; i < 3; i++) {
            wrapper.vm.pickerOptions.shortcuts[i].onClick({ $emit: jest.fn() })
        }
        wrapper.vm.sendTags(-1, "400")
        wrapper.vm.handleClose(0, "学习")
        wrapper.vm.handleInputConfirm(0)
        wrapper.vm.input[0] = "北大"
        wrapper.vm.handleInputConfirm(0)
        expect(wrapper.vm.input[0]).toBe("")
        wrapper.vm.$notify.error = jest.fn()
        wrapper.vm.input[1] = "北大"
        wrapper.vm.handleInputConfirm(1)
        wrapper.vm.input[0] = "北大北大北大北大北大北大北大北大北大北大"
        wrapper.vm.handleInputConfirm(0)
        wrapper.vm.handleFocus(0)
        wrapper.vm.cloud.onWordClick({ text: "123", value: 2 })
        expect(wrapper.vm.cloud.fontSizeMapper({ text: "123", value: 2 })).toBe(1)
    })
})