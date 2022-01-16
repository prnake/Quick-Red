<template>
  <div>
    <div>
      <div v-if="whichVideo.id === -1" class="user-container">
        <el-row :gutter="20">
          <el-col :span="9">
            <el-card class="user-card">
              <el-col :span="9" align="center">
                <div class="block">
                  <el-avatar :size="100" :src="kuaishou_avatar" />
                </div>
              </el-col>
              <el-col :span="15">
                <div class="text-primary">{{ kuaishou_nickname }}</div>
                <div class="text-secondary">快手用户</div>
              </el-col>
            </el-card>
          </el-col>
          <el-col :span="15">
            <el-card class="user-card">
              <el-col :span="8" align="center">
                <div class="text-primary">{{ data_3d.play }}</div>
                <div v-if="data_3d.play_rate > 0" class="text-small color-red">
                  {{ data_3d.play_rate }}⬆
                </div>
                <div
                  v-else-if="data_3d.play_rate < 0"
                  class="text-small color-green"
                >
                  {{ data_3d.play_rate }}⬇
                </div>
                <div v-else class="text-small">与更早时持平</div>
                <div class="text-secondary">近三日内获播放</div>
              </el-col>
              <el-col :span="8" align="center">
                <div class="text-primary">{{ data_3d.like }}</div>
                <div v-if="data_3d.like_rate > 0" class="text-small color-red">
                  {{ data_3d.like_rate }}⬆
                </div>
                <div
                  v-else-if="data_3d.like_rate < 0"
                  class="text-small color-green"
                >
                  {{ data_3d.like_rate }}⬇
                </div>
                <div v-else class="text-small">与更早时持平</div>
                <div class="text-secondary">近三日内获点赞</div>
              </el-col>
              <el-col :span="8" align="center">
                <div class="text-primary">{{ data_3d.comment }}</div>
                <div
                  v-if="data_3d.comment_rate > 0"
                  class="text-small color-red"
                >
                  {{ data_3d.comment_rate }}⬆
                </div>
                <div
                  v-else-if="data_3d.comment_rate < 0"
                  class="text-small color-green"
                >
                  {{ data_3d.comment_rate }}⬇
                </div>
                <div v-else class="text-small">与更早时持平</div>
                <div class="text-secondary">近三日内获评论</div>
              </el-col>
            </el-card>
          </el-col>
        </el-row>
      </div>

      <div v-else class="info-container">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-card class="info-card">
              <el-col :span="8" align="center">
                <div class="cover" style="width: 150px; height: 200px">
                  <img style="width: 150px; height: 200px" :src="video.cover">
                  <div class="shade" />
                  <div class="el-icon-video-play" @click="playVideo" />
                </div>
              </el-col>
              <el-col :span="16">
                <el-tooltip
                  class="item"
                  effect="dark"
                  :content="video.title"
                  placement="top"
                >
                  <div class="text-primary">{{ parseTitle(video.title) }}</div>
                </el-tooltip>
                <div class="text-secondary">标题</div>
              </el-col>
            </el-card>
          </el-col>
          <el-col :span="12">
            <el-card class="info-card">
              <el-col :span="8" align="center">
                <div class="text-primary">{{ video.likes }}</div>
                <div class="text-secondary">点赞</div>
              </el-col>
              <el-col :span="8" align="center">
                <div class="text-primary">{{ video.comments }}</div>
                <div class="text-secondary">评论</div>
              </el-col>
              <el-col :span="8" align="center">
                <div class="text-primary">{{ video.plays }}</div>
                <div class="text-secondary">播放</div>
              </el-col>
            </el-card>
          </el-col>
        </el-row>
      </div>

      <div class="chart-container" style="width: 100%; height: 600px">
        <div class="slide-container">
          时间范围
          <el-slider
            v-model="slide_value"
            :marks="slide_marks"
            :max="29"
            :min="1"
            range
            :input-size="'small'"
            @change="setRange"
          />
        </div>
        <Chart id="main" :option="option" :chartloaded="chartloaded" />
      </div>
    </div>

    <el-dialog
      title
      :visible.sync="dialogPlay"
      width="30%"
      @close="closeDialog"
    >
      <video
        :ref="'dialogVideo'"
        :src="vedio_url"
        controls
        autoplay
        class="video"
        width="100%"
      />
    </el-dialog>
  </div>
</template>

<script>
import { getInfo, getVideoData } from '@/api/kuaishou'
import Chart from '@/components/Chart/index'
import { setNumber, yAxisMax, yAxisMin } from '@/utils/index'
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
      kuaishou_nickname: '',
      kuaishou_avatar: '',
      chartloaded: true,
      whichVideo: {
        id: this.$route.params.id || -1
      },
      video: {
        title: '',
        likes: 0,
        comments: 0,
        plays: 0,
        cover: '',
        play_url: ''
      },
      slide_value: [1, 3],
      slide_marks: {
        1: {
          style: {
            color: '#DF500E'
          },
          label: this.$createElement('strong', '24h')
        },
        3: '3d',
        7: '7d',
        29: '1m'
      },
      option: {
        // color: colors,
        title: {
          show: true,
          text: '',
          x: 'center'
        },
        legend: {
          data: ['点赞', '评论', '播放'],
          left: 'left'
        },
        grid: {
          right: '20%'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross'
          }
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
        series: [
          {
            name: '点赞',
            data: [],
            type: 'bar',
            smooth: true
          },
          {
            name: '评论',
            data: [],
            type: 'bar',
            yAxisIndex: 1
          },
          {
            name: '播放',
            data: [],
            type: 'bar',
            yAxisIndex: 2
          }
        ],
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
          }
        ]
      },
      time_array: [],
      like_data: [],
      comment_data: [],
      play_data: [],
      time_array_24h: [],
      like_data_24h: [],
      comment_data_24h: [],
      play_data_24h: [],
      data_3d: {
        play: 0,
        play_rate: 0,
        like: 0,
        like_rate: 0,
        comment: 0,
        comment_rate: 0
      },
      dialogPlay: false,
      vedio_url: ''
    }
  },
  mounted() {
    this.getNameAvatar()
    this.getData()
  },
  methods: {
    getNameAvatar() {
      getInfo().then((response) => {
        this.kuaishou_nickname = response.data.info.name
        this.kuaishou_avatar = response.data.info.avatar
      })
    },
    getData() {
      this.chartloaded = false
      getVideoData(this.whichVideo).then((response) => {
        this.video.title = response.data.title
        this.video.cover = response.data.cover
        this.video.play_url = response.data.play_url
        this.video.likes = setNumber(response.data.likes)
        this.video.comments = setNumber(response.data.comments)
        this.video.plays = setNumber(response.data.plays)
        this.time_array = response.data.time_array.slice(0, 29)
        for (var i = 0; i < 29; i++) {
          this.like_data[i] =
            response.data.like_data[i + 1] - response.data.like_data[i]
          this.comment_data[i] =
            response.data.comment_data[i + 1] - response.data.comment_data[i]
          this.play_data[i] =
            response.data.play_data[i + 1] - response.data.play_data[i]
        }
        this.time_array_24h = response.data.time_array_24h
        for (i = 0; i < 23; i++) {
          this.like_data_24h[i] =
            response.data.like_data_24h[i + 1] - response.data.like_data_24h[i]
          this.comment_data_24h[i] =
            response.data.comment_data_24h[i + 1] -
            response.data.comment_data_24h[i]
          this.play_data_24h[i] =
            response.data.play_data_24h[i + 1] - response.data.play_data_24h[i]
        }
        this.like_data_24h[23] =
          response.data.likes - response.data.like_data_24h[23]
        this.comment_data_24h[23] =
          response.data.comments - response.data.comment_data_24h[23]
        this.play_data_24h[23] =
          response.data.plays - response.data.play_data_24h[23]
        this.negative = false
        for (i = 0; i < 24; i++) {
          if (
            this.like_data_24h[i] < 0 ||
            this.comment_data_24h[i] < 0 ||
            this.play_data_24h[i] < 0
          ) {
            this.negative = true
            break
          }
        }
        var len = this.time_array.length
        this.data_3d.like = setNumber(
          this.getSum(response.data.like_data.slice(len - 4, len))
        )
        this.data_3d.like_rate =
          this.data_3d.like -
          this.getSum(response.data.like_data.slice(len - 7, len - 3))
        this.data_3d.play = setNumber(
          this.getSum(response.data.play_data.slice(len - 4, len))
        )
        this.data_3d.play_rate =
          this.data_3d.play -
          this.getSum(response.data.play_data.slice(len - 7, len - 3))
        this.data_3d.comment = setNumber(
          this.getSum(response.data.comment_data.slice(len - 4, len))
        )
        this.data_3d.comment_rate =
          this.data_3d.comment -
          this.getSum(response.data.comment_data.slice(len - 7, len - 3))
        this.setRange([1, 3])
        this.chartloaded = true
      })
    },
    setRange(days) {
      if (days[0] === 1 && days[1] === 1) {
        this.option['xAxis']['data'] = this.time_array_24h
        this.option['series'][0]['data'] = this.like_data_24h
        this.option['series'][1]['data'] = this.comment_data_24h
        this.option['series'][2]['data'] = this.play_data_24h
        this.option.title.text = '过去24小时的作品数据'
      } else {
        if (days[0] === days[1]) {
          this.option.title.text = '过去第' + days[0] + '天的数据'
        } else {
          this.option.title.text =
            '过去' + days[0] + '天到' + days[1] + '天的作品数据'
        }
        var len = this.time_array.length
        this.option['xAxis']['data'] = this.time_array.slice(
          len - days[1],
          len - days[0] + 1
        )
        this.option['series'][0]['data'] = this.like_data.slice(
          len - days[1],
          len - days[0] + 1
        )
        this.option['series'][1]['data'] = this.comment_data.slice(
          len - days[1],
          len - days[0] + 1
        )
        this.option['series'][2]['data'] = this.play_data.slice(
          len - days[1],
          len - days[0] + 1
        )
        this.negative = false
        for (let i = 0; i < 3; i++) {
          for (let j = 0; j < this.option['series'][0]['data'].length; j++) {
            if (this.option['series'][i]['data'][j] < 0) {
              this.negative = true
              break
            }
          }
        }
      }
    },
    getSum(arr) {
      // This actually works like it has nothing to do with "getSum".
      var len = arr.length
      if (len < 1) {
        return 'no data'
      } else {
        return arr[len - 1] - arr[0]
      }
    },
    playVideo() {
      this.dialogPlay = true
      this.vedio_url = this.video.play_url
    },
    closeDialog() {
      this.dialogPlay = false
      this.vedio_url = ''
    },
    parseTitle(title) {
      if (title.length > 30) {
        return title.slice(0, 30) + '...'
      } else {
        return title
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.info {
  &-container {
    margin: 50px;
    min-width: 1000px;
  }
  &-card {
    height: 240px;
  }
}
.user {
  &-container {
    margin: 50px;
    min-width: 1000px;
  }
  &-card {
    height: 150px;
  }
}
.chart {
  &-container {
    min-width: 1000px;
  }
}
.el-row {
  margin-bottom: 5px;
  &:last-child {
    margin-bottom: 0;
  }
}
.slide {
  &-container {
    margin: 50px;
  }
}
.text {
  &-primary {
    font-size: 32px;
    line-height: 50px;
  }
  &-secondary {
    font-size: 20px;
    line-height: 50px;
  }
  &-small {
    font-size: 15px;
  }
}
.color {
  &-green {
    color: #67c32a;
  }
  &-red {
    color: #f56c95;
  }
}

.cover {
  position: relative;
}
.cover .shade {
  display: none;
}
.cover .el-icon-video-play {
  display: none;
}
.cover:hover .shade {
  display: block;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  width: 150px;
  height: 200px;
  opacity: 0.5;
  background-color: black;
}
.cover:hover .el-icon-video-play {
  display: block;
  position: absolute;
  color: white;
  font-size: 100px;
  top: 50px;
  left: 25px;
  cursor: pointer;
}
</style>
