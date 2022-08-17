import Vue from 'vue'
import barChartTable from "./components/barChartTable.vue";

const components = [
    barChartTable,
]

const install = function(Vue) {
    if(install.installed) return
    components.map(component => Vue.component(component.name, component))
  }
  
  
export default {
    install,
    barChartTable
}