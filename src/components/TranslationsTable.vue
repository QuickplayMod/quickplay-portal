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
        <VBtn fab color="primary" dark @click="newItemButtonClicked">
          <FontAwesomeIcon :icon="['fas', 'plus']" class="plus-icon" />
        </VBtn>
      </div>
      <TranslationCreateDialog
        v-if="showEditMenu"
        v-model="showEditMenu"
        :initial-translation-key="editorInitialKeyValue"
        :initial-translation-lang="editorInitialLangValue"
        :initial-translation-value="editorInitialValueValue"
      />
    </template>
  </QuickplayItemTable>
</template>

<script>
import { DeleteTranslationAction } from "@quickplaymod/quickplay-actions-js";
import QuickplayItemTable from "@/components/QuickplayItemTable";
import TranslationCreateDialog from "./TranslationCreateDialog";
export default {
  name: "TranslationsTable",
  components: {
    TranslationCreateDialog,
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
      showTranslationList: false,
      editorInitialKeyValue: "",
      editorInitialLangValue: "",
      editorInitialValueValue: "",
      search: "",
      headers: [
        {
          text: "Key",
          align: "start",
          value: "key"
        },
        { text: "Language", value: "lang" },
        { text: "Value", value: "value" }
      ]
    };
  },
  methods: {
    newItemButtonClicked() {
      this.editorInitialKeyValue = "";
      this.editorInitialLangValue = "";
      this.editorInitialValueValue = "";
      this.showEditMenu = true;
    },
    editItem(item) {
      this.editorInitialKeyValue = item.key || "";
      this.editorInitialLangValue = item.lang || "";
      this.editorInitialValueValue = item.value || "";
      this.showEditMenu = true;
    },
    deleteItem(item) {
      if (confirm("Are you sure you want to delete this item?")) {
        this.$store.dispatch("sendAction", {
          action: new DeleteTranslationAction(item.key, item.lang)
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

.new-button-wrapper {
  display: flex;
  justify-content: flex-end;
  margin: 10px;
}
</style>
