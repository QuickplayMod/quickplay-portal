<template>
  <div class="conn-graph">
    <h2 class="title">Active Connections</h2>
    <div class="conn-graph-flex">
      <div class="y-axis">
        <p class="top">{{ max }}</p>
        <p class="bottom">{{ min }}</p>
      </div>
      <VSparkline
        class="graph"
        auto-draw
        :value="[0, 1, 2, 3, 4, 2, 6, 12, 9]"
        :gradient="['#0fa99a', '#2c4845']"
        smooth
      />
    </div>
    <div class="x-axis">
      <p class="left">{{ start }}</p>
      <p class="right">{{ end }}</p>
    </div>
  </div>
</template>

<script lang="ts">
import moment from "moment";
export default {
  name: "ConnectionsChart",
  computed: {
    min(): string {
      return parseInt("0").toLocaleString();
    },
    max(): string {
      return parseInt("20000").toLocaleString();
    },
    start(): string {
      return moment()
        .subtract(7, "days")
        .format("MM/DD/YY");
    },
    end(): string {
      return moment().format("MM/DD/YY");
    }
  }
};
</script>

<style lang="scss" scoped>
.conn-graph {
  .graph {
    width: 100%;
  }
  .title {
    text-align: center;
  }
  .conn-graph-flex {
    display: flex;
    .y-axis {
      @media (max-width: 300px) {
        display: none;
      }
      @media (max-width: 450px) {
        font-size: 10px;
      }
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      * {
        padding: 0;
        text-align: right;
      }
    }
  }
  .x-axis {
    .left {
      float: left;
    }
    .right {
      float: right;
    }
  }
}
</style>
