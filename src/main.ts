import "vfonts/FiraCode.css";
import "vfonts/Lato.css";
import "./index.css";

import { createPinia } from "pinia";
import { createApp } from "vue";

import App from "./App.vue";
import router from "./router";

const app = createApp(App);

app.use(createPinia()).use(router);

app.mount("#app");
