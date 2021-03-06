<template>
  <QuickplayItemTable
    :subtable="subtable"
    :headers="headers"
    :value="value"
    :expandable="false"
    @edit="editItem"
    @delete="deleteItem"
    @move-up="moveUpItem"
    @move-down="moveDownItem"
  >
    <template v-slot:editor="{}">
      <div class="new-button-wrapper">
        <VTooltip left>
          <template v-slot:activator="{ on, attrs }">
            <VBtn
              v-if="subtable"
              class="attach-btn"
              fab
              color="secondary"
              dark
              v-bind="attrs"
              v-on="on"
              @click="attachItemButtonClicked"
            >
              <FontAwesomeIcon :icon="['fas', 'link']" class="plus-icon" />
            </VBtn>
          </template>
          <span>Attach</span>
        </VTooltip>

        <VTooltip right>
          <template v-slot:activator="{ on, attrs }">
            <VBtn
              fab
              color="primary"
              dark
              @click="newItemButtonClicked"
              v-bind="attrs"
              v-on="on"
            >
              <FontAwesomeIcon :icon="['fas', 'plus']" class="plus-icon" />
            </VBtn>
          </template>
          <span>Create New</span>
        </VTooltip>
      </div>
      <AliasedActionsList
        v-if="subtable"
        v-model="showAliasedActionList"
        @click="aliasedActionChosen"
      />
      <AliasedActionCreateDialog
        v-if="showEditMenu"
        v-model="showEditMenu"
        :initial-aliased-action-key="editorInitialKeyValue"
        :initial-selected-servers="editorInitialSelectedServersValue"
        :initial-visible="editorInitialVisibleValue"
        :initial-admin-only="editorInitialAdminOnlyValue"
        :initial-action-type="editorInitialActionType"
        :initial-action-arg="editorInitialActionArg"
        :initial-hypixel-build-team-admin-only="
          editorInitialHypixelBuildTeamAdminOnly
        "
        :initial-hypixel-build-team-only="editorInitialHypixelBuildTeamOnly"
        :initial-hypixel-locraw-regex="editorInitialHypixelLocrawRegex"
        :initial-hypixel-package-rank-regex="
          editorInitialHypixelPackageRankRegex
        "
        :initial-hypixel-rank-regex="editorInitialHypixelRankRegex"
        :initial-settings-regexes="editorInitialSettingsRegexes"
      />
    </template>
  </QuickplayItemTable>
</template>

<script>
import { DeleteAliasedActionAction } from "@quickplaymod/quickplay-actions-js";
import QuickplayItemTable from "@/components/QuickplayItemTable";
import AliasedActionCreateDialog from "./AliasedActionCreateDialog";
import AliasedActionsList from "@/components/AliasedActionsList";
export default {
  name: "AliasedActionsTable",
  components: {
    AliasedActionsList,
    AliasedActionCreateDialog,
    QuickplayItemTable
  },
  props: {
    subtable: {
      type: Boolean,
      default: false
    },
    value: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      showEditMenu: false,
      showAliasedActionList: false,
      editorInitialKeyValue: "",
      editorInitialSelectedServersValue: [],
      editorInitialVisibleValue: true,
      editorInitialAdminOnlyValue: false,
      editorInitialActionType: "SendChatCommandAction",
      editorInitialActionArg: "/play ",
      editorInitialHypixelPackageRankRegex: "",
      editorInitialHypixelRankRegex: "",
      editorInitialHypixelLocrawRegex: "",
      editorInitialHypixelBuildTeamOnly: false,
      editorInitialHypixelBuildTeamAdminOnly: false,
      editorInitialSettingsRegexes: {},
      headers: [
        {
          text: "Aliased Action Key",
          align: "start",
          value: "key"
        },
        { text: "Action Type", value: "actionType" },
        { text: "Action Arg", value: "actionArg" }
      ]
    };
  },
  methods: {
    aliasedActionChosen(btn) {
      this.$emit("change", [...this.value, btn]);
      this.showAliasedActionList = false;
    },
    attachItemButtonClicked() {
      this.showAliasedActionList = true;
    },
    newItemButtonClicked() {
      this.editorInitialKeyValue = "";
      this.editorInitialSelectedServersValue = ["serverHypixel"];
      this.editorInitialVisibleValue = true;
      this.editorInitialAdminOnlyValue = false;
      this.editorInitialActionType = "SendChatCommandAction";
      this.editorInitialActionArg = "/play ";
      this.editorInitialHypixelRankRegex = "";
      this.editorInitialHypixelPackageRankRegex = "";
      this.editorInitialHypixelLocrawRegex = {};
      this.editorInitialHypixelBuildTeamOnly = false;
      this.editorInitialHypixelBuildTeamAdminOnly = false;
      this.editorInitialSettingsRegexes = {};
      this.showEditMenu = true;
    },
    moveUpItem(item) {
      const index = this.value.indexOf(item);
      const copiedArray = [...this.value];
      copiedArray.splice(index, 1);
      const firstHalf = copiedArray.slice(0, index - 1);
      const secondHalf = copiedArray.slice(index - 1, copiedArray.length);
      this.$emit("change", [...firstHalf, item, ...secondHalf]);
    },
    moveDownItem(item) {
      const index = this.value.indexOf(item);
      const copiedArray = [...this.value];
      copiedArray.splice(index, 1);
      const firstHalf = copiedArray.slice(0, index + 1);
      const secondHalf = copiedArray.slice(index + 1, copiedArray.length);
      this.$emit("change", [...firstHalf, item, ...secondHalf]);
    },
    editItem(item) {
      this.editorInitialKeyValue = item.key || "";
      this.editorInitialSelectedServersValue = item.availableOn || [];
      this.editorInitialVisibleValue = !!item.visible;
      this.editorInitialAdminOnlyValue = !!item.adminOnly;
      this.editorInitialHypixelBuildTeamAdminOnly =
        item.hypixelBuildTeamAdminOnly || false;
      this.editorInitialHypixelBuildTeamOnly =
        item.hypixelBuildTeamOnly || false;
      this.editorInitialHypixelLocrawRegex = item.hypixelLocrawRegex || {};
      this.editorInitialHypixelPackageRankRegex =
        item.hypixelPackageRankRegex || "";
      this.editorInitialHypixelRankRegex = item.hypixelRankRegex || "";
      this.editorInitialSettingsRegexes = item.settingsRegexes || {};
      this.editorInitialActionType =
        item.action.id === 11 ? "OpenScreenAction" : "SendChatCommandAction";
      this.editorInitialActionArg = item.action.getPayloadObjectAsString(0);
      this.showEditMenu = true;
    },
    deleteItem(item) {
      if (!this.subtable) {
        if (confirm("Are you sure you want to delete this item?")) {
          this.$store.dispatch("sendAction", {
            action: new DeleteAliasedActionAction(item.key)
          });
        }
      } else {
        if (
          confirm("Are you sure you want to remove this item from its parent?")
        ) {
          const newArr = [...this.value];
          const index = newArr.indexOf(item);
          newArr.splice(index, 1);
          this.$emit("change", newArr);
        }
      }
    }
  }
};
</script>

<style scoped lang="scss">
.plus-icon {
  font-size: 20px;
}

.attach-btn {
  margin-right: 10px;
}

.new-button-wrapper {
  display: flex;
  justify-content: flex-end;
  margin: 10px;
}
</style>
