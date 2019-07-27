<template>
  <div class="animated fadeIn">
    <b-row>
      <b-col md="12">
        <b-card header="Monitoring" class="card-accent-warning">
          <b-card>
            <b-row>
              <b-col sm="5">
                <h4>
                  <img src="img/avatars/patient.png" width="50px" alt="CoreUI Logo">
                  {{patientName}}
                </h4>

                <b-badge v-bind:variant="getKondisi(CurrentConditions)">{{CurrentConditions== 0 ? "Abnormal":"Normal"}}</b-badge>|
                <b-badge v-bind:variant="getBadge(statusDevice)">{{ statusDevice == 0 ? "Nonactive": statusDevice == 1 ? "Active":"Pending"}}</b-badge>
              </b-col>
              <b-col sm="7">
                <b-form inline class="float-right">
                  <label class="mr-sm-2" for="inlineInput1">Start:</label>
                  <b-input id="inlineInput1" type="date" v-model="startDate"></b-input>
                  <label class="mx-sm-2" for="inlineInput2">End:</label>
                  <b-input id="inlineInput2" type="date" v-model="endDate"></b-input>
                  <label class="mr-sm-2"></label>
                  <b-button
                    v-b-tooltip.hover
                    title="Filter data"
                    type="button"
                    variant="primary"
                    class="float-right"
                    @click="filterData"
                  >
                    <i class="icon-magnifier"></i>
                  </b-button>
                  <label class="mr-sm-2"></label>
                  <b-button
                    v-b-tooltip.hover
                    title="Streaming data"
                    type="button"
                    variant="warning"
                    class="float-right"
                    @click="firstLoad"
                  >
                    <i class="icon-clock"></i>
                  </b-button>
                </b-form>
              </b-col>
            </b-row>
             <b-row>
               <b-col class="mb-sm-6 mb-0">
                  <bounce-spinner v-if="isLoading"></bounce-spinner>
                  <jantung-line-chart
                    v-if="isProcess"
                    chartId="chart-jantung-01"
                    :labels="labelsData"
                    :dataheart="dataChartHeart"
                    :options="{responsive: true, maintainAspectRatio: false}"
                  ></jantung-line-chart>
               </b-col>
                <b-col class="mb-sm-6 mb-0">
                  <bounce-spinner v-if="isLoading"></bounce-spinner>
                  <suhu-line-chart
                    v-if="isProcess"
                    chartId="chart-suhu-01"
                    :labels="labelsData"
                    :datatemperature="dataChartTemp"
                    :options="{responsive: true, maintainAspectRatio: false}"
                  ></suhu-line-chart>
               </b-col>
             </b-row>
             <b-row>
              <b-col class="mb-sm-6 mb-0">
                  <bounce-spinner v-if="isLoading"></bounce-spinner>
                  <spo-line-chart
                    v-if="isProcess"
                    chartId="chart-spo-01"
                    :labels="labelsData"
                    :dataspo="dataChartSpo"
                    :options="{responsive: true, maintainAspectRatio: false}"
                  ></spo-line-chart>
               </b-col>
                <b-col class="mb-sm-6 mb-0">
                  <bounce-spinner v-if="isLoading"></bounce-spinner>
                  <line-chart
                    v-if="isProcess"
                    :labels="labelsData"
                    :dataheart="dataChartHeart"
                    :datatemperature="dataChartTemp"
                    :dataspo="dataChartSpo"
                    :options="{responsive: true, maintainAspectRatio: false}"
                  ></line-chart>
               </b-col>
             </b-row>
            <!-- <bounce-spinner v-if="isLoading"></bounce-spinner>
            <line-chart
              v-if="isProcess"
              :labels="labelsData"
              :dataheart="dataChartHeart"
              :datatemperature="dataChartTemp"
              :dataspo="dataChartSpo"
              :options="{responsive: true, maintainAspectRatio: false}"
            ></line-chart> -->
            <div slot="footer">
              <b-row class="text-center">
                <b-col class="mb-sm-4 mb-0">
                  <div class="text-muted">Temperature</div>
                  <strong>{{currentTemp}}</strong>
                  <b-progress
                    height="{}"
                    class="progress-xs mt-2"
                    :precision="1"
                    v-bind:value="100"
                  ></b-progress>
                </b-col>

                <b-col class="mb-sm-4 mb-0">
                  <div class="text-muted">Heart Rate</div>
                  <strong>{{currentHeart}}</strong>
                  <b-progress
                    height="{}"
                    class="progress-xs mt-2"
                    :precision="1"
                    variant="danger"
                    v-bind:value="100"
                  ></b-progress>
                </b-col>
                <b-col class="mb-sm-4 mb-0">
                  <div class="text-muted">Spo</div>
                  <strong>{{currentSpo}}</strong>
                  <b-progress
                    height="{}"
                    class="progress-xs mt-2"
                    :precision="1"
                    variant="warning"
                    v-bind:value="100"
                  ></b-progress>
                </b-col>
              </b-row>
            </div>
          </b-card>
          <b-card>
            <!-- <b-row>  -->

            <!-- <b-table striped outlined stacked="sm" hover :items="tableItems" :fields="tableFields" head-variant="light" :current-page="currentPage" :per-page="perPage"> -->
            <b-table
              :hover="hover"
              :striped="striped"
              :bordered="bordered"
              :small="small"
              :fixed="fixed"
              responsive="sm"
              :items="tableItems"
              :fields="tableFields"
              :current-page="currentPage"
              :per-page="perPage"
            >
              <div slot="key-kondisi" slot-scope="data">
                <b-badge
                  :variant="getKondisi(data.item.kondisi)"
                >{{data.item.kondisi == 0 ? "Abnormal":"Normal"}}</b-badge>
              </div>
              <div slot="key-tanggal" slot-scope="data">
                <b-badge
                  :variant="dateFormatter(data.item.tanggal)"
                >{{data.item.tanggal | formatDate}}</b-badge>
              </div>
              <div slot="key-suhu" slot-scope="data">
                <strong>{{data.item.suhu.toFixed(2)}}</strong>
                <div class="small text-muted">Celcius</div>
              </div>
              <div slot="key-jantung" slot-scope="data">
                <strong>{{data.item.jantung.toFixed(2)}}</strong>
                <div class="small text-muted">BPM</div>
              </div>
              <div slot="key-spo" slot-scope="data">
                <strong>{{data.item.spo.toFixed(2)}}</strong>
                <div class="small text-muted">Percent</div>
              </div>
            </b-table>
            <nav>
              <b-pagination
                :total-rows="getRowCount(tableItems)"
                :per-page="perPage"
                v-model="currentPage"
                prev-text="Prev"
                next-text="Next"
                hide-goto-end-buttons
              />
            </nav>
            <!-- <nav>
              <b-pagination size="sm" :total-rows="tableItemsLength" :per-page="10" :limit="5" prev-text="prev" next-text="next" v-model="page"/>
            </nav>-->
            <!-- </b-row> -->
          </b-card>
        </b-card>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import CardLine1ChartExample from "../dashboard/CardLine1ChartExample";
import CardLine2ChartExample from "../dashboard/CardLine2ChartExample";
import CardLine3ChartExample from "../dashboard/CardLine3ChartExample";
import CardBarChartExample from "../dashboard/CardBarChartExample";
import MainChartExample from "../dashboard/MainChartExample";
import LineChart from "../dashboard/LineChart";
import JantungLineChart from "../pasien/JantungLineChart";
import SuhuLineChart from "../pasien/SuhuLineChart";
import SpoLineChart from "../pasien/SpoLineChart";
import SocialBoxChartExample from "../dashboard/SocialBoxChartExample";
import CalloutChartExample from "../dashboard/CalloutChartExample";
import { Callout } from "@coreui/vue";
import io from "socket.io-client";
import PostsService from "@/services/PostsService";
import Constants from "@/services/Constants";
import "vue-spinners/dist/vue-spinners.css";
import { BounceSpinner } from "vue-spinners/dist/vue-spinners.common";
import moment from "moment";

export default {
  name: "Pasien",
  filters: {
    formatDate: function(value) {
      if (value) {
        return moment(String(value)).format("DD-MMM-YYYY HH:mm:ss");
      }
    }
  },
  props: {
    hover: {
      type: Boolean,
      default: false
    },
    striped: {
      type: Boolean,
      default: false
    },
    bordered: {
      type: Boolean,
      default: false
    },
    small: {
      type: Boolean,
      default: false
    },
    fixed: {
      type: Boolean,
      default: false
    }
  },
  components: {
    Callout,
    BounceSpinner,
    // myComponent,
    LineChart,
    JantungLineChart,
    SuhuLineChart,
    SpoLineChart,
    CardLine1ChartExample,
    CardLine2ChartExample,
    CardLine3ChartExample,
    CardBarChartExample,
    MainChartExample,
    SocialBoxChartExample,
    CalloutChartExample
  },
  data() {
    return {
      // INITIAL
      patientName:"",
      CurrentConditions: "",
      statusDevice: "",
      tableItems: [],
      tableFields: [
        {
          key:'key-kondisi',
          label:'Condition'
        },
        { key: 'key-tanggal', 
          label: 'Time' 
        },
        { key: 'key-suhu', 
          label: 'Temperature' 
        },
        { key: 'key-jantung', 
          label: 'Heart Rate' 
        },
        { key: 'key-spo', 
          label: 'Oxygen'
        }
      ],
      dataChartHeart: [],
      dataChartTemp: [],
      dataChartSpo: [],
      isLoading: false,
      isProcess: true,
      currentPage: 1,
      perPage: 5,
      totalRows: 0,
      page: 1,
      tableItemsLength: 0,
      labelsData: [],
      currentTemp: 0,
      currentHeart: 0,
      currentSpo:0,
      socket: io(Constants.SOCKET_SERVER),
      dateOnFormat: "",
      startDate: "",
      endDate: "",
      // INITIAL




      
      
      
      conditions: "",
      test: [4, 4, 4, 4, 4, 4],
      nameOfCow: "",

      




    };
  },
  created() {
    this.checkSession();
  },
  methods: {
    getRowCount(items) {
      return items.length;
    },
    filterData: function() {
      this.processDataInTime();
    },
    checkSession() {
      /**
       * check session and do action
       */
      if (!window.localStorage.getItem("token")) {
        this.$router.push({ name: "Login" });
      } else {
        if (window.localStorage.getItem("role") != Constants.ROLE_PASIEN) {
          // redirect to 404 page
          this.$router.push({ name: "Page404" });
          // console.log(Constants.ROLE_PASIEN)
        } else {
          this.firstLoad();
        }
      }
    },
    // FETCH DATA
    async fetchDataFirst() {
      const response = await PostsService.detailPasien(
        window.localStorage.getItem("token"),
        {
          idPasien: window.localStorage.getItem("id_pasien")
        }
      );
      return response.data;
    },
    async fetchDataInTime() {
      const response = await PostsService.perangkatSpecificTime(
        {
          idPasien: window.localStorage.getItem("id_pasien"),
          start: this.startDate,
          end: this.endDate
        }
      );
      return response.data;
    },
    // async fetchDataSapi() {
    //   const response = await PostsService.getSapiDetail(
    //     window.localStorage.getItem("token"),
    //     this.$route.params.id
    //   );
    //   return response.data;
    // },
    // async fetchDataToday() {
    //   const response = await PostsService.getDataToday(
    //     window.localStorage.getItem("token"),
    //     {
    //       idSapi: this.$route.params.id
    //     }
    //   );
    //   return response.data;
    // },

    // FETCH DATA
    soket(id_perangkat) {
      this.socket.on(
        "/topic/ewaras/detail/" + id_perangkat,
        perangkatData => {
          const pasienData = perangkatData[0]
          // this.tableItems = sapiData.perangkat.data;
          this.currentTemp = pasienData.perangkats_docs[0].data[pasienData.perangkats_docs[0].data.length-1].suhu.toFixed(2);
          this.currentHeart = pasienData.perangkats_docs[0].data[pasienData.perangkats_docs[0].data.length-1].jantung.toFixed(2);
          this.currentSpo = pasienData.perangkats_docs[0].data[pasienData.perangkats_docs[0].data.length-1].spo.toFixed(2);
          this.CurrentConditions = pasienData.perangkats_docs[0].data[pasienData.perangkats_docs[0].data.length-1].kondisi
          this.statusDevice = pasienData.perangkats_docs[0].statusDevice
          this.dateFormatter(
            pasienData.perangkats_docs[0].data[pasienData.perangkats_docs[0].data.length-1].tanggal
          );
          // Chart operation
          if (this.dataChartHeart.length > 120) {
            this.dataChartHeart.shift();
            this.dataChartTemp.shift();
            this.dataChartSpo.shift();
            this.labelsData.shift();

            this.dataChartHeart.push(this.currentHeart);
            this.dataChartTemp.push(this.currentTemp);
            this.dataChartSpo.push(this.currentSpo);
            this.labelsData.push(this.dateOnFormat);
          } else {
            this.dataChartHeart.push(this.currentHeart);
            this.dataChartTemp.push(this.currentTemp);
            this.dataChartSpo.push(this.currentSpo);
            this.labelsData.push(this.dateOnFormat);
          }

          //=======
        }
      );
    },

    async firstLoad() {
      this.dataChartHeart = [];
      this.dataChartTemp = [];
      this.dataChartSpo = []
      this.labelsData = [];
      const response = await this.fetchDataFirst()
      let pasienData = response.data[0]
      this.patientName = pasienData.pasien_docs[0].nama
      this.CurrentConditions= pasienData.perangkats_docs[0].data[pasienData.perangkats_docs[0].data.length-1].kondisi
      this.statusDevice = pasienData.perangkats_docs[0].statusDevice
      // this.tableItems = pasienData.perangkats_docs[0].data
      this.soket(pasienData.perangkats_docs[0]._id)

    },
    async processDataInTime() {
      this.isLoading = true;
      this.isProcess = false;
      const response = await this.fetchDataInTime();
      let pasienData = response.data[0];
      this.socket.removeListener("/topic/ewaras/detail/" + pasienData.perangkats_docs[0]._id);
      this.dataChartHeart = [];
      this.dataChartTemp = [];
      this.dataChartSpo = []
      this.labelsData = [];
      this.tableItems = [];

      this.tableItems = pasienData.perangkats_docs[0].data
      this.tableItemsLength = this.tableItems.length;
      this.CurrentConditions= pasienData.perangkats_docs[0].data[pasienData.perangkats_docs[0].data.length-1].kondisi
      this.statusDevice = pasienData.perangkats_docs[0].statusDevice
     
      this.currentTemp = pasienData.perangkats_docs[0].data[pasienData.perangkats_docs[0].data.length-1].suhu.toFixed(2);
      this.currentHeart = pasienData.perangkats_docs[0].data[pasienData.perangkats_docs[0].data.length-1].jantung.toFixed(2);
      this.currentSpo = pasienData.perangkats_docs[0].data[pasienData.perangkats_docs[0].data.length-1].spo.toFixed(2);
          
      for (var i = 0; i < pasienData.perangkats_docs[0].data.length; i++) {
        this.dataChartHeart.push(pasienData.perangkats_docs[0].data[i].jantung.toFixed(2));
        this.dataChartTemp.push(pasienData.perangkats_docs[0].data[i].suhu.toFixed(2));
        this.dataChartSpo.push(pasienData.perangkats_docs[0].data[i].spo.toFixed(2));
        
        this.dateFormatter(pasienData.perangkats_docs[0].data[i].tanggal);
        this.labelsData.push(this.dateOnFormat);
      }
      this.isProcess = true;
      this.isLoading = false;
    },
    getBadge(status) {

      return status == 0 ? "danger": status == 1 ? "success":"default"
    },
    getKondisi(tmp){
      return tmp == 0 ? 'danger' : 'success'
    },
    dateFormatter(date) {
      var created_date = new Date(date);
      var months = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec"
      ];
      var year = created_date.getFullYear();
      var month = months[created_date.getMonth()];
      var date = created_date.getDate();
      var hour = created_date.getHours();
      var min = created_date.getMinutes();
      var sec = created_date.getSeconds();
      var time =
        date + "," + month + " " + year + " " + hour + ":" + min + ":" + sec; // final date with time, you can use this according your requirement
      this.dateOnFormat = time;
      return "secondary";
    },
    toDetail(id) {
      this.$router.push({ name: "Details", params: { id: id } });
      console.log(id);
    }
  }
};
</script>

<style>
/* IE fix */
#card-chart-01,
#card-chart-02 {
  width: 100% !important;
}
.list-sapi-header {
  color: white;
}
.brand-card-header {
  background-color: #ffc107 !important;
}
.header-section {
  text-align: center;
}
</style>
