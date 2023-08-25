import Vue from "vue";
import Vuex from "vuex";

import loading from "./modules/loading";
import news from "./modules/news";

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    loading,
    news,
  },
});
