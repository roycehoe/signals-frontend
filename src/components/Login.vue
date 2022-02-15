<script lang="ts" setup>
import { ref } from "vue";
import router from "@/router";
import { ErrorCode, ErrorMsg } from "@/services/errors";
import { AuthUserRequest, AuthUserResponse, getAuthUserResponse } from "@/services/user/getAuthUserResponse";

const loginForm = ref({} as AuthUserRequest);
const errorDisplay = ref("");
const isLoading = ref(false)

async function login(): Promise<void> {
  errorDisplay.value = ""
  isLoading.value = true
  const { ok: isSuccessful, val: response } = await getAuthUserResponse(
    loginForm.value
  );

  if (isSuccessful) {
    const { access_token: token } = response as AuthUserResponse;
    localStorage.removeItem("token");
    localStorage.setItem("token", token);
    router.push({
      path: '/play',
    })
    return;
  }
  switch (response) {
    case ErrorCode.INVALID_CREDENTIALS:
      errorDisplay.value = ErrorMsg.INVALID_CREDENTIALS;
      break;
    default:
      errorDisplay.value = ErrorMsg.SOMETHING_WENT_WRONG;
  }
  isLoading.value = false
}
</script>

<template>
  <div class="login-display">
    <form class="loginForm" @submit.prevent="login">
      <div class="loginForm__username">
        <input
          class="loginForm__username--greyInput"
          type="text"
          v-model="loginForm.username"
          placeholder="Username"
          autocomplete="off"
          maxlength="20"
          required="true"
        />
      </div>

      <div class="loginForm__password">
        <input
          class="loginForm__password loginForm__password--input"
          type="password"
          v-model="loginForm.password"
          placeholder="Password"
          autocomplete="off"
          maxlength="20"
          required="true"
        />
      </div>
      <div class="loginBox__credentialsError">
        <p class="loginBox__credentialsError--msg">{{ errorDisplay }}</p>
      </div>

      <div class="loginForm__loginButton">
        <button v-if="!isLoading" class="loginForm__loginButton--greenButton" type="submit">Log in</button>
        <button v-else class="loginForm__loginButton--loading" disabled>Loading...</button>
      </div>
    </form>

    <div class="createAccount">
      <div class="createAccount__question">
        <p class="createAccount__question--txt">Don't have an account yet?</p>
      </div>

      <div class="createAccount__link">
        <router-link class="createAccount__link--txt" to="/new">Create an account</router-link>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@import "@/styles/variables.scss";
//--------MEDIA AGNOSTIC FORMATTING--------//

.loginForm {
  display: flex;
  flex-direction: column;
  width: 100%;

  &__loginButton {
    &--loading {
      width: 100%;
      background-color: $green-btn-loading;
      color: $btn-txt;
    }
    &--greenButton {
      width: 100%;
      background-color: $green-btn-home;
      color: $btn-txt;
      &:hover {
        background-color: $green-btn-home-hover;
      }
    }
  }
}

.loginBox__credentialsError {
  &--msg {
    color: $red-warning-txt;
    font-style: italic;
  }
}

.createAccount {
  display: flex;
  flex-direction: column;
  align-items: center;

  &__question {
    color: $supporting-text;
  }

  &__link {
    &--txt {
      &:hover {
        color: $btn-txt-hover;
      }
    }
  }
}

// -------- PHONE DISPLAY -------- //
@media screen and (max-width: $tablet-width) {
  .loginForm {
    &__username {
      &--greyInput {
        font-size: 18px;
        height: 40px;
      }
    }
    &__password {
      &--input {
        font-size: 18px;
        height: 40px;
        margin-top: 20px;
      }
    }

    &__loginButton {
      margin-top: 20px;

      &--greenButton {
        font-size: 18px;
        height: 40px;
      }
      &--loading {
        font-size: 18px;
        height: 40px;
      }
    }
  }

  .loginBox__credentialsError {
    &--msg {
      margin-top: 2px;
      height: 12px;
      font-size: 14px;
      line-height: 0.8;
    }
  }

  .createAccount {
    padding-top: 20px;

    &__question {
      &--txt {
        font-size: 16px;
      }
    }
    &__link {
      &--txt {
        font-size: 16px;
        line-height: 30px;
      }
    }
  }
}

// -------- TABLET DISPLAY -------- //
@media screen and (min-width: $tablet-width) {
  .loginForm {
    &__username {
      &--greyInput {
        font-size: 18px;
        height: 48px;
      }
    }
    &__password {
      &--input {
        font-size: 18px;
        height: 48px;
        margin-top: 24px;
      }
    }

    &__loginButton {
      margin-top: 24px;

      &--greenButton {
        font-size: 18px;
        height: 41px;
      }
      &--loading {
        font-size: 18px;
        height: 41px;
      }
    }
  }

  .loginBox__credentialsError {
    &--msg {
      margin-top: 2px;
      height: 24px;
      font-size: 18px;
      line-height: 0.8;
    }
  }

  .createAccount {
    padding-top: 21px;

    &__question {
      &--txt {
        font-size: 18px;
      }
    }
    &__link {
      font-size: 18px;
      &--txt {
        font-size: 18px;
        line-height: 0px;
      }
    }
  }
}

// -------- DESKTOP DISPLAY -------- //
@media screen and (min-width: $desktop-width) {
  .loginForm {
    &__password {
      &--input {
        margin-top: 20px;
      }
    }

    &__loginButton {
      margin-top: 10px;

      &--greenButton {
        height: 40px;
      }
      &--loading {
        height: 40px;
      }
    }
  }

  .loginBox__credentialsError {
    &--msg {
      height: 20px;
      font-size: 18px;
    }
  }

  .createAccount {
    padding-top: 20px;

    &__question {
      font-size: 20px;
    }
  }
}
</style>