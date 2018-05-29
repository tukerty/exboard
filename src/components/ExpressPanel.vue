<template>
  <section class="express-panel">
    <b-loading :is-full-page="true" :active.sync="isLoading" :canCancel="true"></b-loading>
    <header>
      <div class="logo-block">
        E/P
      </div>
      <div class="projects-bar">
        <div class="projects-item" v-for="project in projects" :key="project.id">
          <div class="project-item-container">
            <p>{{project.name}}</p>
            <div class="project-underscore" :style="{backgroundColor: project.color}"></div>
          </div>
        </div>
        <div class="projects-item" v-if="editMode">
          <div class="project-item-container">
            <p><span>+</span> Add new project</p>
          </div>
        </div>
      </div>
    </header>
    <div class="control-ribbon">
      <div class="control-ribbon-buttons">
        <a class="button">
          <span class="icon" @click="editMode = !editMode">
              <b-icon
                icon="pencil">
              </b-icon>
          </span>
        </a>
        <a class="button">
          <span class="icon">
              <b-icon
                icon="filter">
              </b-icon>
          </span>
        </a>
      </div>
      <div class="control-ribbon-search">
          <p class="control is-expanded has-icons-left">
            <input class="input" type="search" v-bind="searchQuery" placeholder="Search...">
            <span class="icon is-left">
              <b-icon
                icon="magnify">
              </b-icon>
            </span>
          </p>
      </div>
    </div>
    <div class="env-bar">
      <div class="tag env-item" v-for="env in envs" :key="env.id"  :style="{backgroundColor: env.color}">
        {{env.name}}
      </div>
      <div class="tag env-item add-env" :style="{backgroundColor: '#607D8B'}" v-if="editMode">
        Add environment +
      </div>
    </div>

    <div class="cards-container">
      <draggable class="services-grid" :style="{width: gridWidth + 'px'}" v-model="services" :options="{sort:editMode, draggable: '.service-draggable'}" @start="drag=true" @end="drag=false">
        <div class="service-block service-draggable" v-for="service in filteredServices" :key="service.id"  @click="goToService(service)">
          <div class="service-tags">
            <div class="tag is-small" v-for="env in service.env" :key="env.id" :style="{backgroundColor: envs.find(x => x.id === env).color}">
              {{envs.find(x => x.id === env).alias}}
            </div>
          </div>
          <h1 class="service-name">{{service.name}}</h1>
          <p class="service-url">{{service.url}}</p>
          <div class="service-buttons" v-if="editMode">
              <b-icon icon="plus-circle-outline" size="is-big"></b-icon>
              <b-icon icon="circle-edit-outline" size="is-big"></b-icon>
              <b-icon icon="close-circle-outline" size="is-big"></b-icon>
          </div>
        </div>
        <button class="service-block service-add-button" slot="footer" v-if="editMode">
          +
        </button>
      </draggable>
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
      isLoading: true,
      searchQuery: "",
      horizontalCount: 3,
      colorsList: ['#f44336', '#E91E63', '#9C27B0', '#673AB7', '#3F51B5', '#2196F3', '#03A9F4', '#00BCD4', '#009688', '#4CAF50', '#8BC34A', '#CDDC39', '#FFEB3B', '#FFC107', '#FF9800', '#FF5722', '#795548', '#9E9E9E', '#607D8B'],
      services: [],
      envs: [],
      projects: [],
      editMode: false,
    }
  },
  mounted() {
    this.loadProjects()
    this.loadEnvs()
    this.loadServices()
  },
  methods: {
    loadServices: function(){
      axios.get('http://192.168.11.204:4532/services')
      .then(response => {
        this.services = response.data
        this.isLoading = false
      })
      .catch(e => {
        this.error = e.data
      })
    },

    loadEnvs: function(){
      axios.get('http://192.168.11.204:4532/envs')
      .then(response => {
        this.envs = response.data
      })
      .catch(e => {
        this.error = e.data
      })
    },  

    loadProjects: function(){
      axios.get('http://192.168.11.204:4532/projects')
      .then(response => {
        this.projects = response.data
      })
      .catch(e => {
        this.error = e.data
      })
    },

    goToService: function(s){
      if (!this.editMode){
        window.location.href = s.url
      }
    }
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
        return this.horizontalCount * 400        
      }
      else{
        return 3 * 400
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
header{
  height: 60px;
  background-color: #36475F;
  display: flex;
}
.logo-block{
  height: 60px;
  background-color: #03A9F4;
  color:#fff;
  font-family: 'Courier New', Courier, monospace;
  font-weight: bold;
  font-size: 1.5em;
  padding: 10px 20px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.projects-bar{
  color:#fff;
  height: 60px;
  flex-grow: 1;
  display: flex;
  align-items: center;
  justify-content: flex-start;
}
.projects-item{
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 60px;
  padding: 0 20px;
  border-right: 1px solid rgb(47, 64, 87);
}
.projects-item:last-child{
  border: none;
}
.project-item-container span{
  color: #FFF;
  font-weight: bold;
  font-size: 1em;
}

.project-underscore{
  height: 2px;
  width: 100%;
}

.projects-item:hover{
  background-color:rgb(47, 64, 87);
}

.control-ribbon{
  display: flex;
  background-color: #FFF;
  height: 60px;
}
.control-ribbon-buttons{
  display: flex;
  padding: 0 0 0 20px;
  justify-content: center;
  align-items: center;
}
.control-ribbon-buttons a{
  cursor: pointer;
  margin: 0 10px 0 0;
}
.control-ribbon-search{
  display: flex;
  justify-content: center;
  align-items: center;
  flex-grow: 1;
  padding-right: 20px;
}
.control-ribbon-search .control{
  flex-grow: 1;
}

.cards-container{
  position: relative;
  padding: 10px;
  display:flex;
  justify-content: center;
  align-items: center
}

.service-block{
  cursor: pointer;
  transition: all 0.2s;
  background-color: #FFF;
  color:#000;
  padding: 20px;
  display: inline-block;
  width: 380px;
  height: 100px;
  margin: 10px;
  align-items: center;
  justify-content: center;
  position: relative;
}
.service-add-button{
  background-color: rgba(0,0,0,0.75);
  color:#FFF;
  cursor: pointer;
  font-size: 3em;
  height: 100px;
  border: none;
  outline: none;
  position: absolute;
}
.service-block h1{
  font-size: 1.5em;
}

.service-block p{
  font-size: 0.75em;
}

.service-tags{
  position: absolute;
  right: 10px;
}
.service-tags .tag{
  color:#FFF;
  margin: 0 10px 0 0;
}

.service-buttons{
  display: flex;
  align-items: center;
  justify-content:center;
  height: 100%;
  width: 100%;
  background-color: rgba(0,0,0,0.8);
  opacity: 0.5;
  top:0;
  left: 0;
  position: absolute;
  cursor:default;
}
.service-buttons .icon{
  margin: 0 0 0 10px;
  color:#FFF;
  cursor: pointer;
}
.env-bar{
  padding: 0 0 10px 20px;
  background-color: #FFF;
  display: flex;
  justify-content: flex-start;
  align-items: center;
}
.env-bar .tag{
  opacity: 0.5;
  color:#FFF;
  margin-right: 10px;
}
.env-bar .add-env{
  opacity: 1;
  cursor: pointer;
}

</style>