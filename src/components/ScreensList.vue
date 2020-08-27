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
        ></VTextField>
        <VList two-line>
          <VListItem
            v-for="(value, key) in $store.state.screens"
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
