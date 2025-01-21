import * as Cesium from 'cesium'

// Make Cesium globally available
declare global {
  interface Window {
    Cesium: typeof Cesium
  }
}
window.Cesium = Cesium

interface ViewerConfig {
  imageryProvider?: any
  infoBox?: boolean
  [key: string]: any
}

export default class CesiumIns {
  static Cesium: typeof Cesium
  static viewer: any
  static token = 'cbaab337a925c65bf48b2fbc28dbe27d'
  // 服务域名
  static tdtUrl = 'https://t{s}.tianditu.gov.cn/'
  // 服务负载子域
  static subdomains = ['0', '1', '2', '3', '4', '5', '6', '7']

  constructor() {}

  static async init(id: string, callback?: () => void, config: ViewerConfig = {}) {
    try {
      if (window.Cesium) {
        // 天地图影像底图
        // const imageryProvider = new Cesium.WebMapTileServiceImageryProvider({
        //   url: 'http://t0.tianditu.gov.cn/img_w/wmts?tk=cbaab337a925c65bf48b2fbc28dbe27d',
        //   layer: 'img',
        //   style: 'default',
        //   format: 'tiles',
        //   tileMatrixSetID: 'w',
        //   maximumLevel: 18,
        // })

        CesiumIns.Cesium = window.Cesium

        // Set default access token
        CesiumIns.Cesium.Ion.defaultAccessToken =
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI2MDQyYmE4NC1mMDBkLTRjZjItYTNkOC0yNThlODY3MjQ4NzYiLCJpZCI6NTYwMzEsImlhdCI6MTYyMTIxODExOH0.gSO5_Wx1WyujkeHypFKrIQ0BElvoOImrrXABWjOk1X4'

        // Create viewer with merged config
        const defaultConfig = {
          shouldAnimate: true, // 开启动画
          selectionIndicator: false, // 显示选择指示器
          baseLayerPicker: false, // 显示图层选择器
          fullscreenButton: false, // 显示全屏按钮
          geocoder: false, // 显示地址搜索
          homeButton: false, // 显示主页按钮
          infoBox: false, // 显示信息框
          sceneModePicker: false, // 显示场景模式选择器
          timeline: false, // 显示时间轴
          navigationHelpButton: false, // 显示导航帮助按钮
          navigationInstructionsInitiallyVisible: false, // 导航帮助按钮是否默认显示
          showRenderLoopErrors: false, // 显示渲染循环错误
          shadows: false, // 显示阴影
          terrain: Cesium.Terrain.fromWorldTerrain(), // 地形数据
          // 关闭无级缩放地图
          smoothResolutionConstraint: false, //平滑分辨率约束
          zoomFactor: 50, // 缩放因子
          zoom: 12, // 缩放级别
        }

        // Create container element and set dimensions
        // const container = document.getElementById(id)

        CesiumIns.viewer = new CesiumIns.Cesium.Viewer(id, {
          ...defaultConfig,
          ...config,
        })

        // Initialize default viewer settings
        CesiumIns.viewer.scene.globe.depthTestAgainstTerrain = true
        CesiumIns.viewer.scene.globe.showGroundAtmosphere = false
        CesiumIns.viewer.scene.globe.enableLighting = false
        CesiumIns.viewer.scene.debugShowFramesPerSecond = false
        CesiumIns.viewer.scene.fxaa = false
        CesiumIns.viewer.scene.postProcessStages.fxaa.enabled = false
        // 水雾特效,true会让海洋颜色变浅蓝
        CesiumIns.viewer.scene.globe.showGroundAtmosphere = false
        // 设置最大俯仰角，[-90,0]区间内，默认为-30，单位弧度
        CesiumIns.viewer.scene.screenSpaceCameraController.constrainedPitch =
          Cesium.Math.toRadians(-20)
        CesiumIns.viewer.scene.screenSpaceCameraController.autoResetHeadingPitch = false
        CesiumIns.viewer.scene.screenSpaceCameraController.inertiaZoom = 0.5
        CesiumIns.viewer.scene.screenSpaceCameraController.minimumZoomDistance = 50
        CesiumIns.viewer.scene.screenSpaceCameraController.maximumZoomDistance = 20000000
        CesiumIns.viewer.scene.fog.enabled = false
        CesiumIns.viewer.scene.sun.show = false
        CesiumIns.viewer.scene.skyBox.show = false
        CesiumIns.viewer.scene.skyAtmosphere.show = false

        CesiumIns.viewer.scene.screenSpaceCameraController.zoomEventTypes = [
          Cesium.CameraEventType.RIGHT_DRAG,
          Cesium.CameraEventType.WHEEL,
          Cesium.CameraEventType.PINCH,
        ]

        CesiumIns.viewer.scene.screenSpaceCameraController.tiltEventTypes = [
          Cesium.CameraEventType.MIDDLE_DRAG,
          Cesium.CameraEventType.PINCH,
          {
            eventType: Cesium.CameraEventType.LEFT_DRAG,
            modifier: Cesium.KeyboardEventModifier.CTRL,
          },
          {
            eventType: Cesium.CameraEventType.RIGHT_DRAG,
            modifier: Cesium.KeyboardEventModifier.CTRL,
          },
        ]

        CesiumIns.viewer.cesiumWidget.screenSpaceEventHandler.removeInputAction(
          Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK,
        )

        // 控制不展示动画组件和时间线组件
        CesiumIns.viewer._cesiumWidget._creditContainer.style.display = 'none' // 隐藏cesium ion
        if (CesiumIns.viewer.timeline) {
          CesiumIns.viewer.timeline.container.style.display = 'none' // 隐藏时间线
        }
        if (CesiumIns.viewer.animation) {
          CesiumIns.viewer.animation.container.style.visibility = 'hidden' // 隐藏动画控件
        }

        //---------- ArcGIS Online World Imagery 卫星影像-------------
        // const imageryLayer = new Cesium.WebMapTileServiceImageryProvider({
        //   url: 'https://services.arcgisonline.com/arcgis/rest/services/World_Imagery/MapServer/WMTS',
        //   layer: 'World_Imagery',
        //   style: 'default',
        //   format: 'image/jpeg',
        //   tileMatrixSetID: 'GoogleMapsCompatible',
        //   maximumLevel: 19,
        //   credit: new Cesium.Credit('© Esri', 'https://www.esri.com/'),
        // })
        // CesiumIns.viewer.imageryLayers.addImageryProvider(imageryLayer)

        // // 添加路网图层
        // const roadsLayer = await Cesium.ArcGisMapServerImageryProvider.fromUrl(
        //   'https://services.arcgisonline.com/ArcGIS/rest/services/Reference/World_Transportation/MapServer',
        // )
        // CesiumIns.viewer.imageryLayers.addImageryProvider(roadsLayer)

        // // // 添加国界线和地名标注图层
        // const boundariesAndLabelsLayer = await Cesium.ArcGisMapServerImageryProvider.fromUrl(
        //   'https://services.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer',
        // )
        // CesiumIns.viewer.imageryLayers.addImageryProvider(boundariesAndLabelsLayer)

        //--------------------- bing map
        // const tdtLayer = new Cesium.BingMapsImageryProvider({
        //   url: 'https://ecn.t{s}.tiles.virtualearth.net/tiles/h{q}.jpeg?n=z&g=11404&mkt=',
        //   subdomains: ['0', '1', '2', '3'],
        //   tilingScheme: new Cesium.WebMercatorTilingScheme(),
        //   customTags: {
        //     // q: function (imageryProvider, x, y, level) {
        //     //   const result = CesiumIns.tileXYToQuadKey(x, y, level)
        //     //   console.log(imageryProvider, x, y, level, result)
        //     //   return result
        //     // },
        //   },
        // })
        // CesiumIns.viewer.imageryLayers.addImageryProvider(tdtLayer)

        //--------------- OpenStreetMap地形图

        // const bingMap = new Cesium.UrlTemplateImageryProvider({
        //   url: 'https://tile.openstreetmap.bzh/br/{z}/{x}/{y}.png',
        //   subdomains: ['a', 'b', 'c', 'd'],
        // })
        // CesiumIns.viewer.imageryLayers.addImageryProvider(bingMap)

        // --------------------百度地图 由于百度地图的地理编码和cesium、天地图差异过大，不建议使用

        // ---------------------天地图
        // 叠加影像服务
        // const imgMap = new Cesium.UrlTemplateImageryProvider({
        //   url: CesiumIns.tdtUrl + 'DataServer?T=img_w&x={x}&y={y}&l={z}&tk=' + CesiumIns.token,
        //   subdomains: CesiumIns.subdomains,
        //   tilingScheme: new Cesium.WebMercatorTilingScheme(),
        //   maximumLevel: 18,
        // })
        // CesiumIns.viewer.imageryLayers.addImageryProvider(imgMap)

        // // 叠加国界服务
        // const iboMap = new Cesium.UrlTemplateImageryProvider({
        //   url: CesiumIns.tdtUrl + 'DataServer?T=ibo_w&x={x}&y={y}&l={z}&tk=' + CesiumIns.token,
        //   subdomains: CesiumIns.subdomains,
        //   tilingScheme: new Cesium.WebMercatorTilingScheme(),
        //   maximumLevel: 10,
        // })
        // CesiumIns.viewer.imageryLayers.addImageryProvider(iboMap)

        // // 叠加矢量注记服务

        // const vector_marker = new Cesium.WebMapTileServiceImageryProvider({
        //   url:
        //     CesiumIns.tdtUrl +
        //     'cva_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=cva&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default.jpg&tk=' +
        //     CesiumIns.token,
        //   layer: 'tdtAnnoLayer',
        //   style: 'default',
        //   subdomains: CesiumIns.subdomains,
        //   format: 'image/jpeg',
        //   tileMatrixSetID: 'GoogleMapsCompatible',
        // })
        // CesiumIns.viewer.imageryLayers.addImageryProvider(vector_marker)

        // 添加地形数据
        // const addWorldTerrainAsync = async (viewer: Cesium.Viewer) => {
        //   try {
        //     const terrainProvider = await Cesium.CesiumTerrainProvider.fromUrl(
        //       CesiumIns.tdtUrl.replace('{s}', 1 + 'mapservice/swdx?T=elv_c&tk=' + CesiumIns.token),
        //       {
        //         requestWaterMask: true,
        //         requestVertexNormals: true,
        //       },
        //     )

        //     viewer.terrainProvider = terrainProvider
        //   } catch (error) {
        //     console.log(`Failed to add world imagery: ${error}`)
        //   }
        // }
        // addWorldTerrainAsync(CesiumIns.viewer)

        // 将三维球定位到中国
        CesiumIns.viewer.camera.flyTo({
          destination: Cesium.Cartesian3.fromDegrees(126.7, 45.75, 1000),
          orientation: {
            heading: Cesium.Math.toRadians(0),
            pitch: Cesium.Math.toRadians(-90),
            roll: Cesium.Math.toRadians(0),
          },
        })

        // 叠加三维地名服务
        // const wtfs = new Cesium.GeoWTFS({
        //   viewer: CesiumIns.viewer,
        //   //三维地名服务，使用wtfs服务
        //   subdomains: CesiumIns.subdomains,
        //   metadata: {
        //     boundBox: {
        //       minX: -180,
        //       minY: -90,
        //       maxX: 180,
        //       maxY: 90,
        //     },
        //     minLevel: 1,
        //     maxLevel: 20,
        //   },
        //   depthTestOptimization: true,
        //   dTOElevation: 15000,
        //   dTOPitch: Cesium.Math.toRadians(-70),
        //   aotuCollide: true, //是否开启避让
        //   collisionPadding: [5, 10, 8, 5], //开启避让时，标注碰撞增加内边距，上、右、下、左
        //   serverFirstStyle: true, //服务端样式优先
        //   labelGraphics: {
        //     font: '28px sans-serif',
        //     fontSize: 28,
        //     fillColor: Cesium.Color.WHITE,
        //     scale: 0.5,
        //     outlineColor: Cesium.Color.BLACK,
        //     outlineWidth: 2,
        //     style: Cesium.LabelStyle.FILL_AND_OUTLINE,
        //     showBackground: false,
        //     backgroundColor: Cesium.Color.RED,
        //     backgroundPadding: new Cesium.Cartesian2(10, 10),
        //     horizontalOrigin: Cesium.HorizontalOrigin.LEFT,
        //     verticalOrigin: Cesium.VerticalOrigin.TOP,
        //     eyeOffset: Cesium.Cartesian3.ZERO,
        //     pixelOffset: new Cesium.Cartesian2(5, 5),
        //     disableDepthTestDistance: undefined,
        //   },
        //   billboardGraphics: {
        //     horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
        //     verticalOrigin: Cesium.VerticalOrigin.CENTER,
        //     eyeOffset: Cesium.Cartesian3.ZERO,
        //     pixelOffset: Cesium.Cartesian2.ZERO,
        //     alignedAxis: Cesium.Cartesian3.ZERO,
        //     color: Cesium.Color.WHITE,
        //     rotation: 0,
        //     scale: 1,
        //     width: 18,
        //     height: 18,
        //     disableDepthTestDistance: undefined,
        //   },
        // })

        // //三维地名服务，使用wtfs服务
        // wtfs.getTileUrl = function () {
        //   return (
        //     CesiumIns.tdtUrl +
        //     'mapservice/GetTiles?lxys={z},{x},{y}&VERSION=1.0.0&tk=' +
        //     CesiumIns.token
        //   )
        // }

        // // 三维图标服务
        // wtfs.getIcoUrl = function () {
        //   return CesiumIns.tdtUrl + 'mapservice/GetIcon?id={id}&tk=' + CesiumIns.token
        // }

        // wtfs.initTDT([
        //   { x: 6, y: 1, level: 2, boundBox: { minX: 90, minY: 0, maxX: 135, maxY: 45 } },
        //   { x: 7, y: 1, level: 2, boundBox: { minX: 135, minY: 0, maxX: 180, maxY: 45 } },
        //   { x: 6, y: 0, level: 2, boundBox: { minX: 90, minY: 45, maxX: 135, maxY: 90 } },
        //   { x: 7, y: 0, level: 2, boundBox: { minX: 135, minY: 45, maxX: 180, maxY: 90 } },
        //   { x: 5, y: 1, level: 2, boundBox: { minX: 45, minY: 0, maxX: 90, maxY: 45 } },
        //   { x: 4, y: 1, level: 2, boundBox: { minX: 0, minY: 0, maxX: 45, maxY: 45 } },
        //   { x: 5, y: 0, level: 2, boundBox: { minX: 45, minY: 45, maxX: 90, maxY: 90 } },
        //   { x: 4, y: 0, level: 2, boundBox: { minX: 0, minY: 45, maxX: 45, maxY: 90 } },
        //   { x: 6, y: 2, level: 2, boundBox: { minX: 90, minY: -45, maxX: 135, maxY: 0 } },
        //   { x: 6, y: 3, level: 2, boundBox: { minX: 90, minY: -90, maxX: 135, maxY: -45 } },
        //   { x: 7, y: 2, level: 2, boundBox: { minX: 135, minY: -45, maxX: 180, maxY: 0 } },
        //   { x: 5, y: 2, level: 2, boundBox: { minX: 45, minY: -45, maxX: 90, maxY: 0 } },
        //   { x: 4, y: 2, level: 2, boundBox: { minX: 0, minY: -45, maxX: 45, maxY: 0 } },
        //   { x: 3, y: 1, level: 2, boundBox: { minX: -45, minY: 0, maxX: 0, maxY: 45 } },
        //   { x: 3, y: 0, level: 2, boundBox: { minX: -45, minY: 45, maxX: 0, maxY: 90 } },
        //   { x: 2, y: 0, level: 2, boundBox: { minX: -90, minY: 45, maxX: -45, maxY: 90 } },
        //   { x: 0, y: 1, level: 2, boundBox: { minX: -180, minY: 0, maxX: -135, maxY: 45 } },
        //   { x: 1, y: 0, level: 2, boundBox: { minX: -135, minY: 45, maxX: -90, maxY: 90 } },
        //   { x: 0, y: 0, level: 2, boundBox: { minX: -180, minY: 45, maxX: -135, maxY: 90 } },
        // ])

        // Execute callback if provided
        if (callback) {
          callback()
        }
        return CesiumIns.viewer
        // return new Promise((resolve) => {
        //   resolve(CesiumIns.viewer)
        // })
      }
    } catch (error) {
      console.error('Failed to initialize Cesium viewer:', error)
    }
  }

  //此方法应该是QGIS中q参数的计算方法
  static tileXYToQuadKey(x, y, level) {
    let quadkey = ''
    for (let i = level; i >= 0; --i) {
      const bitmask = 1 << i
      let digit = 0
      if ((x & bitmask) !== 0) {
        digit |= 1
      }
      if ((y & bitmask) !== 0) {
        digit |= 2
      }
      quadkey += digit
    }
    if (quadkey[0] === '0') {
      quadkey = quadkey.substr(1)
    }
    return quadkey
  }
}
