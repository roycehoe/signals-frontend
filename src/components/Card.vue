<script lang="ts" setup>
import { getAssetUrl } from '@/services/assets';

const props = defineProps({
  data: {
    type: String,
  },
});

function getCardImageURL(cardName: string): string {
  return getAssetUrl("graphics/cards", cardName + ".svg");
}
</script>


<template>
  <div class="card" v-if="data">
    <img class="card--img" :src="data ? getCardImageURL(data) : ''" />
  </div>

  <div class="card" v-else>
    <img class="card--blank" :src="getAssetUrl('graphics/cards', 'Red back.svg')" />
  </div>
</template>

<style scoped lang="scss">
@import "src/styles/variables.scss";

.card {
  &--img {
    font-size: 0px;
    width: 100%;
    min-width: min(30vw, 400px);
  }
  &--blank {
    font-size: 0px;
    width: 100%;
    min-width: min(30vw, 400px);
  }
}

@media screen and (max-width: $desktop-width) {
  .card {
    &--img {
      min-width: auto;
      width: max(30vw, 100px);
    }
    &--blank {
      min-width: auto;
      width: max(30vw, 100px);
    }
  }
}

@media screen and (max-width: $tablet-width) {
  .card {
    &--img {
      font-size: 0px;
      width: 100%;
    }
    &--blank {
      font-size: 0px;
      width: 100%;
    }
  }
}
</style>