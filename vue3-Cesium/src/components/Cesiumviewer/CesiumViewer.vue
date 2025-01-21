<template>
  <div class="container" id="cesiumContainer"></div>
</template>

<script setup lang="ts">
import CesiumIns from '@/components/Cesiumviewer/CesiumIns.ts'
import initSnow from '@/components/Cesiumviewer/snow.ts'
import initRain from '@/components/Cesiumviewer/rain.ts'
import initWindLayer from '@/components/Cesiumviewer/wind.ts'
import initRadar from '@/components/Cesiumviewer/radar.ts'
import createBoundingSphere from '@/components/Cesiumviewer/boundingSphere.js'
import { onMounted } from 'vue'
import * as Cesium from 'cesium'
// import { windDataDefault } from './wind.js'
// import { windDataDefault } from './haerbin.js'
import { windDataDefault } from './dongsansheng.js'
// import drone from '@/assets/drone.gltf'
import building from '@/assets/1.gltf'

let viewer: any
const droneUrl = '/CesiumDrone.glb'
onMounted(() => {
  //三维场景初始化

  CesiumIns.init('cesiumContainer', (val) => {
    //这里可以写初始化完成后想要执行的操作
    console.log(val)
    viewer = val
    viewer.camera.setView({
      destination: Cesium.Cartesian3.fromDegrees(126.7, 45.75, 1000),
      orientation: {
        heading: 4.731089976107251,
        pitch: -0.32003481981370063,
      },
    })
    model()
  })
  // 将三维球定位到中国
  // viewer.camera.flyTo({
  //   destination: Cesium.Cartesian3.fromDegrees(126.7, 45.75, 1000),
  //   orientation: {
  //     heading: Cesium.Math.toRadians(0),
  //     pitch: Cesium.Math.toRadians(-90),
  //     roll: Cesium.Math.toRadians(0),
  //   },
  // })

  // 风场
  // initWindLayer(viewer, windDataDefault)
  // 雪
  // initSnow(viewer)
  // 雨
  // initRain(viewer)
  // 雷达
  // console.log(1, viewer)
  // initRadar(viewer, 200)
  // 球形区域
  // createBoundingSphere(viewer, 126.7, 45.75)
})

const model = async () => {
  const hpr = new Cesium.HeadingPitchRoll(0, 0, 0) // 设置方向角
  const origin = Cesium.Cartesian3.fromDegrees(126.7, 45.75, 300.0) // 设置位置
  const modelMatrix1 = Cesium.Transforms.headingPitchRollToFixedFrame(
    origin,
    hpr as Cesium.HeadingPitchRoll,
  )
  const model = await Cesium.Model.fromGltfAsync({
    show: true,
    url: droneUrl, //gltf文件的URL
    modelMatrix: modelMatrix1,
    scale: 100, //放大倍数
    color: Cesium.Color.RED,
    colorBlendMode: Cesium.ColorBlendMode.REPLACE, // 使用替换模式
    colorBlendAmount: 1.0, // 完全替换原始颜色
  })
  // 创建自定义材质
  const material = new Cesium.Material({
    fabric: {
      type: 'Color',
      uniforms: {
        color: Cesium.Color.RED,
      },
    },
  })

  // 将自定义材质应用到模型上
  // model.material = material
  const primitive = viewer.scene.primitives.add(model)
  // console.log(viewer.scene.primitives)
  model.readyEvent.addEventListener(() => {
    // 模型加载完成
    console.log('Model is ready for rendering')
    // viewer.zoomTo(model)
  })

  // const position = Cesium.Cartesian3.fromDegrees(126.7, 45.75, 200)
  // const heading = Cesium.Math.toRadians(135)
  // const pitch = 0
  // const roll = 0
  // const hpr = new Cesium.HeadingPitchRoll(heading, pitch, roll)
  // const orientation = Cesium.Transforms.headingPitchRollQuaternion(position, hpr)
  // const modelMatrix = new Cesium.Transforms.eastNorthUpToFixedFrame(
  //   new Cesium.Cartesian3.fromDegrees(126.7, 45.75, 300.0),
  // ) //gltf数据加载位置

  // const entity = viewer.entities.add({
  //   name: '../../assets/drone.glb',
  //   position: position,
  //   orientation: orientation,
  //   model: {
  //     uri: droneUrl,
  //     scale: 10,
  //     minimumPixelSize: 128,
  //     maximumScale: 200,
  //   },
  // })
  // viewer.trackedEntity = entity
}
</script>

<style scoped>
html,
body,
.container {
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
  overflow: hidden;
  position: absolute;
}
</style>
