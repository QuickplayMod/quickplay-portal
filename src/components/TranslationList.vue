<template>
  <VDialog max-width="600px" v-model="localValue">
    <VCard>
      <VCardTitle>
        Translations
      </VCardTitle>
      <VCardText>
        <VTextField
          label="Search"
          v-model="search"
          append-icon="$search"
          autofocus
        ></VTextField>
        <VList two-line>
          <VListItem
            v-for="(value, key) in translations"
            :key="key"
            @click="itemClicked(key)"
          >
            <VListItemContent>
              <VListItemTitle>
                {{ value }}
              </VListItemTitle>
              <VListItemSubtitle>
                {{ key }}
              </VListItemSubtitle>
            </VListItemContent>
          </VListItem>
        </VList>
      </VCardText>
    </VCard>
  </VDialog>
</template>

<script>
export default {
  name: "TranslationList",
  props: {
    value: {
      type: Boolean,
      required: true
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
    translations() {
      const result = {};
      for (const translation in this.$store.state.translations) {
        const lowerCaseTranslationKey = translation.toLowerCase();
        if (!this.$store.state.translations[translation]["en_us"]) {
          continue;
        }
        if (
          lowerCaseTranslationKey.includes(this.search.toLowerCase()) ||
          this.$store.state.translations[translation]["en_us"]
            .toLowerCase()
            .includes(this.search.toLowerCase())
        ) {
          result[translation] = this.$store.state.translations[translation][
            "en_us"
          ];
        }
      }
      return result;
    }
  },
  methods: {
    itemClicked(key) {
      this.$emit("click", key);
    }
  }
};
</script>

<style scoped lang="scss"></style>
