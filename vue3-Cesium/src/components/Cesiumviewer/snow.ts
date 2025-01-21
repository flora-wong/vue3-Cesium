import * as Cesium from 'cesium'
import snowflake_particle from '../../assets/snowflake_particle.png'

export default function initSnow(viewer: Cesium.Viewer) {
  {
    // snow
    const snowParticleSize = 12.0
    const snowRadius = 100000.0
    const minimumSnowImageSize = new Cesium.Cartesian2(snowParticleSize, snowParticleSize)
    const maximumSnowImageSize = new Cesium.Cartesian2(
      snowParticleSize * 2.0,
      snowParticleSize * 2.0,
    )
    let snowGravityScratch = new Cesium.Cartesian3()
    const snowUpdate = function (particle, dt) {
      snowGravityScratch = Cesium.Cartesian3.normalize(particle.position, snowGravityScratch)
      Cesium.Cartesian3.multiplyByScalar(
        snowGravityScratch,
        Cesium.Math.randomBetween(-30.0, -300.0),
        snowGravityScratch,
      )
      particle.velocity = Cesium.Cartesian3.add(
        particle.velocity,
        snowGravityScratch,
        particle.velocity,
      )
      const distance = Cesium.Cartesian3.distance(viewer.scene.camera.position, particle.position)
      if (distance > snowRadius) {
        particle.endColor.alpha = 0.0
      } else {
        particle.endColor.alpha = 1.0 / (distance / snowRadius + 0.1)
      }
    }

    viewer.scene.primitives.add(
      new Cesium.ParticleSystem({
        modelMatrix: new Cesium.Matrix4.fromTranslation(viewer.scene.camera.position),
        minimumSpeed: -1.0,
        maximumSpeed: 0.0,
        lifetime: 15.0,
        emitter: new Cesium.SphereEmitter(snowRadius),
        startScale: 0.5,
        endScale: 1.0,
        image: snowflake_particle,
        emissionRate: 7000.0,
        startColor: Cesium.Color.WHITE.withAlpha(0.0),
        endColor: Cesium.Color.WHITE.withAlpha(1.0),
        minimumImageSize: minimumSnowImageSize,
        maximumImageSize: maximumSnowImageSize,
        updateCallback: snowUpdate,
      }),
    )

    viewer.scene.skyAtmosphere.hueShift = -0.8
    viewer.scene.skyAtmosphere.saturationShift = -0.7
    viewer.scene.skyAtmosphere.brightnessShift = -0.33
    viewer.scene.fog.density = 0.001
    viewer.scene.fog.minimumBrightness = 0.8
  }
}
