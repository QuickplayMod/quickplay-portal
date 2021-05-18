<template>
  <VDialog max-width="1200px" v-model="localValue">
    <VCard>
      <VCardTitle class="headline">
        {{ initialRegexKey ? "Edit" : "New" }} Regular Expression
      </VCardTitle>
      <VCardText>
        <VContainer>
          <VForm v-model="formValid">
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
            <VRow>
              <VCol>
                <VTextField
                  v-model="formRegexKey"
                  :counter="256"
                  :rules="[validateRegexKey]"
                  hint="Required. Must be unique per language."
                >
                  <template v-slot:label>
                    Regex Key <span class="red--text">*</span>
                  </template>
                </VTextField>
              </VCol>
            </VRow>
            <VRow>
              <VCol>
                <VTextField
                  v-model="formRegexValue"
                  :counter="16000"
                  :rules="[validateRegexValue]"
                  hint="Required."
                >
                  <template v-slot:label>
                    Value <span class="red--text">*</span>
                  </template>
                </VTextField>
              </VCol>
            </VRow>
          </VForm>
          <VAlert
            type="warning"
            v-if="initialRegexKey && formRegexKey !== initialRegexKey"
          >
            Quickplay source code references Regular Expressions by their key.
            You should not change a Regular Expression's key unless you know
            what you are doing.
          </VAlert>
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
        </VContainer>
      </VCardText>
    </VCard>
  </VDialog>
</template>

<script>
import { AlterRegexAction } from "@quickplaymod/quickplay-actions-js";
export default {
  name: "RegexCreateDialog",
  props: {
    value: {
      type: Boolean,
      required: true
    },
    initialRegexKey: {
      type: String,
      default: ""
    },
    initialRegexValue: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      formValid: false,
      formRegexKey: this.initialRegexKey,
      formRegexValue: this.initialRegexValue
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
    validateRegexKey(key) {
      if (!key) {
        return "This field is required.";
      }
      if (key.length > 256) {
        return "This field must be less than or equal to 256 characters in length.";
      }
      if (this.$store.state.regexes[key] && key !== this.initialRegexKey) {
        return "There is already a translation with this key in this language.";
      }
      return true;
    },
    validateRegexValue(val) {
      if (!val) {
        return "This field is required.";
      }
      if (val.length > 16000) {
        return "This field must be less than or equal to 16,000 characters in length.";
      }
      return true;
    },
    cancelClicked() {
      this.localValue = false;
    },
    reset() {
      this.formRegexKey = this.initialRegexKey;
      this.formRegexValue = this.initialRegexValue;
    },
    submit() {
      const action = new AlterRegexAction(
        this.formRegexKey,
        this.formRegexValue
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
  &.lower-action-btns {
    margin-top: 15px;
  }
}
</style>
