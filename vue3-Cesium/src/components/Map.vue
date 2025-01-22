<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import AMapLoader from '@amap/amap-jsapi-loader'

let map: unknown = null

onMounted(() => {
  window._AMapSecurityConfig = {
    securityJsCode: '',
  }
  AMapLoader.load({
    key: '', // 申请好的Web端开发者Key，首次调用 load 时必填
    version: '2.1Beta', // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
    plugins: ['AMap.Scale'], //需要使用的的插件列表，如比例尺'AMap.Scale'，支持添加多个如：['...','...']
  })
    .then((AMap) => {
      // 3d暗蓝
      // map = new AMap.Map('container', {
      //   // 设置地图容器id
      //   viewMode: '3D', // 是否为3D地图模式
      //   zoom: 11, // 初始化地图级别
      //   center: [116.397428, 39.90923], // 初始化地图中心点位置
      //   mapStyle: 'amap://styles/darkblue',
      //   viewMode: '3D', //开启3D视图,默认为关闭
      // })

      // 楼快图层
      // map = new AMap.Map('container', {
      //   center: [116.397428, 39.90923],
      //   viewMode: '3D',
      //   pitch: 60,
      //   rotation: -35,
      //   // 隐藏默认楼块
      //   features: ['bg', 'road', 'point'],
      //   mapStyle: 'amap://styles/light',
      //   layers: [
      //     // 高德默认标准图层
      //     new AMap.TileLayer.Satellite(),
      //     // 楼块图层
      //     new AMap.Buildings({
      //       zooms: [10, 40],
      //       zIndex: 10,
      //       heightFactor: 2, //2倍于默认高度，3D下有效
      //     }),
      //   ],
      //   zoom: 16.8,
      // })

      // 3d地形
      map = new AMap.Map('container', {
        rotateEnable: false, //是否开启地图旋转交互 鼠标右键 + 鼠标画圈移动 或 键盘Ctrl + 鼠标画圈移动
        pitchEnable: true, // 是否开启地图倾斜交互 鼠标右键 + 鼠标上下移动或键盘Ctrl + 鼠标上下移动
        zoom: 13.8, //初始化地图层级
        pitch: 0, // 地图俯仰角度，有效范围 0 度- 83 度
        rotation: 0, //初始地图顺时针旋转的角度
        viewMode: '3D', //开启3D视图,默认为关闭
        zooms: [2, 20], //地图显示的缩放级别范围
        center: [126.7, 45.75], //初始地图中心经纬度
        terrain: true, // 开启地形图
        layers: [
          // 卫星
          new AMap.TileLayer.Satellite(),
          // 路网
          // new AMap.TileLayer.RoadNet()
        ],
      })
      // AMap.plugin(['AMap.ControlBar', 'AMap.ToolBar'], function () {
      //   //异步加载插件
      //   const controlBar = new AMap.ControlBar({
      //     //控制地图旋转插件
      //     position: {
      //       right: '10px',
      //       top: '10px',
      //     },
      //   })
      //   map.addControl(controlBar)
      //   const toolBar = new AMap.ToolBar({
      //     //地图缩放插件
      //     position: {
      //       right: '40px',
      //       top: '110px',
      //     },
      //   })
      //   map.addControl(toolBar)
      // })
    })
    .catch((e) => {
      console.log(e)
    })
})

onUnmounted(() => {
  map?.destroy()
})
</script>

<template>
  <div class="map-container" id="container"></div>
</template>

<style scoped>
.map-container {
  width: 1080px;
  height: 200px;
}
</style>
