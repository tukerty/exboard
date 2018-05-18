<template>
  <section class="express_panel">
    <h1 id="tool_title">{{activeTool}}</h1>
    <VuePerfectScrollbar class="service_bar">
      <div class="env" @click="switchEnv(env.id)" v-bind:class="{env_active: env.id == currentEnv}" v-bind:key="env.id" v-for="env in envs"  @mouseover="logStatus('Show only: ' + env.name)">
        <p>{{env.name}}</p>
        <div class="indicator" v-bind:style="{'background-color': env.color}"></div>
      </div>
    </VuePerfectScrollbar>
    <div class="search">
      <input type="text" class="search_bar" v-model="searchQuery">
      <button class="search_button">Search</button>
      <button class="new_env_btn">Add enviroment</button>
      <button class="new_srv_btn">Add service</button>
    </div>
    <div class="grid">
      <div class="item" v-bind:key="service.id" v-for="service in filteredServices" v-bind:data-id="service.id" v-if="inEnv(service.env, currentEnv)">
        <div class="item-content" @mouseover="logStatus('Go To: ' + service.url)">
          <div class="card">
            <div class="service_header">
              <h1>{{service.name}}</h1>
              <div class="indicators_container">
                <div class="indicator" v-bind:key="color.id" v-for="color in findColors(service.env)" v-bind:style="{'background-color': color}"></div>
              </div>
            </div>
            <p>{{service.url}}</p>
          </div>
        </div>
      </div>
    </div>
    <div class="status_bar">
      {{this.statusBar}}
    </div>
  </section>
</template>

<script>
/* eslint-disable */
import axios from 'axios'
import Muuri from 'muuri'
import VuePerfectScrollbar from 'vue-perfect-scrollbar'

export default {
  components: {
    VuePerfectScrollbar
  },
  name: 'ExpressPanel',
  data () {
    return{
      grid: '',
      searchQuery: '',
      services: [],
      envs: [],
      activeEnvs: [],
      currentEnv: 1,
      newServicesLoaded: false,
      activeTool: 'Express Panel',
      statusBar: ''
    }
  },
  mounted() {
    this.loadServices()
    this.loadEnvs()
    document.body.style.background = 'linear-gradient(to bottom, #24c6dc, #514a9d'
  },
  updated(){
    if (this.newServicesLoaded == true){
    this.initTable()
    this.newServicesLoaded = false
    }
  },
  methods: {
    switchEnv: function(a){
      this.currentEnv = a
      this.loadEnvs()
    },
    inEnv: function(a,b){
      return((""+a).split(",").includes(""+b));
    },
    findColors: function(a){
      a = a.toString().split(',')
      var colors = []
      for(var i = 0; i<a.length; i++){
        for (var j = 0; j<this.envs.length; j++){
          if (a[i] == this.envs[j].id){
            colors.push(this.envs[j].color)
          }
        }
      }
      return colors
    },
    logStatus: function(a){
      this.statusBar = a
    },
    initTable:function(){
      var k = this
      try{
        this.grid.destroy(true)
      }
      catch(e){
        console.log(e)
      }
      this.gird = new Muuri('.grid', {
          dragEnabled: true,
          dragSortInterval: 300,
          dragSortPredicate: {
            threshold: 75,
            action: 'swap'
          }
        }).on('move',function(items){
          k.swapServices(items.fromIndex, items.toIndex)
          k.logStatus('Swap successful')
      });
    },
    loadServices: function(){
      this.logStatus('Loading Services...')
      axios.get('http://192.168.11.204:4532/get')
      .then(response => {
        this.logStatus('Serivces loaded succesfully')
        this.newServicesLoaded = true
        this.services = response.data
      })
      .catch(e => {
        this.error = e.data
      })
    },

    loadEnvs: function(){
      this.logStatus('Loading Services...')
      axios.get('http://192.168.11.204:4532/getEnvs')
      .then(response => {
        this.logStatus('Enviroments loaded succesfully')
        this.envs = response.data
      })
      .catch(e => {
        this.error = e.data
      })
    },

    swapServices: function(a,b){
      axios.post('http://192.168.11.204:4532/swap', {
        from: a,
        to: b
      })
      .then(response => {
      })
    },
    
  },
  computed: {
    filteredServices: function(){
      this.newServicesLoaded = true
      return this.services.filter(service => {
        return service.name.toLowerCase().includes(this.searchQuery.toLowerCase())
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.env{
  cursor: pointer;
  background: rgba(255,255,255,0.5);
  padding: 30px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-radius: 5px;
}

.env_active{
  background: rgba(255,255,255,1);
}

.env:not(:last-child) {
  margin-bottom: 30px;
}

.env p{
  font-size: 18px;
  margin: 0;
}
.indicator{
  height: 14px;
  width: 14px;
  margin: 0 3px;
  border-radius: 7px;
}
.indicators_container{
  display: flex;
}
.service_header{
  display: flex;
  justify-content:space-between;
  align-items: center;
}

.service_bar{
  background: rgba(255,255,255,0.75);
  position: absolute;
  margin: 30px;
  padding: 30px;
  height: calc(100vh - 290px);
  width: calc(20vw - 60px);
  overflow-y: scroll;
  border-radius: 5px;
}
.grid {
  background: rgba(255,255,255,0.75);
  position: absolute;
  top:230px;
  left: calc(20vw + 60px);
  width: calc(80vw - 210px);
  margin: 30px;
  padding: 30px;
  border-radius: 5px;
}
.item {
  cursor: pointer;
  display: block;
  position: absolute;
  margin: 30px 0 0px 30px;
  height: 10vh;
  padding: 30px;
  width: calc(20vw - 90px / 4);
  z-index: 1;
  background: rgba(255,255,255,0.75);
  border-radius: 5px;
  color: #2c3e50;
}
.item.muuri-item-dragging {
  z-index: 3;
}
.item.muuri-item-releasing {
  z-index: 2;
}
.item.muuri-item-hidden {
  z-index: 0;
}
.item-content {
  position: relative;
  width: 100%;
  height: 100%;
}
.search{
  background: rgba(255,255,255,0.75);
  border-radius: 5px;
  position: absolute;
  top:110px;
  left: calc(20vw + 60px);
  width: calc(80vw - 210px);
  margin: 30px;
  padding: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: space-between
}
.search_bar{
  border-radius: 5px;
  height: 30px;
  width: 100%;
  background: #FFF;
  border: none;
  padding: 0 10px;
}
.search_bar:focus{
  border: none;
  outline: none;
}
.search button{
  height: 30px;
  cursor: pointer;
  word-wrap: break-word;
}
.new_srv_btn{
  margin: 0 0 0 10px;
}

.search_button{
  background: #FFF;
  border:none;
  outline: none;
  margin: 0 30px 0 10px;
}
</style>