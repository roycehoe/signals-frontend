<script lang="ts" setup>
import { getAssetUrl } from '@/services/assets';

</script>

<template>
  <div class="videoBackground">
    <div class="videoBackground--overlay"></div>
    <video autoplay muted loop class="videoBackground--video">
      <source :src="getAssetUrl('graphics/background-videos', 'home-screen.mp4')" type="video/mp4" />
    </video>
  </div>

  <div class="display">
    <div class="display--flexboxColumn display--onGrid">
      <div class="gameLogo">
        <img class="gameLogo--smallImg" :src="getAssetUrl('graphics', 'logo.png')" />
      </div>

      <div class="display--inputBox">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@import "../styles/variables.scss";

//--------MEDIA AGNOSTIC FORMATTING--------//
.gameLogo {
  &--smallImg {
    height: 196px;
    width: 522px;
  }
}

.videoBackground {
  &--overlay {
    position: fixed;
    display: block;
    width: 100%;
    height: 100%;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: $overlay;
    z-index: -1;
  }

  &--video {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: -2;
    object-fit: cover;
  }
}
.display {
  display: grid;

  &--flexboxColumn {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  &--inputBox {
    display: flex;
    flex-direction: column;
    background-color: $input-box;
  }
}

// -------- PHONE DISPLAY -------- //
@media screen and (max-width: $tablet-width) {
  .gameLogo {
    &--smallImg {
      width: 300px;
      height: 100%;
    }
  }
  .display {
    margin-top: 20px;
    grid-template-columns: repeat(6, auto);
    margin-left: 20px;
    margin-right: 20px;

    &--onGrid {
      grid-column-start: 1;
      grid-column-end: 7;
    }

    &--inputBox {
      margin-top: 20px;
      // padding: 11px 28px 17px 27px;
      padding: 20px 20px;
      width: 100%;
      box-sizing: border-box;
      border-radius: 5px;
    }
  }
}

// -------- TABLET DISPLAY -------- //
@media screen and (min-width: $tablet-width) {
  .gameLogo {
    &--smallImg {
      height: 191px;
      width: 509px;
    }
  }
  .display {
    margin-top: 143px;
    grid-template-columns: repeat(6, auto);
    grid-column-gap: 20px;

    &--onGrid {
      grid-column-start: 2;
      grid-column-end: 6;
    }
    &--inputBox {
      margin-top: 50px;
      padding: 24px 63px 33px 63px;
      width: 400px;
      box-sizing: border-box;
      border-radius: 10px;
    }
  }
}

// -------- DESKTOP DISPLAY -------- //
@media screen and (min-width: $desktop-width) {
  .display {
    margin-top: 143px;
    grid-template-columns: repeat(12, auto);
    grid-column-gap: 20px;

    &--onGrid {
      grid-column-start: 4;
      grid-column-end: 10;
    }
    &--inputBox {
      margin-top: 50px;
      padding: 21px 52px 40px 52px;
      width: 400px;
      box-sizing: border-box;
      border-radius: 10px;
    }
  }
  .gameLogo {
    &--smallImg {
      height: 196px;
      width: 522px;
    }
  }
}
</style>