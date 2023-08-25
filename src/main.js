import Vue from "vue";
import App from "./App.vue";

import store from "./store";

import BootstrapVue from "bootstrap-vue";

import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue/dist/bootstrap-vue.css";

import VueNoty from "vuejs-noty";
import "vuejs-noty/dist/vuejs-noty.css";

import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faNewspaper,
  faExternalLink,
  faCog,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

library.add(faNewspaper, faExternalLink, faCog);

Vue.component("font-awesome-icon", FontAwesomeIcon);

Vue.config.productionTip = false;

Vue.use(BootstrapVue);
Vue.use(VueNoty);

new Vue({
  store,
  render: (h) => h(App),
}).$mount("#app");
