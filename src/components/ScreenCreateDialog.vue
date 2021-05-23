<template>
  <VDialog max-width="1200px" v-model="localValue">
    <VCard>
      <VCardTitle class="headline">
        {{ initialScreenKey ? "Edit" : "New" }} Screen
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
                  v-model="formScreenKey"
                  :counter="64"
                  :rules="[validateScreenKey]"
                  hint="Required. Must be unique."
                >
                  <template v-slot:label>
                    Screen Key <span class="red--text">*</span>
                  </template>
                </VTextField>
              </VCol>
              <VCol>
                <p class="subtitle-1">
                  Screen Type <span class="red--text">*</span>
                </p>
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
                <p class="subtitle-1">
                  Server IP Regex
                </p>
                <p class="server-regex-note">
                  * Select nothing for all servers
                </p>
                <RegexSelector
                  v-model="formSelectedServers"
                  clearable
                  multiple
                />
              </VCol>
              <VCol>
                <p class="subtitle-1">Visibility</p>
                <VCheckbox v-model="formVisible" label="Visible" />
                <VCheckbox v-model="formAdminOnly" label="Admin-only" />
                <HypixelPermissionsEditor
                  v-model="showHypixelEditor"
                  :initial-build-team-admin-only="formHypixelBuildTeamAdminOnly"
                  :initial-build-team-only="formHypixelBuildTeamOnly"
                  :initial-locraw-regex="formHypixelLocrawRegex"
                  :initial-package-rank-regex="formHypixelPackageRankRegex"
                  :initial-rank-regex="formHypixelRankRegex"
                  @rank-regex-change="v => (this.formHypixelRankRegex = v)"
                  @package-rank-regex-change="
                    v => (this.formHypixelPackageRankRegex = v)
                  "
                  @build-team-only-change="
                    v => (this.formHypixelBuildTeamOnly = v)
                  "
                  @build-team-admin-only-change="
                    v => (this.formHypixelBuildTeamAdminOnly = v)
                  "
                  @locraw-regex-change="v => (this.formHypixelLocrawRegex = v)"
                />
                <VBtn @click="showHypixelEditor = true" color="primary">
                  Open Hypixel Editor
                </VBtn>
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
            <VRow>
              <VCol>
                <VCard elevation="8">
                  <VTabs v-model="tab">
                    <VTab key="screen-create-dialog-buttons">Buttons</VTab>
                    <VTab key="screen-create-dialog-aliased-actions">
                      Back Btn Actions
                    </VTab>
                  </VTabs>
                  <VTabsItems v-model="tab">
                    <VTabItem key="screen-create-dialog-buttons">
                      <ButtonsTable
                        @change="arr => buttonOrderChanged(arr)"
                        :value="getButtonsList()"
                        subtable
                      />
                    </VTabItem>
                    <VTabItem key="screen-create-dialog-aliased-actions">
                      <AliasedActionsTable
                        @change="arr => aliasedActionOrderChanged(arr)"
                        :value="getAliasedActionsList()"
                        subtable
                      />
                    </VTabItem>
                  </VTabsItems>
                </VCard>
              </VCol>
            </VRow>
          </VForm>
          <VAlert
            type="warning"
            v-if="initialScreenKey && formScreenKey !== initialScreenKey"
          >
            Buttons and Keybinds reference Screens by their key. You should not
            change a Screen's key unless you know what you are doing.
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
import { Screen, AlterScreenAction } from "@quickplaymod/quickplay-actions-js";
import TranslationSelector from "@/components/TranslationSelector";
import ButtonsTable from "@/components/ButtonsTable";
import AliasedActionsTable from "@/components/AliasedActionsTable";
import HypixelPermissionsEditor from "@/components/HypixelPermissionsEditor";
import RegexSelector from "@/components/RegexSelector";
export default {
  name: "ScreenCreateDialog",
  components: {
    RegexSelector,
    HypixelPermissionsEditor,
    AliasedActionsTable,
    ButtonsTable,
    TranslationSelector
  },
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
      default: () => ["serverHypixel", "serverHypixelAlpha"]
    },
    initialVisible: {
      type: Boolean,
      default: true
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
    },
    initialButtonList: {
      type: Array,
      default: () => []
    },
    initialAliasedActionList: {
      type: Array,
      default: () => []
    },
    initialHypixelBuildTeamAdminOnly: {
      type: Boolean,
      default: false
    },
    initialHypixelBuildTeamOnly: {
      type: Boolean,
      default: false
    },
    initialHypixelLocrawRegex: {
      type: Object,
      default: () => {
        return {};
      }
    },
    initialHypixelPackageRankRegex: {
      type: String,
      default: ""
    },
    initialHypixelRankRegex: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      showTranslationList: false,
      formValid: false,
      showHypixelEditor: false,
      formScreenKey: this.initialScreenKey,
      formScreenType: this.initialScreenType,
      formSelectedServers: [...this.initialSelectedServers],
      formVisible: this.initialVisible,
      formAdminOnly: this.initialAdminOnly,
      formImageUrl: this.initialImageUrl,
      formTranslationKey: this.initialTranslationKey,
      formButtonList: [...this.initialButtonList],
      formAliasedActionList: [...this.initialAliasedActionList],
      formHypixelBuildTeamAdminOnly: this.initialHypixelBuildTeamAdminOnly,
      formHypixelBuildTeamOnly: this.initialHypixelBuildTeamOnly,
      formHypixelLocrawRegex: this.initialHypixelLocrawRegex,
      formHypixelPackageRankRegex: this.initialHypixelPackageRankRegex,
      formHypixelRankRegex: this.initialHypixelRankRegex,
      tab: ""
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
    buttonOrderChanged(arr) {
      const keyArray = []; // Arr is an array of buttons but needs to be an array of keys.
      for (let i = 0; i < arr.length; i++) {
        keyArray.push(arr[i].key);
      }
      this.formButtonList = keyArray;
    },
    aliasedActionOrderChanged(arr) {
      const keyArray = []; // Arr is an array of aliased actions but needs to be an array of keys.
      for (let i = 0; i < arr.length; i++) {
        keyArray.push(arr[i].key);
      }
      this.formAliasedActionList = keyArray;
    },
    getButtonsList() {
      const buttonArr = [];
      for (let i = 0; i < this.formButtonList.length; i++) {
        const btn = this.$store.state.buttons[this.formButtonList[i]];
        if (!btn) {
          continue;
        }
        buttonArr.push(btn);
      }
      return buttonArr;
    },
    getAliasedActionsList() {
      const aaArr = [];
      for (let i = 0; i < this.formAliasedActionList.length; i++) {
        const aa = this.$store.state.aliasedActions[
          this.formAliasedActionList[i]
        ];
        if (!aa) {
          continue;
        }
        aaArr.push(aa);
      }
      return aaArr;
    },
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
    cancelClicked() {
      this.localValue = false;
    },
    reset() {
      this.formScreenKey = this.initialScreenKey;
      this.formScreenType = this.initialScreenType;
      this.formSelectedServers = [...this.initialSelectedServers];
      this.formVisible = this.initialVisible;
      this.formAdminOnly = this.initialAdminOnly;
      this.formImageUrl = this.initialImageUrl;
      this.formTranslationKey = this.initialTranslationKey;
      this.formButtonList = [...this.initialButtonList];
      this.formAliasedActionList = [...this.initialAliasedActionList];
      this.formHypixelBuildTeamAdminOnly = this.initialHypixelBuildTeamAdminOnly;
      this.formHypixelBuildTeamOnly = this.initialHypixelBuildTeamOnly;
      this.formHypixelLocrawRegex = this.initialHypixelLocrawRegex;
      this.formHypixelPackageRankRegex = this.initialHypixelPackageRankRegex;
      this.formHypixelRankRegex = this.initialHypixelRankRegex;
    },
    async submit() {
      const currentScreen = this.$store.state.screens[this.formScreenKey];
      let currentScreenCopy = null;
      if (currentScreen) {
        const currentScreenJson = JSON.stringify(currentScreen);
        if (currentScreenJson) {
          currentScreenCopy = await Screen.deserialize(
            JSON.stringify(currentScreen)
          );
        }
      }

      const screen = currentScreenCopy
        ? currentScreenCopy
        : new Screen(this.formScreenKey, this.formScreenType);
      screen.availableOn = this.formSelectedServers;
      screen.imageURL = this.formImageUrl;
      screen.translationKey = this.formTranslationKey;
      screen.buttons = this.formButtonList;
      screen.backButtonActions = this.formAliasedActionList;
      screen.visible = this.formVisible;
      screen.adminOnly = this.formAdminOnly;
      screen.hypixelBuildTeamAdminOnly = this.formHypixelBuildTeamAdminOnly;
      screen.hypixelBuildTeamOnly = this.formHypixelBuildTeamOnly;
      screen.hypixelPackageRankRegex = this.formHypixelPackageRankRegex;
      screen.hypixelRankRegex = this.formHypixelRankRegex;
      screen.hypixelLocrawRegex = this.formHypixelLocrawRegex;
      const action = new AlterScreenAction(this.formScreenKey, screen);
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
  &.lower-action-btns {
    margin-top: 15px;
  }
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
.server-regex-note {
  margin: 0;
}
</style>
