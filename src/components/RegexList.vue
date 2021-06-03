<template>
  <VDialog max-width="600px" v-model="localValue">
    <VCard>
      <VCardTitle>
        Regular Expressions
      </VCardTitle>
      <VCardText>
        <VTextField
          label="Search"
          v-model="search"
          append-icon="$search"
          autofocus
        ></VTextField>
        <VList two-line>
          <VListItemGroup :multiple="multiple" v-model="selectedIndices">
            <VListItem
              v-for="value in regexes"
              :key="value.key"
              @click="itemClicked(value.key)"
            >
              <VListItemContent>
                <VListItemTitle>
                  {{ value.key }}
                </VListItemTitle>
                <VListItemSubtitle>
                  {{ value.value }}
                </VListItemSubtitle>
              </VListItemContent>
            </VListItem>
          </VListItemGroup>
        </VList>
        <VBtn @click="saveButtonClicked">Save</VBtn>
      </VCardText>
    </VCard>
  </VDialog>
</template>

<script>
export default {
  name: "RegexList",
  props: {
    multiple: {
      type: Boolean,
      default: false
    },
    value: {
      type: Boolean,
      required: true
    },
    selectedValues: {
      type: [Array, String],
      default: () => []
    }
  },
  mounted() {
    if (this.multiple) {
      this.localSelectedValues = this.selectedValues || [];
    }
  },
  data() {
    return {
      search: ""
    };
  },
  computed: {
    localValue: {
      get() {
        return this.value;
      },
      set(newVal) {
        this.$emit("input", newVal);
      }
    },
    localSelectedValues: {
      get() {
        return this.selectedValues;
      },
      set(newVal) {
        this.$emit("click", newVal);
      }
    },
    regexes() {
      const result = [];
      for (const regex in this.$store.state.regexes) {
        if (
          regex.toLowerCase().includes(this.search.toLowerCase()) ||
          this.$store.state.regexes[regex]
            .toLowerCase()
            .includes(this.search.toLowerCase())
        ) {
          const item = {};
          item.key = regex;
          item.value = this.$store.state.regexes[regex];
          if (this.multiple) {
            item.selected = this.localSelectedValues.includes(regex);
          }
          result.push(item);
        }
      }
      return result;
    },
    selectedIndices: {
      get() {
        const result = [];
        for (let i = 0; i < this.localSelectedValues.length; i++) {
          for (let j = 0; j < this.regexes.length; j++) {
            if (this.regexes[j].key === this.localSelectedValues[i]) {
              result.push(j);
            }
          }
        }
        return result;
      },
      set() {
        /* unused -- see itemClicked */
      }
    }
  },
  methods: {
    itemClicked(key) {
      if (this.multiple) {
        if (this.localSelectedValues.includes(key)) {
          this.localSelectedValues.splice(
            this.localSelectedValues.indexOf(key),
            1
          );
        } else {
          this.localSelectedValues.push(key);
        }
      } else {
        this.$emit("click", key);
      }
    },
    saveButtonClicked() {
      this.$emit("input", false);
    }
  }
};
</script>

<style scoped lang="scss"></style>
