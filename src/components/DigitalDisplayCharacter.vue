<script lang="ts" setup>

const props = defineProps({
  content: {
    type: String,
    required: true,
  },
});
</script>

<template>
  <p class="digital-display-character--blank-txt" v-if="content === '~'">{{ content }}</p>
  <p class="digital-display-character--red-txt" v-else>{{ content }}</p>
</template>

<style scoped lang="scss">
@import "../styles/variables.scss";

.digital-display-character--blank-txt {
  font-family: DSEG14_Classic;
  color: $digital-display-blank-txt;
  font-size: 28px;
}
.digital-display-character--red-txt {
  font-family: DSEG14_Classic;
  color: $digital-display-red-txt;
  font-size: 28px;
}

.digital-display-character--overlay {
  position: relative;
  bottom: 10px;
  font-size: 28px;
}

@media screen and (max-width: $tablet-width) {
  .digital-display-character {
    &--blank-txt {
      font-size: 16px;
    }
    &--red-txt {
      font-size: 16px;
    }
  }
}
</style>