<template>
  <VDialog persistent max-width="600px" v-model="localValue">
    <template v-slot:activator="{ on, attrs }">
      <slot :attrs="attrs" :on="on" name="activator"></slot>
    </template>
    <VCard>
      <VCardTitle class="headline">New Button</VCardTitle>
      <VCardText>
        <VContainer>
          <VForm v-model="formValid">
            <VRow>
              <VCol>
                <VTextField
                  label="Button Key"
                  v-model="formButtonKey"
                  :counter="64"
                  :rules="[validateButtonKey]"
                  hint="Required. Must be unique."
                ></VTextField>
              </VCol>
            </VRow>
            <VRow>
              <VCol>
                <p class="subtitle-1">Available on</p>
                <VCheckbox
                  class="available-on-checkbox"
                  v-model="formSelectedServers"
                  label="Hypixel Network"
                  value="Hypixel Network"
                  :rules="[validateAvailableOnServers]"
                />
                <VCheckbox
                  class="available-on-checkbox"
                  v-model="formSelectedServers"
                  label="Hypixel Alpha Network"
                  value="Hypixel Alpha Network"
                  :rules="[validateAvailableOnServers]"
                />
                <VCheckbox
                  class="available-on-checkbox"
                  v-model="formSelectedServers"
                  label="All"
                  value="ALL"
                  :rules="[validateAvailableOnServers]"
                />
              </VCol>
              <VCol>
                <p class="subtitle-1">Visibility</p>
                <VCheckbox v-model="formAdminOnly" label="Admin-only" />
              </VCol>
            </VRow>
            <VRow>
              <VCol>
                <VTextField
                  label="Image URL"
                  v-model="formImageUrl"
                  :counter="512"
                  :rules="[validateImageUrl]"
                  hint="Required if this Button is used on screens of type IMAGES. Optional otherwise."
                ></VTextField>
              </VCol>
              <VCol>
                <p class="subtitle-1">
                  Title Translation <span class="red--text">*</span>
                </p>
                <TranslationSelector
                  v-model="formTranslationKey"
                  :rules="[validateTranslationKey]"
                />
              </VCol>
            </VRow>
          </VForm>
          <p>
            Button aliased actions can be added after the button has been
            created.
          </p>
          <VAlert
            type="warning"
            v-if="initialButtonKey && formButtonKey !== initialButtonKey"
          >
            Screens and Keybinds reference Buttons by their key. You should not
            change a Button's key unless you know what you are doing.
          </VAlert>
          <div class="action-btns">
            <VBtn class="cancel-btn" color="error" @click="cancelClicked">
              Cancel
            </VBtn>
            <VBtn class="submit-btn" @click="submit" :disabled="!formValid">
              Submit
            </VBtn>
          </div>
        </VContainer>
      </VCardText>
    </VCard>
  </VDialog>
</template>

<script>
import { Button, AlterButtonAction } from "@quickplaymod/quickplay-actions-js";
import TranslationSelector from "@/components/TranslationSelector";
export default {
  name: "ButtonCreateDialog",
  components: { TranslationSelector },
  props: {
    value: {
      type: Boolean,
      required: true
    },
    initialButtonKey: {
      type: String,
      default: ""
    },
    initialSelectedServers: {
      type: Array,
      default: () => ["Hypixel Network", "Hypixel Alpha Network"]
    },
    initialAdminOnly: {
      type: Boolean,
      default: false
    },
    initialImageUrl: {
      type: String,
      default: ""
    },
    initialTranslationKey: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      formValid: false,
      formButtonKey: this.initialButtonKey,
      formSelectedServers: this.initialSelectedServers,
      formAdminOnly: this.initialAdminOnly,
      formImageUrl: this.initialImageUrl,
      formTranslationKey: this.initialTranslationKey
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
    validateButtonKey(key) {
      if (!key) {
        return "This field is required.";
      }
      if (key.length > 64) {
        return "This field must be less than or equal to 64 characters in length.";
      }
      if (this.$store.state.buttons[key] && key !== this.initialButtonKey) {
        return "There is already a button with this key.";
      }
      return true;
    },
    validateImageUrl(value) {
      if (!value) {
        return true;
      }
      if (value.length > 512) {
        return "This field must be less than or equal to 512 characters in length.";
      }
      if (!value.match(/^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i)) {
        return "This field must match a valid URL.";
      }
      return true;
    },
    validateAvailableOnServers(value) {
      if (!value || !value.length) {
        return "You must select at least one option.";
      }
      if (value.includes("ALL") && value.length > 1) {
        return 'You cannot select both "All" and another option.';
      }
      return true;
    },
    validateTranslationKey() {
      if (!this.formTranslationKey) {
        return "You must select a translation for this item.";
      }
      return true;
    },
    cancelClicked() {
      this.localValue = false;
    },
    reset() {
      this.formButtonKey = this.initialButtonKey;
      this.formSelectedServers = this.initialSelectedServers;
      this.formAdminOnly = this.initialAdminOnly;
      this.formImageUrl = this.initialImageUrl;
      this.formTranslationKey = this.initialTranslationKey;
    },
    async submit() {
      const currentButton = await Button.deserialize(
        JSON.stringify(this.$store.state.buttons[this.formButtonKey])
      );
      const button = currentButton
        ? currentButton
        : new Button(this.formButtonKey);
      button.availableOn = this.formSelectedServers;
      button.imageURL = this.formImageUrl;
      button.translationKey = this.formTranslationKey;
      const action = new AlterButtonAction(this.formButtonKey, button);
      await this.$store.dispatch("sendAction", {
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
</style>
