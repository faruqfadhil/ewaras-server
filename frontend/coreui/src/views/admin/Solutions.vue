<template>
  <div>
    <bounce-spinner v-if="isLoading"></bounce-spinner>
    <div class="animated fadeIn" v-if="isLoading==false">
      <b-row>
        <b-modal
          variant="warning"
          class="modal-warning"
          ref="myModalRef"
          hide-footer
          title="Add solutions"
        >
          <div class="d-block">
            <b-form-group>
              
              <label class="mr-sm-2" for="basicSelect">Select Label:</label>
                <b-form-select v-model="labelSelected" id="basicSelect" :plain="true">
                <option
                  v-for="label in tableItemsLabel"
                  v-bind:value="label.labelIdentity"
                  v-bind:key="label.namaLabel"
                >{{label.namaLabel}}</option>
              </b-form-select>
              <br>
              <label class="mr-sm-2" for="treatment">Treatment:</label>
                  <b-form-textarea
                    id="treatment"
                    v-model="treatment"
                    rows="8"
                ></b-form-textarea>
                <label class="mr-sm-2" for="prevention">Prevention:</label>
                  <b-form-textarea
                    id="prevention"
                    v-model="prevention"
                    rows="8"
                ></b-form-textarea>
            </b-form-group>

          </div>
          <b-btn class="mt-3" variant="outline-warning" block @click="addSolution">Add Solution</b-btn>
        </b-modal>

        <b-col md="12">
          <b-card header="Labels List" class="card-accent-warning">
            <div slot="header">
              <b>Solutions</b>
              <div class="card-header-actions">
                <b-button
                  type="button"
                  variant="warning"
                  @click="showModal"
                  class="mr-1"
                >Add solution</b-button>
              </div>
            </div>
            <b-table
              class="mb-0 table-outline"
              striped
              responsive="sm"
              hover
              :items="tableItems"
              :fields="tableFields"
              head-variant="light"
            >
              <div slot="key-identity" slot-scope="data">
                <i class="icon-ghost"></i>
                <strong>{{data.item.labelIdentity}}</strong>
              </div>
              <div slot="key-treatment" slot-scope="data">
                <strong>{{data.item.treatment}}</strong>
              </div>
              <div slot="key-prevention" slot-scope="data">
                <strong>{{data.item.prevention}}</strong>
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

export default {
  name: "Solutions",
  components: {
    Callout,
    BounceSpinner,
    CardLine1ChartExample,
    CardLine2ChartExample,
    CardLine3ChartExample,
    CardBarChartExample,
    MainChartExample,
    SocialBoxChartExample,
    CalloutChartExample
  },
  data: function() {
    return {
      labelSelected:"",
      treatment:"",
      prevention:"",
      isLoading: true,
      peternakRegistered: 0,
      sapiRegistered: 0,
      deviceOnline: 0,
      deviceOffline: 0,
      devicePending: 0,
      selected: "Month",
      tableItemsLabel: [],
      tableItems:[],
      tableFields: [
        {
          key: "key-identity",
          label: "Identity of label"
        },
        {
          key: "key-treatment",
          label: "Treatment"
        },
        {
          key: "key-prevention",
          label: "Prevention"
        }
      ]
    };
  },
  created() {
    this.checkSession();
  },
  methods: {
    async addSolution(){
        var objData = [{}]
        objData[0]["labelIdentity"] = this.labelSelected
        objData[0]["treatment"] = this.treatment
        objData[0]["prevention"] = this.prevention
        let upload = await this.addToServer(objData[0])
        this.$refs.myModalRef.hide()
        this.firstLoad()
        // console.log(objData[0])
        // console.log(this.labelSelected)
        // console.log(this.treatment)
        // console.log(this.prevention)
    },
    showModal() {
      /**
       * this function for show create cow form on modal
       */
      this.errors = [];
      this.$refs.myModalRef.show();
    },
    async fetchDataLabel() {
      let response = await PostsService.getAllLabel();
      return response.data;
    },
    async fetchDataSolutions() {
      let response = await PostsService.getAllSolutions();
      return response.data;
    },
    async addToServer(params){
      const response = await PostsService.addSolution(params);
      return response.data;
    },
    checkSession() {
      /**
       * check session and do action
       */
      if (!window.localStorage.getItem("token")) {
        this.$router.push({ name: "Login" });
      } else {
        if (window.localStorage.getItem("role") != Constants.ROLE_ADMIN) {
          // redirect to 404 page
          this.$router.push({ name: "Page404" });
        } else {
          this.firstLoad();
        }
      }
    },
    async firstLoad() {
      let responseData = await this.fetchDataLabel();
      let labelData = responseData.data;
      this.tableItemsLabel = labelData;
      let responseDataSolutions = await this.fetchDataSolutions()
      let solutionsData = responseDataSolutions.data
      this.tableItems = solutionsData
      this.isLoading = false;
    },
    variant(value) {
      let $variant;
      if (value <= 25) {
        $variant = "info";
      } else if (value > 25 && value <= 50) {
        $variant = "success";
      } else if (value > 50 && value <= 75) {
        $variant = "warning";
      } else if (value > 75 && value <= 100) {
        $variant = "danger";
      }
      return $variant;
    },
    flag(value) {
      return "flag-icon flag-icon-" + value;
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
