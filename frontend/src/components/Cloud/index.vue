<template>
  <div>
    <div
      class="wordCloud_tagBall"
      :style="{ width: `${width + 50}px`, height: `${height}px` }"
    >
      <span
        v-for="(item, index) of data"
        :key="index"
        class="wordCloud_tag"
        :style="{
          color: color[index % color.length],
          ...contentEle[index].style,
        }"
        @click="onWordClick(item)"
      >{{ item.text }}</span>
    </div>
  </div>
</template>

<script>
export default {
  name: '',
  props: {
    data: {
      required: true,
      type: Array
    },
    onWordClick: {
      required: true,
      type: Function
    },
    fontSizeMapper: {
      required: true,
      type: Function
    },
    width: {
      type: Number,
      default: 500
    },
    height: {
      type: Number,
      default: 500
    }
  },
  data: () => ({
    color: ['#2D4DB6', '#04B67C', '#D1AF07', '#E27914', '#CB4A4D', '#B02690'],
    contentEle: [],
    direction: '-1',
    speed: 800
  }),
  watch: {
    data() {
      this.innit()
    }
  },
  created() {
    this.innit()
  },
  methods: {
    innit() {
      const RADIUSX = (this.width - 50) / 2
      const RADIUSY = (this.height - 50) / 2
      this.contentEle = []
      for (let i = 0; i < this.data.length; i += 1) {
        const k = -1 + (2 * (i + 1) - 1) / this.data.length
        const a = Math.acos(k)
        const b = a * Math.sqrt(this.data.length * Math.PI)
        const x = RADIUSX * Math.sin(a) * Math.cos(b)
        const y = RADIUSY * Math.sin(a) * Math.sin(b)
        const z = RADIUSX * Math.cos(a)
        const singleEle = {
          x,
          y,
          z,
          style: {
            'font-size': this.fontSizeMapper(this.data[i]) + 'px'
          }
        }
        this.contentEle.push(singleEle)
      }
      this.animate()
    },
    animate() {
      this.rotateX()
      this.rotateY()
      this.move()
      window.requestAnimationFrame(this.animate)
    },
    rotateX() {
      const angleX = ['-1', '1'].includes(this.direction)
        ? Math.PI / Infinity
        : Math.PI / ((Number(this.direction) / 2) * Number(this.speed))
      const cos = Math.cos(angleX)
      const sin = Math.sin(angleX)
      this.contentEle = this.contentEle.map((t) => {
        const y1 = t.y * cos - t.z * sin
        const z1 = t.z * cos + t.y * sin
        return {
          ...t,
          y: y1,
          z: z1
        }
      })
    },
    rotateY() {
      const angleY = ['-2', '2'].includes(this.direction)
        ? Math.PI / Infinity
        : Math.PI / (Number(this.direction) * Number(this.speed))
      const cos = Math.cos(angleY)
      const sin = Math.sin(angleY)
      this.contentEle = this.contentEle.map((t) => {
        const x1 = t.x * cos - t.z * sin
        const z1 = t.z * cos + t.x * sin
        return {
          ...t,
          x: x1,
          z: z1
        }
      })
    },
    move() {
      const CX = this.width / 2
      const CY = this.height / 2
      this.contentEle = this.contentEle.map((singleEle) => {
        const { x, y, z } = singleEle
        const fallLength = 500
        const RADIUS = (this.width - 50) / 2
        const scale = fallLength / (fallLength - z)
        const alpha = (z + RADIUS) / (2 * RADIUS)
        const left = `${x + CX - 15}px`
        const top = `${y + CY - 15}px`
        const transform = `translate(${left}, ${top}) scale(${scale})`
        const style = {
          ...singleEle.style,
          opacity: alpha + 0.5,
          zIndex: parseInt(scale * 100, 10),
          transform
        }
        return {
          x,
          y,
          z,
          style
        }
      })
    },
    handleSpeed(value) {
      const speedObj = {
        fast: -50,
        slow: 50
      }
      this.speed += speedObj[value]
      if (this.speed === 0) {
        this.speed = 50
      }
    }
  }
}
</script>

<style scoped>
.wordCloud_tagBall {
  margin: 50px auto;
  position: relative;
}
.wordCloud_tag {
  display: block;
  position: absolute;
  left: 0px;
  top: 0px;
  color: green;
  text-decoration: none;
  font-size: 10px;
  font-family: "微软雅黑";
  font-weight: bold;
}
.wordCloud_tag:hover {
  color: red;
}
.wordCloud_home {
  display: flex;
  justify-content: center;
}
</style>
