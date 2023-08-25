import axios from "../../axios.js";

const getDefaultState = () => {
  return {
    newsList: [],
  };
};

const state = getDefaultState();

const getters = {
  newsList: (state) => state.newsList,
};

const mutations = {
  setNewsList(state, list) {
    state.newsList = list;
  },
};

const actions = {
  async getNewsList({ commit }, { dataInicial, dataFinal }) {
    const params = {
      dataInicial: dataInicial ? dataInicial : undefined,
      dataFinal: dataFinal ? dataFinal : undefined,
    };
    const { data } = await axios.get("/news", { params });
    commit("setNewsList", data.articles);
    return data;
  },
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};
