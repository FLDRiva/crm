<template>
  <div class="container">
    <div class="head-table">
      <add-button @click="addNewItem" :label-button="'Add item'">
        <div class="add-button-information">
          <i class="fa fa-plus" aria-hidden="true"></i>
          Add Item
        </div>
      </add-button>
      <Input :type="'text'" :placeholder="'Search'" v-model="searchInput" />

      <select v-model="selectCategory">
        <option v-for="select in selectItem" :key="select.id">
          {{ select.value }}
        </option>
      </select>

      <add-button @click="findSelect" :label-button="'Find'">
        <div class="add-button-information">
          <i class="fa fa-hand-o-right" aria-hidden="true"></i>
          Find
        </div>
      </add-button>

      <add-button @click="returnItem" :label-button="'Clear'">
        <div class="add-button-information">
          <i class="fa fa-refresh" aria-hidden="true"></i>
          Clear
        </div>
      </add-button>
    </div>

    <div class="v-modal-container">
      <create-modal
        v-if="isModalVisible || isEditMode"
        :editMode="isEditMode"
        :item="item"
        @close="closeModal"
      />
    </div>
    <div class="product-table">
      <table>
        <tr>
          <th>Name</th>
          <th>Compound</th>
          <th>Availability</th>
          <th>Price</th>
          <th>Data</th>
        </tr>
        <tr v-for="itemName in items" :key="itemName.id">
          <td>{{ itemName.name }}</td>
          <td>{{ itemName.compound }}</td>
          <td>{{ itemName.availability }}</td>
          <td>{{ itemName.price }}</td>
          <td>{{ itemName.date }}</td>
          <td>
            <i
              @click="editModal(itemName)"
              class="fa fa-pencil-square-o pencil"
              aria-hidden="true"
            ></i>
          </td>
          <td>
            <i
              @click="incrementItems()"
              class="fa fa-plus"
              aria-hidden="true"
            ></i>
          </td>
          <td>
            <input v-model="countProduct" type="text" class="num-product" />
          </td>
          <td>
            <i
              @click="decrementItem()"
              class="fa fa-minus"
              aria-hidden="true"
            ></i>
          </td>
          <td>
            <i
              @click="delItem(itemName)"
              class="fa fa-trash trash"
              aria-hidden="true"
            ></i>
          </td>
        </tr>
      </table>
    </div>
  </div>
</template>

<script>
import Input from "../components/ui/StandartInput.vue";
import AddButton from "../components/ui/LoginBtn.vue";
import CreateModal from "../components/ui/CreateModal.vue";
import { mapActions, mapGetters } from "vuex";
export default {
  name: "ProductList",
  data() {
    return {
      searchInput: "",
      items: [],
      originalItems: [],
      isModalVisible: false,
      item: {},
      isEditMode: false,
      deleteItems: {},
      countItems: {},
      selectItem: [
        { id: 1, text: "All fields", value: "All fields" },
        { id: 2, text: "", value: "Name" },
        { id: 3, text: "", value: "Compound" },
        { id: 4, text: "", value: "Availability" },
        { id: 5, text: "", value: "Price" },
      ],
      selectSearch: "",
      selectCategory: 0,
      countProduct: 0,
    };
  },
  computed: {
    ...mapGetters(["ITEM_NAME"]),
  },
  watch: {
    ITEM_NAME(value) {
      this.items = value;
      this.originalItems = value;
    },
  },
  methods: {
    ...mapActions(["updateItem", "removeItem", "incrementItem"]),

    findItem() {
      const search = this.searchInput.toLowerCase();
      const result = this.items.filter((item) => {
        return (
          item.compound.toLowerCase().includes(search) ||
          item.name.toLowerCase().includes(search)
        );
      });
      this.items = result;
    },
    findSelect() {
      this.items = this.originalItems;
      const search = this.searchInput.toLowerCase();
      let ser = null;
      if (this.selectCategory === "Name") {
        ser = this.items.filter((item) => {
          return item.name.toLowerCase().includes(search);
        });
      }
      if (this.selectCategory === "Compound") {
        ser = this.items.filter((item) => {
          return item.compound.toLowerCase().includes(search);
        });
      }
      this.items = ser;
    },
    returnItem() {
      this.items = this.originalItems;
    },
    addNewItem() {
      this.isModalVisible = !this.isModalVisible;
      this.item = {
        name: "",
        compound: "",
        availability: "",
        price: "",
        date: new Date(),
      };
      this.isEditMode = false;
    },
    editModal(data) {
      this.isEditMode = true;
      this.item = data;
    },
    closeModal() {
      this.isModalVisible = false;
      this.isEditMode = false;
    },
    delItem() {
      this.items.forEach((elem) => {
        this.deleteItems = elem;
      });
      this.removeItem(this.deleteItems);
    },
    decrementItem() {
      if (this.countProduct > 1) {
        this.countProduct--;
      }
    },
    incrementItems(count) {
      this.countItems = count;
      if (count > 0 || count === 0) {
        this.countProduct++;
      }
    },
  },
  components: {
    AddButton,
    Input,
    CreateModal,
  },
  async mounted() {
    this.updateItem();
  },
};
</script>

<style lang="scss" scoped>
.container {
  display: flex;
  flex-direction: column;
  min-height: 80vh;
  font-family: "Roboto Condensed", sans-serif;
  font-weight: 400;
  .head-table {
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    @media (min-width: 320px) and (max-width: 430px) {
      width: 100%;
      flex-direction: column;
      align-items: center;
      height: 10vh;
    }
    select {
      display: block;
      font-size: 16px;
      font-family: "Roboto Condensed", sans-serif;
      font-weight: 400;
      color: #444;
      line-height: 1.3;
      padding: 0.6em 1.4em 0.5em 0.8em;
      width: 100%;
      max-width: 20%;
      box-sizing: border-box;
      margin: 0;
      border: 1px solid #e5e5e5;
      box-shadow: 0 1px 0 1px rgba(0, 0, 0, 0.04);
      border-radius: 0.5em;
      -moz-appearance: none;
      -webkit-appearance: none;
      appearance: auto;
      background-color: #fff;
      background-repeat: no-repeat, repeat;
      background-position: right 0.7em top 50%, 0 0;
      background-size: 0.65em auto, 100%;
      &::-ms-expand {
        display: none;
      }
      &:hover {
        border-color: #888;
      }
      &::after {
        content: "▼";
      }
      &:focus {
        border-color: #aaa;
        box-shadow: 0 0 1px 3px rgba(59, 153, 252, 0.7);
        box-shadow: 0 0 0 3px -moz-mac-focusring;
        color: #222;
        outline: none;
      }
      & option {
        font-weight: normal;
      }
    }
  }

  .add-button-information {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
  }
  .v-modal-container {
    display: flex;
    justify-content: center;
    padding: 3vh;
  }
  .product-table {
    display: flex;
    justify-content: center;
    table {
      height: 200px;
      background-color: #eeeeee;
      box-shadow: 8px 10px 12px 0px rgba(3, 5, 7, 0.2);
      border: 1px solid rgba(128, 128, 128, 0.2784313725);
      border-collapse: collapse;
      font-family: "Roboto Condensed", sans-serif;
      font-weight: 400;
      font-size: 16px;
      table-layout: fixed;
      @media (min-width: 320px) and (max-width: 430px) {
        margin-top: 55px;
        table-layout: fixed;
      }
      th {
        text-align: center;
        border: 1px solid #dddddd;
        @media (min-width: 320px) and (max-width: 430px) {
          table-layout: fixed;
          // &:nth-child(5) {
          //   display: none;
          // }
        }
      }
      tr {
        vertical-align: top;
      }
      td {
        text-align: center;
        border: 1px solid #dddddd;
        &:nth-child(3),
        &:nth-child(4),
        &:nth-child(6),
        &:nth-child(7),
        &:nth-child(8),
        &:nth-child(9) {
          width: 5%;
          overflow-x: auto;
          vertical-align: top;
        }
        @media (max-width: 1024px) {
          &:nth-child(6),
          &:nth-child(7),
          &:nth-child(8),
          &:nth-child(9) {
            width: 3%;
          }
        }
        @media (min-width: 320px) and (max-width: 430px) {
          // &:nth-child(5) {
          //   display: none;
          // }
        }
        i {
          cursor: pointer;
        }
        .trash:hover {
          color: red;
        }
        .pencil:hover {
          color: blue;
        }
        .num-product {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 100%;
          font-family: "Roboto Condensed", sans-serif;
          font-weight: 400;
          font-size: 16px;
          border: 1px solid rgba(128, 128, 128, 0.2784313725);
        }
      }
    }
  }
}
</style>
