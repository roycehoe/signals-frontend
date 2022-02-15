<script lang="ts" setup>
import { ref } from "vue";
import { ErrorCode, ErrorMsg } from "@/services/errors";
import { CreateUserRequest, getCreateUserResponse } from "@/services/user/getCreateUserResponse";

const newUserForm = ref({} as CreateUserForm);
const errorDisplay = ref("");
const isLoading = ref(false)
const accountCreated = ref(false);

interface CreateUserForm extends CreateUserRequest {
  confirmPassword: string;
}

async function createAccount(): Promise<void> {
  isLoading.value = true
  if (newUserForm.value.password != newUserForm.value.confirmPassword) {
    errorDisplay.value = ErrorMsg.NON_MATCHING_PASSWORDS;
    isLoading.value = false
    return
  }
  const { ok: isSuccessful, val: response } = await getCreateUserResponse(
    newUserForm.value
  );
  if (isSuccessful) {
    accountCreated.value = true;
    isLoading.value = false
    return;
  }
  switch (response) {
    case ErrorCode.USERNAME_TAKEN:
      errorDisplay.value = ErrorMsg.USERNAME_TAKEN;
      break;
    default:
      errorDisplay.value = ErrorMsg.SOMETHING_WENT_WRONG;
  }
  isLoading.value = false
}

</script>

<template>
  <form class="createAccountForm" v-if="!accountCreated" @submit.prevent="createAccount">
    <div class="createAccountForm__Input">
      <input
        class="createAccountForm__Input--Username"
        type="text"
        id="username"
        v-model="newUserForm.username"
        placeholder="New Username"
        autocomplete="off"
        required="true"
        maxlength="20"
      />

      <input
        class="createAccountForm__Input--Password"
        type="password"
        id="pasword"
        v-model="newUserForm.password"
        placeholder="Password"
        autocomplete="off"
        required="true"
        maxlength="20"
      />

      <input
        class="createAccountForm__Input--Confirmpassword"
        type="password"
        id="confirmPasword"
        v-model="newUserForm.confirmPassword"
        placeholder="Confirm Password"
        autocomplete="off"
        required="true"
        maxlength="20"
      />
    </div>

    <div class="createAccountForm__submissionError">
      <p class="createAccountForm__submissionError--msg">{{ errorDisplay }}</p>
    </div>

    <div class="createAccountForm__btn">
      <button v-if="!isLoading" class="createAccountForm__btn--green" type="submit">
        <p class="createAccountForm__btn__txt">Create Account</p>
      </button>

      <button v-else class="createAccountForm__btn--loading" type="submit">
        <p class="createAccountForm__btn__txt">Loading...</p>
      </button>
    </div>

    <button class="createAccountForm__btn--grey" @click="$router.push('/')" type="button">
      <p class="createAccountForm__btn__txt">Return to Main Menu</p>
    </button>
  </form>

  <div class="createAccountSuccess" v-else>
    <p class="createAccountSuccess__txt">Account successfully created</p>
    <button class="createAccountForm__btn--grey" @click="$router.push('/')" type="button">
      <p class="createAccountForm__btn__txt">Return to Main Menu</p>
    </button>
  </div>
</template>

<style scoped lang="scss">
@import "@/styles/variables.scss";

//--------MEDIA AGNOSTIC FORMATTING--------//
.createAccountForm {
  display: flex;
  flex-direction: column;
  width: 100%;

  &__submissionError {
    &--msg {
      color: $red-warning-txt;
      font-style: italic;
    }
  }

  &__btn {
    &--green {
      width: 100%;
      background-color: $green-btn-home;
      color: $btn-txt;

      &:hover {
        background-color: $green-btn-home-hover;
      }
    }
    &--loading {
      width: 100%;
      background-color: $green-btn-loading;
      color: $btn-txt;
    }

    &--grey {
      width: 100%;
      background-color: $grey-btn;
      color: $btn-txt;
      &:hover {
        background-color: $grey-btn-hover;
      }
    }
    &__txt {
      font-weight: 600;
    }
  }
}

.createAccountSuccess {
  &__txt {
    display: flex;
    flex-direction: column;
    align-items: center;
    color: $supporting-text;
  }
}

// -------- PHONE DISPLAY -------- //
@media screen and (max-width: $tablet-width) {
  .createAccountForm {
    &__Input {
      &--Username {
        font-size: 18px;
        height: 40px;
      }
      &--Password {
        font-size: 18px;
        height: 40px;
        margin-top: 20px;
      }
      &--Confirmpassword {
        font-size: 18px;
        height: 40px;
        margin-top: 20px;
      }
    }
    &__submissionError {
      &--msg {
        margin-top: 2px;
        height: 12px;
        font-size: 14px;
        line-height: 0.8;
      }
    }

    &__btn {
      &__txt {
        font-size: 18px;
      }
      &--green {
        font-size: 18px;
        height: 40px;
        margin-top: 20px;
      }
      &--loading {
        font-size: 18px;
        height: 40px;
      }

      &--grey {
        font-size: 18px;
        height: 40px;
        margin-top: 20px;
      }
    }
  }
  .createAccountSuccess {
    &__txt {
      font-size: 18px;
    }
  }
}

// -------- TABLET DISPLAY -------- //
@media screen and (min-width: $tablet-width) {
  .createAccountForm {
    &__Input {
      &--Username {
        font-size: 18px;
        height: 48px;
      }
      &--Password {
        font-size: 18px;
        height: 48px;
        margin-top: 24px;
      }
      &--Confirmpassword {
        font-size: 18px;
        height: 48px;
        margin-top: 24px;
      }
    }

    &__submissionError {
      &--msg {
        height: 24px;
        font-size: 18px;
      }
    }

    &__btn {
      &__txt {
        font-size: 18px;
      }
      &--green {
        margin-top: 24px;
        height: 39px;
      }
      &--loading {
        margin-top: 24px;
        height: 39px;
      }

      &--grey {
        margin-top: 21px;
        height: 39px;
      }
    }
  }
  .createAccountSuccess {
    &__txt {
      font-size: 18px;
    }
  }
}

// -------- DESKTOP DISPLAY -------- //
@media screen and (min-width: $desktop-width) {
  .createAccountForm {
    &__Input {
      &--Password {
        margin-top: 20px;
      }
      &--Confirmpassword {
        margin-top: 20px;
      }
    }

    &__submissionError {
      &--msg {
        height: 20px;
        font-size: 18px;
      }
    }

    &__btn {
      &--green {
        margin-top: 10px;
        height: 40px;
      }
      &--loading {
        margin-top: 10px;
        height: 40px;
      }

      &--grey {
        margin-top: 20px;
        height: 40px;
      }
    }
  }
  .createAccountSuccess {
    &__txt {
      font-size: 20px;
    }
  }
}
</style>