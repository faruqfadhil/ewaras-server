<template>
<div>
    <bounce-spinner v-if="isLoading"></bounce-spinner>
  <div class="animated fadeIn" v-if="isLoading==false">
    <b-row>
      <b-col md="12">
        <b-card header="Attributes List" class="card-accent-warning">
          <b-table
            class="mb-0 table-outline"
            striped
            responsive="sm"
            hover
            :items="tableItems"
            :fields="tableFields"
            head-variant="light"
          >
            <div slot="key-nik" slot-scope="data">
              <i class="icon-ghost"></i>
              <strong> {{data.item.nik}}</strong>
            </div>
            <div slot="key-nama" slot-scope="data">
              <i class="icon-ghost"></i>
              <strong> {{data.item.nama}}</strong>
            </div>
            <div slot="key-alamat" slot-scope="data">
              <i class="icon-key"></i>
              <strong> {{data.item.alamat}}</strong>
            </div>
            <div slot="key-telp" slot-scope="data">
              <i class="icon-key"></i>
              <strong> {{data.item.noTelp}}</strong>
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
import 'vue-spinners/dist/vue-spinners.css'
import { BounceSpinner } from 'vue-spinners/dist/vue-spinners.common';

export default {
  name: "PasienAdmin",
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
      peternakRegistered: 0,
      sapiRegistered: 0,
      deviceOnline: 0,
      deviceOffline: 0,
      devicePending: 0,
      selected: "Month",
      tableItems: [],
      tableFields: [
        {
          key:'key-nik',
          label: 'NIK'
        },
        {
          key:'key-nama',
          label: 'Name'
        },
        {
          key:'key-alamat',
          label: 'Address'
        },
        {
          key:'key-telp',
          label: 'Phone'
        }
      ]
    };
  },
  created() {
    this.checkSession();
  },
  methods: {
    // async fetchDataAttributes() {
    //   let response = await PostsService.getAllAttributes();
    //   return response.data;
    // },
    async fetchDataPasien() {
      let response = await PostsService.allPasien(
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
      let responseData = await this.fetchDataPasien();
      let attrData = responseData.data;
      this.tableItems = attrData;
      this.isLoading=false
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
