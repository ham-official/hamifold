<template>
  <button :type="ctaType" :class="[
    onlyIcon ? onlyIconButtonClasses : buttonClasses,
    {
      'rounded-full transition ease-in-out duration-100 uppercase font-display font-semibold':
        !onlyIcon,
    },
    {
      'rounded-full transition ease-in-out duration-100': onlyIcon,
    },
  ]" :disabled="disabled" class="flex items-center justify-center">
    <Icon v-if="iconLeft" :icon="iconLeft" :noSize="true" :classes="leftIconClasses" @click="handleClick" />
    <slot v-if="!onlyIcon"></slot>
    <Icon v-if="!onlyIcon && iconRight" :icon="iconRight" :noSize="true" :classes="rightIconClasses"
      @click="handleClick" />
  </button>
</template>

<script>
export default {
  props: {
    color: {
      type: String,
      default: "primary",
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    iconLeft: {
      type: String,
      default: null,
    },
    iconRight: {
      type: String,
      default: null,
    },
    size: {
      type: String,
      default: "md",
    },
    onlyIcon: {
      type: Boolean,
      default: false,
    },
    ctaType: {
      type: String,
      default: 'button'
    }
  },
  computed: {
    iconSize() {
      switch (this.size) {
        case "xxl":
          return 6;
        case "xl":
          return 5;
        case "lg":
          return 5;
        case "md":
          return 5;
        case "sm":
          return 5;
        default:
          return 6;
      }
    },
    leftIconClasses() {
      return this.iconSize ? `h-${this.iconSize} w-${this.iconSize}` : 'h-5 w-5'
    },
    rightIconClasses() {
      return this.iconSize ? `h-${this.iconSize} w-${this.iconSize}` : 'h-5 w-5'
    },
    buttonClasses() {
      return {
        "md:px-3.5 py-2 gap-x-2 text-sm": this.size === "sm",
        "md:px-4 py-2.5 gap-x-2 text-sm": this.size === "md",
        "md:px-4 py-2.5 gap-x-2 text-md": this.size === "lg",
        "p-5 gap-x-2 text-button-xl": this.size === "xl",
        "md:px-7 py-4 gap-x-3 text-lg": this.size === "xxl",


        "bg-primary-400 text-black hover:bg-primary-700 hover:text-primary-25 border border-gray-900 font-display uppercase font-semibold":
          this.color === "primary" && !this.disabled,
        "cursor-not-allowed bg-primary-100 border border-primary-300 text-primary-400":
          this.color === "primary" && this.disabled,

        "bg-primary-100 text-primary-900 hover:bg-primary-700 hover:text-primary-25":
          this.color === "primary-light" && !this.disabled,
        "cursor-not-allowed bg-primary-200 border border-primary-300 text-primary-400":
          this.color === "primary-light" && this.disabled,

        "bg-secondary-800 border border-secondary-600 text-white hover:bg-secondary-600 hover:border-secondary-800":
          this.color === "secondary" && !this.disabled,
        "cursor-not-allowed bg-secondary-200 border border-secondary-300 text-secondary-400 stroke-current":
          this.color === "secondary" && this.disabled,

        "bg-white text-gray-900 border border-gray-900 hover:text-white focus:text-white hover:bg-gray-900 hover:text-gray-900 focus:bg-gray-900 font-display uppercase font-semibold":
          this.color === "white" && !this.disabled,
        "cursor-not-allowed bg-gray-300 text-gray-400 stroke-current font-display uppercase font-semibold":
          this.color === "white" && this.disabled,

        "bg-gray-200 border border-gray-200 text-gray-800 hover:bg-gray-400 hover:border-gray-400 hover:text-gray-900 focus:bg-gray-200 focus:border-gray-200":
          this.color === "gray" && !this.disabled,
        "cursor-not-allowed bg-gray-100 border border-gray-100 text-gray-400 stroke-current":
          this.color === "gray" && this.disabled,

        "bg-gray-900 text-white border border-gray-900 hover:text-gray-900 focus:text-gray-900 hover:bg-white hover:text-gray-900 focus:bg-white font-display uppercase font-semibold":
          this.color === "black" && !this.disabled,
        "cursor-not-allowed bg-gray-100 text-gray-400 stroke-current":
          this.color === "black" && this.disabled,

        "text-primary-100 hover:text-primary-300 hover:underline focus:text-primary-900":
          this.color === "only-link" && !this.disabled,
        "cursor-not-allowed text-primary-300 ":
          this.color === "only-link" && this.disabled,

      };
    },
    onlyIconButtonClasses() {
      return {
        "p-2": this.size === "sm",
        "py-2.5 px-2.5": this.size === "md",
        "py-3 px-3": this.size === "lg",
        "py-3.5 px-3.5": this.size === "xl",
        "py-4 px-4": this.size === "xxl",

        "bg-primary-800 text-white hover:bg-primary-700 hover:text-primary-25":
          this.color === "primary" && !this.disabled,
        "cursor-not-allowed bg-primary-200 border border-primary-300 text-primary-400":
          this.color === "primary" && this.disabled,

        "bg-primary-100 text-primary-900 hover:bg-primary-700 hover:text-primary-25":
          this.color === "primary-light" && !this.disabled,
        "cursor-not-allowed bg-primary-200 border border-primary-300 text-primary-400":
          this.color === "primary-light" && this.disabled,

        "bg-secondary-800 border border-secondary-600 text-white hover:bg-secondary-600 hover:border-secondary-800":
          this.color === "secondary" && !this.disabled,
        "cursor-not-allowed bg-secondary-200 border border-secondary-300 text-secondary-400 stroke-current":
          this.color === "secondary" && this.disabled,

        "bg-white text-gray-900 border border-gray-900 hover:text-white focus:text-white hover:bg-gray-900 hover:text-gray-900 focus:bg-gray-900 font-display uppercase font-semibold":
          this.color === "white" && !this.disabled,
        "cursor-not-allowed bg-gray-300 text-gray-400 stroke-current font-display uppercase font-semibold":
          this.color === "white" && this.disabled,

        "bg-gray-200 text-gray-800 hover:bg-gray-400 hover:text-gray-900 focus:bg-gray-200":
          this.color === "gray" && !this.disabled,
        "cursor-not-allowed bg-gray-100 text-gray-400 stroke-current":
          this.color === "gray" && this.disabled,

        "bg-gray-900 text-white border border-gray-900 hover:text-gray-900 focus:text-gray-900 hover:bg-white hover:text-gray-900 focus:bg-white font-display uppercase font-semibold":
          this.color === "black" && !this.disabled,
        "cursor-not-allowed bg-gray-100 text-gray-400 stroke-current":
          this.color === "black" && this.disabled,

        "text-primary-100 hover:text-primary-300 hover:underline focus:text-primary-900":
          this.color === "only-link" && !this.disabled,
        "cursor-not-allowed text-primary-300 ":
          this.color === "only-link" && this.disabled,

      };
    },
  },
  methods: {
    handleClick($ev) {
      if (this.disabled) {
        $ev.stopPropagation();
      }
    },
  },
};
</script>