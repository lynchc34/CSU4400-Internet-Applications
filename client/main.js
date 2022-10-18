import component from "./component.js"
Vue.createApp({
    template: `
    <button @click="hi"> click me </button>
    <component :name="domtest"/> 
    `,
    methods:{
        hi(){alert("hello")}
    },
    components: {component},
    data(){return {domtest: "doms"}}
}).mount("#app")
