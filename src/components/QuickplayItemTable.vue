<template>
  <VCard flat>
    <VCardText>
      <VTextField
        v-model="search"
        label="Search"
        single-line
        hide-details
      ></VTextField>
      <slot name="editor" :subtable="subtable" />
      <VDataTable
        :headers="trueHeaders"
        :items="value"
        :search="search"
        item-key="key"
        :show-expand="expandable"
        single-expand
      >
        <template v-slot:item.imageURL="{ item }">
          <a :href="item.imageURL" target="_blank">
            {{ prettifyUrl(item.imageURL) }}
          </a>
        </template>
        <template v-slot:item.translationKey="{ item }">
          <VTooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <div v-bind="attrs" v-on="on">
                {{ translate(item.translationKey) }}
              </div>
            </template>
            {{ item.translationKey }}
          </VTooltip>
        </template>
        <template v-slot:item.actionType="{ item }">
          {{
            item.action.id === 11 ? "OpenScreenAction" : "SendChatCommandAction"
          }}
        </template>
        <template v-slot:item.actionArg="{ item }">
          {{ item.action.getPayloadObjectAsString(0) }}
        </template>
        <template v-slot:item.admin-actions="{ item }">
          <FontAwesomeIcon
            v-if="subtable"
            :icon="['fas', 'arrow-alt-up']"
            @click="moveUpItem(item)"
            :class="
              'move-up-icon' +
                (value.indexOf(item) === 0 ? ' first-move-up' : '')
            "
            aria-label="Move item up"
          />
          <FontAwesomeIcon
            v-if="subtable"
            :icon="['fas', 'arrow-alt-down']"
            @click="moveDownItem(item)"
            :class="
              'move-down-icon' +
                (value.indexOf(item) === value.length - 1
                  ? ' last-move-down'
                  : '')
            "
            aria-label="Move item down"
          />
          <FontAwesomeIcon
            :icon="['fas', 'pencil']"
            @click="editItem(item)"
            class="edit-icon"
            aria-label="Edit item"
          />
          <FontAwesomeIcon
            :icon="['fas', 'trash']"
            @click="deleteItem(item)"
            class="delete-icon"
            aria-label="Delete item"
          />
        </template>
        <template
          v-if="expandable"
          v-slot:item.data-table-expand="{ expand, isExpanded }"
        >
          <FontAwesomeIcon
            @click="expand(!isExpanded)"
            :icon="['fas', isExpanded ? 'chevron-up' : 'chevron-down']"
            class="expand-icon"
          />
        </template>
        <template v-slot:expanded-item="{ headers, item }">
          <td :colspan="headers.length">
            <slot name="expandable" :item="item" />
          </td>
        </template>
      </VDataTable>
    </VCardText>
  </VCard>
</template>

<script>
import { prettifyUrl, translate } from "@/util";
export default {
  name: "QuickplayItemTable",
  components: {},
  props: {
    subtable: {
      type: Boolean,
      default: false
    },
    expandable: {
      type: Boolean,
      default: true
    },
    headers: {
      type: Array,
      required: true
    },
    value: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      buttonTab: null,
      search: ""
    };
  },
  computed: {
    trueHeaders() {
      const arr = [
        ...this.headers,
        { text: "Actions", value: "admin-actions", sortable: false }
      ];
      if (this.expandable) {
        arr.push({ text: "", value: "data-table-expand" });
      }
      if (this.subtable) {
        for (let i = 0; i < arr.length; i++) {
          arr[i].sortable = false;
        }
      }
      return arr;
    }
  },
  methods: {
    moveUpItem(item) {
      if (this.value.indexOf(item) <= 0) {
        return;
      }
      this.$emit("move-up", item);
    },
    moveDownItem(item) {
      if (this.value.indexOf(item) >= this.value.length - 1) {
        return;
      }
      this.$emit("move-down", item);
    },
    editItem(item) {
      this.$emit("edit", item);
    },
    deleteItem(item) {
      this.$emit("delete", item);
    },
    translate(key) {
      return translate(key);
    },
    prettifyUrl(url) {
      return prettifyUrl(url);
    }
  }
};
</script>

<style scoped lang="scss">
.move-down-icon,
.move-up-icon,
.edit-icon {
  margin-right: 10px;
}
.move-down-icon,
.move-up-icon,
.edit-icon,
.delete-icon {
  cursor: pointer;
}

.first-move-up,
.last-move-down {
  cursor: not-allowed;
  opacity: 0.5;
  color: #fff !important;
}

.move-up-icon:hover,
.move-down-icon:hover {
  color: #1e88e5;
}
.edit-icon:hover {
  color: #00c853;
}
.delete-icon:hover {
  color: #f15858;
}
.expand-icon {
  cursor: pointer;
}

.plus-icon {
  font-size: 20px;
}

.new-button-wrapper {
  display: flex;
  justify-content: flex-end;
  margin: 10px;
}
</style>
