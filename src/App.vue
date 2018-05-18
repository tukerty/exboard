<template>
  <div id="app">
    <div class="navigator">
      <router-link class="nav_item nav_item_1" to="/translator">T</router-link>
      <router-link class="nav_item nav_item_1" to="/">E</router-link>
      <router-link class="nav_item nav_item_1" to="/">M</router-link>
    </div>
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
a{
  text-decoration: none;
  color:#000;
}
body{
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  margin: 0;
  height: 100vh;
  width: 100vw;
  overflow: hidden;
}
#app{
  height: calc(100vh - 90px);
  width: calc(100vw - 60px);
  margin: 60px 30px 30px 30px;
  border-radius: 5px;
  background-color: rgba(255,255,255,0.25);
}
#tool_title{
  font-size: 25px;
  position: absolute;
  top: 25px;
  color:#FFF;
  margin: 0

}
.navigator{
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 5px 5px 0 0;
  height: 50px;
  width: calc(100vw - 60px);
  background-color: #ecf0f1;
}
.nav_item{
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: 'Courier New', Courier, monospace;
  font-size: 30px;
  font-weight: 900;
  cursor: pointer;
  margin: 0 20px 50px 0;
  border-radius: 100%;
  height: 60px;
  border: 3px solid #ecf0f1;
  width: 60px;
  background-color: #ecf0f1;
}
.status_bar{
  font-family: 'Courier New', Courier, monospace;
  display: flex;
  align-items: center;
  padding: 0 15px;
  border-radius: 0 0 5px 5px;
  height: 30px;
  position: absolute;
  bottom: 30px;
  width: calc(100vw - 90px);
  background-color: rgba(0,0,0,0.5);
  text-align: left;
  color:#FFF;
  font-size: 12px;
  box-shadow: 0 -1px -1px rgba(0,0,0,0.06), 0 -1px -1px rgba(0,0,0,0.12);
}
</style>
