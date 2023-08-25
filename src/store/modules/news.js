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
      q: "tecnologia",
      language: "pt",
      from: dataInicial ? dataInicial : undefined,
      to: dataFinal ? dataFinal : undefined,
      sortBy: "publishedAt",
      apiKey: "XXXXXXX",
    };
    const { data } = await axios.get("/everything", { params });
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
