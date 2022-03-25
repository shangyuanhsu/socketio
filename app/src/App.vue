<template>
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
  padding: 8px 10px;
  cursor: pointer;
  border: 0;
  background: gray;
  color: white;
  outline: none;
  border-radius: 20px;
}
input[type="text"] {
  padding: 8px;
  margin: 0 5px 0 0;
  border: 1px solid gray;
  outline: none;
  border-radius: 20px;
}
</style>
