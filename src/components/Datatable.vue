<template>
  <b-container class="my-3">
    <b-row>
      <b-col>
        <h4>
          <font-awesome-icon icon="newspaper" />
          Notícias
        </h4>
      </b-col>
      <b-col class="btn-right">
        <b-button variant="primary" @click="onClickFiltros"> FILTROS </b-button>
      </b-col>
    </b-row>
    <b-row class="mt-1">
      <b-col md="4">
        <b-input placeholder="Pesquisa" @input="debouncedPesquisa" />
      </b-col>
    </b-row>
    <b-card class="mt-3">
      <b-table
        striped
        :fields="fields"
        hover
        :items="filteredNewsList"
        :per-page="perPage"
        :current-page="currentPage"
        responsive
        class="mt-3"
      >
        <template #head()="{ column }">
          {{ formatColumnName(column) }}
        </template>
        <template #cell(url)="row">
          <b-button variant="link" size="sm" @click="onRedirect(row.item.url)">
            <font-awesome-icon icon="external-link" />
          </b-button>
        </template>
      </b-table>
      <b-pagination
        v-model="currentPage"
        :total-rows="filteredNewsList.length"
        :per-page="perPage"
        aria-controls="my-table"
        align="right"
        size="sm"
        class="mt-4 mb-0"
      />
    </b-card>
    <b-modal
      v-model="showModal"
      title="Filtros"
      cancelVariant="danger"
      hide-footer
    >
      <b-form @submit.prevent="applyFilters(filtros)">
        <b-row>
          <b-col>
            <b-form-group label="Data inicial:" label-for="dataInicial">
              <b-form-datepicker
                id="dataInicial"
                v-model="filtros.dataInicial"
                placeholder="Data inicial"
                required
              ></b-form-datepicker>
            </b-form-group>
          </b-col>
        </b-row>
        <b-row>
          <b-col>
            <b-form-group label="Data final:" label-for="dataFinal">
              <b-form-datepicker
                id="dataFinal"
                v-model="filtros.dataFinal"
                placeholder="Data final"
                required
              ></b-form-datepicker>
            </b-form-group>
          </b-col>
        </b-row>
        <div class="btn-right mt-3">
          <b-button variant="danger" @click="clearFilters"> LIMPAR </b-button>
          <b-button type="submit" variant="primary" class="mx-1">
            APLICAR
          </b-button>
        </div>
      </b-form>
    </b-modal>
  </b-container>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import moment from "moment";
import debounce from "lodash/debounce";
import filter from "lodash/filter";

export default {
  name: "Default-Datatable",
  data() {
    return {
      currentPage: 1,
      perPage: 10,
      fields: [
        {
          key: "author",
          sortable: true,
          formatter: (value) => {
            return value || "-";
          },
        },
        {
          key: "title",
          sortable: true,
          formatter: (value) => {
            return value || "-";
          },
        },
        {
          key: "description",
          sortable: true,
          formatter: (value) => {
            return value || "-";
          },
        },
        {
          key: "publishedAt",
          formatter: (value) => {
            return moment(value).format("DD/MM/YYYY HH:mm:ss");
          },
        },
        { key: "url" },
      ],
      showModal: false,
      filtros: {},
      pesquisa: null,
    };
  },
  computed: {
    ...mapGetters("news", ["newsList"]),
    filteredNewsList() {
      const pesquisa = (this.pesquisa || "").toLowerCase();
      if (pesquisa) {
        return filter(this.newsList, function (o) {
          return Object.keys(o).some(function (k) {
            return o[k]
              ? o[k].toString().toLowerCase().indexOf(pesquisa) != -1
              : false;
          });
        });
      } else return this.newsList;
    },
  },
  mounted() {
    this.getList();
  },
  methods: {
    ...mapActions("loading", ["loading"]),
    ...mapActions("news", ["getNewsList"]),
    debouncedPesquisa: debounce(function (e) {
      this.pesquisa = e;
    }, 500),
    async getList(filtros = {}) {
      try {
        this.loading();
        await this.getNewsList(filtros);
      } catch (err) {
        this.$noty.error("Erro ao obter dados das notícias.");
      } finally {
        this.loading(false);
      }
    },
    formatColumnName(col) {
      const obj = {
        author: "Autor",
        title: "Título",
        description: "Descrição",
        publishedAt: "Publicação",
        url: "Ação",
      };
      return obj[col];
    },
    onRedirect(url) {
      window.open(url);
    },
    onClickFiltros() {
      this.showModal = true;
    },
    async applyFilters(filtros) {
      const { dataInicial, dataFinal } = filtros;
      const unixDataInicial = moment(dataInicial).unix();
      const unixDataFinal = moment(dataFinal).unix();

      if (unixDataInicial > unixDataFinal) {
        this.$noty.warning(
          "A data inicial não pode ser maior que a data final."
        );
        return;
      }

      await this.getList(filtros);
      this.showModal = false;
    },
    async clearFilters() {
      this.filtros = {
        dataInicial: undefined,
        dataFinal: undefined,
      };
      await this.getList();
      this.showModal = false;
    },
  },
};
</script>

<style scoped>
h4 {
  text-align: left;
}
.btn-right {
  text-align: right;
}
</style>
