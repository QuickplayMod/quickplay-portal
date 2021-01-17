<template>
  <VDialog max-width="800px" v-model="localValue">
    <template v-slot:activator="{ on, attrs }">
      <slot :attrs="attrs" :on="on" name="activator"></slot>
    </template>
    <VCard>
      <VCardTitle class="headline">
        Bulk Translation Upload
      </VCardTitle>
      <VCardText>
        <p>Upload translations in bulk here in JSON format.</p>
        <VForm v-model="formValid">
          <div class="action-btns lower-action-btns">
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
          <VTextField
            v-model="formLanguage"
            :counter="16"
            @input="languageInput"
            :rules="[validateTranslationLang]"
            hint="Required. Must be unique per language."
          >
            <template v-slot:label>
              Language <span class="red--text">*</span>
            </template>
          </VTextField>
          <VTextarea
            v-model="formBulkInput"
            :rules="[validateBulkInput]"
            hint="Required. Must be valid JSON."
            :rows="15"
            class="bulk-translation-upload-json-input"
          >
            <template v-slot:label>
              Upload data <span class="red--text">*</span>
            </template>
          </VTextarea>
          <div class="action-btns lower-action-btns">
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
        </VForm>
      </VCardText>
    </VCard>
  </VDialog>
</template>

<script>
import { AlterTranslationAction } from "@quickplaymod/quickplay-actions-js";

export default {
  name: "BulkTranslationUpload",
  props: {
    value: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      formValid: false,
      formLanguage: "",
      formBulkInput: ""
    };
  },
  methods: {
    languageInput(input) {
      this.formLanguage = input.toLowerCase();
      this.formLanguage = this.formLanguage.replace(/\s/g, "_");
    },
    validateTranslationLang(lang) {
      if (!lang) {
        return "This field is required.";
      }
      if (lang.length > 16) {
        return "This field must be less than or equal to 16 characters in length.";
      }
      if (lang.includes(",")) {
        return "Translation languages cannot contain commas.";
      }
      return true;
    },
    validateBulkInput(input) {
      if (!input) {
        return "This field is required.";
      }

      try {
        let parsedInput = JSON.parse(input);
        if (!parsedInput || typeof parsedInput != "object") {
          return "The input JSON is not valid.";
        }

        // Input is also accepted with a "keys" field which contains all the translations.
        if (parsedInput.keys && typeof parsedInput.keys == "object") {
          parsedInput = parsedInput.keys;
        }

        for (const prop in parsedInput) {
          // eslint-disable-next-line no-prototype-builtins
          if (!parsedInput.hasOwnProperty(prop)) {
            continue;
          }

          if (typeof parsedInput[prop] !== "string") {
            return "All properties in the input JSON must be strings.";
          }
        }
      } catch (e) {
        return "The input JSON is not valid.";
      }
      return true;
    },
    cancelClicked() {
      this.localValue = false;
    },
    getModificationCounts(obj, lang) {
      // Count how many modifications are made for the given language and object.
      const result = {
        added: 0,
        modified: 0,
        present: 0 // Number of unmodified translations
      };
      for (const prop in obj) {
        // eslint-disable-next-line no-prototype-builtins
        if (!obj.hasOwnProperty(prop) || !obj[prop]) {
          continue;
        }

        if (
          !this.$store.state.translations ||
          !this.$store.state.translations[prop] ||
          !this.$store.state.translations[prop][lang]
        ) {
          result.added++;
        } else if (this.$store.state.translations[prop][lang] !== obj[prop]) {
          result.modified++;
        } else {
          result.present++;
        }
      }

      return result;
    },
    reset() {
      this.formLanguage = "";
      this.formBulkInput = "";
    },
    submit() {
      // We inform the user of the changes they're about to make, and confirm that they want to make them.
      let parsedInput = JSON.parse(this.formBulkInput);

      // Input is also accepted with a "keys" field which contains all the translations.
      if (parsedInput.keys && typeof parsedInput.keys == "object") {
        parsedInput = parsedInput.keys;
      }

      const modifiedCounts = this.getModificationCounts(
        parsedInput,
        this.formLanguage
      );
      if (
        !confirm(
          `Are you sure you want to submit? You will add ${modifiedCounts.added} new translations to the ` +
            `language ${this.formLanguage}, and modify ${modifiedCounts.modified} translations. ` +
            `${modifiedCounts.present} translations are already present.`
        )
      ) {
        return;
      }
      // Send out an AlterTranslationAction for each translation, if the user wishes to go through with it.
      for (const prop in parsedInput) {
        // eslint-disable-next-line no-prototype-builtins
        if (!parsedInput.hasOwnProperty(prop)) {
          continue;
        }
        const action = new AlterTranslationAction(
          prop,
          this.formLanguage,
          parsedInput[prop]
        );
        this.$store.dispatch("sendAction", {
          action: action
        });
        this.localValue = false;
      }
    }
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
  }
};
</script>

<style lang="scss">
.bulk-translation-upload-json-input textarea {
  font-family: monospace;
}
</style>

<style scoped lang="scss">
.action-btns {
  .cancel-btn {
    margin-right: 10px;
  }
  display: flex;
  justify-content: flex-end;
  &.lower-action-btns {
    margin-top: 15px;
  }
}
</style>
