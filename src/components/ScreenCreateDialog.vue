<template>
  <VDialog persistent max-width="600px" v-model="localValue">
    <VCard>
      <VCardTitle class="headline">New Screen</VCardTitle>
      <VCardText>
        <VContainer>
          <VForm v-model="formValid">
            <VRow>
              <VCol>
                <VTextField
                  label="Screen Key"
                  v-model="formScreenKey"
                  :counter="64"
                  :rules="[validateScreenKey]"
                  hint="Required. Must be unique."
                ></VTextField>
              </VCol>
              <VCol>
                <p class="subtitle-1">Screen Type</p>
                <VRadioGroup
                  row
                  v-model="formScreenType"
                  hint="Required."
                  :rules="[validateScreenType]"
                >
                  <VRadio
                    name="screenType"
                    label="BUTTONS"
                    value="BUTTONS"
                    class="buttons-radio"
                  ></VRadio>
                  <VRadio
                    name="screenType"
                    label="IMAGES"
                    value="IMAGES"
                  ></VRadio>
                </VRadioGroup>
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
                  hint="Optional. Appears at the top of the screen, above the title."
                ></VTextField>
              </VCol>
              <VCol>
                <p class="subtitle-1">Title Translation</p>
                <TranslationSelector v-model="formTranslationKey" clearable />
              </VCol>
            </VRow>
          </VForm>
          <p>
            Buttons and back button actions can be added after the screen has
            been created.
          </p>
          <VAlert
            type="warning"
            v-if="initialScreenKey && formScreenKey !== initialScreenKey"
          >
            Buttons and Keybinds reference Screens by their key. You should not
            change a Screen's key unless you know what you are doing.
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
import { Screen, AlterScreenAction } from "@quickplaymod/quickplay-actions-js";
import TranslationSelector from "@/components/TranslationSelector";
import { translate } from "@/util";
export default {
  name: "ScreenCreateDialog",
  components: { TranslationSelector },
  props: {
    value: {
      type: Boolean,
      required: true
    },
    initialScreenKey: {
      type: String,
      default: ""
    },
    initialScreenType: {
      type: String,
      default: "BUTTONS"
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
      showTranslationList: false,
      formValid: false,
      formScreenKey: this.initialScreenKey,
      formScreenType: this.initialScreenType,
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
    translationChosen(key) {
      this.formTranslationKey = key;
      this.showTranslationList = false;
    },
    validateScreenKey(key) {
      if (!key) {
        return "This field is required.";
      }
      if (key.length > 64) {
        return "This field must be less than or equal to 64 characters in length.";
      }
      if (this.$store.state.screens[key] && key !== this.initialScreenKey) {
        return "There is already a screen with this key.";
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
    validateScreenType(value) {
      if (value !== "BUTTONS" && value !== "IMAGES") {
        return 'You must select either "BUTTONS" or "IMAGES".';
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
    cancelClicked() {
      this.localValue = false;
    },
    reset() {
      this.formScreenKey = this.initialScreenKey;
      this.formScreenType = this.initialScreenType;
      this.formSelectedServers = this.initialSelectedServers;
      this.formAdminOnly = this.initialAdminOnly;
      this.formImageUrl = this.initialImageUrl;
      this.formTranslationKey = this.initialTranslationKey;
    },
    async submit() {
      const currentScreen = await Screen.deserialize(
        JSON.stringify(this.$store.state.screens[this.formScreenKey])
      );
      const screen = currentScreen
        ? currentScreen
        : new Screen(this.formScreenKey, this.formScreenType);
      screen.availableOn = this.formSelectedServers;
      screen.imageURL = this.formImageUrl;
      screen.translationKey = this.formTranslationKey;
      const action = new AlterScreenAction(this.formScreenKey, screen);
      await this.$store.dispatch("sendAction", {
        action: action
      });
      this.localValue = false;
    },
    translate(key) {
      return translate(key);
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
