<template>
  <VDialog persistent max-width="600px" v-model="localValue">
    <VCard>
      <VCardTitle class="headline">New Translation</VCardTitle>
      <VCardText>
        <VContainer>
          <VForm v-model="formValid">
            <VRow>
              <VCol>
                <VTextField
                  label="Translation key"
                  v-model="formTranslationKey"
                  :counter="256"
                  :rules="[validateTranslationKey]"
                  @input="keyInput"
                  hint="Required. Must be unique per language."
                ></VTextField>
              </VCol>
              <VCol>
                <VTextField
                  label="Language"
                  v-model="formTranslationLang"
                  :counter="16"
                  @input="languageInput"
                  :rules="[validateTranslationLang]"
                  hint="Required. Must be unique per language."
                ></VTextField>
              </VCol>
            </VRow>
            <VRow>
              <VCol>
                <VTextField
                  label="Value"
                  v-model="formTranslationValue"
                  :counter="512"
                  :rules="[validateTranslationValue]"
                  hint="Required."
                ></VTextField>
              </VCol>
            </VRow>
          </VForm>
          <p>
            Translations which do not have a translation in English (en_us)
            cannot be selected elsewhere.
          </p>
          <VAlert
            type="warning"
            v-if="
              initialTranslationKey &&
                formTranslationKey !== initialTranslationKey
            "
          >
            Quickplay elements reference Translations by their key. You should
            not change a Translation's key unless you know what you are doing.
          </VAlert>
          <div class="action-btns">
            <VBtn class="cancel-btn" @click="cancelClicked">
              Cancel
            </VBtn>
            <VBtn
              class="submit-btn"
              color="primary"
              @click="submit"
              :disabled="!formValid"
            >
              Submit
            </VBtn>
          </div>
        </VContainer>
      </VCardText>
    </VCard>
  </VDialog>
</template>

<script>
import { AlterTranslationAction } from "@quickplaymod/quickplay-actions-js";
export default {
  name: "TranslationCreateDialog",
  props: {
    value: {
      type: Boolean,
      required: true
    },
    initialTranslationKey: {
      type: String,
      default: ""
    },
    initialTranslationLang: {
      type: String,
      default: ""
    },
    initialTranslationValue: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      formValid: false,
      formTranslationKey: this.initialTranslationKey,
      formTranslationLang: this.initialTranslationLang,
      formTranslationValue: this.initialTranslationValue
    };
  },
  computed: {
    localValue: {
      get() {
        if (this.value) {
          this.reset();
        }
        return this.value;
      },
      set(newVal) {
        this.$emit("input", newVal);
      }
    }
  },
  methods: {
    validateTranslationKey(key) {
      if (!key) {
        return "This field is required.";
      }
      if (!key.startsWith("quickplay.")) {
        return 'This field must start with "quickplay.".';
      }
      if (key.length > 256) {
        return "This field must be less than or equal to 256 characters in length.";
      }
      if (
        this.formTranslationLang &&
        this.$store.state.translations[key][this.formTranslationLang] &&
        key !== this.initialTranslationKey
      ) {
        return "There is already a translation with this key in this language.";
      }
      return true;
    },
    validateTranslationLang(lang) {
      if (!lang) {
        return "This field is required.";
      }
      if (lang.length > 16) {
        return "This field must be less than or equal to 16 characters in length.";
      }
      return true;
    },
    validateTranslationValue(val) {
      if (!val) {
        return "This field is required.";
      }
      if (val.length > 512) {
        return "This field must be less than or equal to 512 characters in length.";
      }
      return true;
    },
    languageInput(input) {
      this.formTranslationLang = input.toLowerCase();
      this.formTranslationLang = this.formTranslationLang.replace(/\s/g, "_");
    },
    keyInput() {
      this.formTranslationKey = this.formTranslationKey.replace(/\s/g, "_");
    },
    cancelClicked() {
      this.localValue = false;
    },
    reset() {
      this.formTranslationKey = this.initialTranslationKey;
      this.formTranslationLang = this.initialTranslationLang;
      this.formTranslationValue = this.initialTranslationValue;
    },
    submit() {
      const action = new AlterTranslationAction(
        this.formTranslationKey,
        this.formTranslationLang,
        this.formTranslationValue
      );
      this.$store.dispatch("sendAction", {
        action: action
      });
      this.localValue = false;
    }
  }
};
</script>

<style scoped lang="scss">
.action-btns {
  .cancel-btn {
    margin-right: 10px;
  }
  display: flex;
  justify-content: flex-end;
}
.available-on-checkbox {
  margin: 0;
  padding: 0;
}
.buttons-radio {
  @media (max-width: 595px) {
    margin-bottom: 10px;
  }
}
.translation-btn {
  margin-right: 10px;
  margin-bottom: 10px;
}
.translation-text {
  margin: 5px 0 0;
  color: white;
}
.translation-key {
  margin: 0 0 15px;
  font-style: italic;
}
</style>
