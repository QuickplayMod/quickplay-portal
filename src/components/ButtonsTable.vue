<template>
  <QuickplayItemTable
    :subtable="subtable"
    :headers="headers"
    :value="value"
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
      <ButtonsList
        v-if="subtable"
        v-model="showButtonList"
        @click="buttonChosen"
      />
      <ButtonCreateDialog
        v-if="showEditMenu"
        v-model="showEditMenu"
        :initial-button-key="editorInitialKeyValue"
        :initial-selected-servers="editorInitialSelectedServersValue"
        :initial-visible="editorInitialVisibleValue"
        :initial-admin-only="editorInitialAdminOnlyValue"
        :initial-visible-in-party-mode="editorInitialVisibleInPartyMode"
        :initial-image-url="editorInitialImageUrlValue"
        :initial-translation-key="editorInitialTranslationKeyValue"
        :initial-party-mode-scope-translation-key="
          editorInitialPartyModeScopeTranslationKeyValue
        "
        :initial-aliased-action-list="editorInitialAliasedActionList"
        :initial-hypixel-build-team-admin-only="
          editorInitialHypixelBuildTeamAdminOnly
        "
        :initial-hypixel-build-team-only="editorInitialHypixelBuildTeamOnly"
        :initial-hypixel-locraw-regex="editorInitialHypixelLocrawRegex"
        :initial-hypixel-package-rank-regex="
          editorInitialHypixelPackageRankRegex
        "
        :initial-hypixel-rank-regex="editorInitialHypixelRankRegex"
      />
    </template>
    <template v-slot:expandable="{ item }">
      <AliasedActionsTable
        @change="arr => actionOrderChanged(arr, item)"
        :value="getActionList(item)"
        subtable
      />
    </template>
  </QuickplayItemTable>
</template>

<script>
import {
  DeleteButtonAction,
  AlterButtonAction,
  Button
} from "@quickplaymod/quickplay-actions-js";
import ButtonCreateDialog from "@/components/ButtonCreateDialog";
import AliasedActionsTable from "@/components/AliasedActionsTable";
import QuickplayItemTable from "@/components/QuickplayItemTable";
import ButtonsList from "@/components/ButtonsList";
export default {
  name: "ButtonsTable",
  components: {
    ButtonsList,
    QuickplayItemTable,
    ButtonCreateDialog,
    AliasedActionsTable
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
      showButtonList: false,
      editorInitialKeyValue: "",
      editorInitialSelectedServersValue: [],
      editorInitialVisibleValue: true,
      editorInitialAdminOnlyValue: false,
      editorInitialVisibleInPartyMode: true,
      editorInitialImageUrlValue: "",
      editorInitialTranslationKeyValue: "",
      editorInitialPartyModeScopeTranslationKeyValue: "",
      editorInitialAliasedActionList: [],
      editorInitialHypixelPackageRankRegex: "",
      editorInitialHypixelRankRegex: "",
      editorInitialHypixelLocrawRegex: {},
      editorInitialHypixelBuildTeamOnly: false,
      editorInitialHypixelBuildTeamAdminOnly: false,
      headers: [
        {
          text: "Button Key",
          align: "start",
          value: "key"
        },
        { text: "Image URL", value: "imageURL" },
        { text: "Translation", value: "translationKey" }
      ]
    };
  },
  methods: {
    async actionOrderChanged(arr, item) {
      const keyArray = []; // Arr is an array of buttons but needs to be an array of keys.
      for (let i = 0; i < arr.length; i++) {
        keyArray.push(arr[i].key);
      }

      const newButton = await Button.deserialize(
        JSON.stringify(this.$store.state.buttons[item.key])
      );
      newButton.actions = keyArray;
      await this.$store.dispatch("sendAction", {
        action: new AlterButtonAction(item.key, newButton)
      });
    },
    getActionList(item) {
      const button = this.$store.state.buttons[item.key];
      if (!button) {
        return [];
      }

      const aaArr = [];
      for (let i = 0; i < button.actions.length; i++) {
        const aa = this.$store.state.aliasedActions[button.actions[i]];
        if (!aa) {
          continue;
        }
        aaArr.push(aa);
      }
      return aaArr;
    },
    buttonChosen(btn) {
      this.$emit("change", [...this.value, btn]);
      this.showButtonList = false;
    },
    attachItemButtonClicked() {
      this.showButtonList = true;
    },
    newItemButtonClicked() {
      this.editorInitialKeyValue = "";
      this.editorInitialSelectedServersValue = [
        "Hypixel Network",
        "Hypixel Alpha Network"
      ];
      this.editorInitialVisibleValue = true;
      this.editorInitialAdminOnlyValue = false;
      this.editorInitialVisibleInPartyMode = true;
      this.editorInitialImageUrlValue = "";
      this.editorInitialTranslationKeyValue = "";
      this.editorInitialPartyModeScopeTranslationKeyValue = "";
      this.editorInitialAliasedActionList = [];
      this.editorInitialHypixelRankRegex = "";
      this.editorInitialHypixelPackageRankRegex = "";
      this.editorInitialHypixelLocrawRegex = {};
      this.editorInitialHypixelBuildTeamOnly = false;
      this.editorInitialHypixelBuildTeamAdminOnly = false;
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
      this.editorInitialVisibleInPartyMode = !!item.visibleInPartyMode;
      this.editorInitialImageUrlValue = item.imageURL || "";
      this.editorInitialTranslationKeyValue = item.translationKey || "";
      this.editorInitialPartyModeScopeTranslationKeyValue =
        item.partyModeScopeTranslationKey || "";
      this.editorInitialAliasedActionList = item.actions || [];
      this.editorInitialHypixelBuildTeamAdminOnly =
        item.hypixelBuildTeamAdminOnly || false;
      this.editorInitialHypixelBuildTeamOnly =
        item.hypixelBuildTeamOnly || false;
      this.editorInitialHypixelLocrawRegex = item.hypixelLocrawRegex || {};
      this.editorInitialHypixelPackageRankRegex =
        item.hypixelPackageRankRegex || "";
      this.editorInitialHypixelRankRegex = item.hypixelRankRegex || "";
      this.showEditMenu = true;
    },
    deleteItem(item) {
      if (!this.subtable) {
        if (confirm("Are you sure you want to delete this item?")) {
          this.$store.dispatch("sendAction", {
            action: new DeleteButtonAction(item.key)
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
