<template>
  <VDialog max-width="1200px" v-model="localValue">
    <template v-slot:activator="{ on, attrs }">
      <slot :attrs="attrs" :on="on" name="activator"></slot>
    </template>
    <VCard>
      <VCardTitle class="headline">
        {{ initialButtonKey ? "Edit" : "New" }} Button
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
                  v-model="formButtonKey"
                  :counter="64"
                  :rules="[validateButtonKey]"
                  hint="Required. Must be unique."
                >
                  <template v-slot:label>
                    Button Key <span class="red--text">*</span>
                  </template>
                </VTextField>
              </VCol>
            </VRow>
            <VRow>
              <VCol>
                <p class="subtitle-1">
                  Available on <span class="red--text">*</span>
                </p>
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
                <VCheckbox v-model="formVisible" label="Visible" />
                <VCheckbox v-model="formAdminOnly" label="Admin-only" />
                <VCheckbox
                  v-model="formVisibleInPartyMode"
                  label="Visible in Party Mode"
                />
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
                <p class="subtitle-1">
                  Party Mode Scope Translation
                </p>
                <TranslationSelector
                  v-model="formPartyModeScopeTranslationKey"
                  clearable
                />
              </VCol>
            </VRow>
            <VRow>
              <VCol>
                <p class="subtitle-1">
                  Aliased Actions
                </p>
                <VCard elevation="8">
                  <AliasedActionsTable
                    @change="arr => actionOrderChanged(arr)"
                    :value="getActionList()"
                    subtable
                  />
                </VCard>
              </VCol>
            </VRow>
          </VForm>
          <VAlert
            type="warning"
            v-if="initialButtonKey && formButtonKey !== initialButtonKey"
          >
            Screens and Keybinds reference Buttons by their key. You should not
            change a Button's key unless you know what you are doing.
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
import { Button, AlterButtonAction } from "@quickplaymod/quickplay-actions-js";
import TranslationSelector from "@/components/TranslationSelector";
import AliasedActionsTable from "@/components/AliasedActionsTable";
import HypixelPermissionsEditor from "@/components/HypixelPermissionsEditor";
export default {
  name: "ButtonCreateDialog",
  components: {
    HypixelPermissionsEditor,
    AliasedActionsTable,
    TranslationSelector
  },
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
    initialVisible: {
      type: Boolean,
      default: true
    },
    initialAdminOnly: {
      type: Boolean,
      default: false
    },
    initialVisibleInPartyMode: {
      type: Boolean,
      default: true
    },
    initialImageUrl: {
      type: String,
      default: ""
    },
    initialTranslationKey: {
      type: String,
      default: ""
    },
    initialPartyModeScopeTranslationKey: {
      type: String,
      default: ""
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
      formValid: false,
      showHypixelEditor: false,
      formButtonKey: this.initialButtonKey,
      formSelectedServers: this.initialSelectedServers,
      formVisible: this.initialVisible,
      formAdminOnly: this.initialAdminOnly,
      formVisibleInPartyMode: this.initialVisibleInPartyMode,
      formImageUrl: this.initialImageUrl,
      formTranslationKey: this.initialTranslationKey,
      formPartyModeScopeTranslationKey: this
        .initialPartyModeScopeTranslationKey,
      formAliasedActionList: this.initialAliasedActionList,
      formHypixelBuildTeamAdminOnly: this.initialHypixelBuildTeamAdminOnly,
      formHypixelBuildTeamOnly: this.initialHypixelBuildTeamOnly,
      formHypixelLocrawRegex: this.initialHypixelLocrawRegex,
      formHypixelPackageRankRegex: this.initialHypixelPackageRankRegex,
      formHypixelRankRegex: this.initialHypixelRankRegex
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
    actionOrderChanged(arr) {
      const keyArray = []; // Arr is an array of buttons but needs to be an array of keys.
      for (let i = 0; i < arr.length; i++) {
        keyArray.push(arr[i].key);
      }
      this.formAliasedActionList = keyArray;
    },
    getActionList() {
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
      this.formVisible = this.initialVisible;
      this.formAdminOnly = this.initialAdminOnly;
      this.formVisibleInPartyMode = this.initialVisibleInPartyMode;
      this.formImageUrl = this.initialImageUrl;
      this.formTranslationKey = this.initialTranslationKey;
      this.formPartyModeScopeTranslationKey = this.initialPartyModeScopeTranslationKey;
      this.formAliasedActionList = this.initialAliasedActionList;
      this.formHypixelBuildTeamAdminOnly = this.initialHypixelBuildTeamAdminOnly;
      this.formHypixelBuildTeamOnly = this.initialHypixelBuildTeamOnly;
      this.formHypixelLocrawRegex = this.initialHypixelLocrawRegex;
      this.formHypixelPackageRankRegex = this.initialHypixelPackageRankRegex;
      this.formHypixelRankRegex = this.initialHypixelRankRegex;
    },
    async submit() {
      const currentButton = this.$store.state.buttons[this.formButtonKey];
      let currentButtonCopy = null;
      if (currentButton) {
        const currentButtonJson = JSON.stringify(currentButton);
        if (currentButtonJson) {
          currentButtonCopy = await Button.deserialize(
            JSON.stringify(currentButton)
          );
        }
      }

      const button = currentButtonCopy
        ? currentButtonCopy
        : new Button(this.formButtonKey);
      button.availableOn = this.formSelectedServers;
      button.imageURL = this.formImageUrl;
      button.translationKey = this.formTranslationKey;
      button.partyModeScopeTranslationKey = this.formPartyModeScopeTranslationKey;
      button.actions = this.formAliasedActionList;
      button.visible = this.formVisible;
      button.adminOnly = this.formAdminOnly;
      button.visibleInPartyMode = this.formVisibleInPartyMode;
      button.hypixelBuildTeamAdminOnly = this.formHypixelBuildTeamAdminOnly;
      button.hypixelBuildTeamOnly = this.formHypixelBuildTeamOnly;
      button.hypixelPackageRankRegex = this.formHypixelPackageRankRegex;
      button.hypixelRankRegex = this.formHypixelRankRegex;
      button.hypixelLocrawRegex = this.formHypixelLocrawRegex;
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
</style>
