<template>
  <VDialog max-width="600px" v-model="localValue">
    <template v-slot:activator="{ on, attrs }">
      <slot :attrs="attrs" :on="on" name="activator"></slot>
    </template>
    <VCard>
      <VCardTitle class="headline">
        Edit Hypixel Permissions
      </VCardTitle>
      <VCardText>
        <VContainer>
          <p>
            Visit
            <a target="_blank" href="https://regex101.com/">regex101.com</a> for
            more info on how to use regular expressions.
          </p>
          <VForm v-model="formValid">
            <p class="subtitle-1 locraw-header">Location Regex</p>
            <VRow>
              <VCol>
                <VTextField
                  v-model="formLocrawRegex.server"
                  label="Server"
                  class="regex-input"
                  spellcheck="false"
                />
                <VTextField
                  v-model="formLocrawRegex.gametype"
                  label="Gametype"
                  class="regex-input"
                  spellcheck="false"
                />
              </VCol>
              <VCol>
                <VTextField
                  v-model="formLocrawRegex.mode"
                  label="Mode"
                  class="regex-input"
                  spellcheck="false"
                />
                <VTextField
                  v-model="formLocrawRegex.map"
                  label="Map"
                  class="regex-input"
                  spellcheck="false"
                />
              </VCol>
            </VRow>
            <VRow>
              <VCol>
                <p class="subtitle-1">Server Ranks Regex</p>
                <VTextField
                  v-model="formRankRegex"
                  @change="v => $emit('rank-regex-change', v)"
                  label="Rank"
                  class="regex-input"
                  spellcheck="false"
                />
                <VTextField
                  v-model="formPackageRankRegex"
                  @change="v => $emit('package-rank-regex-change', v)"
                  label="Package Rank(s)"
                  class="regex-input"
                  spellcheck="false"
                  hint="Includes: packageRank, newPackageRank, monthlyPackageRank"
                />
              </VCol>
            </VRow>
            <VRow>
              <VCol>
                <p class="subtitle-1">Build Team</p>
                <VCheckbox
                  v-model="formBuildTeamOnly"
                  @change="v => $emit('build-team-only-change', v)"
                  label="Build Team Only"
                />
                <VCheckbox
                  v-model="formBuildTeamAdminOnly"
                  @change="v => $emit('build-team-admin-only-change', v)"
                  label="Build Team Admin Only"
                />
              </VCol>
            </VRow>
          </VForm>
          <div class="action-btns">
            <VBtn
              class="submit-btn"
              color="primary"
              @click="localValue = false"
              :disabled="!formValid"
            >
              Close
            </VBtn>
          </div>
        </VContainer>
      </VCardText>
    </VCard>
  </VDialog>
</template>

<script>
export default {
  name: "HypixelPermissionsEditor",
  props: {
    value: {
      type: Boolean,
      required: true
    },
    initialBuildTeamOnly: {
      type: Boolean,
      default: false
    },
    initialBuildTeamAdminOnly: {
      type: Boolean,
      default: false
    },
    initialLocrawRegex: {
      type: Object,
      default: () => {
        return {};
      }
    },
    initialRankRegex: {
      type: String,
      default: ""
    },
    initialPackageRankRegex: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      formValid: false,
      formBuildTeamOnly: this.initialBuildTeamOnly,
      formBuildTeamAdminOnly: this.initialBuildTeamAdminOnly,
      formLocrawRegex: this.initialLocrawRegex,
      formRankRegex: this.initialRankRegex,
      formPackageRankRegex: this.initialPackageRankRegex
    };
  },
  watch: {
    formLocrawRegex(newVal) {
      this.$emit("locraw-regex-change", newVal);
    }
  },
  computed: {
    localValue: {
      get() {
        if (this.value) {
          this.reset();
        }
        return this.value;
      },
      set(newVal) {
        this.$emit("input", newVal);
      }
    }
  },
  methods: {
    reset() {
      this.formBuildTeamOnly = this.initialBuildTeamOnly;
      this.formBuildTeamAdminOnly = this.initialBuildTeamAdminOnly;
      this.formLocrawRegex = this.initialLocrawRegex;
      this.formRankRegex = this.initialRankRegex;
      this.formPackageRankRegex = this.initialPackageRankRegex;
    }
  }
};
</script>

<style scoped lang="scss">
.action-btns {
  display: flex;
  justify-content: flex-end;
}
.regex-input {
  font-family: Consolas, "Lucida Console", monospace, sans-serif;
}
.locraw-header {
  margin-bottom: 0;
}
</style>
