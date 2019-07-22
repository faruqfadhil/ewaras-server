<template>
<div>
   <bounce-spinner v-if="isLoading"></bounce-spinner>
  <div class="animated fadeIn" v-if="isLoading==false">
      <b-card-group class="mb-4">
        <b-card>
          <div class="h1 text-muted text-right mb-4">
            <i class="icon-people"></i>
          </div>
          <div class="h4 mb-0">{{dokterRegistered}}</div>
          <small class="text-muted text-uppercase font-weight-bold">Dokters Registered</small>
          <b-progress height="{}" class="progress-xs mt-3 mb-0" variant="info" :value="dokterRegistered"/>
        </b-card>
        <b-card>
          <div class="h1 text-muted text-right mb-4">
            <i class="icon-people"></i>
          </div>
          <div class="h4 mb-0">{{pasienRegistered}}</div>
          <small class="text-muted text-uppercase font-weight-bold">Patients Registered</small>
          <b-progress height="{}" class="progress-xs mt-3 mb-0" variant="success" :value="pasienRegistered"/>
        </b-card>
        <b-card>
          <div class="h1 text-muted text-right mb-4">
            <i class="icon-feed"></i>
          </div>
          <div class="h4 mb-0">{{deviceOnline}}</div>
          <small class="text-muted text-uppercase font-weight-bold">Device Online</small>
          <b-progress height="{}" class="progress-xs mt-3 mb-0" variant="warning" :value="deviceOnline"/>
        </b-card>
        <b-card>
          <div class="h1 text-muted text-right mb-4">
            <i class="icon-ghost"></i>
          </div>
          <div class="h4 mb-0">{{deviceOffline}}</div>
          <small class="text-muted text-uppercase font-weight-bold">Device Offline</small>
          <b-progress height="{}" class="progress-xs mt-3 mb-0" :value="deviceOffline"/>
        </b-card>
        <b-card>
          <div class="h1 text-muted text-right mb-4">
            <i class="icon-clock"></i>
          </div>
          <div class="h4 mb-0">{{devicePending}}</div>
          <small class="text-muted text-uppercase font-weight-bold">Device Pending</small>
          <b-progress height="{}" class="progress-xs mt-3 mb-0" variant="danger" :value="devicePending"/>
        </b-card>
      </b-card-group>
    <b-row>
      <b-col md="12">
        <b-card header="Requested Devices" class="card-accent-warning">
          <b-table
            class="mb-0 table-outline"
            striped
            responsive="sm"
            hover
            :items="tableItems"
            :fields="tableFields"
            head-variant="light"
          >
            <div slot="namaPasien" slot-scope="data">
              <img src="img/avatars/patient.png" width="50px" alt="farmers logo">
              <strong>{{data.item.nama}}</strong>
            </div>
            <div slot="key-alamat" slot-scope="data">
              <i class="icon-direction"></i>
              <strong> {{data.item.alamat}}</strong>
            </div>
              <div slot="key-telp" slot-scope="data">
              <h5>
                <b-badge variant="warning">{{data.item.noTelp}}</b-badge>
              </h5>
            </div>
            <div slot="key-id" slot-scope="data">
              <b-link class="card-header-action btn-minimize" v-b-toggle.collapse1>
                <h4><b-badge variant="primary" v-bind:id="data.item.perangkats_docs[0]._id" >Open ID <i class="icon-eye"></i></b-badge></h4>
              </b-link>
              <b-popover v-bind:target="data.item.perangkats_docs[0]._id" title="Device Id">
                <!-- <strong>{{data.item._id}}</strong> -->
                <h5>
                  <b-badge variant="secondary">{{data.item.perangkats_docs[0]._id}}</b-badge>
                </h5>
              </b-popover>
            </div>
            <div slot="key-status" >
              <h5>
                <b-badge variant="secondary">Pending</b-badge>
              </h5>
            </div>
            <div slot="key-tanggal" slot-scope="data">
               <h5> <b-badge variant="secondary">{{data.item.perangkats_docs[0].data[0].tanggal | formatDate}}</b-badge></h5> 
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
import 'vue-spinners/dist/vue-spinners.css';
import { BounceSpinner } from 'vue-spinners/dist/vue-spinners.common';
import moment from 'moment'

export default {
  name: "Admin",
    filters:{
    formatDate : function(value){
      if (value) {
        return moment(String(value)).format('DD-MMM-YYYY HH:mm:ss')
      }
    }
  },
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
      isLoading: true,
      dokterRegistered: 0,
      pasienRegistered: 0,
      deviceOnline: 0,
      deviceOffline: 0,
      devicePending: 0,
      selected: "Month",
      tableItems: [],
      tableFields: [
         {
          key:'namaPasien',
          label: 'Name'
        },
        { key: 'key-alamat', 
          label: 'Address'
        },
        { key: 'key-telp', 
          label: 'Phone'
        },
        { key: 'key-id', 
          label: 'Device Id' 
        },
        { key: 'key-status', 
          label: 'Device Status'
        },
        { key: 'key-tanggal', 
          label: 'Time' 
        }
      ]
    };
  },
  created() {
    this.checkSession();
  },
  methods: {

    async fetchDataPasien() {
      let response = await PostsService.allPasien(
        window.localStorage.getItem("token")
      );
      return response.data;
    },
    async fetchDataPasienPending() {
      let response = await PostsService.allPasienPending(
        window.localStorage.getItem("token")
      );
      return response.data;
    },
    async fetchDataDokter() {
      let response = await PostsService.allDokter(
        window.localStorage.getItem("token")
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
        if (window.localStorage.getItem("role") != Constants.ROLE_ADMIN) {
          // redirect to 404 page
          this.$router.push({ name: "Page404" });
        } else {
          this.firstLoad();
        }
      }
    },
    async firstLoad() {
      var active = 0,
        nonactive = 0,
        pending = 0;
      let response = await this.fetchDataPasien();
      let responseDataDokter = await this.fetchDataDokter();
      let responseDataPasienPending = await this.fetchDataPasienPending()
      let pasienData = response.data;
      let dokterData = responseDataDokter.data;
      let pasienDataPending = responseDataPasienPending.data
      this.isLoading=false

      this.dokterRegistered = dokterData.length;
      this.pasienRegistered = pasienData.length;
      console.log(pasienData)
      for (var i = 0; i < pasienData.length; i++) {
        switch (pasienData[i].perangkats_docs[0].statusDevice) {
          case Constants.DEVICE_ACTIVE:
            active++;
            break;
          case Constants.DEVICE_NONACTIVE:
            nonactive++;
            break;
          default:
            pending++;
        }
      }
      this.tableItems = pasienDataPending;
      this.deviceOnline = active;
      this.deviceOffline = nonactive;
      this.devicePending = pending;
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
