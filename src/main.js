import { createApp } from "vue";

export default function (pageComponent) {
    createApp(pageComponent).mount("#app");
}
