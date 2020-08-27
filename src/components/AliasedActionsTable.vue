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
        <VBtn fab color="primary" dark @click="newItemButtonClicked">
          <FontAwesomeIcon :icon="['fas', 'plus']" class="plus-icon" />
        </VBtn>
      </div>
      <AliasedActionsList
        v-if="subtable"
        v-model="showAliasedActionList"
        @click="aliasedActionChosen"
      />
      <AliasedActionCreateDialog
        v-if="showEditMenu"
        v-model="showEditMenu"
        :initial-button-key="editorInitialKeyValue"
        :initial-selected-servers="editorInitialSelectedServersValue"
        :initial-admin-only="editorInitialAdminOnlyValue"
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
      editorInitialAdminOnlyValue: false,
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
    newItemButtonClicked() {
      if (this.subtable) {
        this.showAliasedActionList = true;
      } else {
        this.editorInitialKeyValue = "";
        this.editorInitialSelectedServersValue = [
          "Hypixel Network",
          "Hypixel Alpha Network"
        ];
        this.editorInitialAdminOnlyValue = false;
        this.showEditMenu = true;
      }
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
      this.editorInitialAdminOnlyValue = !!item.adminOnly;
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

.new-button-wrapper {
  display: flex;
  justify-content: flex-end;
  margin: 10px;
}
</style>