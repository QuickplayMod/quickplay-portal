<template>
  <QuickplayItemTable
    :expandable="false"
    :headers="headers"
    :value="value"
    @edit="editItem"
    @delete="deleteItem"
  >
    <template v-slot:editor="{}">
      <div class="new-button-wrapper">
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
      <RegexCreateDialog
        v-if="showEditMenu"
        v-model="showEditMenu"
        :initial-regex-key="editorInitialKeyValue"
        :initial-regex-value="editorInitialValueValue"
      />
    </template>
  </QuickplayItemTable>
</template>

<script>
import { DeleteRegexAction } from "@quickplaymod/quickplay-actions-js";
import QuickplayItemTable from "@/components/QuickplayItemTable";
import RegexCreateDialog from "@/components/RegexCreateDialog";
export default {
  name: "RegexesTable",
  components: {
    RegexCreateDialog,
    QuickplayItemTable
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
      editorInitialKeyValue: "",
      editorInitialValueValue: "",
      search: "",
      headers: [
        {
          text: "Key",
          align: "start",
          value: "key"
        },
        { text: "Value", value: "value" }
      ]
    };
  },
  methods: {
    newItemButtonClicked() {
      this.editorInitialKeyValue = "";
      this.editorInitialValueValue = "";
      this.showEditMenu = true;
    },
    editItem(item) {
      this.editorInitialKeyValue = item.key || "";
      this.editorInitialValueValue = item.value || "";
      this.showEditMenu = true;
    },
    deleteItem(item) {
      if (confirm("Are you sure you want to delete this item?")) {
        this.$store.dispatch("sendAction", {
          action: new DeleteRegexAction(item.key)
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
.upload-btn {
  margin-right: 10px;
}

.new-button-wrapper {
  display: flex;
  justify-content: flex-end;
  margin: 10px;
}
</style>
