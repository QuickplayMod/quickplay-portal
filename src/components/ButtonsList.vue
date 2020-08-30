<template>
  <VDialog max-width="600px" v-model="localValue">
    <VCard>
      <VCardTitle>
        Buttons
      </VCardTitle>
      <VCardText>
        <VTextField
          label="Search"
          v-model="search"
          append-icon="$search"
        ></VTextField>
        <VList two-line>
          <VListItem
            v-for="(value, key) in buttons"
            :key="key"
            @click="itemClicked(value)"
          >
            <VListItemContent>
              <VListItemTitle>
                {{ key }}
              </VListItemTitle>
              <VListItemSubtitle>
                {{ { actions: value.actions } }}
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
  name: "ButtonsList",
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
    buttons() {
      const result = {};
      const all = this.$store.state.buttons;
      for (const button in all) {
        if (button.toLowerCase().includes(this.search.toLowerCase())) {
          result[button] = all[button];
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
    itemClicked(button) {
      this.$emit("click", button);
    }
  }
};
</script>

<style scoped lang="scss"></style>
