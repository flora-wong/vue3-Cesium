import * as Cesium from 'cesium'
import img_color from '../../assets/snowflake_particle.png'

// 波纹扫描
const waveScanFabric = {
  uniforms: {
    color: new Cesium.Color(1.0, 0.0, 0.0, 1.0),
    speed: 10.0,
  },
  source: `
    uniform vec4 color;
    uniform float speed;

    #define PI 3.14159265359

    float rand(vec2 co){
      return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
    }

    czm_material czm_getMaterial(czm_materialInput materialInput){
      czm_material material = czm_getDefaultMaterial(materialInput);
      vec2 st = materialInput.st;
      vec2 pos = st - vec2(0.5);
      float time = czm_frameNumber * speed / 1000.0 ;
      float r = length(pos);
      float t = atan(pos.y, pos.x) - time * 2.5;
      float a = (atan(sin(t), cos(t)) + PI)/(2.0*PI);
      float ta = 0.5;
      float v = smoothstep(ta-0.05,ta+0.05,a) * smoothstep(ta+0.05,ta-0.05,a);
      vec3 flagColor = color.rgb * v;
      float blink = pow(sin(time*1.5)*0.5+0.5, 0.8);
      flagColor = color.rgb *  pow(a, 8.0*(.2+blink))*(sin(r*500.0)*.5+.5) ;
      flagColor = flagColor * pow(r, 0.4);
      material.alpha = length(flagColor) * 1.3;
      material.diffuse = flagColor * 3.0;
      return material;
    }
  `,
}

// 扇形扫描
const sectorScanFabric = {
  uniforms: {
    color: new Cesium.Color(0.0, 1.0, 0.0),
    rotate: 90.0,
    percent: 0.1,
  },
  source: `
    uniform vec4 color;
    uniform float percent;

    float get_angle(vec2 base,vec2 dir)
    {
      base = normalize(base);
      dir = normalize(dir);
      float angle = degrees(acos(abs(dot(dir,base))));
      if (dir.s > 0.0 && dir.t > 0.0){angle = angle;}
      else if (dir.s < 0.0 && dir.t > 0.0){angle = 180.0 - angle;}
      else if (dir.s < 0.0 && dir.t < 0.0){angle = 180.0 + angle;}
      else{angle = 360.0 - angle;}
      return angle;
    }

    czm_material czm_getMaterial(czm_materialInput materialInput)
    {
      czm_material material = czm_getDefaultMaterial(materialInput);
      material.diffuse = czm_gammaCorrect(color.rgb);

      vec2 st = materialInput.st;
      vec2 base = vec2(0.5,0.0);
      vec2 dir = st-vec2(0.5,0.5);
      float len = length(dir);
      if(len > 0.49){
        material.alpha = 1.0;
        material.diffuse = czm_gammaCorrect(color.rgb);
        material.emission=vec3(0.2);
      }
      else{
        float angle = get_angle(base,dir);
        material.alpha = (mod(angle + (-czm_frameNumber),360.0)-(1.0-percent)*360.0)/(360.0*percent);
        material.emission=vec3(0.5);
      }
      return material;
    }
    `,
}

export default function dynamicWall(viewer) {
  const scene = viewer.scene
  // Create the circle geometry.
  const circleGeometry = new Cesium.CircleGeometry({
    center: Cesium.Cartesian3.fromDegrees(126.7, 45.75),
    radius: 200.0,
    vertexFormat: Cesium.VertexFormat.POSITION_AND_ST,
  })
  const instance = new Cesium.GeometryInstance({
    geometry: circleGeometry,
    // attributes: {
    //   color: new Cesium.Color(0.0, 1.0, 0.0),
    // },
  })
  scene.primitives.add(
    new Cesium.GroundPrimitive({
      geometryInstances: instance,
      appearance: new Cesium.MaterialAppearance({
        material: new Cesium.Material({
          translucent: false,
          fabric: sectorScanFabric,
        }),
      }),
    }),
  )
}
