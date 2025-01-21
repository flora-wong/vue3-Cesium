/**
 *
 * @param {Viewer} viewer
 * @param {Cartesian3} position 经纬度
 * @param {String} id
 * @param {number} shortwaveRange 半径
 * @return {*}
 *
 */
import * as Cesium from 'cesium'

interface TrackMatteValue {
  viewer: Cesium.Viewer
  id: string
  shortwaveRange: number
  position: number[]
}

export default class TrackMatte {
  viewer: Cesium.Viewer
  id: string
  shortwaveRange: number
  longitude: number
  latitude: number
  position: Cesium.Cartesian3
  heading: number
  positionArr: number[]

  constructor(value: TrackMatteValue) {
    const { viewer, id, shortwaveRange, position } = value || {}
    this.viewer = viewer
    this.id = id
    this.shortwaveRange = shortwaveRange
    this.longitude = position[0]
    this.latitude = position[1]
    this.position = Cesium.Cartesian3.fromDegrees(position[0], position[1])
    this.heading = 0
    this.positionArr = this.calcPoints(position[0], position[1], shortwaveRange, 0) //储存脏数据
    this.addEntities()
  }
  addEntities() {
    const entity = this.viewer.entities.add({
      id: this.id,
      position: this.position,
      wall: {
        positions: new Cesium.CallbackProperty(() => {
          return Cesium.Cartesian3.fromDegreesArrayHeights(this.positionArr)
        }, false),
        material: new Cesium.Color.fromCssColorString('#00dcff82'),
        distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0.0, 10.5e6),
        // outline: true,
        // outlineColor: Cesium.Color.fromCssColorString('#00dcff'),
        // outlineWidth: 2.0,
      },
      // ellipsoid: {
      //   radii: new Cesium.Cartesian3(this.shortwaveRange, this.shortwaveRange, this.shortwaveRange),
      //   maximumCone: Cesium.Math.toRadians(90),
      //   material: new Cesium.Color.fromCssColorString('#00dcff82'),
      //   outline: true,
      //   outlineColor: new Cesium.Color.fromCssColorString('#00dcff82'),
      //   outlineWidth: 1,
      //   distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0.0, 10.5e6),
      // },
    })
    this.addPostRender()
  }
  addPostRender() {
    this.viewer.clock.onTick.addEventListener(() => {
      this.heading += 5.0 //可调节转动速度
      this.positionArr = this.calcPoints(
        this.longitude,
        this.latitude,
        this.shortwaveRange,
        this.heading,
      )
    })
  }
  calcPoints(x1: number, y1: number, radius: number, heading: number) {
    const m = Cesium.Transforms.eastNorthUpToFixedFrame(Cesium.Cartesian3.fromDegrees(x1, y1))
    const rx = radius * Math.cos((heading * Math.PI) / 180.0)
    const ry = radius * Math.sin((heading * Math.PI) / 180.0)
    const translation = Cesium.Cartesian3.fromElements(rx, ry, 0)
    const d = Cesium.Matrix4.multiplyByPoint(m, translation, new Cesium.Cartesian3())
    const c = Cesium.Cartographic.fromCartesian(d)
    const x2 = Cesium.Math.toDegrees(c.longitude)
    const y2 = Cesium.Math.toDegrees(c.latitude)
    return this.computeCirclularFlight(x1, y1, x2, y2, 0, 90)
  }
  computeCirclularFlight(
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    fx: number,
    angle: number,
  ) {
    const positionArr = []
    positionArr.push(x1)
    positionArr.push(y1)
    positionArr.push(0)
    const radius = Cesium.Cartesian3.distance(
      Cesium.Cartesian3.fromDegrees(x1, y1),
      Cesium.Cartesian3.fromDegrees(x2, y2),
    )
    for (let i = fx; i <= fx + angle; i++) {
      const h = radius * Math.sin((i * Math.PI) / 180.0)
      const r = Math.cos((i * Math.PI) / 180.0)
      const x = (x2 - x1) * r + x1
      const y = (y2 - y1) * r + y1
      positionArr.push(x)
      positionArr.push(y)
      positionArr.push(h)
    }
    return positionArr
  }
}
