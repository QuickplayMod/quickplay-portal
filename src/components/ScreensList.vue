<template>
  <VDialog max-width="600px" v-model="localValue">
    <VCard>
      <VCardTitle>
        Screens
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
            v-for="(value, key) in screens"
            :key="key"
            @click="itemClicked(key)"
          >
            <VListItemContent>
              <VListItemTitle>
                {{ key }}
              </VListItemTitle>
              <VListItemSubtitle>
                {{ { buttons: value.buttons } }}
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
  name: "ScreensList",
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
    screens() {
      const result = {};
      const all = this.$store.state.screens;
      for (const screen in all) {
        if (screen.toLowerCase().includes(this.search.toLowerCase())) {
          result[screen] = all[screen];
        }
      }
      return result;
    },
    localValue: {
      get() {
        return this.value;
      },
      set(newVal) {
        this.$emit("input", newVal);
      }
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
