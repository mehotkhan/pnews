import { createStore } from "vuex";
import axios from "axios";
export const ITEMS_PER_PAGE = 10;

// axios.defaults.headers.common["Access-Control-Allow-Origin"] = "*";

const api = axios.create({
  baseURL: " https://api.rss2json.com/v1/api.json?rss_url=https://virgool.io/feed/",

});

async function* asyncGetter(data) {
  let i = 0;
  while (i < data.length) {
    let res = await api.get(`item/${data[i]}.json?print=pretty`);
    i++;
    yield res.data;
  }
}

export default createStore({
  state: {
    topic: "top", // default topic
    loading: false,
    page: 1, // default page
    items: [],
    endPagination: false,
  },
  mutations: {
    setTopic(state, topic) {
      state.topic = topic;
    },
    setLoading(state, status) {
      state.loading = status;
    },
    setEndPagination(state, status) {
      state.endPagination = status;
    },
    setPage(state, page) {
      state.page = page;
    },
    increasePage(state) {
      state.page++;
    },
    loadItems(state, items) {
      state.items = [...state.items, ...items];
    },
    clearItems(state) {
      state.items = [];
    },
  },
  actions: {
    async fetchItems(context, topic) {
      // init local items storage
      let items = [];
      // if the requested topic is not the same with current topic, then reset relevant variables
      if (topic !== this.state.topic) {
        context.commit("clearItems"); // clear items
        context.commit("setTopic", topic); // set the  new topic
        context.commit("setEndPagination", false); // reset
        context.commit("setPage", 1); // reset
      } else context.commit("increasePage"); // if not, inrease the number of current page
      // init current page
      let curPage = this.state.page;
      context.commit("setLoading", true);
      // make the request
      // let resp = await api.get(`${this.state.topic}stories.json?limitToFirst=${ITEMS_PER_PAGE * curPage}&orderBy="$key"`);
      let resp = await api.get(`topic/استارتاپ` );
      console.log(curPage);
      // slice data
      // let result = resp.data.items.slice(
      //   (curPage - 1) * ITEMS_PER_PAGE,
      //   ITEMS_PER_PAGE * curPage
      // );  
      let result = resp.data.items ;

      console.log(result)
      if (result.length === 0) context.commit("setEndPagination", true);
      else
        // for await (let item of asyncGetter(result)) {
        for  (let item of result) {
          items.push(item);
        }

      context.commit("loadItems", items);
      context.commit("setLoading", false);
    },
  },
});
