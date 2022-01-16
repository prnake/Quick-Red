<template>
  <div :id="id" :style="style" />
</template>
<script>
import resize from './mixins/resize'

export default {
  name: 'Chart',
  mixins: [resize],
  props: {
    // 父组件需要传递的参数：id，width，height，option
    id: {
      type: String,
      default: 'main'
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '400px'
    },
    option: {
      type: Object,
      // Object类型的prop值一定要用函数return出来，不然会报错。原理和data是一样的，
      // 使用闭包保证一个vue实例拥有自己的一份props
      default() {}
    }
  },
  data() {
    return {
      // echarts实例
      chart: ''
    }
  },
  computed: {
    style() {
      return {
        height: this.height,
        width: this.width
      }
    }
  },
  watch: {
    // 观察option的变化
    option: {
      handler(newVal, oldVal) {
        if (this.chart) {
          if (newVal) {
            this.chart.setOption(newVal)
          } else {
            this.chart.setOption(oldVal)
          }
        } else {
          this.init()
        }
      },
      deep: true // 对象内部属性的监听，关键。
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      this.chart = this.$echarts.init(document.getElementById(this.id))
      this.chart.setOption(this.option)
    }
  }
}
</script>
