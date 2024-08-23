<template>
  <i @click="$emit('click', $event)" v-html="inlineSVG" />
</template>

<script>
const icons = import.meta.glob("../../assets/svg/*.svg", { as: "raw" });
export default {
  props: {
    height: {
      type: [Number, String],
      default: 6,
    },
    icon: {
      type: String,
      default: "",
    },
    noSize: {
      type: Boolean,
      default: false,
    },
    width: {
      type: [Number, String],
      default: 6,
    },
    classes: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      inlineSVG: null,
    };
  },
  computed: {
    iconClasses() {
      return this.noSize ? [] : [`h-${this.height}`, `w-${this.width}`];
    },
  },
  watch: {
    icon() {
      this.getIcon();
    },
  },
  mounted() {
    this.getIcon();
  },
  methods: {
    getIcon() {
      if (
        this.icon !== "" &&
        icons.hasOwnProperty(`../../assets/svg/${this.icon}.svg`)
      ) {
        icons[`../../assets/svg/${this.icon}.svg`]().then((i) => {
          let span = document.createElement("span");
          span.innerHTML = i;
          let svg = span.children[0];
          if (this.iconClasses && this.iconClasses.length > 0) {
            this.iconClasses.forEach((c) => {
              if (c !== "") {
                svg.classList.add(c);
              }
            });
          }
          if (this.classes && this.classes.length > 0) {
            this.classes.split(" ").forEach((c) => {
              if (c !== "") {
                svg.classList.add(c);
              }
            });
          }
          this.inlineSVG = span.innerHTML;
        });
      }
    },
  },
};
</script>
