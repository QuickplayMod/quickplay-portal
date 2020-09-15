<template>
  <VDialog max-width="800px" v-model="localValue">
    <template v-slot:activator="{ on, attrs }">
      <slot :attrs="attrs" :on="on" name="activator"></slot>
    </template>
    <VCard>
      <VCardTitle class="headline">
        Edit Log
      </VCardTitle>
      <VCardText>
        <p>Most recent items appear at the top.</p>
        <div class="log">
          {{ logText }}
        </div>
      </VCardText>
    </VCard>
  </VDialog>
</template>

<script>
import moment from "moment";
export default {
  name: "EditLog",
  props: {
    value: {
      type: Boolean,
      required: true
    },
    editLog: {
      type: Array,
      required: true
    }
  },
  computed: {
    logText() {
      let str = "";
      const sortedEditLog = this.editLog;
      sortedEditLog.sort(
        (a, b) => b.timestamp.getTime() - a.timestamp.getTime()
      );
      for (let i = 0; i < sortedEditLog.length; i++) {
        let eventType;
        if (sortedEditLog[i].deleted) {
          eventType = " deleted ";
        } else if (sortedEditLog[i].prevVersion) {
          eventType = " edited ";
        } else {
          eventType = " created ";
        }

        str +=
          moment(sortedEditLog[i].timestamp).format("MM/DD/YY HH:mm:ss") +
          " : User " +
          sortedEditLog[i].editedBy +
          eventType +
          sortedEditLog[i].itemType.replace(/_/g, " ") +
          " " +
          sortedEditLog[i].itemKey +
          ".\n";
      }
      return str;
    },
    localValue: {
      get() {
        return this.value;
      },
      set(newVal) {
        this.$emit("input", newVal);
      }
    }
  }
};
</script>

<style scoped lang="scss">
.log {
  font-family: monospace;
  color: white;
  background-color: #333;
  padding: 10px;
  max-height: 500px;
  overflow-y: scroll;
  white-space: pre-line;
}
</style>
