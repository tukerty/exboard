<template>
  <section class="express_panel">
    <h1 id="tool_title">{{activeTool}}</h1>
    <VuePerfectScrollbar class="project_bar">
      <div class="project">
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

</style>
