import Vue from 'vue'
import vue2ChartTable from "./src/index.vue";

const components = [
    vue2ChartTable,
]

const install = function(Vue) {
    if(install.installed) return
    components.map(component => Vue.component(component.name, component))
  }

export default {
    install,
    vue2ChartTable
}