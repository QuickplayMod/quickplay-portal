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
        <VList three-line>
          <VListItem
            v-for="(value, key) in aliasedActions"
            :key="key"
            @click="itemClicked(value)"
          >
            <VListItemContent>
              <VListItemTitle>
                {{ key }}
              </VListItemTitle>
              <VListItemSubtitle>
                {{ getActionName(value.action) }}
              </VListItemSubtitle>
              <VListItemSubtitle>
                {{ getActionArgs(value.action) }}
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
    aliasedActions() {
      const result = {};
      const all = this.$store.state.aliasedActions;
      for (const aliasedAction in all) {
        if (aliasedAction.toLowerCase().includes(this.search.toLowerCase())) {
          result[aliasedAction] = all[aliasedAction];
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
    },
    getActionName(action) {
      return action.constructor.name;
    },
    getActionArgs(action) {
      let str = "";
      for (let i = 0; i < action.payloadObjs.length; i++) {
        str += action.getPayloadObjectAsString(i);
        if (i < action.payloadObjs.length - 1) {
          str += ", ";
        }
      }
      return str;
    }
  }
};
</script>

<style scoped lang="scss"></style>
