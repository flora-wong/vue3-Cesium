import { WindLayer, type WindLayerOptions, type WindData } from 'cesium-wind-layer'
import * as Cesium from 'cesium'

import {
  interpolateRainbow,
  interpolateViridis,
  interpolateCool,
  interpolateWarm,
  interpolateInferno,
  interpolateMagma,
  interpolatePlasma,
  interpolateBlues,
  interpolateGreens,
  interpolateOranges,
  interpolateReds,
  interpolatePurples,
  interpolateBuGn,
  interpolateBuPu,
  interpolateCividis,
  interpolateCubehelixDefault,
  interpolateGnBu,
  interpolateGreys,
  interpolateOrRd,
  interpolatePuBu,
  interpolatePuBuGn,
  interpolatePuRd,
  interpolateRdPu,
  interpolateSinebow,
  interpolateTurbo,
  interpolateYlGn,
  interpolateYlGnBu,
  interpolateYlOrBr,
  interpolateYlOrRd,
} from 'd3-scale-chromatic'
const generateSingleColorTable = (color: string): string[] => {
  return Array(20).fill(color)
}

const generateColorTable = (
  interpolator: (t: number) => string,
  reverse: boolean = false,
): string[] => {
  const segments = 20
  const colors = Array.from({ length: segments }).map((_, i) => {
    return interpolator(i / (segments - 1))
  })
  if (reverse) {
    return colors.reverse()
  }
  return colors
}

const colorSchemes = [
  { label: 'Single Color', value: 'single', interpolator: () => '#FFFFFF', isSingleColor: true },
  { label: 'Rainbow', value: 'rainbow', interpolator: interpolateRainbow },
  { label: 'Turbo', value: 'turbo', interpolator: interpolateTurbo },
  { label: 'Viridis', value: 'viridis', interpolator: interpolateViridis },
  { label: 'Cool', value: 'cool', interpolator: interpolateCool },
  { label: 'Warm', value: 'warm', interpolator: interpolateWarm },
  { label: 'Inferno', value: 'inferno', interpolator: interpolateInferno },
  { label: 'Magma', value: 'magma', interpolator: interpolateMagma },
  { label: 'Plasma', value: 'plasma', interpolator: interpolatePlasma },
  { label: 'Cividis', value: 'cividis', interpolator: interpolateCividis },
  { label: 'Cubehelix', value: 'cubehelix', interpolator: interpolateCubehelixDefault },
  { label: 'Sinebow', value: 'sinebow', interpolator: interpolateSinebow },
  { label: 'Blues', value: 'blues', interpolator: interpolateBlues },
  { label: 'Greens', value: 'greens', interpolator: interpolateGreens },
  { label: 'Greys', value: 'greys', interpolator: interpolateGreys },
  { label: 'Oranges', value: 'oranges', interpolator: interpolateOranges },
  { label: 'Purples', value: 'purples', interpolator: interpolatePurples },
  { label: 'Reds', value: 'reds', interpolator: interpolateReds },
  { label: 'BuGn', value: 'bugn', interpolator: interpolateBuGn },
  { label: 'BuPu', value: 'bupu', interpolator: interpolateBuPu },
  { label: 'GnBu', value: 'gnbu', interpolator: interpolateGnBu },
  { label: 'OrRd', value: 'orrd', interpolator: interpolateOrRd },
  { label: 'PuBuGn', value: 'pubugn', interpolator: interpolatePuBuGn },
  { label: 'PuBu', value: 'pubu', interpolator: interpolatePuBu },
  { label: 'PuRd', value: 'purd', interpolator: interpolatePuRd },
  { label: 'RdPu', value: 'rdpu', interpolator: interpolateRdPu },
  { label: 'YlGnBu', value: 'ylgnbu', interpolator: interpolateYlGnBu },
  { label: 'YlGn', value: 'ylgn', interpolator: interpolateYlGn },
  { label: 'YlOrBr', value: 'ylorbr', interpolator: interpolateYlOrBr },
  { label: 'YlOrRd', value: 'ylorrd', interpolator: interpolateYlOrRd },
].map((item) => ({
  ...item,
  colors: item.isSingleColor
    ? generateSingleColorTable(item.interpolator())
    : generateColorTable(item.interpolator),
}))

const defaultOptions: Partial<WindLayerOptions> = {
  ...WindLayer.defaultOptions,
  particlesTextureSize: 80, // 粒子数
  colors: colorSchemes.find((item) => item.value === 'cool')?.colors.reverse(), // 默认颜色方案，变色
  // colors: ['white'], // 默认颜色方案，纯色
  flipY: true, // 是否翻转Y轴
  useViewerBounds: true, // 是否使用视口边界
  dynamic: true,
  lineLength: {
    // 线长
    min: 50,
    max: 100,
  },
  lineWidth: {
    // 线宽
    min: 10,
    max: 20,
  },

  domain: {
    // 风速范围，用于计算颜色
    min: 0,
    max: 5,
  },
  speedFactor: 1, // 速度因子
  particleHeight: 400, // 粒子高度
  dropRate: 0.001, // 丢弃率
  dropRateBump: 0.02, // 丢弃率增量
}

const haerbinOption = {
  particlesTextureSize: 40, // 粒子数
  colors: colorSchemes.find((item) => item.value === 'cool')?.colors.reverse(), // 默认颜色方案，变色
  // colors: ['white'], // 默认颜色方案，纯色
  flipY: true, // 是否翻转Y轴
  useViewerBounds: true, // 是否使用视口边界
  dynamic: true,
  lineLength: {
    // 线长
    min: 2,
    max: 3,
  },
  lineWidth: {
    // 线宽
    min: 0.2,
    max: 0.5,
  },

  domain: {
    // 风速范围，用于计算颜色
    min: 0,
    max: 5,
  },
  speedFactor: 0.02, // 速度因子
  particleHeight: 400, // 粒子高度
  dropRate: 0.001, // 丢弃率
  dropRateBump: 0.02, // 丢弃率增量
}

interface TypedObject {
  [key: string]: any
}

const isComponentMounted = true
const windLayerRef: WindLayer | null = null
const Rectangle = Cesium.Rectangle

export default function initWindLayer(viewer: Cesium.Viewer, data: TypedObject) {
  try {
    // console.log(1.11, windDataFiles[0])
    // const res = await fetch('./wind.json')
    // console.log(1.12, res)
    // const data = windDataDefault
    if (!viewer) return

    const windData: WindData = {
      ...data,
      bounds: {
        west: data.bbox[0],
        south: data.bbox[1],
        east: data.bbox[2],
        north: data.bbox[3],
      },
    }

    // Apply initial options with wind configuration
    const initialOptions = {
      ...defaultOptions,
      ...haerbinOption,
    }

    if (windData.bounds) {
      const rectangle = Rectangle.fromDegrees(
        windData.bounds.west,
        windData.bounds.south,
        windData.bounds.east,
        windData.bounds.north,
      )
      viewer.camera.flyTo({
        destination: rectangle,
        duration: 0,
      })
    }

    const layer = new WindLayer(viewer, windData, initialOptions)

    // // Add event listeners
    // layer.addEventListener('dataChange', (data) => {
    //   console.log('Wind data updated:', data)
    //   // Handle data change
    // })

    // console.log(6)
    // layer.addEventListener('optionsChange', (options) => {
    //   console.log('Options updated:', options)
    //   // Handle options change
    // })

    // console.log(7)
    // windLayerRef = layer
    // windLayerRef.updateWindData(windData)
  } catch (error) {
    console.error('Failed to initialize wind layer:', error)
  }
}
