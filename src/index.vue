<template>
  <div id="charts"></div>
</template>

<script>
import * as echarts from "echarts"
export default {
  name: "barChartTable",
  data() {
    return {
      // echarts实例
      myChart: null,

      // 视图滑条最大长度
      dataZoomLength: 100,

      // 颜色盒对应每个数据的颜色
      colorBox: [
        "#5470c6",
        "#91cc75",
        "#fac858",
        "#ee6666",
        "#73c0de",
        "#3ba272",
        "#fc8452",
        "#9a60b4",
        "#ea7ccc",
      ],

      // X轴最大行数
      maxRowN: 1,
    }
  },
  props: {
    xData: {
      type: Array,
      default: () => [
        {
          name: "",
          list: [],
        },
      ],
    },
    xArr: {
      type: Array,
      default: () => [],
    },
    chartLoading: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    getXTable(data) {
      return data.map((item, idx) => {
        return {
          position: "bottom", // 将分组x轴位置定至底部，不然默认在顶部
          offset: 60 + idx * 30, // 向下偏移，使分组文字显示位置不与原x轴重叠
          max: this.xArr.length - 1,
          axisTick: {
            length: 0, // 延长刻度线做分组线
            inside: true, // 使刻度线相对轴线在上面与原x轴相接，默认在轴线下方
            // lineStyle: { color: "#888" }, // 非必须，仅为了演示，明显标示出分组刻度线
          },
          axisLabel: {
            inside: true, // 使刻度名称相对轴线在上面与原x轴相接，默认在轴线下方
            interval: 0, // 强制显示全部刻度名
            color: this.colorBox[idx],
          },
          data: item.list,
        }
      })
    },
    getSeries(data) {
      return data.map((item) => {
        return {
          name: item.name,
          type: "bar",
          data: item.list,
        }
      })
    },

    // 初始化图表
    initCharts() {
      const _this = this
      // 实例化并设置option
      this.myChart = echarts.init(document.getElementById("charts"))

      // 随窗口自适应宽度（给窗口添加大小变化的监听事件，当变化时触发echarts的变化） 做个节流
      let flag = false
      window.addEventListener("resize", (e) => {
        if (!flag) {
          flag = true
          setTimeout(() => {
            _this.myChart.resize()
            this.renderCharts()
            flag = false
          }, 500)
        }
      })
    },

    // 图表安装配置项
    renderCharts() {
      const _this = this

      // 限制最大滑条宽
      let DataZoomLength = 31 * 100 // 最多展示31天

      // 适配窄屏幕
      if (window.innerWidth <= 1700) {
        DataZoomLength = 15 * 100
      } else {
        DataZoomLength = 31 * 100
      }

      // 控制最多只显示30天的内容
      DataZoomLength / this.xArr.length >= 100
        ? (this.dataZoomLength = 100)
        : (this.dataZoomLength = DataZoomLength / this.xArr.length)

      // 如果数据超过10，则再缩小滑条最大限制
      if (Math.max(...this.xArr.map((item) => item.length)) > 10) {
        this.dataZoomLength /= 3
      }

      const gridLeft =
        60 + Math.max(...this.xData.map((item) => item.name.length)) * 6

      const option = {
        color: this.colorBox,
        tooltip: {
          trigger: "axis",
        },
        grid: {
          top: "15%",
          bottom: 40 + this.xData.length * 30, // 随条数变化改变图形大小
          left: gridLeft,
          right: "3%",
          x: 100,
          y2: 75 + 30 * this.xData.length,
        },
        legend: {
          data: this.xData.map((item) => item.name),
          orient: "vertical",
          width: "5%",
          left: 20,
          bottom: 10,
          itemGap: 17,
        },
        dataZoom: [
          {
            top: "5%",
            start: 0,
            end: this.dataZoomLength,
            maxSpan: this.dataZoomLength,
          },
        ],
        toolbox: {
          show: true,
          top: 0,
          right: 30,
          feature: {
            magicType: { show: true, type: ["stack"] },
            saveAsImage: {},
          },
        },
        xAxis: [
          {
            type: "category",
            max: this.xArr.length - 1,
            axisLabel: {
              fontWeight: "bold",
              show: true,
              // X轴换行
              formatter: function (value) {
                var ret = "" //拼接加\n返回的类目项
                var maxLength = 30 //每项显示文字个数
                var valLength = value.length //X轴类目项的文字个数
                var rowN = Math.ceil(valLength / maxLength) //类目项需要换行的行数
                _this.maxRowN = Math.max(rowN, _this.maxRowN)
                if (rowN > 1) {
                  //如果类目项的文字大于5,
                  for (var i = 0; i < rowN; i++) {
                    var temp = "" //每次截取的字符串
                    var start = i * maxLength //开始截取的位置
                    var end = start + maxLength //结束截取的位置
                    //这里也可以加一个是否是最后一行的判断，但是不加也没有影响，那就不加吧
                    temp = value.substring(start, end) + "\n"
                    ret += temp //凭借最终的字符串
                  }
                  return ret
                } else {
                  return value
                }
              },
            },
            axisPointer: {
              type: "shadow",
            },
            data: this.xArr,
          },
          {
            position: "bottom", // 将分组x轴位置定至底部，不然默认在顶部
            offset: 0, // 向下偏移，使分组文字显示位置不与原x轴重叠
            axisTick: {
              length: -(this.xData.length + 1) * 30, // 延长刻度线做分组线
              inside: true, // 使刻度线相对轴线在上面与原x轴相接，默认在轴线下方
              // lineStyle: { color: "#000" }, // 非必须，仅为了演示，明显标示出分组刻度线
            },
            max: this.xArr.length - 1,
            axisLabel: {
              inside: true, // 使刻度名称相对轴线在上面与原x轴相接，默认在轴线下方
              interval: 0, // 强制显示全部刻度名
            },
            data: [""],
          },
          {
            position: "bottom", // 将分组x轴位置定至底部，不然默认在顶部
            offset: 30, // 向下偏移，使分组文字显示位置不与原x轴重叠
            axisTick: {
              length: 0, // 延长刻度线做分组线
              inside: true, // 使刻度线相对轴线在上面与原x轴相接，默认在轴线下方
              // lineStyle: { color: "#000" }, // 非必须，仅为了演示，明显标示出分组刻度线
            },
            axisLabel: {
              inside: true, // 使刻度名称相对轴线在上面与原x轴相接，默认在轴线下方
              interval: 0, // 强制显示全部刻度名
            },
          },
          ...this.getXTable(this.xData),
        ],
        yAxis: [
          {
            type: "value",
            axisLabel: {
              fontSize: "14px",
            },
          },
        ],
        series: this.getSeries(this.xData),
      }

      option && this.myChart.setOption(option)
    },

    // 销毁实例防止内存泄漏
    defend() {
      if (!this.myChart) {
        return
      }
      this.myChart.dispose()
      this.myChart = null
    },
  },
  watch: {
    xArr: function (n, o) {
      if (n.length != 0) {
        this.renderCharts()
      }
    },
    chartLoading: function (newval) {
      this.myChart
        ? newval
          ? this.myChart.showLoading()
          : this.myChart.hideLoading()
        : false
    },
  },

  mounted() {
    this.initCharts()
    if (this.xArr.length != 0) {
      this.renderCharts()
    }
  },

  beforeDestroy() {
    this.defend()
  },
}
</script>

<style>
#charts {
  width: 100%;
  height: 600px;
}
</style>
