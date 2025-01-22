import * as Cesium from 'cesium'
import { throttle } from '@/utils/throttle'

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

interface position {}
interface Movement {
  startPosition: Cesium.Cartesian2
  endPosition: Cesium.Cartesian2
}

export default class CesiumIns {
  static Cesium: typeof Cesium
  static viewer: any
  static token = ''
  // 服务域名
  static tdtUrl = 'https://t{s}.tianditu.gov.cn/'
  // 服务负载子域
  static subdomains = ['0', '1', '2', '3', '4', '5', '6', '7']

  constructor() {}

  static async init(
    id: string,
    callback?: (val: Cesium.Viewer) => void,
    config: ViewerConfig = {},
  ) {
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

        const imageryProvider = new Cesium.UrlTemplateImageryProvider({
          url: 'https://tile.openstreetmap.bzh/br/{z}/{x}/{y}.png',
          subdomains: ['a', 'b', 'c', 'd'],
        })

        // const imageryProvider = new Cesium.OpenStreetMapImageryProvider({
        //   url: 'https://a.tile.openstreetmap.org/',
        // })
        const layer_shiLiang = new Cesium.WebMapTileServiceImageryProvider({
          url:
            this.tdtUrl +
            'vec_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=vec&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default&format=tiles&tk=' +
            this.token,
          layer: 'tdtVecBasicLayer',
          style: 'default',
          format: 'image/jpeg',
          subdomains: this.subdomains,
          tileMatrixSetID: 'GoogleMapsCompatible',
        })
        // 全球矢量中文注记
        const layer_shiLiangAnno = new Cesium.WebMapTileServiceImageryProvider({
          url:
            this.tdtUrl +
            'cva_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=cva&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default.jpg&tk=' +
            this.token,
          layer: 'tdtAnnoLayer',
          style: 'default',
          subdomains: this.subdomains,
          format: 'image/jpeg',
          tileMatrixSetID: 'GoogleMapsCompatible',
        })
        // 全球影像地图
        const layer_img = new Cesium.UrlTemplateImageryProvider({
          url: this.tdtUrl + 'DataServer?T=img_w&x={x}&y={y}&l={z}&tk=' + this.token,
          subdomains: this.subdomains,
          tilingScheme: new Cesium.WebMercatorTilingScheme(),
          maximumLevel: 18,
        })
        // 全球影像中文注记服务
        const layer_imgAnno = new Cesium.WebMapTileServiceImageryProvider({
          url:
            this.tdtUrl +
            'cia_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=cia&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default.jpg&tk=' +
            this.token,
          layer: 'tdtAnnoLayer',
          style: 'default',
          format: 'image/jpeg',
          subdomains: this.subdomains,
          tileMatrixSetID: 'GoogleMapsCompatible',
        })
        // 国界
        const layer_iboMap = new Cesium.UrlTemplateImageryProvider({
          url: this.tdtUrl + 'DataServer?T=ibo_w&x={x}&y={y}&l={z}&tk=' + this.token,
          subdomains: this.subdomains,
          tilingScheme: new Cesium.WebMercatorTilingScheme(),
          maximumLevel: 10,
        })

        CesiumIns.Cesium = window.Cesium

        // Set default access token
        CesiumIns.Cesium.Ion.defaultAccessToken =''
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
          // terrain: Cesium.Terrain.fromWorldTerrain(), // 地形数据
          // 关闭无级缩放地图
          smoothResolutionConstraint: false, //平滑分辨率约束
          zoomFactor: 50, // 缩放因子
          zoom: 12, // 缩放级别
          enableDebugWireframe: true,
        }

        // Create container element and set dimensions
        // const container = document.getElementById(id)
        Cesium.createWorldTerrainAsync().then((terrainProvider) => {
          CesiumIns.viewer = new CesiumIns.Cesium.Viewer(id, {
            ...defaultConfig,
            ...config,
            terrainProvider: terrainProvider, // 添加地形
            baseLayerPicker: false, // 可选：关闭底图选择器
            scene3DOnly: true, // 可选：仅使用 3D 场景
          })

          // 开启深度探测：开启后3d模型会根据地形进行遮挡
          CesiumIns.viewer.scene.globe.depthTestAgainstTerrain = true
          // 关闭大气效果
          CesiumIns.viewer.scene.globe.showGroundAtmosphere = false
          // 关闭光照
          CesiumIns.viewer.scene.globe.enableLighting = false
          // 水雾特效,true会让海洋颜色变浅蓝
          CesiumIns.viewer.scene.globe.showGroundAtmosphere = false

          // 抗锯齿：开启后会让3d模型边缘看起来更平滑
          CesiumIns.viewer.scene.fxaa = true
          // 近似抗锯齿功能：开启
          CesiumIns.viewer.scene.postProcessStages.fxaa.enabled = true
          // 设置最大俯仰角，[-90,0]区间内，默认为-30，单位弧度
          CesiumIns.viewer.scene.screenSpaceCameraController.constrainedPitch =
            Cesium.Math.toRadians(-20)
          // 控制相机在某些操作后是否自动重置方向（heading）和俯仰角（pitch）
          CesiumIns.viewer.scene.screenSpaceCameraController.autoResetHeadingPitch = true
          // 设置相机缩放速度，用户在缩放操作停止后，相机继续缩放的持续时间，默认为1.0
          CesiumIns.viewer.scene.screenSpaceCameraController.inertiaZoom = 0.5
          // 最小的缩放距离，单位米
          CesiumIns.viewer.scene.screenSpaceCameraController.minimumZoomDistance = 100
          // 最大的缩放距离，单位米
          CesiumIns.viewer.scene.screenSpaceCameraController.maximumZoomDistance = 2000000
          // 关闭雾效
          CesiumIns.viewer.scene.fog.enabled = false
          // 关闭太阳
          CesiumIns.viewer.scene.sun.show = false
          // 关闭天空盒
          CesiumIns.viewer.scene.skyBox.show = false
          // 关闭大气层
          CesiumIns.viewer.scene.skyAtmosphere.show = false

          // 设置相机缩放方式
          CesiumIns.viewer.scene.screenSpaceCameraController.zoomEventTypes = [
            Cesium.CameraEventType.RIGHT_DRAG,
            Cesium.CameraEventType.WHEEL,
            Cesium.CameraEventType.PINCH,
          ]

          // 设置相机旋转方式
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

          // 设置相机倾斜方式
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
          if (Cesium.FeatureDetection.supportsImageRenderingPixelated()) {
            //判断是否支持图像渲染像素化处理
            CesiumIns.viewer.resolutionScale = window.devicePixelRatio
          }

          CesiumIns.viewer.imageryLayers.addImageryProvider(layer_shiLiang)
          CesiumIns.viewer.imageryLayers.addImageryProvider(layer_shiLiangAnno)
          CesiumIns.viewer.imageryLayers.addImageryProvider(layer_iboMap)

          CesiumIns.viewer.scene.primitives.removeAll()
          // 添加3D建筑展示
          Cesium.Cesium3DTileset.fromIonAssetId(96188, {}).then(function (tileset) {
            // tileset.style = new Cesium.Cesium3DTileStyle({
            //   color: 'color("white", 1)',
            //   lightingModel: 'unlit', // 关闭光照模型
            // })

            const customShader = new Cesium.CustomShader({
              mode: Cesium.CustomShaderMode.MODIFY_MATERIAL,
              fragmentShaderText: `
                  void fragmentMain(FragmentInput fsInput, inout czm_modelMaterial material) {
                      material.diffuse = vec3(0.57, 0.84, 1.0); // 设置为白色
                      material.alpha = 1.0; // 设置透明度为 100%
                  }
              `,
            })

            // tileset.customShader = customShader

            // const customShader = new Cesium.CustomShader({
            //   fragmentShaderText: `
            //       czm_material czm_getMaterial(czm_materialInput materialInput)
            //       {
            //           czm_material material = czm_getDefaultMaterial(materialInput);
            //           vec3 normal = normalize(materialInput.normalMC); // 获取法线方向
            //           vec3 position = materialInput.positionMC; // 获取模型空间位置

            //           // 设置整体为纯白色
            //           material.diffuse = vec3(1.0, 1.0, 1.0);

            //           // 判断是否为侧立面（法线方向接近垂直方向）
            //           if (abs(normal.y) < 0.9) {
            //               // 计算细条纹
            //               float stripe = mod(position.x + position.z, 0.1); // 调整条纹间距
            //               if (stripe < 0.05) { // 调整条纹宽度
            //                   material.diffuse = vec3(0.0, 0.0, 0.0); // 条纹颜色为黑色
            //               }
            //           }

            //           return material;
            //       }
            //   `,
            // })

            CesiumIns.viewer.scene.primitives.add(tileset)
            tileset.customShader = customShader
          })

          // 修改地图颜色，改为深蓝色
          this.modifyMap(CesiumIns.viewer, {
            invertColor: true, //滤镜值
            filterRGB: [50, 211, 255],
          })
          this.queryTerrainHeight()
          if (callback) {
            callback(CesiumIns.viewer)
          }
        })

        // 测量某一点的海拔高度
        // const longitude = 114.66 // 经度
        // const latitude = 35.4923611111111 // 纬度

        // // 将经纬度转换为弧度制的 Cartographic 对象
        // const positionCartographic = Cesium.Cartographic.fromDegrees(longitude, latitude)
        // const worldTerrain = await Cesium.createWorldTerrainAsync()
        // CesiumIns.viewer.scene.terrainProvider = worldTerrain
        // // 使用 sampleTerrainMostDetailed 获取地形高度
        // Cesium.sampleTerrainMostDetailed(CesiumIns.viewer.scene.terrainProvider, [
        //   positionCartographic,
        // ])
        //   .then(function (updatedPositions) {
        //     const height = updatedPositions[0].height // 获取高度
        //     console.log('该点的海拔高度为：' + height.toFixed(6) + ' 米')
        //   })
        //   .catch(function (error) {
        //     console.error('获取地形高度时发生错误：', error)
        //   })
      }
    } catch (error) {
      console.error('Failed to initialize Cesium viewer:', error)
    }
  }

  static modifyMap = (viewer: Cesium.Viewer, options) => {
    const baseLayer = viewer.imageryLayers.get(0)
    //以下几个参数根据实际情况修改,目前我是参照火星科技的参数,个人感觉效果还不错
    baseLayer.brightness = options.brightness || 0.6
    baseLayer.contrast = options.contrast || 1.8
    baseLayer.gamma = options.gamma || 0.3
    baseLayer.hue = options.hue || 1
    baseLayer.saturation = options.saturation || 0
    const baseFragShader = viewer.scene.globe._surfaceShaderSet.baseFragmentShaderSource.sources
    for (let i = 0; i < baseFragShader.length; i++) {
      const strS = 'color = czm_saturation(color, textureSaturation);\n#endif\n'
      let strT = 'color = czm_saturation(color, textureSaturation);\n#endif\n'
      if (options.invertColor) {
        strT += `
      color.r = 1.0 - color.r;
      color.g = 1.0 - color.g;
      color.b = 1.0 - color.b;
      `
      }
      if (options.filterRGB.length > 0) {
        strT += `
      color.r = color.r * ${options.filterRGB[0]}.0/255.0;
      color.g = color.g * ${options.filterRGB[1]}.0/255.0;
      color.b = color.b * ${options.filterRGB[2]}.0/255.0;
      `
      }
      baseFragShader[i] = baseFragShader[i].replace(strS, strT)
    }
  }

  static queryTerrainHeight = () => {
    // 鼠标移动事件，查询3d地形高度
    CesiumIns.viewer.screenSpaceEventHandler.setInputAction(
      throttle((movement: Movement) => {
        const mousePosition = movement.endPosition

        const cartesian = CesiumIns.viewer.scene.globe.pick(
          CesiumIns.viewer.camera.getPickRay(mousePosition),
          CesiumIns.viewer.scene,
        )
        console.log(cartesian)
        if (cartesian) {
          // 获取经纬度
          const cartographic = Cesium.Cartographic.fromCartesian(cartesian)
          const longitude = Cesium.Math.toDegrees(cartographic.longitude)
          const latitude = Cesium.Math.toDegrees(cartographic.latitude)
          console.log('1', longitude, latitude)
          // 将经纬度转换为弧度制的 Cartographic 对象
          // 查询地形高度
          const terrainProvider = CesiumIns.viewer.terrainProvider
          const position = Cesium.Cartographic.fromDegrees(longitude, latitude)
          console.log('2', position)
          Cesium.sampleTerrainMostDetailed(terrainProvider, [position]).then(
            function (updatedPositions) {
              const height = updatedPositions[0].height

              console.log(
                `鼠标位置：经度 ${longitude.toFixed(4)}°, 纬度 ${latitude.toFixed(4)}°, 高度 ${height.toFixed(2)} 米`,
              )
            },
          )
        }
      }, 100),
      Cesium.ScreenSpaceEventType.MOUSE_MOVE,
    )
  }
}
