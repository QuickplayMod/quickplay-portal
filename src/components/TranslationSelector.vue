<template>
  <div>
    <h3 class="translation-text">
      {{ translate(this.value) }}
    </h3>
    <p class="translation-key text--secondary">
      {{ this.value }}
    </p>
    <VMessages
      :value="this.messagesToDisplay"
      v-if="modified && this.messagesToDisplay.length > 0"
      color="error"
      class="err-msg"
    />
    <VBtn
      class="select-translation-btn translation-btn"
      outlined
      color="primary lighten-2"
      @click="showTranslationList = true"
    >
      Select
    </VBtn>
    <VBtn
      class="translation-btn"
      outlined
      color="primary lighten-2"
      @click="showTranslationDialog = true"
    >
      Create New
    </VBtn>
    <TranslationCreateDialog v-model="showTranslationDialog" />
    <VBtn
      v-if="value && clearable"
      class="translation-btn"
      outlined
      color="error lighten-2"
      @click="localValue = null"
    >
      Clear
    </VBtn>
    <TranslationList v-model="showTranslationList" @click="translationChosen" />
  </div>
</template>

<script>
import VInput from "vuetify/lib/components/VInput/VInput.js";
import VMessages from "vuetify/lib/components/VMessages/VMessages";
import TranslationList from "./TranslationList";
import { translate } from "@/util";
import TranslationCreateDialog from "@/components/TranslationCreateDialog";

export default {
  name: "TranslationSelector",
  components: {
    TranslationCreateDialog,
    TranslationList,
    VMessages
  },
  extends: VInput,
  data() {
    return {
      showTranslationDialog: false,
      modified: false
    };
  },
  props: {
    clearable: {
      type: Boolean,
      default: false
    },
    value: {
      type: String,
      required: true
    }
  },
  computed: {
    localValue: {
      get() {
        return this.value;
      },
      set(newVal) {
        this.modified = true;
        this.$emit("input", newVal);
      }
    }
  },
  methods: {
    translate(key) {
      return translate(key);
    },
    translationChosen(key) {
      this.localValue = key;
      this.showTranslationList = false;
    }
  }
};
</script>

<style scoped lang="scss">
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
.err-msg {
  margin-bottom: 10px;
}
</style>
