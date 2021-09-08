<template>
  <div id="container" class="md:container md:mx-auto px-5 text-right py-10">
    <div class="flex flex-col">
      <h1
        class="
          text-blue-700
          dark:text-pink-400
          text-3xl
          font-semibold
          text-center
          mb-5
        "
      >
        <a href="/">یک خبرخوان ساده و جمع و جور</a>
      </h1>
      <div class="flex justify-between">
        <div class="text-pink-600 dark:text-yellow-200 text-xl">
          <span
            :ref="`topic-${topic.key}`"
            class="tab mr-3 cursor-pointer text-sm md:text-lg"
            v-for="topic in topics"
            :key="topic.key"
            @click="loadStories(topic.key, $event)"
            >{{ topic.icon }} {{ topic.title }}</span
          >
        </div>
        <div class="theme-switch-wrapper">
          <span
            ref="toggleDark"
            class="
              h-6
              w-6
              flex
              items-center
              justify-center
              cursor-pointer
              bg-gray-600
              dark:bg-blue-600
              rounded-full
            "
            @click="toggleDarkMode"
            >☀️</span
          >
        </div>
      </div>
      <Stories :items="items"></Stories>
      <div class="flex" v-if="endPagination">
        <div class="flex-auto text-center mt-2">
          <span class="text-red-500 dark:text-pink-600">The End.</span>
        </div>
      </div>
      <div class="flex" v-else>
        <div class="flex-auto text-center">
          <button
            @click="handleScroll"
            class="
              p-2
              bg-blue-600
              text-white
              hover:text-yellow-300
              dark:text-pink-600
              dark:bg-yellow-300
              dark:hover:text-green-700
              rounded-md
            "
            v-if="!loading"
          >
            صفحه بعد
          </button>
          <Skeleton v-else quantity="10"></Skeleton>
          <span
            class="animate-ping text-red-500 dark:text-pink-200"
            v-show="loading"
            >آپدیت ...</span
          >
        </div>
      </div>
    </div>
    <div class="mt-6 text-gray leading-3 text-center">
      همه چیز به طور شگفت انگیزی خوب باید باشد ، طراحی و توسعه توسط
      <a href="https://alizemani.ir"> علی زِمانی</a> ❤️
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import Stories from "./components/Stories.vue";
import Skeleton from "./components/Skeleton.vue";

export default {
  name: "app",
  components: { Stories, Skeleton },
  data() {
    return {
      topics: [
        { key: "new", title: "جدیدترین", icon: "" },
        { key: "top", title: "مطالب داغ", icon: "" },
        { key: "science", title: "دانش", icon: "" },
        { key: "it", title: "آی‌تی", icon: "" },
        { key: "economy", title: "اقتصاد", icon: "" },
        { key: "book", title: "کتاب", icon: "" },
      ],
    };
  },
  computed: {
    ...mapState(["items", "loading", "endPagination", "page"]),
  },
  created() {
    if (!("topic" in localStorage)) localStorage.topic = "new";
    this.loadStories(localStorage.topic);
    if (!("theme" in localStorage)) localStorage.theme = "white";
  },
  mounted() {
    this.toggleDarkMode(localStorage.theme);
    this.$refs[`topic-${localStorage.topic}`].classList.add("text-green-500");
    // window.onscroll = () => {
    //   window.innerHeight + window.scrollY >= document.body.offsetHeight &&
    //     this.handleScroll();
    // };
  },
  methods: {
    handleScroll() {
      if (!this.loading) this.loadStories(localStorage.topic);
    },
    toggleDarkMode(theme, evt) {
      let htmlElm = document.querySelector("html");
      const setLight = () => {
        htmlElm.classList.remove("dark");
        localStorage.theme = "light";
        this.$refs.toggleDark.textContent = "☀️";
      };
      const setDark = () => {
        htmlElm.classList.add("dark");
        localStorage.theme = "dark";
        this.$refs.toggleDark.textContent = "☀️";
      };
      if (typeof theme === "string") {
        if (theme == "dark") setDark();
        else setLight();
      } else {
        if (localStorage.theme === "dark") setLight();
        else setDark();
      }
    },
    loadStories(topic, evt) {
      this.$store.dispatch("fetchItems", topic);
      localStorage.topic = topic;
      if (evt != undefined) {
        document.querySelectorAll(".tab").forEach((elm) => {
          elm.classList.remove("text-green-500");
        });
        evt.target.classList.add("text-green-500");
      }
    },
  },
};
</script>
<style scoped>
a:hover {
  cursor: pointer;
}
</style>
