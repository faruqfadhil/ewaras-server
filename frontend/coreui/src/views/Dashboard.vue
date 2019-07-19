<template>
<div>
    <bounce-spinner v-if="isLoading"></bounce-spinner>
  <div class="animated fadeIn" v-if="isLoading==false">
  
    <!-- <b-row> -->
      <b-alert show variant="success" v-if="successAlert.length > 0">
              <h4 class="alert-heading">Congratulation !</h4>
              <ul>
                <li v-for="item in successAlert" :key="item">{{ item }}</li>
              </ul>
              
      </b-alert>
      <b-card-group class="mb-4">
        <b-card>
          <div class="h1 text-muted text-right mb-4">
            <i class="icon-people"></i>
          </div>
          <div class="h4 mb-0">{{patientsEnroll}}</div>
          <small class="text-muted text-uppercase font-weight-bold">Patients Enroll</small>
          <b-progress height="{}" class="progress-xs mt-3 mb-0" variant="info" :value="patientsEnroll"/>
        </b-card>
        <b-card>
          <div class="h1 text-muted text-right mb-4">
            <i class="icon-people"></i>
          </div>
          <div class="h4 mb-0">{{patientsNormal}}</div>
          <small class="text-muted text-uppercase font-weight-bold">Patients Normal</small>
          <b-progress height="{}" class="progress-xs mt-3 mb-0" variant="success" :value="patientsNormal"/>
        </b-card>
        <b-card>
          <div class="h1 text-muted text-right mb-4">
            <i class="icon-people"></i>
          </div>
          <div class="h4 mb-0">{{patientsAbnormal}}</div>
          <small class="text-muted text-uppercase font-weight-bold">Patients Abnormal</small>
          <b-progress height="{}" class="progress-xs mt-3 mb-0" variant="success" :value="patientsAbnormal"/>
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
    <!-- </b-row> -->

    <b-row>
      <b-col md="12">
        <b-card header="Cow List" class="card-accent-warning">
           <div slot="header">
              <b>Patients List</b>
              <div class="card-header-actions">
                <b-button type="button" variant="warning" @click="showModal" class="mr-1">Enroll Patients</b-button>
             
              </div>
          </div>
          <!-- <b-row>        
             <b-col sm="12" lg="12">
              <b-row v-if="existingData == true">
                <b-col sm="6">
                  <Callout variant="info">
                    <b-row>
                      <b-col sm="12" lg="6">
                        <small class="text-muted">Temperature Average</small><br>
                        <strong class="h4">{{ TemperatureAverage }}</strong>
                      </b-col>
                      <b-col sm="12" lg="6">
                        <callout-chart-example chartId="callout-chart-01" :labels="labelsData" :data="TemperatureGraph" variant="info" width="80" height="30" />
                    
                      </b-col>
                    </b-row>
                  </Callout>
                </b-col>
                <b-col sm="6">
                  <Callout variant="danger">
                    <b-row>
                      <b-col sm="12" lg="6">
                        <small class="text-muted">Heart Rate Average</small><br>
                        <strong class="h4">{{HeartRateAverage}}</strong>
                      </b-col>
                      <b-col sm="12" lg="6">
                        
                        <callout-chart-example chartId="callout-chart-02" :labels="labelsData" :data="HeartGraph" variant="danger" width="80" height="30" />
                        
                      </b-col>
                    </b-row>
                  </Callout>
                </b-col>
              </b-row>
              <hr class="mt-0">
             </b-col>
          </b-row> -->
          <b-row>
            <b-table striped outlined stacked="sm" hover :items="tableItems" :fields="tableFields" head-variant="light"  v-if="existingData == true">
            <div slot="namaPasien" slot-scope="data">
              <img src="img/avatars/patient.png" width="50px" alt="cows logo">
              <strong>{{data.item.pasien_docs[0].nama}}</strong>
              <!-- <b-link class="card-header-action btn-minimize" v-b-toggle.collapse1>
                  <i v-bind:id="data.item._id" class="icon-eye"></i>
              </b-link>
              <b-popover v-bind:target="data.item._id" title="Cow ID">
                <h5><b-badge variant="secondary">{{data.item.perangkat.idOnRaspi}}</b-badge></h5>
              </b-popover> -->
              <!-- <div class="small text-muted">{{data.item._id}}</div> -->
            </div>
            <div slot="key-kondisi" slot-scope="data">
              <b-badge :variant="getKondisi(data.item.perangkat_docs[0].data[data.item.perangkat_docs[0].data.length-1].kondisi)">{{data.item.perangkat_docs[0].data[data.item.perangkat_docs[0].data.length-1].kondisi == 0 ? "Abnormal":"Normal"}}</b-badge>
            </div>
            <div slot="key-tanggal" slot-scope="data">
              <b-badge :variant="dateFormatter(data.item.perangkat_docs[0].data[data.item.perangkat_docs[0].data.length-1].tanggal)">{{data.item.perangkat_docs[0].data[data.item.perangkat_docs[0].data.length-1].tanggal | formatDate}}</b-badge>
              
            </div>
            <div slot="key-suhu" slot-scope="data">
              
              <strong>{{data.item.perangkat_docs[0].data[data.item.perangkat_docs[0].data.length-1].suhu.toFixed(2)}}</strong>
              <div class="small text-muted">Celcius</div>
            </div>
            <div slot="key-jantung" slot-scope="data">
              
              <strong>{{data.item.perangkat_docs[0].data[data.item.perangkat_docs[0].data.length-1].jantung.toFixed(2)}}</strong>
              <div class="small text-muted">BPM</div>
            </div>
            <div slot="key-spo" slot-scope="data">
              
              <strong>{{data.item.perangkat_docs[0].data[data.item.perangkat_docs[0].data.length-1].spo.toFixed(2)}}</strong>
              <div class="small text-muted">spo</div>
            </div>
            <div slot="key-status" slot-scope="data">
              <b-badge :variant="getBadge(data.item.perangkat_docs[0].statusDevice)">{{ data.item.perangkat_docs[0].statusDevice == 0 ? "Nonactive": data.item.perangkat_docs[0].statusDevice == 1 ? "Active":"Pending" }}</b-badge>
            </div>
            <div slot="key-action" slot-scope="data">
              <b-button variant="primary" size="sm" @click="toDetail(data.item.pasien_docs[0]._id)">Details</b-button>
            </div>
            <div slot="key-unroll" slot-scope="data">
              <b-button variant="danger" size="sm" @click="unrollPasien(data.item.pasien_docs[0]._id)">Unroll</b-button>
            </div>
            <!-- <div slot="key-expert" slot-scope="data">
              <b-button variant="success" size="sm" @click="toExpert(data.item._id)">Identification</b-button>
            </div> -->
          </b-table> 
            
          </b-row> 
            <b-alert v-if="existingData == false" show variant="warning">
              You don't have a patients enrolled, let's enroll your first patient by clicking the enroll patient button.
            </b-alert>
        </b-card>
      </b-col>
    </b-row>
          
    <b-modal id="modal-lg" size="lg" variant="warning" class="modal-warning"  ref="myModalRef" hide-footer title="Search Patients">
      <div class="d-block text-center">
        <b-alert show variant="danger" v-if="errors.length > 0">
              <h4 class="alert-heading">Error !</h4>
              <ul>
                <li v-for="item in errors" :key="item">{{ item }}</li>
              </ul>
              <hr>
              <p class="mb-0">
               Please check again your form field.
              </p>
          </b-alert>
        <b-form-group>
          <b-form-input type="text" id="nik" v-model="nik" placeholder="Search by NIK..."></b-form-input>
        </b-form-group>
          <!-- <b-row> -->
            <b-table striped outlined stacked="sm" hover :items="tablePasien" :fields="tablePasienFields" head-variant="light"  v-if="existingDataPasien == true">
            <div slot="nik" slot-scope="data">
              <strong>{{data.item.nik}}</strong>
            </div>
            <div slot="nama-pasien" slot-scope="data">
              <strong>{{data.item.nama}}</strong>
            </div>
            <div slot="alamat" slot-scope="data">
              <strong>{{data.item.alamat}}</strong>
            </div>
            <div slot="phone" slot-scope="data">
              <strong>{{data.item.noTelp}}</strong>
            </div>
            <div slot="enroll" slot-scope="data">
              <b-button variant="primary" size="sm" @click="enrollPasien(data.item._id)">Enroll</b-button>
            </div>
            <!-- <div slot="key-expert" slot-scope="data">
              <b-button variant="success" size="sm" @click="toExpert(data.item._id)">Identification</b-button>
            </div> -->
          </b-table> 
            
          <!-- </b-row>  -->
      </div>
      <b-btn class="mt-3" variant="outline-warning" block @click="search">Search</b-btn>
    </b-modal>


  </div>
</div>
</template>

<script>
import CardLine1ChartExample from './dashboard/CardLine1ChartExample'
import CardLine2ChartExample from './dashboard/CardLine2ChartExample'
import CardLine3ChartExample from './dashboard/CardLine3ChartExample'
import CardBarChartExample from './dashboard/CardBarChartExample'
import MainChartExample from './dashboard/MainChartExample'
import SocialBoxChartExample from './dashboard/SocialBoxChartExample'
import CalloutChartExample from './dashboard/CalloutChartExample'
import { Callout } from '@coreui/vue'
import io from 'socket.io-client'
import PostsService from "@/services/PostsService"
import Constants from "@/services/Constants"
import 'vue-spinners/dist/vue-spinners.css'
import { BounceSpinner } from 'vue-spinners/dist/vue-spinners.common'
import moment from 'moment'


export default {
  name: 'dashboard',
  filters:{
    formatDate : function(value){
      if (value) {
        return moment(String(value)).format('DD-MMM-YYYY HH:mm:ss')
      }
    }
  },
  components: {
    Callout,
    // myComponent,
    BounceSpinner,
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
      socket : io(Constants.SOCKET_SERVER),
      isLoading: true,
      patientsEnroll:0,
      patientsNormal:0,
      patientsAbnormal:0,
      deviceOnline:0,
      deviceOffline:0,
      devicePending:0,
      nik:"",
      existingDataPasien:false,
      tableItems: [],
      tableFields: [
        {
          key:'namaPasien',
          label: 'Name'
          
        },
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
        },
        { key: 'key-status', 
          label: 'Device Status'
        },
        {
          key: 'key-action',
          label: 'Details'
        },
        {
          key: 'key-unroll',
          label: 'Unroll'
        }
      ],
      tablePasien:[],
      tablePasienFields:[
        {
          key:'nik',
          label: 'NIK'
        },
        {
          key:'nama-pasien',
          label: 'Patient Name'
        },
        {
          key:'alamat',
          label: 'Address'
        },
        {
          key:'phone',
          label: 'Phone'
        },
        {
          key:'enroll',
          label: 'Enroll'
        }
      ],
      // INITIAL
      DeviceActive:0,
      cowName:"",
      
      warningModal: false,
      DeviceNonActive:0,
      TemperatureAverage:0,
      HeartRateAverage:0,
      TemperatureGraph:[],
      HeartGraph:[],
      labelsData:[],
      CurrentConditions:"",
      suhuArrange:[],
      statusDeviceInStr:"",
      dateOnFormat:"",
      dateOnFormatForAvg:"",
      existingData:false,
      sapiList:[],
      selected: 'Month',
      errors: [],
      successAlert: []
    }
  },
  created(){
      this.checkSession();
     
  },
  methods: {
    showModal () {
      /**
       * this function for show create cow form on modal
       */
      this.errors = []
      this.$refs.myModalRef.show()
    },
    async postCreateCowData() {
      /**
       * post create cow data
       */
      this.successAlert = []
      const response = await PostsService.createCow(window.localStorage.getItem("token"),{
                          namaSapi: this.cowName
                        });
      this.$refs.myModalRef.hide()
      if(response.data.status){
        this.successAlert.push('Congratulation,You have successfully register a new cow, our team will prepare your device, please refresh this page');
      }
      // setTimeout(location.reload(), 5000)
      
    },
    async search() {
      /**
       * this function for action search patients by nik
       */
      if(this.nik){
        const respon = await this.searchPasien()
        if(respon.data.length > 0){
          this.existingDataPasien = true
          this.tablePasien = respon.data
        }
      }
      this.errors = []
      if(!this.nik){
        this.errors.push('nik cant blank !');
      }
     
    },
    checkSession(){
      /**
       * check session and do action
       */
      if(!window.localStorage.getItem("token")){
        this.$router.push({ name: 'Login' })  
      }else{
        if(window.localStorage.getItem("role") != Constants.ROLE_DOKTER){
          // redirect to 404 page
          this.$router.push({ name: 'Page404' })    
        }else{
          this.firstLoad();
        }
        
      }
    },
    variant (value) {
      let $variant
      if (value <= 25) {
        $variant = 'info'
      } else if (value > 25 && value <= 50) {
        $variant = 'success'
      } else if (value > 50 && value <= 75) {
        $variant = 'warning'
      } else if (value > 75 && value <= 100) {
        $variant = 'danger'
      }
      return $variant
    },
    flag (value) {
      return 'flag-icon flag-icon-' + value
    },
    // FETCH DATA
    async fetchDataSapi(){
      const response = await PostsService.getSapi(window.localStorage.getItem("token"));
      return response.data;
    },
    async fetchDataFirst(){
      const response = await PostsService.dataOnDokter(window.localStorage.getItem("token"),
        {
          idDokter: window.localStorage.getItem("id_dokter")
        });
      return response.data;
    },
    async searchPasien() {
      /**
       * post create cow data
       */
      this.successAlert = []
      const response = await PostsService.searchPasien(window.localStorage.getItem("token"),{
                          nik: this.nik
                        });
      return response.data
      // this.$refs.myModalRef.hide()
      // if(response.data.status){
      //   this.successAlert.push('Congratulation,You have successfully register a new cow, our team will prepare your device, please refresh this page');
      // }
      // setTimeout(location.reload(), 5000)
      
    },
    async enrollPasien(id) {
      /**
       * post create cow data
       */
      this.successAlert = []
      const response = await PostsService.enrollPasien(window.localStorage.getItem("token"),{
                          idPasien: id,
                          idDokter: window.localStorage.getItem("id_dokter")
                        });
      if(response.data.status){
          this.$refs.myModalRef.hide()
          this.successAlert.push('Congratulation,You have successfully enrolling a new patient');
          this.firstLoad()
          // setTimeout(location.reload(), 5000)
      }
      
    },
    async unrollPasien(id) {
      /**
       * post create cow data
       */
      this.successAlert = []
      const response = await PostsService.unrollPasien(window.localStorage.getItem("token"),{
                          idPasien: id,
                          idDokter: window.localStorage.getItem("id_dokter")
                        });
      if(response.data.status){
          // this.$refs.myModalRef.hide()
          this.successAlert.push('The patient has successfully unroll');
          this.firstLoad()
          // setTimeout(location.reload(), 5000)
      }
      
    },
    // FETCH DATA

    soket(){
      this.socket.on('/topic/ewaras/'+window.localStorage.getItem("id_dokter"), (dokterData) => {
          this.tableItems = dokterData;
          this.patientsEnroll = dokterData.length
          // console.log(dokterData.length)
          this.patientsAbnormal = 0
          this.patientsNormal = 0
          this.deviceOnline = 0
          this.deviceOffline = 0
          this.devicePending = 0
          for(var i=0;i<dokterData.length;i++){
            // console.log(i)
            if(dokterData[i].perangkat_docs[0].data[dokterData[i].perangkat_docs[0].data.length-1].kondisi==1){
              this.patientsAbnormal++
            }else{
              this.patientsNormal++
            }
            if(dokterData[i].perangkat_docs[0].statusDevice==Constants.DEVICE_ACTIVE){
              this.deviceOnline++
            }else if(dokterData[i].perangkat_docs[0].statusDevice==Constants.DEVICE_NONACTIVE){
              this.deviceOffline++
            }else{
              this.devicePending++
            }
          }
          //   var active =0,inActive =0,avgSuhu=0,avgHeart=0;
          //   for(var i=0;i<sapiData.length;i++){
          //   avgSuhu += Number(sapiData[i].perangkat.data[sapiData[i].perangkat.data.length-1].suhu);
          //   avgHeart += Number(sapiData[i].perangkat.data[sapiData[i].perangkat.data.length-1].jantung);
          //   this.dateFormatter(sapiData[i].perangkat.data[sapiData[i].perangkat.data.length-1].tanggal);
          //   if(sapiData[i].perangkat.status == 1){
          //     active++;
          //   }else{
          //     inActive++;
          //   }
          // }
          // avgSuhu = avgSuhu/sapiData.length;
          // avgHeart = avgHeart/sapiData.length;
          // this.tableItems = sapiData;
          // this.DeviceActive = active;
          // this.DeviceNonActive = inActive;
          // this.TemperatureAverage = avgSuhu.toFixed(2);
          // this.HeartRateAverage = avgHeart.toFixed(2);
          // // chart operation
          // this.HeartGraph.push(this.HeartRateAverage);
          // this.TemperatureGraph.push(this.TemperatureAverage);
          // this.labelsData.push(this.dateOnFormat)
            
      });
    },
    async firstLoad(){
      // console.log(window.localStorage.getItem("token"));
      const response = await this.fetchDataFirst();
      let dokterData = response.data;
      console.log(dokterData)
      this.isLoading=false
      this.patientsEnroll = dokterData.length
      this.patientsAbnormal = 0
      this.patientsNormal = 0
      this.deviceOnline = 0
      this.deviceOffline = 0
      this.devicePending = 0
      if(dokterData.length > 0){
          this.existingData = true
          this.patientsEnroll = dokterData.length
          this.patientsAbnormal = 0
          this.patientsNormal = 0
          this.deviceOnline = 0
          this.deviceOffline = 0
          this.devicePending = 0
          // console.log(dokterData.length)
          for(var i=0;i<dokterData.length;i++){
            // console.log(i)
            if(dokterData[i].perangkat_docs[0].data[dokterData[i].perangkat_docs[0].data.length-1].kondisi==1){
              this.patientsAbnormal++
            }else{
              this.patientsNormal++
            }
            if(dokterData[i].perangkat_docs[0].statusDevice==Constants.DEVICE_ACTIVE){
              this.deviceOnline++
            }else if(dokterData[i].perangkat_docs[0].statusDevice==Constants.DEVICE_NONACTIVE){
              this.deviceOffline++
            }else{
              this.devicePending++
            }
          }
          this.tableItems = dokterData
          this.soket();
          // var active =0,inActive =0,avgSuhu=0,avgHeart=0;
          // for(var i=0;i<sapiData.length;i++){
          //   avgSuhu += Number(sapiData[i].perangkat.data[sapiData[i].perangkat.data.length-1].suhu);
          //   avgHeart += Number(sapiData[i].perangkat.data[sapiData[i].perangkat.data.length-1].jantung);
          //   this.dateFormatter(sapiData[i].perangkat.data[sapiData[i].perangkat.data.length-1].tanggal);
          //   if(sapiData[i].perangkat.status == 1){
          //     active++;
          //   }else{
          //     inActive++;
          //   }
          // }
          // avgSuhu = avgSuhu/sapiData.length;
          // avgHeart = avgHeart/sapiData.length;
          // this.tableItems = sapiData;
          // this.DeviceActive = active;
          // this.DeviceNonActive = inActive;
          // this.TemperatureAverage = avgSuhu.toFixed(2);
          // this.HeartRateAverage = avgHeart.toFixed(2);
          // // chart operation
          // this.HeartGraph.push(this.HeartRateAverage);
          // this.TemperatureGraph.push(this.TemperatureAverage);
          // this.labelsData.push(this.dateOnFormat)
          // this.soket();
      }else{
        this.existingData=false
      }
      
      // console.log(this.tableItems);
    },
    
    getBadge (status) {
      var varian_='danger'
      if(status==0){
        this.statusDeviceInStr="Nonactive";
      }else if(status==1){
        this.statusDeviceInStr="Active";
        varian_='success'
      }else{
        this.statusDeviceInStr="Pending"
        varian_='secondary'
      }
      // return status == 0 ? 'danger' : 'success'
      return varian_
    },
    getKondisi(tmp){
      return tmp == 0 ? 'danger' : 'success'
    },
    dateFormatter(date){
      var created_date = new Date(date);
      var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
      var year = created_date.getFullYear();
      var month = months[created_date.getMonth()];
      var date = created_date.getDate();
      var hour = created_date.getHours();
      var min = created_date.getMinutes();
      var sec = created_date.getSeconds();
      var time = date + ',' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec ;    // final date with time, you can use this according your requirement
      this.dateOnFormat = time;
      return 'secondary';
    },
    toExpert(id){
      this.$router.push({ name: 'expert', params: {id : id} })
    },
    toDetail (id){
      this.$router.push({ name: 'Details', params: {id : id} })
      
    }
  } 
}
</script>

<style>
  /* IE fix */
  #card-chart-01, #card-chart-02 {
    width: 100% !important;
  }
  .list-sapi-header{
    color:white;
  }
  .brand-card-header{
    background-color: #ffc107 !important;
  }
  .chart-wrapper canvas{
    /* width: 100% !important;  */
    /* margin-top: -10% !important;
    height: 50px !important; */
  }
</style>
