<template>
  <section class="express-panel">
    <div class="shader" v-if="modalActive">

    </div>
    <div class="header">
      
      <b-input placeholder="Search..." type="search" class="search-bar" icon="magnify" v-model="searchQuery">
      </b-input>

    </div>

    <div class="env-bar">
      <div class="env-item" v-for="env in envs" :key="env.id"  :style="{backgroundColor: env.color}">
        {{env.name}}
      </div>
    </div>
    <div class="content">
      <draggable class="services-grid" :style="{width: gridWidth + 'px'}" v-model="services" :options="{sort:editMode, draggable: '.service-draggable'}" @start="drag=true" @end="drag=false">
        <div class="service-block service-draggable" v-for="service in filteredServices" :key="service.id">
          <div class="service-name">{{service.name}}</div>
          <div class="service-url">{{service.url}}</div>
        </div>
        <button class="service-block service-add-button" slot="footer" >
          +
        </button>
      </draggable>
    </div>
    <div class="projects">
      <div class="project-item" v-for="project in projects" :key="project.id">
        {{project.name}}
      </div>
    </div>
  </section>
</template>

<script>
/* eslint-disable */
import axios from 'axios'
import draggable from 'vuedraggable'
import VuePerfectScrollbar from 'vue-perfect-scrollbar'

export default {
  components: {
    draggable,
    VuePerfectScrollbar
  },
  name: 'ExpressPanel',
  data () {
    return{
      modalActive: 0,
      searchQuery: "",
      horizontalCount: 3,
      colorsList: ['#f44336', '#E91E63', '#9C27B0', '#673AB7', '#3F51B5', '#2196F3', '#03A9F4', '#00BCD4', '#009688', '#4CAF50', '#8BC34A', '#CDDC39', '#FFEB3B', '#FFC107', '#FF9800', '#FF5722', '#795548', '#9E9E9E', '#607D8B'],
      services: [],
      envs: [],
      projects: [],
      editMode: true,
    }
  },
  mounted() {
    this.loadProjects()
    this.loadEnvs()
    this.loadServices()
  },
  methods: {
    loadServices: function(){
      axios.get('http://192.168.11.204:4532/getServices')
      .then(response => {
        this.services = response.data
      })
      .catch(e => {
        this.error = e.data
      })
    },

    loadEnvs: function(){
      axios.get('http://192.168.11.204:4532/getEnvs')
      .then(response => {
        this.envs = response.data
        this.initTable()
      })
      .catch(e => {
        this.error = e.data
      })
    },  

    loadProjects: function(){
      axios.get('http://192.168.11.204:4532/getProjects')
      .then(response => {
        this.projects = response.data
      })
      .catch(e => {
        this.error = e.data
      })
    },  
  },
  computed: {
    filteredServices: function(){
      return this.services.filter(service => {
        return service.name.toLowerCase().includes(this.searchQuery.toLowerCase())
      })
    },
    gridWidth: function() {
      if (this.horizontalCount >= 3 && this.horizontalCount <= 7){
        console.log(this.horizontalCount) 
        return this.horizontalCount * 200        
      }
      else{
        return 3 * 200
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.header{
  width: 100%;
  text-align: center;
}
.search-bar{
  margin-top: 30px;
  font-family: 'Courier New', Courier, monospace;
  display: inline-block;
  width: 500px;
}

.env-bar{
  display: flex;
  align-items: center;
  justify-content: center;
}

.env-item{
  color:#fff;
  cursor: pointer;
  padding: 10px;
  margin: 10px;
  border-radius: 5px;
}

.content{
  display: flex;
  align-items: center;
  justify-content: center;
}
.service-block{
  transition: all 0.2s;
  background-color: #000;
  color:#fff;
  padding: 10px;
  display: inline-block;
  width: 180px;
  margin: 10px;
  height: 100px;
  align-items: center;
  justify-content: center;
}
.service-add-button{
  cursor: pointer;
  font-size: 3em;
  width: 180px;
  border: none;
  outline: none;
  height: 100px;
  position: absolute;
}
.services-grid{
  height: 600px;
}
.shader{
  position: absolute;
  height: 100vh;
  width: 100vw;
  background-color: rgba(0,0,0,0.8);
  display: flex;
  align-items: center;
  justify-content: center;
}
.modal{
  position: absolute;
  background-color: #FFF;
  border-radius: 5px;
  width: 500px;
}
.modal h1{
  text-align: center;
}
</style>