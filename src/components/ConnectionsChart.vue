<script>
import { Scatter } from "vue-chartjs";

export default {
  name: "ConnectionsChart",
  extends: Scatter,
  data() {
    return {
      chartData: {
        datasets: [
          {
            label: "Active Connections",
            showLine: true,
            lineTension: 0,
            pointBackgroundColor: "rgb(255,255,255)",
            borderColor: "rgb(9,222,205)",
            borderWidth: 1,
            pointBorderColor: "rgb(255,255,255)",
            pointRadius: 0,
            data: []
          }
        ]
      },
      chartOptions: {
        responsive: true,
        scales: {
          xAxes: [
            {
              type: "time",
              time: {
                displayFormats: {
                  hour: "MM/DD HH:mm",
                  day: "MM/DD HH:mm"
                }
              },
              position: "bottom"
            }
          ],
          yAxes: [
            {
              type: "linear",
              position: "left",
              ticks: {
                beginAtZero: true
              }
            }
          ]
        }
      }
    };
  },
  computed: {
    sourceData() {
      return this.$store.state.connectionHistory;
    }
  },
  watch: {
    sourceData: {
      handler(newData) {
        this.chartData.datasets[0].data = [];
        const sortedKeys = Object.keys(newData).sort();
        let pointIndex = 0;
        for (let keyIndex = 0; keyIndex < sortedKeys.length; keyIndex++) {
          const keyAsInt = parseInt(sortedKeys[keyIndex]);
          const prevKeyAsInt = parseInt(sortedKeys[keyIndex - 1]);
          // If the time difference between two points is greater than 15 minutes, we should assume the
          // server was offline during that time period. Thus, add points with value 0 in between.
          if (pointIndex > 0 && keyAsInt - prevKeyAsInt > 900000) {
            this.chartData.datasets[0].data[pointIndex++] = {
              x: new Date(prevKeyAsInt + 60000),
              y: 0
            };
            this.chartData.datasets[0].data[pointIndex++] = {
              x: new Date(keyAsInt - 60000),
              y: 0
            };
          }

          // After we've added points with value 0 (if necessary), add this point to the graph.
          this.chartData.datasets[0].data[pointIndex++] = {
            x: new Date(keyAsInt),
            y: newData[sortedKeys[keyIndex]]
          };
        }
        this.$data._chart.update();
      },
      deep: true
    }
  },
  mounted() {
    const gradient = this.$refs.canvas
      .getContext("2d")
      .createLinearGradient(0, 0, 0, 450);
    gradient.addColorStop(0, "rgba(15,169,154,0.6)");
    gradient.addColorStop(1, "rgba(44,72,69,0.4)");
    this.chartData.datasets[0].backgroundColor = gradient;
    this.renderChart(this.chartData, this.chartOptions);
  }
};
</script>
<style lang="scss" scoped></style>
