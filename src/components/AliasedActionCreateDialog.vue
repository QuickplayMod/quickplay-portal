<template>
  <VDialog max-width="1200px" v-model="localValue">
    <template v-slot:activator="{ on, attrs }">
      <slot :attrs="attrs" :on="on" name="activator"></slot>
    </template>
    <VCard>
      <VCardTitle class="headline">
        {{ initialAliasedActionKey ? "Edit" : "New" }} Aliased Action
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
                  v-model="formAliasedActionKey"
                  :counter="64"
                  :rules="[validateAliasedActionKey]"
                  hint="Required. Must be unique."
                >
                  <template v-slot:label>
                    Aliased Action Key <span class="red--text">*</span>
                  </template>
                </VTextField>
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
                <VSelect
                  v-model="formActionType"
                  :items="actionsAvailable"
                  :rules="[validateActionType]"
                  @change="actionTypeUpdated"
                >
                  <template v-slot:label>
                    Action Type <span class="red--text">*</span>
                  </template>
                </VSelect>
              </VCol>
              <VCol>
                <VSelect
                  v-if="formActionType === 'OpenScreenAction'"
                  v-model="formActionArg"
                  :items="screensAvailable"
                  :rules="[validateActionArg]"
                >
                  <template v-slot:label>
                    Screen <span class="red--text">*</span>
                  </template>
                </VSelect>
                <VTextField
                  v-else
                  v-model="formActionArg"
                  :rules="[validateActionArg]"
                >
                  <template v-slot:label>
                    Command <span class="red--text">*</span>
                  </template>
                </VTextField>
              </VCol>
            </VRow>
          </VForm>
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
import {
  AliasedAction,
  AlterAliasedActionAction,
  OpenScreenAction,
  SendChatCommandAction
} from "@quickplaymod/quickplay-actions-js";
import HypixelPermissionsEditor from "@/components/HypixelPermissionsEditor";
import RegexSelector from "@/components/RegexSelector";

export default {
  name: "AliasedActionCreateDialog",
  components: { RegexSelector, HypixelPermissionsEditor },
  props: {
    value: {
      type: Boolean,
      required: true
    },
    initialAliasedActionKey: {
      type: String,
      default: ""
    },
    initialSelectedServers: {
      type: Array,
      default: () => ["serverHypixel"]
    },
    initialVisible: {
      type: Boolean,
      default: true
    },
    initialAdminOnly: {
      type: Boolean,
      default: false
    },
    initialActionType: {
      type: String,
      default: "SendChatCommandAction"
    },
    initialActionArg: {
      type: String,
      default: "/play "
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
      formAliasedActionKey: this.initialAliasedActionKey,
      formSelectedServers: [...this.initialSelectedServers],
      formVisible: this.initialVisible,
      formAdminOnly: this.initialAdminOnly,
      formActionType: this.initialActionType,
      formActionArg: this.initialActionArg,
      formHypixelBuildTeamAdminOnly: this.initialHypixelBuildTeamAdminOnly,
      formHypixelBuildTeamOnly: this.initialHypixelBuildTeamOnly,
      formHypixelLocrawRegex: this.initialHypixelLocrawRegex,
      formHypixelPackageRankRegex: this.initialHypixelPackageRankRegex,
      formHypixelRankRegex: this.initialHypixelRankRegex,
      actionsAvailable: ["OpenScreenAction", "SendChatCommandAction"],
      blockedCommands: [
        "me",
        "msg",
        "message",
        "w",
        "whisper",
        "tell",
        "r",
        "reply",
        "ac",
        "achat",
        "gc",
        "gchat",
        "pc",
        "pchat",
        "oc",
        "ochat",
        "staff",
        "sc",
        "schat",
        "f",
        "friend",
        "g",
        "guild",
        "ignore",
        "chatreport",
        "wdr",
        "ban",
        "mute"
      ]
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
    },
    screensAvailable() {
      const arr = [];
      for (const screen in this.$store.state.screens) {
        if (!screen || !this.$store.state.screens[screen]) {
          continue;
        }
        arr.push(screen);
      }
      return arr;
    }
  },
  methods: {
    actionTypeUpdated() {
      if (
        !this.formActionArg &&
        this.formActionType === "SendChatCommandAction"
      ) {
        this.formActionArg = "/play ";
      } else {
        this.formActionArg = "";
      }
    },
    validateAliasedActionKey(key) {
      if (!key) {
        return "This field is required.";
      }
      if (key.length > 64) {
        return "This field must be less than or equal to 64 characters in length.";
      }
      if (
        this.$store.state.aliasedActions[key] &&
        key !== this.initialAliasedActionKey
      ) {
        return "There is already an aliased action with this key.";
      }
      return true;
    },
    validateActionType(value) {
      if (!value) {
        return "You must select an action type.";
      }
      return true;
    },
    validateActionArg(arg) {
      if (!arg) {
        return "This field is required.";
      }
      if (this.formActionType === "OpenScreenAction") {
        if (!this.$store.state.screens[arg]) {
          return "This is not a known screen.";
        }
      } else {
        if (!arg.startsWith("/")) {
          arg = "/" + arg;
        }
        for (let i = 0; i < this.blockedCommands.length; i++) {
          if (
            arg.startsWith("/" + this.blockedCommands[i] + " ") ||
            arg === "/" + this.blockedCommands[i]
          ) {
            return "This command is blocked. Try another command.";
          }
        }
      }
      return true;
    },
    cancelClicked() {
      this.localValue = false;
    },
    reset() {
      this.formAliasedActionKey = this.initialAliasedActionKey;
      this.formSelectedServers = [...this.initialSelectedServers];
      this.formVisible = this.initialVisible;
      this.formAdminOnly = this.initialAdminOnly;
      this.formActionType = this.initialActionType;
      this.formActionArg = this.initialActionArg;
      this.formHypixelBuildTeamAdminOnly = this.initialHypixelBuildTeamAdminOnly;
      this.formHypixelBuildTeamOnly = this.initialHypixelBuildTeamOnly;
      this.formHypixelLocrawRegex = this.initialHypixelLocrawRegex;
      this.formHypixelPackageRankRegex = this.initialHypixelPackageRankRegex;
      this.formHypixelRankRegex = this.initialHypixelRankRegex;
    },
    submit() {
      const aliasedAction = new AliasedAction(this.formAliasedActionKey);
      aliasedAction.availableOn = this.formSelectedServers;
      const actionClass =
        this.formActionType === "OpenScreenAction"
          ? OpenScreenAction
          : SendChatCommandAction;
      aliasedAction.action = new actionClass(this.formActionArg);
      aliasedAction.visible = this.formVisible;
      aliasedAction.adminOnly = this.formAdminOnly;
      aliasedAction.hypixelBuildTeamAdminOnly = this.formHypixelBuildTeamAdminOnly;
      aliasedAction.hypixelBuildTeamOnly = this.formHypixelBuildTeamOnly;
      aliasedAction.hypixelPackageRankRegex = this.formHypixelPackageRankRegex;
      aliasedAction.hypixelRankRegex = this.formHypixelRankRegex;
      aliasedAction.hypixelLocrawRegex = this.formHypixelLocrawRegex;
      const action = new AlterAliasedActionAction(
        this.formAliasedActionKey,
        aliasedAction
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
.available-on-checkbox {
  margin: 0;
  padding: 0;
}
.buttons-radio {
  @media (max-width: 595px) {
    margin-bottom: 10px;
  }
}
.server-regex-note {
  margin: 0;
}
</style>
