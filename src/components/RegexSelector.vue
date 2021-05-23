<template>
  <div>
    <h3 class="regex-text">
      {{ this.multiple ? this.prettyLocalValue : this.localValue }}
    </h3>
    <VMessages
      :value="this.messagesToDisplay"
      v-if="modified && this.messagesToDisplay.length > 0"
      color="error"
      class="err-msg"
    />
    <VBtn
      class="select-regex-btn regex-btn"
      outlined
      color="primary lighten-2"
      @click="showRegexList = true"
    >
      Select
    </VBtn>
    <VBtn
      class="regex-btn"
      outlined
      color="primary lighten-2"
      @click="showRegexDialog = true"
    >
      Create New
    </VBtn>
    <RegexCreateDialog v-model="showRegexDialog" />
    <VBtn
      v-if="
        ((this.multiple && this.localValue.length > 0) ||
          (!this.multiple && this.localValue)) &&
          this.clearable
      "
      class="regex-btn"
      outlined
      color="error lighten-2"
      @click="localValue = multiple ? [] : null"
    >
      Clear
    </VBtn>
    <RegexList
      v-model="showRegexList"
      @click="regexChosen"
      :multiple="multiple"
      :selected-values="localValue"
    />
  </div>
</template>

<script>
import VInput from "vuetify/lib/components/VInput/VInput.js";
import VMessages from "vuetify/lib/components/VMessages/VMessages";
import RegexCreateDialog from "@/components/RegexCreateDialog";
import RegexList from "@/components/RegexList";

export default {
  name: "RegexSelector",
  components: {
    RegexList,
    RegexCreateDialog,
    VMessages
  },
  extends: VInput,
  data() {
    return {
      showRegexList: false,
      showRegexDialog: false,
      modified: false,
      localList: []
    };
  },
  props: {
    clearable: {
      type: Boolean,
      default: false
    },
    multiple: {
      type: Boolean,
      default: false
    },
    value: {
      type: Array,
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
    },
    prettyLocalValue() {
      let str = "";
      if (this.localValue == null) {
        return str;
      }
      for (let i = 0; i < this.localValue.length; i++) {
        str += this.localValue[i];
        if (i < this.localValue.length - 1) {
          str += ", ";
        }
      }
      return str;
    }
  },
  methods: {
    regexChosen(val) {
      this.localValue = val;
      if (!this.multiple) {
        this.showRegexList = false;
      }
    }
  }
};
</script>

<style scoped lang="scss">
.regex-btn {
  margin-right: 10px;
  margin-bottom: 10px;
}
.regex-text {
  margin: 5px 0 15px;
  color: white;
}
.err-msg {
  margin-bottom: 10px;
}
</style>
