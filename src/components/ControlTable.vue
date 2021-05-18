<template>
  <VCard class="control-card">
    <VTabs v-model="tab">
      <VTab v-for="tab in tabs" :key="tab.key" :to="tab.route">
        {{ tab.name }}
      </VTab>
    </VTabs>
    <VTabsItems v-model="tab" @change="updateRoute">
      <VTabItem key="screens" value="/screens">
        <VCard flat>
          <ScreensTable :value="screenList" />
        </VCard>
      </VTabItem>
      <VTabItem key="buttons" value="/buttons">
        <VCard flat>
          <ButtonsTable :value="buttonList" />
        </VCard>
      </VTabItem>
      <VTabItem key="aliased-actions" value="/aliased-actions">
        <VCard flat>
          <AliasedActionsTable :value="aliasedActionList" />
        </VCard>
      </VTabItem>
      <VTabItem key="translations" value="/translations">
        <VCard flat>
          <TranslationsTable :value="translationList" />
        </VCard>
      </VTabItem>
      <VTabItem key="regexes" value="/regexes">
        <VCard flat>
          <RegexesTable :value="regexList" />
        </VCard>
      </VTabItem>
    </VTabsItems>
  </VCard>
</template>

<script>
import ScreensTable from "@/components/ScreensTable.vue";
import ButtonsTable from "@/components/ButtonsTable";
import TranslationsTable from "@/components/TranslationsTable";
import AliasedActionsTable from "@/components/AliasedActionsTable";
import RegexesTable from "@/components/RegexesTable";
export default {
  name: "ControlTable",
  components: {
    RegexesTable,
    AliasedActionsTable,
    TranslationsTable,
    ButtonsTable,
    ScreensTable
  },
  computed: {
    screenList() {
      const arr = [];

      const screens = this.$store.state.screens;
      for (const screen in screens) {
        if (!screens[screen]) {
          continue;
        }
        arr.push(screens[screen]);
      }

      return arr;
    },
    buttonList() {
      const arr = [];

      const buttons = this.$store.state.buttons;
      for (const button in buttons) {
        if (!buttons[button]) {
          continue;
        }
        arr.push(buttons[button]);
      }

      return arr;
    },
    aliasedActionList() {
      const arr = [];

      const aliasedActions = this.$store.state.aliasedActions;
      for (const aliasedAction in aliasedActions) {
        if (!aliasedActions[aliasedAction]) {
          continue;
        }
        arr.push(aliasedActions[aliasedAction]);
      }

      return arr;
    },
    translationList() {
      const arr = [];
      const translations = this.$store.state.translations;
      for (const translation in translations) {
        if (!translations[translation]) {
          continue;
        }
        for (const lang in translations[translation]) {
          if (
            // eslint-disable-next-line no-prototype-builtins
            !translations[translation].hasOwnProperty(lang) ||
            !translations[translation][lang]
          ) {
            continue;
          }
          arr.push({
            key: translation,
            lang: lang,
            value: translations[translation][lang]
          });
        }
      }
      return arr;
    },
    regexList() {
      const arr = [];

      const regexes = this.$store.state.regexes;
      for (const regex in regexes) {
        if (!regexes[regex]) {
          continue;
        }
        arr.push({ key: regex, value: regexes[regex] });
      }

      return arr;
    }
  },
  data() {
    return {
      tab: null,
      tabs: [
        {
          key: "screens",
          name: "Screens",
          route: "/screens"
        },
        {
          key: "buttons",
          name: "Buttons",
          route: "/buttons"
        },
        {
          key: "aliased-actions",
          name: "Aliased Actions",
          route: "/aliased-actions"
        },
        {
          key: "translations",
          name: "Translations",
          route: "/translations"
        },
        {
          key: "regexes",
          name: "Regular Expressions",
          route: "/regexes"
        }
      ]
    };
  },
  methods: {
    updateRoute(val) {
      // Fix for swiping on touch screens not updating route
      if (this.$route.path !== val) {
        this.$router.push(val);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.control-card {
  width: 100%;
}
</style>
