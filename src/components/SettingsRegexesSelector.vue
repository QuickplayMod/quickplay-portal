<template>
  <VCard elevation="3" class="settings-regex-selector">
    <VCardTitle>Settings Regexes</VCardTitle>
    <VCardText>
      <VMessages
        :value="this.messagesToDisplay"
        v-if="this.messagesToDisplay.length > 0"
        color="error"
        class="err-msg"
      />
      <VRow>
        <VCol><p class="subtitle-2">Setting Name</p></VCol>
        <VCol><p class="subtitle-2">Regular Expression</p></VCol>
        <VCol><p class="subtitle-2">Actions</p></VCol>
      </VRow>
      <VRow v-for="(v, index) in localValue" :key="index">
        <VCol>
          <VTextField
            v-model="v.key"
            ref="settingsKeys"
            @change="valueUpdated"
          />
        </VCol>
        <VCol>
          <RegexSelector v-model="v.value" @input="valueUpdated" />
        </VCol>
        <VCol>
          <VBtn color="error" @click="removePair(index)">Remove</VBtn>
        </VCol>
      </VRow>
      <VRow>
        <VCol>
          <VTextField
            placeholder="Add new..."
            v-model="newValueInput"
            @keydown="newValueAdded"
          />
        </VCol>
        <VCol>
          <VBtn outlined color="primary lighten-2" disabled>Select</VBtn>
        </VCol>
        <VCol>
          <VBtn outlined color="error" disabled>Remove</VBtn>
        </VCol>
      </VRow>
    </VCardText>
  </VCard>
</template>

<script>
import RegexSelector from "@/components/RegexSelector";
import VInput from "vuetify/lib/components/VInput";
import VMessages from "vuetify/lib/components/VMessages";
export default {
  name: "SettingsRegexesSelector",
  components: { RegexSelector, VMessages },
  extends: VInput,
  data() {
    return {
      newValueInput: ""
    };
  },
  props: {
    value: {
      type: Object,
      required: true
    }
  },
  computed: {
    localValue: {
      get() {
        if (this.value == null) {
          return [];
        }
        const arr = [];
        for (const prop in this.value) {
          // eslint-disable-next-line no-prototype-builtins
          if (!this.value.hasOwnProperty(prop)) {
            continue;
          }
          arr.push({ key: prop, value: this.value[prop] });
        }
        return arr;
      },
      set(newVal) {
        const obj = {};
        for (let i = 0; i < newVal.length; i++) {
          // Skip saving values which are already set, an error is thrown for them
          if (obj[newVal[i].key] !== undefined) {
            continue;
          }
          obj[newVal[i].key] = newVal[i].value;
        }
        this.$emit("input", obj);
      }
    }
  },
  methods: {
    newValueAdded() {
      this.$nextTick(() => {
        this.localValue.push({
          key: this.newValueInput,
          value: ""
        });
        this.localValue = [...this.localValue];
        this.$nextTick(() => {
          this.$refs.settingsKeys[this.$refs.settingsKeys.length - 1].$el
            .getElementsByTagName("input")[0]
            .focus();
          this.newValueInput = "";
        });
      });
    },
    removePair(index) {
      this.localValue.splice(index, 1);
      this.localValue = [...this.localValue];
    },
    valueUpdated() {
      this.localValue = [...this.localValue];
    }
  }
};
</script>

<style scoped>
.settings-regex-selector {
  width: 100%;
  margin: 10px;
}
</style>
