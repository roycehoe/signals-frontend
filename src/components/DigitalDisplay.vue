<script lang="ts" setup>
import { PropType } from "vue";
import DigitalDisplayCharacter from '@/components/DigitalDisplayCharacter.vue'


interface DigitalDisplayData {
  content: string;
  header?: string;
  isRightAligned?: boolean;
}

const props = defineProps({
  data: {
    type: Object as PropType<DigitalDisplayData>,
    required: true,
  },
});


function getContents(data: DigitalDisplayData): String {
  if (!data.isRightAligned) {
    return data.content + "~".repeat(100);
  }
  return ("~".repeat(100) + data.content).split("").reverse().join("");
}

</script>

<template>
  <div class="display">
    <div class="display__header" v-if="data.header">
      <p class="display__header--text">{{ data.header }}</p>
    </div>

    <div class="display__body__result display__body__result--screen" v-if="!data.header">
      <p
        class="display__body__result--overlay display__body__result--padding-chars display__body__result--txt"
      >{{ data.content ? data.content : "" }}</p>
    </div>

    <div class="display__body--screen" v-else>
      <div
        class="display__body--txt"
        :class="data.isRightAligned ? 'txt__right-aligned' : 'txt__left-aligned'"
      >
        <p :class="'display__body--txt--chars'" v-for="chars in getContents(data)" :key="chars">
          <DigitalDisplayCharacter :content="chars"></DigitalDisplayCharacter>
        </p>
      </div>
      <div
        class="display__body__overlay-group"
        :class="data.isRightAligned ? 'overlay__right-aligned' : 'overlay__left-aligned'"
      >
        <div class="display__body__overlay--txt">
          <p class="display__body__overlay--chars" v-for="chars in 100">~</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@import "@/styles/variables.scss";
@import "@/styles/digital-display.scss";
@import "@/styles/buttons.scss";

.display__body__result {
  &--screen {
    max-height: min(7vh, 60px);
  }
  &--txt {
    position: relative;
    z-index: 1;
    font-size: min(3.15vw, 41.5px);
  }
  &--overlay {
    &:after {
      position: absolute;
      left: 0;
      z-index: -1;
      color: $digital-display-blank-txt;
      font-family: DSEG14_Classic;
      font-size: min(3.15vw, 41.5px);
      content: "~~~~~~~~~~~~~~~~~~~~~~~~";
    }
  }
  &--padding-chars {
    &:before {
      color: $digital-display-blank-txt;
      font-family: DSEG14_Classic;
      font-size: min(3.15vw, 41.5px);
      content: "~~~~~~~~~";
    }
  }
}

@media screen and (min-width: $tablet-width) and (max-width: $desktop-width) {
  .display__body__result {
    &--screen {
      width: 87vw;
    }
    &--txt {
      font-size: 4.4vw;
    }
    &--overlay {
      &:after {
        font-size: 4.4vw;
      }
    }
    &--padding-chars {
      &:before {
        font-size: 4.4vw;
      }
    }
  }
}

@media screen and (max-width: $tablet-width) {
  .display__body__result {
    &--screen {
      width: 90vw;
    }
    &--txt {
      font-size: 6.8vw;
    }
    &--overlay {
      &:after {
        font-size: 6.8vw;
        content: "~~~~~~~~~~~~~~~~";
      }
    }
    &--padding-chars {
      &:before {
        font-size: 6.8vw;
        content: "~~~~~";
      }
    }
  }
}

.overlay {
  &__right-aligned {
    position: relative;
    display: flex;
    flex-direction: row-reverse;
    flex-wrap: wrap;
    bottom: 35px;
    max-height: 38px;
    overflow: hidden;
    padding-right: 2px;
    direction: rtl;
    z-index: 1;
  }
  &__left-aligned {
    position: relative;
    display: flex;
    flex-wrap: wrap;
    bottom: 35px;
    max-height: 38px;
    padding-left: 2px;
    overflow: hidden;
    z-index: 1;
  }
}
.txt {
  &__right-aligned {
    display: flex;
    flex-direction: row-reverse;
    flex-wrap: wrap;
    max-height: 38px;
    padding-right: 2px;
    box-sizing: border-box;
    position: relative;
    overflow: hidden;
    z-index: 2;
  }
  &__left-aligned {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    max-height: 38px;
    padding-left: 2px;
    box-sizing: border-box;
    position: relative;
    overflow: hidden;
    z-index: 2;
  }
}

.display__body {
  &--screen {
    max-height: 38px;
  }
  &--txt {
    &--chars {
      margin-bottom: 20px;
    }
  }
  &__overlay {
    &--txt {
      display: flex;
      flex-wrap: wrap;
      max-height: 42px;
      overflow: hidden;
    }
    &--chars {
      color: $digital-display-blank-txt;
      margin-bottom: 20px;
      font-size: 28px;
      font-family: DSEG14_Classic;
    }
  }
}

@media screen and (max-width: $tablet-width) {
  .overlay {
    &__right-aligned {
      bottom: 37px;
    }
    &__left-aligned {
      bottom: 37px;
    }
  }
  .txt {
    &__right-aligned {
      padding-top: 1px;
    }
    &__left-aligned {
      padding-top: 1px;
    }
  }
  .display__body {
    &--screen {
      max-height: 20px;
    }
    &__overlay {
      &--chars {
        font-size: 16px;
      }
    }
  }
}

//Phone
$border-phone: 2px;
$border-radius-phone: 2px;
$padding-body-phone: 1px;
$font-size-body-phone: 23px;

$result-txt-padding-phone: 61px;
$result-font-size-phone: 6.8vw;

//Tablet
$border-tablet: 5px;
$border-radius-tablet: 5px;
$padding-body-tablet: 3px;
$font-size-body-tablet: 23px;

$result-font-size-tablet: 4.4vw;

//Desktop
$border-desktop: 5px;
$border-radius-desktop: 5px;
$padding-body-desktop: 3px;
$font-size-body-desktop: 23px;

$result-font-size-desktop: min(3.15vw, 41.5px);

// -------- PHONE DISPLAY -------- //
@media screen and (max-width: $tablet-width) {
  h1 {
    color: white;
  }
  .display {
    &__header {
      display: flex;

      &--text {
        @include display-header-txt($border-radius-phone, 14px, 11px);
        padding-top: 1px;
        padding-bottom: 3px;
      }
    }

    &__body {
      &__result {
        &--screen {
          @include display-screen($border-phone, $border-radius-phone);
        }
        &--txt {
          @include display-body-txt(
            $padding-body-phone,
            $result-font-size-phone
          );
        }
      }
      &--screen {
        @include display-screen($border-phone, $border-radius-phone);
      }
      &--txt {
        @include display-body-txt($padding-body-phone, $font-size-body-phone);
      }
    }
  }
}

// -------- TABLET DISPLAY -------- //
@media screen and (min-width: $tablet-width) {
  h1 {
    color: white;
  }
  .display {
    &__header {
      display: flex;

      &--text {
        @include display-header-txt($border-radius-tablet, 14px, 11px);
        padding-top: 3px;
      }
    }

    &__body {
      &__result {
        &--screen {
          @include display-screen($border-tablet, $border-radius-tablet);
        }
        &--txt {
          @include display-body-txt(
            $padding-body-tablet,
            $result-font-size-tablet
          );
        }
      }
      &--screen {
        @include display-screen($border-tablet, $border-radius-tablet);
      }
      &--txt {
        @include display-body-txt($padding-body-tablet, $font-size-body-tablet);
      }
    }
  }
}

// -------- DESKTOP DISPLAY -------- //
@media screen and (min-width: $desktop-width) {
  h1 {
    color: white;
  }
  .display {
    &__header {
      display: flex;

      &--text {
        @include display-header-txt($border-radius-desktop, 14px, 11px);
        padding-top: 3px;
      }
    }

    &__body {
      &__result {
        &--screen {
          @include display-screen($border-desktop, $border-radius-desktop);
        }
        &--txt {
          @include display-body-txt(
            $padding-body-desktop,
            $result-font-size-desktop
          );
        }
      }
      &--screen {
        @include display-screen($border-desktop, $border-radius-desktop);
      }
      &--txt {
        @include display-body-txt(
          $padding-body-desktop,
          $font-size-body-desktop
        );
      }
    }
  }
}
</style>