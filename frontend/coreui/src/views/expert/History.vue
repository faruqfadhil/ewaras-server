<template>
  <div>
    <div class="animated fadeIn">
      <b-row>
        <b-col md="12">
          <b-card class="bg-secondary text-center">
            <b-form inline>
              <label class="mr-sm-2" for="basicSelect">Select Cow:</label>
              <b-form-select v-model="cowSelected" id="basicSelect" :plain="true">
                <option
                  v-for="cow in tableItemsSapi"
                  v-bind:value="cow._id"
                  v-bind:key="cow._id"
                >{{cow.namaSapi}}</option>
              </b-form-select>
              <label class="mx-sm-2" for="inlineInput1">Start:</label>
              <b-input id="inlineInput1" type="date" v-model="startDate"></b-input>
              <label class="mx-sm-2" for="inlineInput2">End:</label>
              <b-input id="inlineInput2" type="date" v-model="endDate"></b-input>
              <label class="mr-sm-2"></label>
              <b-button type="button" variant="primary" @click="filterWith">
                <i class="icon-magnifier"></i>
                Filter Data
              </b-button>
            </b-form>
          </b-card>
        </b-col>
      </b-row>
      <b-row>
        <b-col md="6">
          <b-card header="Our cows diseases" class="card-accent-warning">
            <bounce-spinner v-if="isLoadingPie"></bounce-spinner>
            <div class="chart-wrapper">
              <pie-example
                v-if="isLoadingPie==false"
                chartId="chart-pie-01"
                :dataPie="dataPie"
                :labelPie="labelPie"
                :backgroundPie="backgroundPie"
              />
            </div>
          </b-card>
        </b-col>
        <b-col md="6">
          <b-card header="Symptoms of the disease most often occur" class="card-accent-warning">
            <bounce-spinner v-if="isLoadingPie"></bounce-spinner>
            <div class="chart-wrapper">
              <bar-example
                v-if="isLoadingBar==false"
                chartId="chart-bar-01"
                :dataBar="dataBar"
                :labelBar="labelBar"
                :backgroundBar="backgroundBar"
              />
            </div>
          </b-card>
        </b-col>
      </b-row>
      <b-row>
        <b-col md="12">
          <b-card header="Symptoms List" class="card-accent-warning">
            <bounce-spinner v-if="isLoadingTable"></bounce-spinner>
            <b-table
              v-if="isLoadingTable==false"
              class="mb-0 table-outline"
              striped
              responsive="sm"
              hover
              :items="tableGejala"
              :fields="tableFields"
              head-variant="light"
            >
              <div slot="key-gejala" slot-scope="data">
                <i class="icon-ghost"></i>
                <strong>{{data.item.gejala}}</strong>
              </div>
              <div slot="key-total" slot-scope="data">
                <i class="icon-key"></i>
                <strong>{{data.item.total}}</strong>
              </div>
            </b-table>
          </b-card>
        </b-col>
      </b-row>
    </div>
  </div>
</template>

<script>
import CardLine1ChartExample from "../dashboard/CardLine1ChartExample";
import CardLine2ChartExample from "../dashboard/CardLine2ChartExample";
import CardLine3ChartExample from "../dashboard/CardLine3ChartExample";
import CardBarChartExample from "../dashboard/CardBarChartExample";
import MainChartExample from "../dashboard/MainChartExample";
import SocialBoxChartExample from "../dashboard/SocialBoxChartExample";
import CalloutChartExample from "../dashboard/CalloutChartExample";
import { Callout } from "@coreui/vue";
import PostsService from "@/services/PostsService";
import Constants from "@/services/Constants";
import "vue-spinners/dist/vue-spinners.css";
import { BounceSpinner } from "vue-spinners/dist/vue-spinners.common";
import PieExample from "../charts/PieExample";
import BarExample from "../charts/BarExample";

export default {
  name: "History",
  components: {
    Callout,
    BounceSpinner,
    CardLine1ChartExample,
    CardLine2ChartExample,
    CardLine3ChartExample,
    CardBarChartExample,
    MainChartExample,
    SocialBoxChartExample,
    CalloutChartExample,
    PieExample,
    BarExample
  },
  data: function() {
    return {
      //====alert=====
      dismissSecs: 10,
      dismissCountDown: 0,
      showDismissibleAlert: false,
      //====alert=====
      //  ===== pie chart ===
      backgroundPie: ["#41B883", "#f4aa42", "#00D8FF", "#DD1B16"],
      labelPie: [],
      dataPie: [],
      // ==== pie chart ===
      //  ===== bar chart ===
      backgroundBar: ["#41B883", "#f4aa42", "#00D8FF", "#DD1B16"],
      labelBar: [],
      dataBar: [],
      // ==== bar chart ===
      // ===loading state===
      isLoadingBar: true,
      isLoadingPie: true,
      isLoadingTable: true,
      // ===loading state===
      cowSelected: "",
      startDate: "",
      endDate: "",
      tableItemsSapi: [],
      tableGejala: [],
      tableFields: [
        {
          key: "key-gejala",
          label: "Symptoms"
        },
        {
          key: "key-total",
          label: "Total Incident"
        }
      ]
    };
  },
  created() {
    this.checkSession();
  },
  methods: {
    async filterWith() {
      this.dataPie = [];
      this.labelPie = [];
      this.dataBar = [];
      this.labelBar = [];
      this.isLoadingPie = true;
      this.isLoadingBar = true;
      this.isLoadingTable = true;
      if (this.startDate == "" && this.endDate == "") {
        // fetch all data by sapi
        if (this.cowSelected == "") {
          this.firstLoad();
        } else {
          var responseDataDiagnoses = await this.fetchDataDiagnoseBySapi(
            this.cowSelected
          );
          var responseDataGejala = await this.fetchDataGejalaBySapiLimit(
            this.cowSelected
          );
          var responseDataGejalaTable = await this.fetchDataGejalaBySapi(
            this.cowSelected
          );
        }
      } else {
        var responseDataDiagnoses = await this.fetchDataDiagnoseBySapiInTime(
          this.startDate,
          this.endDate,
          this.cowSelected
        );
        var responseDataGejala = await this.fetchDataGejalaBySapiInTimeLimit(
          this.startDate,
          this.endDate,
          this.cowSelected
        );
        var responseDataGejalaTable = await this.fetchDataGejalaBySapiInTime(
          this.startDate,
          this.endDate,
          this.cowSelected
        );
      }
      for (var i = 0; i < responseDataDiagnoses.data.length; i++) {
        this.dataPie.push(responseDataDiagnoses.data[i].total);
        this.labelPie.push(responseDataDiagnoses.data[i].diagnose);
      }
      for (var i = 0; i < responseDataGejala.data.length; i++) {
        this.dataBar.push(responseDataGejala.data[i].total);
        this.labelBar.push(responseDataGejala.data[i].gejala);
      }
      this.tableGejala = responseDataGejalaTable.data;
      this.isLoadingPie = false;
      this.isLoadingBar = false;
      this.isLoadingTable = false;
    },
    async fetchDataSapi() {
      const response = await PostsService.getSapi(
        window.localStorage.getItem("token")
      );
      return response.data;
    },
    async fetchAllDataDiagnose() {
      const response = await PostsService.getAllDiagnoses();
      return response.data;
    },
    async fetchAllDataGejala() {
      const response = await PostsService.getAllGejala();
      return response.data;
    },
    async fetchAllDataGejalaLimit() {
      const response = await PostsService.getAllGejalaLimit();
      return response.data;
    },
    async fetchDataDiagnoseBySapi(idSapi) {
      const response = await PostsService.getDiagnoseBySapi(idSapi);
      return response.data;
    },
    async fetchDataDiagnoseBySapiInTime(start, end, idSapi) {
      const response = await PostsService.getDiagnoseBySapiInTime(
        start,
        end,
        idSapi
      );
      return response.data;
    },
    async fetchDataGejalaBySapi(idSapi) {
      const response = await PostsService.getGejalaBySapi(idSapi);
      return response.data;
    },
    async fetchDataGejalaBySapiLimit(idSapi) {
      const response = await PostsService.getGejalaBySapiLimit(idSapi);
      return response.data;
    },
    async fetchDataGejalaBySapiInTime(start, end, idSapi) {
      const response = await PostsService.getGejalaBySapiInTime(
        start,
        end,
        idSapi
      );
      return response.data;
    },
    async fetchDataGejalaBySapiInTimeLimit(start, end, idSapi) {
      const response = await PostsService.getGejalaBySapiInTimeLimit(
        start,
        end,
        idSapi
      );
      return response.data;
    },
    checkSession() {
      /**
       * check session and do action
       */
      if (!window.localStorage.getItem("token")) {
        this.$router.push({ name: "Login" });
      } else {
        if (window.localStorage.getItem("role") != Constants.ROLE_FARMERS) {
          // redirect to 404 page
          this.$router.push({ name: "Page404" });
        } else {
          this.firstLoad();
        }
      }
    },
    async firstLoad() {
      this.dataPie = [];
      this.labelPie = [];
      this.dataBar = [];
      this.labelBar = [];
      this.isLoadingBar = true;
      this.isLoadingPie = true;
      this.isLoadingTable = true;
      const response = await this.fetchDataSapi();
      const responseDataDiagnoses = await this.fetchAllDataDiagnose();
      const responseDataGejala = await this.fetchAllDataGejalaLimit();
      const responseTable = await this.fetchAllDataGejala();
      for (var i = 0; i < responseDataDiagnoses.data.length; i++) {
        this.dataPie.push(responseDataDiagnoses.data[i].total);
        this.labelPie.push(responseDataDiagnoses.data[i].diagnose);
      }
      for (var i = 0; i < responseDataGejala.data.length; i++) {
        this.dataBar.push(responseDataGejala.data[i].total);
        this.labelBar.push(responseDataGejala.data[i].gejala);
      }
      this.tableGejala = responseTable.data;
      this.isLoadingPie = false;
      this.isLoadingBar = false;
      this.isLoadingTable = false;
      let sapiData = response.data;
      this.tableItemsSapi = sapiData;
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
</style>
