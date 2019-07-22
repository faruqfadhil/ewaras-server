<script>
import { Line } from 'vue-chartjs'
import { CustomTooltips } from '@coreui/coreui-plugin-chartjs-custom-tooltips'
import { getStyle, hexToRgba } from '@coreui/coreui/dist/js/coreui-utilities'

export default {
  extends: Line,
  props: ["dataspo","options","labels"],
  mounted() {
    this.renderLineChart();
  },
  computed: {
    chartDataSpo: function(){
      return this.dataspo;
    },
    labelsData: function(){
      return this.labels;
    }
  },
  methods: {
    renderLineChart: function() {
    const brandSuccess = getStyle('--success') || '#4dbd74'
    const brandInfo = getStyle('--info') || '#20a8d8'
    const brandDanger = getStyle('--danger') || '#f86c6b'
    const brandWarning = getStyle('--warning') || '#ffc107'
    this.renderChart(
      {
        labels: this.labelsData,
        datasets: [
          {
            label: 'Spo',
            backgroundColor: hexToRgba('#ffc107', 10),
            borderColor: brandWarning,
            pointHoverBackgroundColor: '#fff',
            borderWidth: 4,
            data: this.chartDataSpo
          }
        ]
      },
      { 
        tooltips: {
          enabled: false,
          custom: CustomTooltips,
          intersect: true,
          mode: 'index',
          position: 'nearest',
          callbacks: {
            labelColor: function (tooltipItem, chart) {
              return { backgroundColor: chart.data.datasets[tooltipItem.datasetIndex].borderColor }
            }
          }
        },
        elements: {
        point: {
          radius: 0,
          hitRadius: 10,
          hoverRadius: 4,
          hoverBorderWidth: 3
        }
        },
        // responsive: true, 
        maintainAspectRatio: false 
      }
    )
    }
  },
  watch: {
    dataspo: function() {
      // this._chart.destroy();
      console.log(this.dataheart);
      console.log(this.options);
      //this.renderChart(this.data, this.options);
      this.renderLineChart();
    }
  }
};
</script>
