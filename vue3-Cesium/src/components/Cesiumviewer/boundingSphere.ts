import * as Cesium from 'cesium'

export default function createBoundingSphere(
  viewer: Cesium.Viewer,
  longitude: number,
  latitude: number,
  range: number = 1000,
  heading: number = 5,
) {
  const czml = [
    {
      id: 'document',
      name: 'CZML Geometries: Spheres and Ellipsoids',
      version: '1.0',
    },
    {
      id: 'redEllipsoid',
      name: 'red ellipsoid',
      position: {
        cartographicDegrees: [126.7, 45.75, 100.0], // 这里的z是高程数据
      },
      ellipsoid: {
        radii: {
          cartesian: [300.0, 300.0, 300.0],
        },
        maximumCone: Math.PI / 2,
        heightReference: Cesium.HeightReference.RELATIVE_TO_GROUND,
        fill: true,
        material: {
          solidColor: {
            color: {
              rgba: [255, 0, 0, 100],
            },
          },
        },
      },
    },
    {
      id: 'orangeSphere',
      name: 'orange sphere with black outline',
      position: {
        cartographicDegrees: [126.7, 45.75, 100.0], // 这里的z是高程数据
      },
      ellipsoid: {
        radii: {
          cartesian: [400.0, 400.0, 400.0],
        },
        maximumCone: Math.PI / 2,
        fill: true,
        heightReference: Cesium.HeightReference.RELATIVE_TO_GROUND,
        material: {
          solidColor: {
            color: {
              rgba: [255, 120, 0, 100],
            },
          },
        },
        outline: false,
        outlineColor: {
          rgbaf: [0, 0, 0, 1],
        },
      },
    },
    {
      id: 'greenSphere',
      name: 'green sphere with black outline',
      position: {
        cartographicDegrees: [126.7, 45.75, 100],
      },
      ellipsoid: {
        radii: {
          cartesian: [500.0, 500.0, 500.0],
        },
        maximumCone: Math.PI / 2,
        heightReference: Cesium.HeightReference.RELATIVE_TO_GROUND,
        fill: true,
        material: {
          solidColor: {
            color: {
              rgba: [0, 255, 248, 50],
            },
          },
        },
        outline: false,
      },
    },
    // {
    //   id: 'wall',
    //   wall: {
    //     positions: new Cesium.CallbackProperty(() => {
    //       return Cesium.Cartesian3.fromDegreesArrayHeights(positionArr)
    //     }, false),
    //     heightReference: Cesium.HeightReference.RELATIVE_TO_GROUND,
    //     material: {
    //       solidColor: {
    //         color: {
    //           rgba: [0, 0, 255, 100],
    //         },
    //       },
    //     },
    //   },
    // },
  ]

  const dataSourcePromise = Cesium.CzmlDataSource.load(czml)
  viewer.dataSources.add(dataSourcePromise)
  // viewer.zoomTo(dataSourcePromise)
}
