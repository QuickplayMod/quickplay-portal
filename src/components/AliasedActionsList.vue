<template>
  <VDialog max-width="600px" v-model="localValue">
    <VCard>
      <VCardTitle>
        Aliased Actions
      </VCardTitle>
      <VCardText>
        <VTextField
          label="Search"
          v-model="search"
          append-icon="$search"
        ></VTextField>
        <VList two-line>
          <VListItem
            v-for="(value, key) in $store.state.aliasedActions"
            :key="key"
            @click="itemClicked(value)"
          >
            <VListItemContent>
              <VListItemTitle>
                {{ key }}
              </VListItemTitle>
              <VListItemSubtitle>
                {{ { action: value.action } }}
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
  name: "AliasedActionsList",
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
    itemClicked(button) {
      this.$emit("click", button);
    }
  }
};
</script>

<style scoped lang="scss"></style>
