<template>
  <div class="home">
    <div v-if="!hasAuth" class="authhelp">
      <p>你还没有通过快手账号授权本站，请先授权以使用我们的服务。</p>
      <el-link
        type="primary"
        :href="authurl"
        style="font-size: 18px"
      >点击这里通过快手授权</el-link>
    </div>

    <div v-else class="data-container">
      <div class="info-container">
        <el-row :gutter="20">
          <el-col :span="8">
            <el-card class="info-head">
              <el-col :span="8" align="center">
                <div class="grid-content">
                  <el-avatar :size="100" :src="avatar" />
                </div>
              </el-col>
              <el-col :span="16" align="center">
                <div class="grid-content">
                  <div class="text-primary">{{ nickname }}</div>
                  <div class="text-secondary">快手用户</div>
                </div>
              </el-col>
            </el-card>
          </el-col>
          <el-col :span="16">
            <el-card class="info-card">
              <el-col :span="4" align="center">
                <div class="grid-content">
                  <div class="text-primary">{{ details.works }}</div>
                  <div class="text-secondary">作品</div>
                </div>
              </el-col>
              <el-col :span="4" align="center">
                <div class="grid-content">
                  <div class="text-primary">{{ fans }}</div>
                  <div class="text-secondary">粉丝</div>
                </div>
              </el-col>
              <el-col :span="4" align="center">
                <div class="grid-content">
                  <div class="text-primary">{{ likes }}</div>
                  <div class="text-secondary">共获赞</div>
                </div>
              </el-col>
              <el-col :span="4" align="center">
                <div class="grid-content">
                  <div class="text-primary">{{ comments }}</div>
                  <div class="text-secondary">共获评论</div>
                </div>
              </el-col>
              <el-col :span="4" align="center">
                <div class="grid-content">
                  <div class="text-primary">{{ plays }}</div>
                  <div class="text-secondary">共获播放</div>
                </div>
              </el-col>
              <el-col :span="4" align="center">
                <div class="grid-content">
                  <div class="text-primary">{{ total }}</div>
                  <div class="text-secondary">总活跃</div>
                </div>
              </el-col>
            </el-card>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="24">
            <el-card class="info-card">
              <el-col :span="6" align="center">
                <div class="text-primary">{{ like24 }}</div>
                <div class="text-secondary">24h内获点赞</div>
              </el-col>
              <el-col :span="6" align="center">
                <div class="text-primary">{{ play24 }}</div>
                <div class="text-secondary">24h内获播放</div>
              </el-col>
              <el-col :span="6" align="center">
                <div class="text-primary">{{ comment24 }}</div>
                <div class="text-secondary">24h内获评论</div>
              </el-col>
              <el-col :span="6" align="center">
                <div class="text-primary">{{ total24 }}</div>
                <div class="text-secondary">24h内活跃度</div>
              </el-col>
            </el-card>
          </el-col>
        </el-row>
      </div>
      <div class="pic_container">
        <div class="chart-container" align="center" style="height: 550px">
          <Chart
            id="datamain"
            :option="option"
            :chartloaded="chartloaded"
            width="100%"
            height="100%"
          />
        </div>
        <div class="chart-container" align="center" style="height: 650px">
          <Chart
            id="tagmain"
            :option="tag_option"
            :chartloaded="chartloaded"
            width="100%"
            height="100%"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getOneDayData, getVideoList } from '@/api/kuaishou'
import Chart from '@/components/Chart/index'
import { parseTime, setNumber, yAxisMax, yAxisMin } from '@/utils/index.js'
import { showImportantNotices } from '@/utils/show-important-notices.js'
// import { colors } from '@/utils/color.js'

export default {
  components: { Chart },
  data() {
    const yAxisMethod = {
      max: (value) => yAxisMax(value),
      min: (value) => (this.negative ? yAxisMin(value) : 0)
    }
    return {
      negative: false,
      showType: '1',
      timeValue: '',
      chartloaded: true,
      list: [],
      totalVedio: 0,
      option: {
        // color: colors,
        title: {
          show: true,
          text: '24小时内数据变化情况',
          x: 'center'
        },
        toolbox: {
          show: true,
          feature: {
            mark: { show: true },
            dataView: { show: true, readOnly: false },
            restore: { show: true },
            saveAsImage: { show: true }
          }
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross'
          }
        },
        legend: {
          data: ['点赞', '评论', '播放', '活跃度'],
          left: 'left'
        },
        grid: {
          right: '20%'
        },
        xAxis: {
          type: 'category',
          data: [],
          name: '',
          nameTextStyle: {
            fontWeight: 600,
            fontSize: 18
          }
        },
        yAxis: [
          {
            type: 'value',
            name: '点赞',
            position: 'right',
            axisLine: {
              show: true
            },
            nameTextStyle: {
              fontSize: 12
            },
            axisLabel: {
              show: true,
              formatter: '{value}'
            },
            ...yAxisMethod
          },
          {
            type: 'value',
            name: '评论',
            position: 'right',
            offset: 80,
            axisLine: {
              show: true
            },
            nameTextStyle: {
              fontSize: 12
            },
            ...yAxisMethod
          },
          {
            type: 'value',
            name: '播放',
            position: 'right',
            offset: 160,
            axisLine: {
              show: true
            },
            nameTextStyle: {
              fontSize: 12
            },
            axisLabel: {
              show: true
            },
            ...yAxisMethod
          },
          {
            type: 'value',
            name: '活跃度',
            position: 'left',
            axisLine: {
              show: true
            },
            nameTextStyle: {
              fontSize: 12
            },
            axisLabel: {
              show: true
            },
            ...yAxisMethod
          }
        ],
        series: [
          {
            name: '点赞',
            data: [],
            type: 'bar'
          },
          {
            name: '评论',
            data: [],
            type: 'bar',
            yAxisIndex: 1 // 设置与众不同的index可以获得一个独立的自适应比例尺
          },
          {
            name: '播放',
            data: [],
            type: 'bar',
            yAxisIndex: 2
          },
          {
            name: '活跃度',
            data: [],
            type: 'line',
            yAxisIndex: 3
          }
        ]
      },
      tag_option: {
        // color: colors,
        title: {
          show: true,
          text: '标签数量统计',
          x: 'center'
        },
        tooltip: {
          show: true,
          trigger: 'item',
          formatter: '{b} : {c}'
        },
        toolbox: {
          show: true,
          feature: {
            mark: { show: true },
            dataView: { show: true, readOnly: false },
            restore: { show: true },
            saveAsImage: { show: true }
          }
        },
        series: [
          {
            name: '面积模式',
            type: 'pie',
            radius: [50, 230],
            center: ['50%', '50%'],
            roseType: 'area',
            itemStyle: {
              borderRadius: 8
            },
            data: []
          }
        ]
      },
      like24: '',
      comment24: '',
      play24: '',
      total24: ''
    }
  },
  computed: {
    ...mapGetters([
      'hasAuth',
      'avatar',
      'username',
      'nickname',
      'details',
      'authurl',
      'notices'
    ]),
    total() {
      return setNumber(
        this.details.likes + this.details.plays + this.details.comments
      )
    },
    fans() {
      return setNumber(this.details.fans)
    },
    plays() {
      return setNumber(this.details.plays)
    },
    comments() {
      return setNumber(this.details.comments)
    },
    likes() {
      return setNumber(this.details.likes)
    }
  },
  watch: {
    notices: {
      handler(newNotices) {
        showImportantNotices(newNotices, this)
      }
    }
  },
  mounted() {
    if (this.hasAuth) {
      const endTime = new Date()
      const startTime = new Date()
      startTime.setTime(startTime.getTime() - 3600 * 1000 * 24 * 365)
      this.time_value = [
        parseTime(startTime, '{y}-{m}-{d}'),
        parseTime(endTime, '{y}-{m}-{d}')
      ]
      this.getRecentData()
    }
    this.openReauthDialog(this.$route.params.who)
  },
  methods: {
    getRecentData() {
      // DESPERATE NEED FOR REFACTORING!!!
      this.chartloaded = false
      getOneDayData().then((response) => {
        let i, j
        this.option['xAxis']['data'] = response.data.xAxis
        for (i = 0; i < 4; i++) {
          for (j = 0; j < 23; j++) {
            this.option['series'][i]['data'][j] =
              response.data.series[i][j + 1] - response.data.series[i][j]
          }
        }
        this.option['series'][0]['data'][23] =
          this.details.likes - response.data.series[0][23]
        this.option['series'][1]['data'][23] =
          this.details.comments - response.data.series[1][23]
        this.option['series'][2]['data'][23] =
          this.details.plays - response.data.series[2][23]
        this.option['series'][3]['data'][23] =
          this.total - response.data.series[3][23]
        this.negative = false
        for (i = 0; i < 4; i++) {
          for (j = 0; j < 24; j++) {
            if (this.option['series'][i]['data'][j] < 0) {
              this.negative = true
              break
            }
          }
        }
        this.chartloaded = true

        this.details.like24 =
          this.details.likes - this.option['series'][0]['data'][0]
        this.like24 = setNumber(this.details.like24)
        this.details.comment24 =
          this.details.comments - this.option['series'][1]['data'][0]
        this.comment24 = setNumber(this.details.comment24)
        this.details.play24 =
          this.details.plays - this.option['series'][2]['data'][0]
        this.play24 = setNumber(this.details.play24)
        this.details.total24 =
          this.details.like24 + this.details.play24 + this.details.comment24
        this.total24 = setNumber(this.details.total24)
      })
      getVideoList({
        userid: '',
        start_time: this.time_value[0],
        end_time: this.time_value[1]
      }).then((response) => {
        var tag_data = []
        var words = {}
        this.list = response.data.items
        this.totalVedio = response.data.total
        for (let i = 0; i < this.list.length; i++) {
          for (let j = 0; j < this.list[i].tags.length; j++) {
            // add plays to the tags
            var word = this.list[i].tags[j]
            if (!words[word]) {
              words[word] = 1 // let it be the number of tags
            } else {
              words[word] += 1 // add
            }
          }
        }
        for (const tmpword in words) {
          tag_data.push({ value: words[tmpword], name: tmpword })
        }
        this.tag_option.series[0].data = tag_data
          .sort((a, b) => {
            return -a.value + b.value
          })
          .slice(0, 15)
      })
    },
    openReauthDialog(who) {
      if (!who) return
      this.$alert(
        '该快手账号已经授权过一个本站用户：' + who + '。请重试。',
        '授权失败',
        {
          confirmButtonText: '确定'
        }
      )
      this.$router.push({ path: '/home' })
    }
  }
}
</script>

<style lang="scss" scoped>
.home {
  overflow: scroll;
  position: relative;
  background: #fff;
  .info {
    margin: 10px;
    &-container {
      margin: 10px;
      min-width: 1200px;
    }
    &-head {
      min-width: 200px;
      height: 130px;
    }
    &-card {
      min-width: 300px;
      height: 130px;
    }
  }
  .text {
    &-primary {
      font-size: 22px;
      line-height: 50px;
    }
    &-secondary {
      font-size: 18px;
      line-height: 50px;
    }
  }
  .el-row {
    margin-bottom: 5px;
    &:last-child {
      margin-bottom: 0;
    }
  }
  .authhelp {
    text-align: center;
    font-size: 18px;
    width: 100%;
    top: 50px;
  }
  .data {
    &-container {
      min-width: 1000px;
    }
  }
  .chart {
    &-container {
      margin: 5px;
    }
  }
}
</style>
