import * as Cesium from 'cesium'
import circular_particle from '../../assets/circular_particle.png'

export default function initRain(viewer: Cesium.Viewer) {
  {
    // rain
    const rainParticleSize = 15.0
    const rainRadius = 100000.0
    const rainImageSize = new Cesium.Cartesian2(rainParticleSize, rainParticleSize * 2.0)
    let rainGravityScratch = new Cesium.Cartesian3()
    const rainUpdate = function (particle, dt) {
      rainGravityScratch = Cesium.Cartesian3.normalize(particle.position, rainGravityScratch)
      rainGravityScratch = Cesium.Cartesian3.multiplyByScalar(
        rainGravityScratch,
        -1050.0,
        rainGravityScratch,
      )

      particle.position = Cesium.Cartesian3.add(
        particle.position,
        rainGravityScratch,
        particle.position,
      )

      const distance = Cesium.Cartesian3.distance(viewer.scene.camera.position, particle.position)
      if (distance > rainRadius) {
        particle.endColor.alpha = 0.0
      } else {
        particle.endColor.alpha = Cesium.Color.BLUE.alpha / (distance / rainRadius + 0.1)
      }
    }

    viewer.scene.primitives.add(
      new Cesium.ParticleSystem({
        modelMatrix: new Cesium.Matrix4.fromTranslation(viewer.scene.camera.position),
        speed: -1.0,
        lifetime: 15.0,
        emitter: new Cesium.SphereEmitter(rainRadius),
        startScale: 1.0,
        endScale: 0.0,
        image: circular_particle,
        emissionRate: 9000.0,
        startColor: new Cesium.Color(0.27, 0.5, 0.7, 0.0),
        endColor: new Cesium.Color(0.27, 0.5, 0.7, 0.98),
        imageSize: rainImageSize,
        updateCallback: rainUpdate,
      }),
    )

    viewer.scene.skyAtmosphere.hueShift = -0.97
    viewer.scene.skyAtmosphere.saturationShift = 0.25
    viewer.scene.skyAtmosphere.brightnessShift = -0.4
    viewer.scene.fog.density = 0.00025
    viewer.scene.fog.minimumBrightness = 0.01
  }
}
