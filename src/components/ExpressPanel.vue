<template>
  <section class="express-panel">
    <b-loading :is-full-page="true" :active.sync="isLoading" :canCancel="true"></b-loading>
    <header>
      <div class="logo-block">
        E/P
      </div>
      <div class="projects-bar">
        <div class="projects-item" v-for="project in projects" :key="project.id" @click="currentProject = project.id; $cookie.set('lastProj', project.id); loadEnvs(project)">
          <div class="project-item-container">
            <p>{{project.name}}</p>
            <div class="project-underscore" :style="{backgroundColor: project.color}"></div>
            <div class="service-buttons project-buttons" v-if="editMode">
                <b-icon icon="circle-edit-outline" size="is-small" @click.native="editProject(project)"></b-icon>
                <b-icon icon="close-circle-outline" size="is-small" @click.native="deleteProject(project.id)"></b-icon>
            </div>
          </div>
        </div>
        <div class="projects-item" v-if="editMode" @click="updateMode = false; modalNewProjectActive = true">
          <div class="project-item-container">
            <p><span>+</span> Add new project</p>
          </div>
        </div>
      </div>
    </header>
    <div class="control-ribbon">
      <div class="control-ribbon-buttons">
        <a class="button" @click="toggleEdit()">
          <span class="icon">
              <b-icon
                icon="pencil">
              </b-icon>
          </span>
        </a>
        <a class="button" @click="filterMode = !filterMode">
          <span class="icon">
              <b-icon
                icon="filter">
              </b-icon>
          </span>
        </a>
      </div>
      <div class="control-ribbon-search">
          <p class="control is-expanded has-icons-left">
            <input class="input" type="search" v-model="searchQuery" placeholder="Search...">
            <span class="icon is-left">
              <b-icon
                icon="magnify">
              </b-icon>
            </span>
          </p>
      </div>
    </div>
    <div class="env-bar" v-if="filterMode || editMode">
      <div class="env-picker">
      <div class="tag env-item" v-if="env.project == currentProject" :class="{'active': env.active}" v-for="env in envs" :key="env.id"  :style="{backgroundColor: env.color}" @click="toggleEnv(env)">
        {{env.name}}
            <div class="service-buttons env-buttons" v-if="editMode">
                <b-icon icon="circle-edit-outline" size="is-small" @click.native="editEnv(env)"></b-icon>
                <b-icon icon="close-circle-outline" size="is-small" @click.native="deleteEnv(env.id)"></b-icon>
            </div>
      </div>
      <div class="tag env-item add-env active" :style="{backgroundColor: '#607D8B'}" v-if="editMode && projects.length > 0" @click="updateMode = false; modalNewEnvActive = true">
        Add environment +
      </div>
      </div>
      <div class="width-picker" v-if="editMode && projects.length > 0">
        <p>Width&nbsp;</p>
        <b-field>
            <b-radio-button v-model="horizontalCount"
                native-value="3"
                type="is-danger"
                size="is-small">
                3
            </b-radio-button>

            <b-radio-button v-model="horizontalCount"
                native-value="4"
                type="is-success"
                size="is-small"
                >
                4
            </b-radio-button>

            <b-radio-button v-model="horizontalCount"
                native-value="5"
                type="is-info"
                size="is-small">
                5
            </b-radio-button>
        </b-field>
      </div>
    </div>
    <div class="cards-container">
      <draggable class="services-grid" :style="{width: gridWidth + 'px'}" @end="updateList" :list="services" :options="{sort:editMode, draggable: '.service-draggable'}" >
        <a class="service-block service-draggable" :style="{backgroundColor: service.bgColor}" :data-id="service.id" v-if="filteredServices.includes(service)"  v-for="service in services" :key="service.id" @click="goToService(service)">
          <div class="service-tags">
            <div class="tag is-small" v-for="env in service.env" :key="env.id" v-if="envs.find(x => x.id === env)" :style="{backgroundColor: envs.find(x => x.id === env).color}">
              {{envs.find(x => x.id === env).alias}}
            </div>
          </div>
          <h1 class="service-name">{{service.name}}</h1>
          <p class="service-url">{{service.url}}</p>
          <div class="service-buttons" v-if="editMode">
              <b-icon icon="circle-edit-outline" size="is-big" @click.native="editService(service)"></b-icon>
              <b-icon icon="close-circle-outline" size="is-big" @click.native="deleteService(service.id)"></b-icon>
          </div>
        </a>
        <button class="service-block service-add-button" slot="footer" v-if="editMode && filteredEnvs.length > 0" @click="createNewService()">
          +
        </button>
      </draggable>
    </div>
  <div class="modal modal-new-service" v-if="modalNewServiceActive">
    <div class="modal-background" @click="modalNewServiceActive = false"></div>
    <div class="modal-content">
      <div class="modal-container">
        <h1 v-if="updateMode">Edit service</h1>
        <h1 v-else>Create new service</h1>
        <label class="label">Name</label>
        <input class="input" type="text" placeholder="Auth" v-model="modalNewServiceName">
        <label class="label">Url</label>
        <input class="input" type="text" placeholder="https://192.168.11.104:2046" v-model="modalNewServiceUrl">
        <label class="label">Environments</label>
        <div class="env-picker">
          <div class="tag env-item" :class="{'active': env.pickerActive}" v-for="env in filteredEnvs" :key="env.id"  :style="{backgroundColor: env.color}" @click="togglePickerEnv(env)">
            {{env.name}}
          </div>
        </div>
        <div class="field is-grouped">
          <div class="color-picker-control control is-expanded">
          <label class="label">Color</label>
            <div class="color-picker">
              <input type="radio" name="service" @change="modalNewServiceColorPicker = color" :value="color" v-model="modalNewServiceColor" v-for="color in colorsList" :key="color.id" :style="{color: color}">
            </div>
          </div>
          <div class="control">
            <label class="label">Custom color</label>
            <div class="custom-picker">
              <chrome-picker v-model="modalNewServiceColorPicker" @input="updateServiceColorValue" />
            </div>
          </div>
        </div>
        <button class="button is-info" v-if="updateMode" @click="updateService()">Update</button>
        <button class="button is-primary" v-else @click="createService()">Create</button>
      </div>
    </div>
    <button class="modal-close is-large" aria-label="close" @click="modalNewServiceActive = false"></button>
  </div>

  <div class="modal modal-new-env" v-if="modalNewEnvActive">
    <div class="modal-background" @click="modalNewEnvActive = false"></div>
    <div class="modal-content">
      <div class="modal-container">
        <h1 v-if="updateMode">Edit environment</h1>
        <h1 v-else>Create new environment</h1>
        <label class="label">Name</label>
        <input class="input" type="text" placeholder="Dev" v-model="modalNewEnvName">
        <label class="label">Alias</label>
        <input class="input" type="text" placeholder="D" v-model="modalNewEnvAlias">
        <label class="label">Projects</label>
        <div class="env-picker">
          <div class="tag env-item" :class="{'active': project.id == modalNewEnvProject}" v-for="project in projects" :key="project.id"  :style="{backgroundColor: project.color}" @click="modalNewEnvProject = project.id">
            {{project.name}}
          </div>
        </div>
        <label class="label">Color</label>
        <div class="color-picker">
          <input type="radio" name="" :value="color" v-model="modalNewEnvColor" v-for="color in colorsList" :key="color" :style="{color: color}">
        </div>
        <button class="button is-info" v-if="updateMode" @click="updateEnv()">Update</button>
        <button class="button is-primary" v-else @click="createEnv()">Create</button>
      </div>
    </div>
    <button class="modal-close is-large" aria-label="close" @click="modalNewEnvActive = false"></button>
  </div>

  <div class="modal modal-new-project" v-if="modalNewProjectActive">
    <div class="modal-background" @click="modalNewProjectActive = false"></div>
    <div class="modal-content">
      <div class="modal-container">
        <h1 v-if="updateMode">Edit project</h1>
        <h1 v-else>Create new project</h1>
        <label class="label">Name</label>
        <input class="input" type="text" placeholder="ReHoming" v-model="modalNewProjectName">
        <label class="label">Color</label>
        <div class="color-picker">
          <input type="radio" name="project" :value="color" v-model="modalNewProjectColor" v-for="color in colorsList" :key="color" :style="{color: color}">
        </div>
        <button class="button is-info" v-if="updateMode" @click="updateProject()">Update</button>
        <button class="button is-primary" v-else @click="createProject()">Create</button>
      </div>
    </div>
    <button class="modal-close is-large" aria-label="close" @click="modalNewProjectActive = false"></button>
  </div>
  </section>
</template>

<script>
/* eslint-disable */
import axios from "axios";
import { Chrome } from 'vue-color';
import draggable from "vuedraggable";
import VuePerfectScrollbar from "vue-perfect-scrollbar";

let Vue = require("vue");

export default {
  components: {
    'chrome-picker': Chrome,
    draggable,
    VuePerfectScrollbar
  },
  name: "ExpressPanel",
  data() {
    return {
      isLoading: true,
      editMode: false,
      filterMode: true,
      updateMode: false,
      currentProject: 0,

      modalNewServiceActive: false,
      modalNewServiceName: '',
      modalNewServiceEnv: [],
      modalNewServiceUrl: '',
      modalNewServiceColor: "#f44336",
      modalUpdateServiceId: -1,
      modalNewServiceColorPicker: "#f44336",

      modalNewEnvActive: false,
      modalNewEnvName: '',
      modalNewEnvAlias: '',
      modalNewEnvColor: "#f44336",
      modalNewEnvProject: '',
      modalUpdateEnvId: -1,

      modalNewProjectActive: false,
      modalNewProjectName: '',
      modalNewProjectColor: "#f44336",
      modalUpdateProjectId: -1,

      horizontalCount: 3,
      searchQuery: "",
      colorsList: [
        "#f44336",
        "#E91E63",
        "#9C27B0",
        "#673AB7",
        "#3F51B5",
        "#2196F3",
        "#03A9F4",
        "#00BCD4",
        "#009688",
        "#4CAF50",
        "#8BC34A",
        "#CDDC39",
        "#FFEB3B",
        "#FFC107",
        "#FF9800",
        "#FF5722",
        "#795548",
        "#9E9E9E",
        "#607D8B"
      ],
      services: [],
      envs: [],
      projects: []
    };
  },
  mounted() {
    this.loadProjects();
    this.loadEnvs();
    this.loadServices();
  },
  methods: {
    loadServices: function() {
      axios
        .get("/services")
        .then(response => {

          let order = []
          let gotServices = response.data
          let sortedServices = []
          if (this.$cookie.get('order')){
            order = this.$cookie.get('order').split(',')
          }

          order.forEach(element => {
            if (gotServices.find(serv => serv.id == element) != undefined){
              sortedServices.push(gotServices.find(serv => serv.id == element))
            }
          });

          gotServices.forEach(service => {
            if (!order.includes(service.id.toString())){
            sortedServices.push(service)
            order.push(service.id)
            }
          })
          this.$cookie.set('order',order)
          this.services = sortedServices;
          this.isLoading = false;
        })
        .catch(e => {
          this.error = e.data;
        });
    },
    loadEnvs: function(p) {
      axios
        .get("/envs")
        .then(response => {
          this.envs = response.data
        })
        .catch(e => {
          this.error = e.data;
        });
    },
    loadProjects: function() {
      axios
        .get("/projects")
        .then(response => {
          this.projects = response.data;
          let lastProj = this.$cookie.get('lastProj')
          if (lastProj){
            this.currentProject = lastProj 
          }
          else{
            this.currentProject = this.projects[0].id;
          }
        })
        .catch(e => {
          this.error = e.data;
        });
    },

    deleteService: function(serviceId) {
      this.$cookie.set('order',this.$cookie.get('order').split(',').filter(item => item != serviceId))
        axios
        .delete("/services/" + serviceId)
        .then(response => {
          this.loadServices();
        })
        .catch(e => {
          this.error = e.data;
        });
    },
    deleteEnv: function(envId) {
      console.log(envId)
        axios
        .delete("/envs/" + envId)
        .then(response => {
          this.loadEnvs()
        })
        .catch(e => {
          this.error = e.data;
        });
    },
    deleteProject: function(projectId) {
        axios
        .delete("/projects/" + projectId)
        .then(response => {
          this.loadProjects()
        })
        .catch(e => {
          this.error = e.data;
        });
    },

    createService: function(serviceId) {
      this.updateMode = false
      var sendEnvs = this.envs.filter(env => env.pickerActive == true)
      this.modalNewServiceEnv = []

      for (var i = 0; i<sendEnvs.length; i++){
        this.modalNewServiceEnv.push(sendEnvs[i].id)
      }
      if (this.modalNewServiceUrl.substring(0, 7) != "http://" && this.modalNewServiceUrl.substring(0, 8) != "https://"){
        this.modalNewServiceUrl = "http://" + this.modalNewServiceUrl;
      }
      if (this.newServiceValid){
        axios
        .post("/services", {
          name: this.modalNewServiceName,
          url: this.modalNewServiceUrl,
          env: this.modalNewServiceEnv,
          color: this.modalNewServiceColor
        })
        .then(response => {
          this.modalNewServiceActive = false
          this.loadServices();
          this.modalNewServiceUrl = "";
          this.modalNewServiceName = "";
          for (var i = 0; i<this.envs.length; i++){
            this.envs[i].pickerActive = false
          }
          this.modalNewServiceColor = colorsList[0]
        })
        .catch(e => {
          this.error = e.data;
        });
      }
    },
    createEnv: function(serviceId) {
      this.updateMode = false
      if (this.newEnvValid){
        axios
        .post("/envs", {
          name: this.modalNewEnvName,
          alias: this.modalNewEnvAlias,
          project: this.modalNewEnvProject,
          color: this.modalNewEnvColor
        })
        .then(response => {
          this.modalNewEnvActive = false
          this.loadEnvs();
          this.modalNewEnvAlias = "";
          this.modalNewEnvName = "";
          this.modalNewEnvProject = -1;
          this.modalNewEnvColor = colorsList[0]
        })
        .catch(e => {
          this.error = e.data;
        });
      }
    },
    createProject: function(serviceId) {
      this.updateMode = false
      if (this.newProjectValid){
        axios
        .post("/projects", {
          name: this.modalNewProjectName,
          color: this.modalNewProjectColor
        })
        .then(response => {
          this.modalNewProjectActive = false
          this.loadProjects();
          this.modalNewProjectName = "";
          this.modalNewProjectColor = colorsList[0]
        })
        .catch(e => {
          this.error = e.data;
        });
      }
    },

    updateService: function(){
      if (this.newServiceValid){
        axios
        .put("/services/" + this.modalUpdateServiceId, {
          name: this.modalNewServiceName,
          url: this.modalNewServiceUrl,
          env: this.modalNewServiceEnv,
          color: this.modalNewServiceColor
        })
        .then(response => {
          this.modalNewServiceActive = false
          this.loadServices();
          this.modalNewServiceUrl = "";
          this.modalNewServiceName = "";
          for (var i = 0; i<this.envs.length; i++){
            this.envs[i].pickerActive = false
          }
          this.modalNewServiceColor = colorsList[0]
        })
        .catch(e => {
          this.error = e.data;
        });
      }
    },
    updateEnv: function(){
      if (this.newEnvValid){
        axios
        .put("/envs/" + this.modalUpdateEnvId, {
          name: this.modalNewEnvName,
          alias: this.modalNewEnvAlias,
          project: this.modalNewEnvProject,
          color: this.modalNewEnvColor
        })
        .then(response => {
          this.modalNewEnvActive = false
          this.loadEnvs();
          this.modalNewEnvAlias = "";
          this.modalNewEnvName = "";
          this.modalNewEnvColor = colorsList[0]
        })
        .catch(e => {
          this.error = e.data;
        });
      }
    },
    updateProject: function(){
      if (this.newProjectValid){
        axios
        .put("/projects/" + this.modalUpdateProjectId, {
          name: this.modalNewProjectName,
          color: this.modalNewProjectColor
        })
        .then(response => {
          this.modalNewProjectActive = false
          this.loadProjects();
          this.modalNewProjectName = "";
          this.modalNewProjectColor = colorsList[0]
        })
        .catch(e => {
          this.error = e.data;
        });
      }
    },

    editService: function(service){
      this.updateMode = true
      this.modalUpdateServiceId = service.id
      this.modalNewServiceName = service.name
      this.modalNewServiceUrl = service.url
      this.modalNewServiceEnv = service.env
      this.modalNewServiceColor = service.color
      for(var i = 0; i<service.env.length; i++){
        var f = this.envs.find(x => x.id === service.env[i])
        this.$set(f, "pickerActive", true);
      }
      this.modalNewServiceActive = true
    },
    editEnv: function(env){
      this.updateMode = true
      this.modalUpdateEnvId = env.id
      this.modalNewEnvName = env.name
      this.modalNewEnvAlias = env.alias
      this.modalNewEnvColor = env.color
      this.modalNewEnvProject = env.project
      this.modalNewEnvActive = true
    },
    editProject: function(project){
      console.log(project)
      this.updateMode = true
      this.modalUpdateProjectId = project.id
      this.modalNewProjectName = project.name
      this.modalNewProjectColor = project.color
      this.modalNewProjectActive = true
    },

    createNewService(){
      for(var i = 0; i<this.envs.length; i++){
        this.$set(this.envs[i], "pickerActive", false);
      }
      this.modalNewServiceActive = true; 
      this.updateMode = false
      this.modalNewServiceName = ''
      this.modalNewServiceEnv = []
      this.modalNewServiceUrl = ''
      this.modalNewServiceColor = "#f44336"
    },

    goToService: function(s) {
      if (!this.editMode) {
        var win = window.open(s.url, '_blank');
        win.focus();
      }
    },
    toggleEdit: function() {
      this.searchQuery = ''
      this.editMode = !this.editMode
    },
    toggleEnv: function(env) {
      if (!this.editMode){
        this.$set(env, "active", !env.active);
      }
    },
    togglePickerEnv: function(env) {
      this.$set(env, "pickerActive", !env.pickerActive);
    },
    updateList: function(evt){
      let newOrder = []
      this.services.forEach(service => newOrder.push(service.id))
      console.log(newOrder)
      this.$cookie.set('order',newOrder)
      this.isLoading = true
      this.loadServices()
    },
    updateServiceColorValue: function(){
      this.modalNewServiceColor = this.modalNewServiceColorPicker.hex
    }
  },
  computed: {
    newServiceValid: function(){
      return this.modalNewServiceName && this.modalNewServiceUrl && this.modalNewServiceEnv && this.modalNewServiceColor
    },
    newEnvValid: function(){
      return this.modalNewEnvName && this.modalNewEnvAlias && this.modalNewEnvColor && this.modalNewEnvProject
    },
    newProjectValid: function(){
      return this.modalNewProjectName && this.modalNewProjectColor
    },
    filteredServices: function() {
      var k = this;
      if (this.services != []) {
        
      return this.services.filter(service => {
        return (
          service.name.toLowerCase().includes(this.searchQuery.toLowerCase()) && service.name != undefined &&
          service.env.filter(e => {
            if (this.filteredEnvs.find(x => x.id === e) != undefined){
              return this.filteredEnvs.find(x => x.id === e).active == true;
            }
            else{
              return false
            }
          }) != 0
        );
      });
      }
      else{
        return []
      }
    },

    filteredEnvs: function() {
      return this.envs.filter(env => {
          return env.project == this.currentProject
      })
    },

    blockWidth: function(){

    },
    gridWidth: function() {
      if (this.horizontalCount * 350 > window.innerWidth){
        return 2*350
      }
      if (this.horizontalCount >= 3 && this.horizontalCount <= 5) {
        return this.horizontalCount * 350;
      } else {
        return 3 * 350;
      }
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
header {
  height: 60px;
  background-color: #36475f;
  display: flex;
}
.logo-block {
  height: 60px;
  background-color: #03a9f4;
  color: #fff;
  font-family: "Courier New", Courier, monospace;
  font-weight: bold;
  font-size: 1.5em;
  padding: 10px 20px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.projects-bar {
  color: #fff;
  height: 60px;
  flex-grow: 1;
  display: flex;
  align-items: center;
  justify-content: flex-start;
}
.projects-item {
  position: relative;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 60px;
  padding: 0 20px;
  border-right: 1px solid rgb(47, 64, 87);
}
.service-buttons.project-buttons{
  padding-top: 25px;
  opacity: 0.8;
  border-radius: 0px;
}

.projects-item:last-child {
  border: none;
}
.project-item-container span {
  color: #fff;
  font-weight: bold;
  font-size: 1em;
}

.project-underscore {
  height: 2px;
  width: 100%;
}

.projects-item:hover {
  background-color: rgb(47, 64, 87);
}

.control-ribbon {
  display: flex;
  background-color: #fff;
  height: 60px;
}
.control-ribbon-buttons {
  display: flex;
  padding: 0 0 0 20px;
  justify-content: center;
  align-items: center;
}
.control-ribbon-buttons a {
  cursor: pointer;
  margin: 0 10px 0 0;
}
.control-ribbon-search {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-grow: 1;
  padding-right: 20px;
}
.control-ribbon-search .control {
  flex-grow: 1;
}

.cards-container {
  position: relative;
  padding: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.service-block {
  cursor: pointer;
  background-color: #fff;
  color: #000;
  padding: 20px;
  display: inline-block;
  width: 330px;
  height: 100px;
  margin: 10px;
  align-items: center;
  justify-content: center;
  position: relative;
  border-radius: 5px;
}
.service-add-button {
  background-color: #999999;
  color: #fff;
  cursor: pointer;
  font-size: 3em;
  height: 100px;
  border: none;
  outline: none;
  position: absolute;
}
.service-add-button:hover{
  background-color: rgba(0, 0, 0, 0.75);

}
.service-block h1 {
  font-size: 1.5em;
}

.service-block p {
  font-size: 0.75em;
}

.service-tags {
  position: absolute;
  right: 10px;
}
.service-tags .tag {
  opacity: 1;
  color: #fff;
  margin: 0 10px 0 0;
}

.service-buttons {
  pointer-events: all;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 100%;
  background-color: rgba(0, 0, 0, 0.8);
  opacity: 0.5;
  top: 0;
  left: 0;
  position: absolute;
  cursor: default;
  border-radius: 5px;
}


.service-buttons .icon {
  margin: 0 0 0 10px;
  color: #fff;
  cursor: pointer;
}
.service-buttons .icon:first-child{
  margin-left: 0; 
}

.env-bar {
  padding: 0 0 10px 20px;
  background-color: #fff;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.tag {
  opacity: 0.2;
  color: #fff;
  margin-right: 10px;
}
.env-bar .add-env {
  opacity: 1;
  cursor: pointer;
}
.env-item.add-env:hover{
  background-color: rgb(75, 99, 110)!important;
}
.env-item {
  position: relative;
  cursor: pointer;
}
.env-item.active {
  opacity: 1;
}
.service-buttons.env-buttons{
  opacity: 0.8;
  border-radius: 3px;
}
.modal{
  display: flex;
}
.modal-content{
  background: #fff;
  border-radius: 5px;
  justify-content: center;
  padding: 20px;
}
.modal-content h1{
  font-size: 1.25em;
  font-weight: bold;
}
.modal-content label{
  margin-bottom: 0;
  margin-top: 20px;
}
.env-picker{
  color:#FFF;
  display: flex;
  justify-content: space-between;
}
.env-picker .env-item{
  color:#FFF;
}

.width-picker{
  height: 1px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 20px;
}

.color-picker{
  padding: 10px 0 10px 0;
}

.custom-picker{
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px 0;
}


span.customRadio {
    display: none;
}

input[type=radio] {
  visibility: hidden;
  position: relative;
  cursor: pointer;
  margin: 5px;
  width: 30px;
  height: 30px;
}

input[type=radio]:before {
  content: "";
  visibility: visible;
  position: absolute;

  border: 2px solid currentColor;
  border-radius: 50%;

  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
}

input[type=radio]:not(:checked):before {
  background-color: currentColor;
  box-shadow:inset 0px 0px 0px 3px #fff;
  border: 2px solid currentColor;
}

input[type=radio]:checked:before {
  background-color: currentColor;
}
</style>