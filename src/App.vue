<script setup lang="ts">
import { getAssetUrl } from './services/assets';
</script>


<template>
  <router-view></router-view>
</template>


<style lang="scss">
/* FONTS */
@font-face {
  font-family: Barlow_Condensed;
  src: url(./assets/fonts/Barlow_Condensed/BarlowCondensed-Regular.ttf);
  font-weight: 400;
  font-style: normal;
}

@font-face {
  font-family: Barlow_Condensed;
  src: url(./assets/fonts/Barlow_Condensed/BarlowCondensed-Italic.ttf);
  font-weight: 400;
  font-style: italic;
}

@font-face {
  font-family: Barlow_Condensed;
  src: url(./assets/fonts/Barlow_Condensed/BarlowCondensed-SemiBold.ttf);
  font-weight: 600;
}

@font-face {
  font-family: Barlow_Condensed;
  src: url(./assets/fonts/Barlow_Condensed/BarlowCondensed-Bold.ttf);
  font-weight: 700;
  font-style: bold;
}

@font-face {
  font-family: DSEG14_Classic;
  src: url(./assets/fonts/DSEG14-Classic/DSEG14Classic-Regular.ttf);
  font-weight: 400;
  font-style: normal;
}

p {
  display: block;
  margin-block-start: 0em;
  margin-block-end: 0em;
  margin-inline-start: 0px;
  margin-inline-end: 0px;
  font-family: Barlow_Condensed;
  font-weight: normal;
  font-size: 20px;
}

input {
  display: flex;
  font-family: Barlow_Condensed;
  box-sizing: border-box;
  font-weight: normal;
  font-size: 20px;
  line-height: 24px;
  width: 100%;
  height: 40px;
  border: 0px;
  border-bottom: 1px solid hsl(0, 0%, 70%);
  background: transparent;
  color: hsl(0, 0%, 100%);

  &:focus-visible {
    outline: none;
  }
}

button {
  font-family: Barlow_Condensed;
  font-weight: 600;
  font-size: 20px;
  line-height: 24px;
  padding: 0px;
  margin: 0px;
  border: none;
  box-sizing: border-box;
  border-radius: 2px;
  color: hsl(0, 0%, 100%);
  cursor: pointer;
}

a {
  font-family: Barlow_Condensed;
  font-weight: 600;
  font-size: 20px;
  line-height: 24px;
  text-decoration: none;
  color: white;
}

video {
  top: 0;
  right: 0;
}

li {
  font-family: Barlow_Condensed;
  font-weight: normal;
}
</style>
