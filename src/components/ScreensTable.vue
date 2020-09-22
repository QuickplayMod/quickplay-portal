<template>
  <QuickplayItemTable
    :subtable="false"
    :headers="headers"
    :value="value"
    @edit="editItem"
    @delete="deleteItem"
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
      <ScreensList v-if="subtable" v-model="showScreenList" />
      <ScreenCreateDialog
        v-if="showEditMenu"
        v-model="showEditMenu"
        :initial-screen-key="editorInitialKeyValue"
        :initial-screen-type="editorInitialScreenTypeValue"
        :initial-selected-servers="editorInitialSelectedServersValue"
        :initial-visible="editorInitialVisibleValue"
        :initial-admin-only="editorInitialAdminOnlyValue"
        :initial-image-url="editorInitialImageUrlValue"
        :initial-translation-key="editorInitialTranslationKeyValue"
        :initial-button-list="editorInitialButtonList"
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
      <VTabs v-model="screenTab">
        <VTab :key="'screen-' + item.key + '-buttons'">Buttons</VTab>
        <VTab :key="'screen-' + item.key + '-aliased-actions'">
          Back Btn Actions
        </VTab>
      </VTabs>
      <VTabsItems v-model="screenTab">
        <VTabItem :key="'screen-' + item.key + '-buttons'">
          <VCard flat>
            <ButtonsTable
              @change="arr => buttonOrderChanged(arr, item)"
              :value="getButtonsList(item)"
              subtable
            />
          </VCard>
        </VTabItem>
        <VTabItem :key="'screen-' + item.key + '-aliased-actions'">
          <VCard flat>
            <AliasedActionsTable
              @change="arr => backButtonActionOrderChanged(arr, item)"
              :value="getBackButtonActionsList(item)"
              subtable
            />
          </VCard>
        </VTabItem>
      </VTabsItems>
    </template>
  </QuickplayItemTable>
</template>

<script>
import {
  DeleteScreenAction,
  AlterScreenAction,
  Screen
} from "@quickplaymod/quickplay-actions-js";
import ScreenCreateDialog from "@/components/ScreenCreateDialog";
import ButtonsTable from "@/components/ButtonsTable";
import QuickplayItemTable from "@/components/QuickplayItemTable";
import ScreensList from "@/components/ScreensList";
import AliasedActionsTable from "@/components/AliasedActionsTable";
export default {
  name: "ScreensTable",
  components: {
    AliasedActionsTable,
    ScreensList,
    QuickplayItemTable,
    ButtonsTable,
    ScreenCreateDialog
  },
  props: {
    value: {
      type: Array,
      required: true
    },
    subtable: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      showEditMenu: false,
      showScreenList: false,
      editorInitialKeyValue: "",
      editorInitialScreenTypeValue: "",
      editorInitialSelectedServersValue: [],
      editorInitialVisibleValue: true,
      editorInitialAdminOnlyValue: false,
      editorInitialImageUrlValue: "",
      editorInitialTranslationKeyValue: "",
      editorInitialButtonList: [],
      editorInitialAliasedActionList: [],
      editorInitialHypixelPackageRankRegex: "",
      editorInitialHypixelRankRegex: "",
      editorInitialHypixelLocrawRegex: {},
      editorInitialHypixelBuildTeamOnly: false,
      editorInitialHypixelBuildTeamAdminOnly: false,
      screenTab: null,
      search: "",
      headers: [
        {
          text: "Screen Key",
          align: "start",
          value: "key"
        },
        { text: "Screen Type", value: "screenType" },
        { text: "Image URL", value: "imageURL" },
        { text: "Translation", value: "translationKey" }
      ]
    };
  },
  methods: {
    async backButtonActionOrderChanged(arr, item) {
      const keyArray = []; // Arr is an array of buttons but needs to be an array of keys.
      for (let i = 0; i < arr.length; i++) {
        keyArray.push(arr[i].key);
      }

      const newScreen = await Screen.deserialize(
        JSON.stringify(this.$store.state.screens[item.key])
      );
      newScreen.backButtonActions = keyArray;
      await this.$store.dispatch("sendAction", {
        action: new AlterScreenAction(item.key, newScreen)
      });
    },
    getBackButtonActionsList(item) {
      const screen = this.$store.state.screens[item.key];
      if (!screen) {
        return [];
      }

      const aaArr = [];
      for (let i = 0; i < screen.backButtonActions.length; i++) {
        const aa = this.$store.state.aliasedActions[
          screen.backButtonActions[i]
        ];
        if (!aa) {
          continue;
        }
        aaArr.push(aa);
      }
      return aaArr;
    },
    async buttonOrderChanged(arr, item) {
      const keyArray = []; // Arr is an array of buttons but needs to be an array of keys.
      for (let i = 0; i < arr.length; i++) {
        keyArray.push(arr[i].key);
      }

      const newScreen = await Screen.deserialize(
        JSON.stringify(this.$store.state.screens[item.key])
      );
      newScreen.buttons = keyArray;
      await this.$store.dispatch("sendAction", {
        action: new AlterScreenAction(item.key, newScreen)
      });
    },
    getButtonsList(item) {
      const screen = this.$store.state.screens[item.key];
      if (!screen) {
        return [];
      }

      const buttonArr = [];
      for (let i = 0; i < screen.buttons.length; i++) {
        const btn = this.$store.state.buttons[screen.buttons[i]];
        if (!btn) {
          continue;
        }
        buttonArr.push(btn);
      }
      return buttonArr;
    },
    attachItemButtonClicked() {
      this.showScreenList = true;
    },
    newItemButtonClicked() {
      this.editorInitialKeyValue = "";
      this.editorInitialScreenTypeValue = "BUTTONS";
      this.editorInitialSelectedServersValue = [
        "Hypixel Network",
        "Hypixel Alpha Network"
      ];
      this.editorInitialVisibleValue = true;
      this.editorInitialAdminOnlyValue = false;
      this.editorInitialImageUrlValue = "";
      this.editorInitialTranslationKeyValue = "";
      this.editorInitialButtonList = [];
      this.editorInitialAliasedActionList = [];
      this.editorInitialHypixelRankRegex = "";
      this.editorInitialHypixelPackageRankRegex = "";
      this.editorInitialHypixelLocrawRegex = {};
      this.editorInitialHypixelBuildTeamOnly = false;
      this.editorInitialHypixelBuildTeamAdminOnly = false;
      this.showEditMenu = true;
    },
    editItem(item) {
      this.editorInitialKeyValue = item.key || "";
      this.editorInitialScreenTypeValue = item.screenType || "BUTTONS";
      this.editorInitialSelectedServersValue = item.availableOn || [];
      this.editorInitialVisibleValue = !!item.visible;
      this.editorInitialAdminOnlyValue = !!item.adminOnly;
      this.editorInitialImageUrlValue = item.imageURL || "";
      this.editorInitialTranslationKeyValue = item.translationKey || "";
      this.editorInitialButtonList = item.buttons || [];
      this.editorInitialAliasedActionList = item.backButtonActions || [];
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
      if (confirm("Are you sure you want to delete this item?")) {
        this.$store.dispatch("sendAction", {
          action: new DeleteScreenAction(item.key)
        });
      }
    }
  }
};
</script>

<style scoped lang="scss">
.edit-icon {
  margin-right: 10px;
  &:hover {
    color: #2bbbd9;
  }
}
.delete-icon:hover {
  color: #f15858;
}
.expand-icon {
  cursor: pointer;
}

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
