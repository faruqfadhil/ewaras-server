<script>
import { Bar } from "vue-chartjs";
import { CustomTooltips } from "@coreui/coreui-plugin-chartjs-custom-tooltips";

export default {
  extends: Bar,
  props: ["dataBar", "labelBar", "backgroundBar"],
  mounted() {
    // Overwriting base render method with actual data.
    this.renderBarChart()
  },
  computed: {
    chartDataBar: function() {
      return this.dataBar;
    },
    labelsDataBar: function() {
      return this.labelBar;
    },
    backgroundDataBar: function() {
      return this.backgroundBar;
    }
  },
  methods: {
    renderBarChart: function() {
      this.renderChart(
        {
          labels: this.labelsDataBar,
          datasets: [
            {
              label: "Symptoms",
              backgroundColor: this.backgroundDataBar,
              data: this.chartDataBar
            }
          ]
        },
        {
          responsive: true,
          maintainAspectRatio: true,
          tooltips: {
            enabled: false,
            custom: CustomTooltips,
            intersect: true,
            mode: "index",
            position: "nearest",
            callbacks: {
              labelColor: function(tooltipItem, chart) {
                return {
                  backgroundColor:
                    chart.data.datasets[tooltipItem.datasetIndex]
                      .backgroundColor
                };
              }
            }
          }
        }
      );
    }
  },
  watch: {
    dataBar: function(){
      this.renderBarChart()
    }
  }
};
</script>
