<script setup lang="ts">
// import { RouterLink, RouterView } from 'vue-router'
import Map from './components/Map.vue'
import CesiumMap from './components/CesiumMap.vue'
import setScale from './utils/scale.js'

// 以下是使用scale方案来实现的自适应缩放，优点是简单方便，缺点是比例不一致时会有白边
let containerStyle: object = setScale(1920, 1080)
window.addEventListener('resize', () => {
  containerStyle = setScale(1920, 1080)
})
</script>

<template>
  <div class="wrapper" id="wrapper">
    <div class="map">
      <!-- <Map></Map> -->
      <CesiumMap />
    </div>
    <div class="header">中国联通极目低空监管平台</div>
    <!-- meteoblute引入 -->
    <!-- <div>
      <iframe
        src="https://www.meteoblue.com/en/weather/maps/widget/harbin-taiping-international-airport_china_6301399?windAnimation=1&gust=1&satellite=1&cloudsAndPrecipitation=1&temperature=1&sunshine=1&extremeForecastIndex=1&geoloc=fixed&tempunit=C&windunit=km%252Fh&lengthunit=metric&zoom=5&autowidth=auto"
        frameborder="0"
        scrolling="NO"
        allowtransparency="true"
        sandbox="allow-same-origin allow-scripts allow-popups allow-popups-to-escape-sandbox"
        style="width: 100%; height: 721px"
      ></iframe>
      <div>
        <a
          href="https://www.meteoblue.com/en/weather/maps/harbin-taiping-international-airport_china_6301399?utm_source=map_widget&utm_medium=linkus&utm_content=map&utm_campaign=Weather%2BWidget"
          target="_blank"
          rel="noopener"
          >meteoblue</a
        >
      </div>
    </div> -->
    <div class="content">
      <div class="left"></div>

      <div class="right"></div>
    </div>
    <div class="bottom"></div>
    <!-- <nav>
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/about">About</RouterLink>
      </nav> -->
  </div>

  <!-- <RouterView /> -->
</template>

<style scoped>
.wrapper {
  display: flex;
  place-items: flex-start;
  flex-wrap: wrap;
  height: 100%;
  width: 100%;
  background-color: midnightblue;
  flex-direction: column;
}
.header {
  width: 100%;
  height: 10vh;
  position: absolute;
  top: 0;
  left: 0;
  font-size: 5vh;
  display: flex;
  flex-direction: row;
  justify-content: center;
  z-index: 1;
  color: #fff;
  background: linear-gradient(to bottom, rgb(221, 228, 233) 0%, rgb(126, 201, 243) 80%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.map {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
}
</style>
