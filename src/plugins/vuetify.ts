import Vue from "vue";
import Vuetify from "vuetify/lib";
import colors from "vuetify/lib/util/colors";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

Vue.use(Vuetify);

export default new Vuetify({
  theme: {
    options: {
      customProperties: true
    },
    dark: true,
    themes: {
      dark: {
        primary: (colors.teal as unknown) as any
      }
    }
  },
  icons: {
    values: {
      radioOff: {
        component: FontAwesomeIcon,
        props: {
          icon: ["fal", "circle"]
        }
      },
      radioOn: {
        component: FontAwesomeIcon,
        props: {
          icon: ["fas", "check-circle"]
        }
      },
      checkboxOff: {
        component: FontAwesomeIcon,
        props: {
          icon: ["fal", "square"]
        }
      },
      checkboxOn: {
        component: FontAwesomeIcon,
        props: {
          icon: ["fas", "check-square"]
        }
      },
      search: {
        component: FontAwesomeIcon,
        props: {
          icon: ["fas", "search"]
        }
      },
      next: {
        component: FontAwesomeIcon,
        props: {
          icon: ["fas", "chevron-right"]
        }
      },
      prev: {
        component: FontAwesomeIcon,
        props: {
          icon: ["fas", "chevron-left"]
        }
      },
      expand: {
        component: FontAwesomeIcon,
        props: {
          icon: ["fas", "chevron-down"]
        }
      },
      dropdown: {
        component: FontAwesomeIcon,
        props: {
          icon: ["fas", "caret-down"]
        }
      }
    }
  }
});
