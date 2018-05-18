<template>
  <section class="express_panel">
    <h1 id="tool_title">{{activeTool}}</h1>
    <VuePerfectScrollbar class="project_bar">
      <div class="project" @mouseover="logStatus('Show to project: ')">
        <p>Test</p>
      </div>
    </VuePerfectScrollbar>
    
    <table class="langTable">
        <tr>
            <th>Key</th>
            <th>Value</th>
            <th>Comment</th>
        </tr>
        <tr>
            <td>q</td>
            <td>w</td>
            <td>e</td>
        </tr>
    </table>

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
  name: 'Translator',
  data () {
    return{
      activeTool: 'Translator',
      statusBar: ''
    }
  },
  mounted() {
    document.body.style.background = 'linear-gradient(to bottom, #0b486b, #f56217'
  },
  updated(){
  },
  methods: {  
    logStatus: function(a){
      this.statusBar = a
    },  
  },
  computed: {
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.project_bar{
  background: rgba(255,255,255,0.75);
  position: absolute;
  margin: 30px;
  padding: 30px;
  height: calc(100vh - 290px);
  width: calc(20vw - 60px);
  overflow-y: scroll;
  border-radius: 5px;
}

.project{
  cursor: pointer;
  background: rgba(255,255,255,0.5);
  padding: 30px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-radius: 5px;
}

.project_active{
  background: rgba(255,255,255,1);
}

.project:not(:last-child) {
  margin-bottom: 30px;
}

.project p{
  font-size: 18px;
  margin: 0;
}

.langTable{
  background: rgba(255,255,255,0.5);
  position: absolute;
  top:110px;
  left: calc(20vw + 60px);
  width: calc(80vw - 210px);
  margin: 30px;
  padding: 30px;
}
.langTable th{
  background: rgba(255,255,255,0.75);
}
</style>
