<script lang="ts" setup>
import { onBeforeMount, ref } from 'vue';
import { ErrorCode } from '@/services/errors';
import { GameChoicesRequest, GameChoicesResponse, getGameChoicesResponse, Prediction } from '@/services/game/getGameChoicesResponse';
import { GameInfoResponse, getGameInfoResponse } from '@/services/game/getGameInfoResponse';
import { getGameResultDisplay } from '@/services/game/getGameResultDisplay';
import { getStartRoundResponse } from '@/services/game/getStartRoundResponse';
import DigitalDisplay from '@/components/DigitalDisplay.vue'
import Card from '@/components/Card.vue'
import router from '@/router';
import { getAssetUrl } from '@/services/assets';

const MIMIMUM_BET = 10;
const hasRoundEnded = ref(false);
const showRules = ref(false);
const gameInfo = ref({} as GameInfoResponse);
const gameChoices = ref({ bet: MIMIMUM_BET } as GameChoicesRequest);
const gameResult = ref({} as GameChoicesResponse);
const isLoading = ref(false)


function clickAudio() {
  const audio = new Audio(getAssetUrl('sounds', 'button-sound.mp3'))
  audio.play()
}

function dealCardAudio() {
  const audio = new Audio(getAssetUrl('sounds', 'deal-card.mp3'))
  audio.play()
}

async function showGameInfo() {
  const { ok: isSuccessful, val: response } = await getGameInfoResponse()
  if (isSuccessful) {
    gameInfo.value = response as GameInfoResponse
    return
  }
  switch (response) {
    case ErrorCode.GAME_NOT_CREATED:
      showNewRoundData()
      break
    default:
      console.error(response)
  }
}

async function showNewRoundData() {
  gameChoices.value.bet = MIMIMUM_BET

  const { ok: isSuccessful, val: response } = await getStartRoundResponse()
  if (isSuccessful) {
    hasRoundEnded.value = false
    gameInfo.value = response as GameInfoResponse
    return
  }
  switch (response) {
    case ErrorCode.ROUND_NOT_ENDED:
      showGameInfo()
      break
    default:
      console.error(response)
  }
}

async function concludeRound(playerPrediction: Prediction) {
  isLoading.value = true
  gameChoices.value.prediction = playerPrediction

  const { ok: isSuccessful, val: response } = await getGameChoicesResponse(gameChoices.value)
  if (isSuccessful) {
    isLoading.value = false
    gameResult.value = response as GameChoicesResponse
    hasRoundEnded.value = true
    setTimeout(() => { showNewRoundData() }, 4000)
    dealCardAudio()
    return
  }
  switch (response) {
    case ErrorCode.ROUND_NOT_STARTED:
      showNewRoundData()
      break
    case ErrorCode.MISSING_FIELD_VALUES:
      showNewRoundData()
      break
    default:
      console.error(response)
  }
}


function isTotalBetMoreThanMoney(increment: number) {
  return gameChoices.value.bet + increment > gameInfo.value.money;
}

function isTotalBetLessThanMinimum(increment: number) {
  return gameChoices.value.bet + increment < MIMIMUM_BET;
}

function incrementBet(increment: number): void {
  clickAudio()
  if (isTotalBetMoreThanMoney(increment)) {
    gameChoices.value.bet = gameInfo.value.money;
  } else if (isTotalBetLessThanMinimum(increment)) {
    gameChoices.value.bet = MIMIMUM_BET;
  } else {
    gameChoices.value.bet += increment;
  }
}

function logOut() {
  localStorage.removeItem("token");
  router.push({
    path: '/',
  })
}


onBeforeMount(async () => await showGameInfo());
</script>


<template>
  <div class="gameBackground">
    <img
      class="gameBackground--img"
      :src="getAssetUrl('graphics/background-images', 'Cloth-background-desktop.png')"
    />
  </div>

  <div class="rules" v-if="showRules">
    <div class="rules--overlay"></div>
    <div class="rules__displaybox">
      <div class="rules__displaybox--text">
        <p class="rules__displaybox--header">Rules:</p>
        <ol class="rules__displaybox--body">
          <li>At the start of the round, a card is dealt.</li>
          <li>Place your bet.</li>
          <li>Choose whether the next card will be higher or lower.</li>
          <li>The next card will be dealt.</li>
          <li>If you predicted correctly, you will win double your stake.</li>
          <li>If you predicted incorrectly, your stake will be lost.</li>
        </ol>
      </div>
      <button class="rules__displaybox--closebtn" @click="showRules = false">Close</button>
    </div>
  </div>

  <div class="game">
    <div class="menu">
      <div class="logout">
        <button class="logout__button" @click="logOut()">
          <img class="logout__button--img" :src="getAssetUrl('graphics', 'logout-icon.png')" />
        </button>
      </div>
      <div class="gameDisplay__rulesBtn">
        <button class="gameDisplay__rulesBtn--txt" @click="showRules = true ; clickAudio()">?</button>
      </div>
    </div>
    <div class="gameDisplay--grid">
      <div v-if="isLoading" class="gameDisplay__digitalDisplay--result">
        <DigitalDisplay :data="{ content: 'loading' }"></DigitalDisplay>
      </div>

      <div v-else class="gameDisplay__digitalDisplay--result">
        <DigitalDisplay
          :data="{ content: hasRoundEnded ? getGameResultDisplay(gameResult.win, gameChoices.prediction) : '' }"
        ></DigitalDisplay>
      </div>

      <div class="gameDisplay__logo">
        <img class="gameDisplay__logo--small" :src="getAssetUrl('graphics', 'logo.png')" />
      </div>

      <div class="gameDisplay__card">
        <Card
          class="gameDisplay__baseCard"
          :data="gameInfo.base_card ? gameInfo.base_card?.name : 'Red back'"
        ></Card>
        <Card
          class="gameDisplay__nextCard"
          :data="hasRoundEnded ? gameResult.next_card.name : 'Red back'"
        ></Card>
      </div>

      <DigitalDisplay
        class="gameDisplay__money"
        :data="{ content: gameInfo.money ? `${gameInfo.money}` : 'Loading', header: 'money', isRightAligned: true }"
      ></DigitalDisplay>

      <DigitalDisplay
        class="gameDisplay__round"
        :data="{ content: gameInfo.round ? `${gameInfo.round}` : 'Loading', header: 'round', isRightAligned: true }"
      ></DigitalDisplay>

      <DigitalDisplay
        class="gameDisplay__name"
        :data="{ content: gameInfo.player_name ? `${gameInfo.player_name}` : 'Loading', header: 'username', isRightAligned: false }"
      ></DigitalDisplay>

      <DigitalDisplay
        class="gameDisplay__bet"
        :data="{ content: gameChoices.bet ? `${gameChoices.bet}` : 'Loading', header: 'bet', isRightAligned: true }"
      ></DigitalDisplay>

      <div class="gameDisplay__betBtn__plusMinus10Group">
        <button
          class="gameDisplay__betBtn--silver gameDisplay__betBtn__minus10"
          type="button"
          @click="incrementBet(-10)"
        >− 10</button>

        <button
          class="gameDisplay__betBtn--gold gameDisplay__betBtn__plus10"
          type="button"
          @click="incrementBet(10)"
        >+ 10</button>
      </div>

      <div class="gameDisplay__betBtn__plusMinus100Group">
        <button
          class="gameDisplay__betBtn--silver gameDisplay__betBtn__minus100"
          type="button"
          @click="incrementBet(-100)"
        >− 100</button>

        <button
          class="gameDisplay__betBtn--gold gameDisplay__betBtn__plus100"
          type="button"
          @click="incrementBet(100)"
        >+ 100</button>
      </div>

      <div class="gameDisplay__betBtn__plusMinus1000Group">
        <button
          class="gameDisplay__betBtn--silver gameDisplay__betBtn__minus1000"
          type="button"
          @click="incrementBet(-1000)"
        >− 1000</button>

        <button
          class="gameDisplay__betBtn--gold gameDisplay__betBtn__plus1000"
          type="button"
          @click="incrementBet(1000)"
        >+ 1000</button>
      </div>

      <div class="gameDisplay__predictionGroup">
        <form
          class="gameDisplay__predictLowerBtn"
          @submit.prevent="concludeRound(Prediction.LOWER)"
        >
          <button
            class="gameDisplay__predictLowerBtn--red"
            type="submit"
            @click="concludeRound(Prediction.LOWER)"
            :disabled="hasRoundEnded"
          >LOWER</button>
        </form>

        <form
          class="gameDisplay__predictHigherBtn"
          @submit.prevent="concludeRound(Prediction.HIGHER)"
        >
          <button
            class="gameDisplay__predictHigherBtn--green"
            type="submit"
            @click="concludeRound(Prediction.HIGHER)"
            :disabled="hasRoundEnded"
          >HIGHER</button>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@import "@/styles/variables.scss";
@import "@/styles/buttons.scss";
@import "@/styles/rules.scss";

//--------MEDIA AGNOSTIC FORMATTING--------//
.gameBackground {
  position: absolute;

  &--img {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: -10;
  }
}

.gameDisplay {
  &--grid {
    display: grid;
  }
}

.gameDisplay {
  &__decreaseBetBtn {
    display: flex;
    flex-direction: column;
  }
  &__increaseBetBtn {
    display: flex;
    flex-direction: column;
  }
  &__predictLowerBtn {
    display: flex;
    align-items: flex-end;
  }
  &__predictHigherBtn {
    display: flex;
    align-items: flex-end;
  }
}

.rules {
  &--overlay {
    @include rules-overlay;
    z-index: 3;
  }
  &__displaybox {
    text-align: left;
    z-index: 3;
  }
}

.gameDisplay {
  &__rulesBtn {
    display: inline-block;
  }
}
.logout {
  display: inline-block;
  margin-right: 10px;
  &__button {
    background: transparent;
    height: 35px;
    width: 35px;
    background-color: $rules-btn;
    border-radius: 100%;
    &:hover {
      background-color: $rules-btn-hover;
    }

    &--img {
      width: 12px;
      height: 12px;
    }
  }
}

.game {
  display: grid;
  grid-template-areas:
    "menu"
    "game";
  justify-content: center;
  align-items: center;
  max-width: 1411px;
  margin-left: auto;
  margin-right: auto;
}
.menu {
  grid-area: menu;
  text-align: right;
  margin-bottom: 10px;
}

// -------- PHONE DISPLAY -------- //
@media screen and (max-width: $tablet-width) {
  .game {
    margin-left: 10px;
    margin-right: 10px;
    margin-top: 5px;
  }
  .gameDisplay {
    &--grid {
      grid-area: game;
      grid-column-gap: 10px;
      grid-template-areas:
        "result result result result"
        "card card card card"
        "money money money round"
        "bet bet bet bet"
        "minus10 minus10 plus10 plus10"
        "minus100 minus100 plus100 plus100"
        "minus1000 minus1000 plus1000 plus1000"
        "predict-lower predict-lower predict-higher predict-higher";
    }
  }

  .gameDisplay {
    &__digitalDisplay {
      &--result {
        grid-area: result;
      }
    }
    &__logo {
      display: none;
    }
    &__card {
      grid-area: card;
      display: grid;
      grid-template-areas: "base-card next-card";
      margin-top: 20px;
    }
    &__baseCard {
      grid-area: "base-card";
      height: 100%;
      margin-right: 10px;
    }
    &__nextCard {
      grid-area: "next-card";
      height: 100%;
      margin-left: 10px;
    }
    &__money {
      grid-area: money;
      margin-top: 15px;
    }
    &__round {
      grid-area: round;
      margin-top: 15px;
    }
    &__name {
      display: none;
      margin-top: 10px;
    }
    &__bet {
      grid-area: bet;
      margin-top: 10px;
    }
    &__betBtn {
      &__plusMinus10Group {
        display: contents;
      }
      &__plusMinus100Group {
        display: contents;
      }
      &__plusMinus1000Group {
        display: contents;
      }
      &__plus10 {
        grid-area: plus10;
      }
      &__minus10 {
        grid-area: minus10;
      }
      &__plus100 {
        grid-area: plus100;
      }
      &__minus100 {
        grid-area: minus100;
      }
      &__plus1000 {
        grid-area: plus1000;
      }
      &__minus1000 {
        grid-area: minus1000;
      }
      &--silver {
        font-size: 16px;
        @include button-border-silver(2px, 2px);
        height: max(4vh, 35px);
        margin-top: 2vh;
        margin-right: 5px;
      }
      &--gold {
        font-size: 16px;
        @include button-border-gold(2px, 2px);
        height: max(4vh, 35px);
        margin-top: 2vh;
        margin-left: 5px;
      }
    }
    &__predictionGroup {
      display: contents;
    }
    &__predictLowerBtn {
      grid-area: predict-lower;
      &--red {
        font-size: 16px;
        @include button(100%, 35px);
        @include button-border-red(2px, 5px);
        margin-top: 2vh;
        margin-right: 5px;
        height: max(6vh, 55px);
      }
    }
    &__predictHigherBtn {
      grid-area: predict-higher;
      &--green {
        font-size: 16px;
        @include button(100%, 35px);
        @include button-border-green(2px, 5px);
        margin-top: 2vh;
        margin-left: 5px;
        height: max(6vh, 55px);
      }
    }
    &__rulesBtn {
      &--txt {
        @include rules-open-btn(24px, 12px);
        font-size: 16px;
      }
    }
  }

  .rules {
    display: flex;
    justify-content: center;
    &__displaybox {
      @include rules-displaybox(2px, 12px);
      top: 30%;
      padding: 24px 30px;

      &--header {
        font-size: 12px;
      }

      &--body {
        line-height: 1.8;
        padding-inline-start: 15px;
      }

      &--closebtn {
        @include rules-close-btn(2px);
        font-size: 12px;
        padding: 4px 19px;
      }
    }
  }
  .logout {
    &__button {
      background: transparent;
      @include rules-open-btn(26px, 12px);
      &--img {
        width: 12px;
        height: 12px;
      }
    }
  }
}

// -------- TABLET DISPLAY -------- //
@media screen and (min-width: $tablet-width) {
  .game {
    margin-right: 50px;
    margin-left: 50px;
  }
  .gameDisplay {
    &--grid {
      grid-column-gap: 20px;
      grid-template-columns: repeat(6, auto);
      grid-template-rows: repeat(7, auto);
      grid-template-areas:
        ". logo logo logo logo ."
        "result result result result result result"
        "card card card card card card"
        "money money round plusMinus10Group plusMinus10Group plusMinus10Group"
        "name name name plusMinus100Group plusMinus100Group plusMinus100Group"
        "bet bet bet plusMinus1000Group plusMinus1000Group plusMinus1000Group"
        ". . . predictionGroup predictionGroup predictionGroup";
    }
  }

  .gameDisplay {
    &__digitalDisplay {
      &--result {
        grid-area: result;
      }
    }
    &__logo {
      grid-area: logo;
      text-align: center;
      &--small {
        width: 100%;
      }
    }
    &__card {
      grid-area: card;
      display: grid;
      grid-template-areas: "base-card next-card";
      grid-column-gap: 56px;
      font-size: 0px;
      margin-top: 23px;
      justify-content: space-evenly;
    }
    &__baseCard {
      grid-area: base-card;
      height: 100%;
    }
    &__nextCard {
      grid-area: next-card;
      height: 100%;
    }
    &__money {
      grid-area: money;
      margin-top: 37px;
    }
    &__round {
      grid-area: round;
      margin-top: 37px;
    }
    &__name {
      grid-area: name;
      margin-top: 24px;
    }
    &__bet {
      grid-area: bet;
      margin-top: 24px;
    }
    &__btns {
      &--grid {
        margin-top: 36px;
        display: grid;
      }
    }
    &__betBtn {
      &__plusMinus10Group {
        margin-top: 50px;
        grid-area: plusMinus10Group;
        display: flex;
        justify-content: space-between;
      }
      &__plusMinus100Group {
        margin-top: 37px;
        grid-area: plusMinus100Group;
        display: flex;
        justify-content: space-between;
      }
      &__plusMinus1000Group {
        grid-area: plusMinus1000Group;
        display: flex;
        justify-content: space-between;
        margin-top: 37px;
      }
      &--silver {
        font-size: 16px;
        @include button-border-silver(2px, 2px);
        height: 49px;
        width: 100%;
        margin-right: 23px;
      }
      &--gold {
        font-size: 16px;
        @include button-border-gold(2px, 2px);
        height: 49px;
        width: 100%;
      }
    }
    &__predictionGroup {
      grid-area: predictionGroup;
      display: flex;
      justify-content: space-between;
    }
    &__predictLowerBtn {
      width: 100%;
      margin-top: 42px;
      margin-right: 23px;
      &--red {
        font-size: 16px;
        @include button(100%, 35px);
        @include button-border-red(2px, 5px);
        height: 52px;
      }
    }
    &__predictHigherBtn {
      width: 100%;
      margin-top: 42px;
      &--green {
        font-size: 16px;
        @include button(100%, 35px);
        @include button-border-green(2px, 5px);
        height: 52px;
      }
    }
    &__rulesBtn {
      &--txt {
        @include rules-open-btn(35px, 16px);
        font-size: 20px;
      }
    }
  }

  .rules {
    display: flex;
    justify-content: center;
    &__displaybox {
      @include rules-displaybox(2px, 16px);
      top: 30%;
      padding: 40px 60px;

      &--header {
        font-size: 16px;
      }

      &--body {
        line-height: 1.8;
        padding-inline-start: 15px;
      }

      &--closebtn {
        @include rules-close-btn(2px);
        font-size: 16px;
        padding: 10px 24px;
      }
    }
  }
}

// -------- DESKTOP DISPLAY -------- //
@media screen and (min-width: $desktop-width) {
  .game {
    margin-right: auto;
    margin-left: auto;
  }
  .gameDisplay {
    &--grid {
      grid-area: game;
      margin-top: 0px;
      margin-right: 0px;
      margin-left: 0px;
      grid-column-gap: 30px;
      grid-template-areas:
        "result result result result result result result result logo logo logo logo"
        "base-card base-card base-card base-card next-card next-card next-card next-card money money money round"
        "base-card base-card base-card base-card next-card next-card next-card next-card name name name name"
        "base-card base-card base-card base-card next-card next-card next-card next-card bet bet bet bet"
        "base-card base-card base-card base-card next-card next-card next-card next-card minus10 minus10 plus10 plus10"
        "base-card base-card base-card base-card next-card next-card next-card next-card minus100 minus100 plus100 plus100"
        "base-card base-card base-card base-card next-card next-card next-card next-card minus1000 minus1000 plus1000 plus1000"
        "base-card base-card base-card base-card next-card next-card next-card next-card predict-lower predict-lower predict-higher predict-higher";
    }
  }

  .gameDisplay {
    &__digitalDisplay {
      &--result {
        grid-area: result;
        display: flex;
        flex-direction: column;
        justify-content: center;
      }
    }
    &__logo {
      grid-area: logo;
      &--small {
        width: 100%;
        max-width: 335px;
        max-height: 125px;
      }
    }
    &__card {
      display: contents;
    }
    &__baseCard {
      grid-area: base-card;
      display: flex;
      flex-direction: column;
      justify-content: center;
    }
    &__nextCard {
      grid-area: next-card;
      display: flex;
      flex-direction: column;
      justify-content: center;
    }
    &__money {
      grid-area: money;
      max-width: 676px;
    }
    &__round {
      grid-area: round;
      max-width: 238px;
    }
    &__name {
      grid-area: name;
      max-width: 944px;
    }
    &__bet {
      grid-area: bet;
      max-width: 944px;
    }
    &__betBtn {
      &__plusMinus10Group {
        display: contents;
      }
      &__plusMinus100Group {
        display: contents;
      }
      &__plusMinus1000Group {
        display: contents;
      }
      &__minus10 {
        grid-area: minus10;
        max-width: 458px;
        margin-top: 40px;
        margin-bottom: 20px;
      }
      &__plus10 {
        grid-area: plus10;
        max-width: 455px;
        margin-top: 40px;
        margin-bottom: 20px;
      }
      &__plus100 {
        grid-area: plus100;
        max-width: 458px;
        margin-bottom: 20px;
      }
      &__minus100 {
        grid-area: minus100;
        max-width: 455px;
        margin-bottom: 20px;
      }
      &__plus1000 {
        grid-area: plus1000;
        max-width: 458px;
        margin-bottom: 20px;
      }
      &__minus1000 {
        grid-area: minus1000;
        max-width: 455px;
        margin-bottom: 20px;
      }
      &--silver {
        @include button-border-silver(2px, 5px);
        font-size: 24px;
      }
      &--gold {
        @include button-border-gold(2px, 5px);
        font-size: 24px;
      }
    }
    &__predictionGroup {
      display: contents;
    }
    &__predictLowerBtn {
      grid-area: predict-lower;
      height: inherit;
      &--red {
        @include button(100%, 80px);
        @include button-border-red(2px, 5px);
        max-width: 458px;
        font-size: 24px;
      }
    }
    &__predictHigherBtn {
      grid-area: predict-higher;
      &--green {
        @include button(100%, 80px);
        @include button-border-green(2px, 5px);
        max-width: 458px;
        font-size: 24px;
      }
    }
    &__rulesBtn {
      display: inline-block;
      &--txt {
        @include rules-open-btn(35px, 16px);
        font-size: 20px;
      }
    }
  }

  .rules {
    &__displaybox {
      @include rules-displaybox(5px, 18px);
      padding: 40px 65px;

      &--header {
        font-size: 18px;
      }

      &--body {
        line-height: 1.8;
        padding-inline-start: 25px;
      }

      &--closebtn {
        @include rules-close-btn(2px);
        font-size: 16px;
        padding: 8px 38px;
      }
    }
  }
}

@media screen and (min-width: $tablet-width) and (max-width: $desktop-width) {
  .gameDisplay {
    &__betBtn {
      &__plusMinus10Group {
        width: 42vw;
      }
    }
  }
  .gameDisplay {
    &__logo {
      &--small {
        width: 40vw;
        margin-bottom: 30px;
      }
    }
  }
}
</style>