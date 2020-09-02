<template>
  <VDialog persistent max-width="600px" v-model="localValue">
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
            <VRow>
              <VCol>
                <VTextField
                  label="Aliased Action Key"
                  v-model="formAliasedActionKey"
                  :counter="64"
                  :rules="[validateAliasedActionKey]"
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
                <VSelect
                  v-model="formActionType"
                  :items="actionsAvailable"
                  label="Action Type"
                  :rules="[validateActionType]"
                />
              </VCol>
              <VCol>
                <VSelect
                  v-if="formActionType === 'OpenScreenAction'"
                  v-model="formActionArg"
                  :items="screensAvailable"
                  label="Screen"
                  :rules="[validateActionArg]"
                />
                <VTextField
                  v-else
                  v-model="formActionArg"
                  label="Command"
                  :rules="[validateActionArg]"
                />
              </VCol>
            </VRow>
          </VForm>
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
import {
  AliasedAction,
  AlterAliasedActionAction,
  OpenScreenAction,
  SendChatCommandAction
} from "@quickplaymod/quickplay-actions-js";
export default {
  name: "AliasedActionCreateDialog",
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
      default: () => ["Hypixel Network", "Hypixel Alpha Network"]
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
      default: ""
    }
  },
  data() {
    return {
      formValid: false,
      formAliasedActionKey: this.initialAliasedActionKey,
      formSelectedServers: this.initialSelectedServers,
      formAdminOnly: this.initialAdminOnly,
      formActionType: this.initialActionType,
      formActionArg: this.initialActionArg,
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
    validateAvailableOnServers(value) {
      if (!value || !value.length) {
        return "You must select at least one option.";
      }
      if (value.includes("ALL") && value.length > 1) {
        return 'You cannot select both "All" and another option.';
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
      this.formSelectedServers = this.initialSelectedServers;
      this.formAdminOnly = this.initialAdminOnly;
      this.formActionType = this.initialActionType;
      this.formActionArg = this.initialActionArg;
    },
    submit() {
      const aliasedAction = new AliasedAction(this.formAliasedActionKey);
      aliasedAction.availableOn = this.formSelectedServers;
      const actionClass =
        this.formActionType === "OpenScreenAction"
          ? OpenScreenAction
          : SendChatCommandAction;
      aliasedAction.action = new actionClass(this.formActionArg);
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
