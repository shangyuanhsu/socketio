<template>
  <!-- <nav>
    <router-link to="/">Login</router-link> |
    <router-link to="/home">Home</router-link>
  </nav> -->
  <router-view />
</template>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
button {
  padding: 5px;
  cursor: pointer;
}
input[type="text"] {
  padding: 5px;
  margin: 0 5px 0 0;
}
</style>
