export default {
  actions: {
    async updateItem({ commit }) {
      const itemProducts = [
        {
          id: 1,
          name: "Goat milk",
          compound: "Alpine goat milk",
          price: "0.5$",
          date: "1-1-2023",
          availability: 20,
        },
        {
          id: 2,
          name: "Cottage cheese",
          compound: "Goat milk, Bifidobacterium",
          price: "0.7$",
          date: "1-1-2023",
          availability: 15,
        },
        {
          id: 3,
          name: "Cheese with spices",
          compound: "Goat milk, Bifidobacterium, Paprika and Herbs",
          price: "0.8$",
          date: "1-1-2023",
          availability: 17,
        },
      ];
      setTimeout(() => {
        commit("conectItem", itemProducts);
      }, 300);
    },
    async postItem({ commit }, payload) {
      setTimeout(() => {
        commit("addItem", payload);
      }, 300);
    },
    async putItem({ commit }, payload) {
      setTimeout(() => {
        commit("editItem", payload);
      }, 300);
    },
    async removeItem({ commit }, payload) {
      setTimeout(() => {
        commit("delItem", payload);
      }, 300);
    },
    async incrementItem({ commit }, payload) {
      setTimeout(() => {
        commit("increment", payload);
      }, 300);
    },
  },

  mutations: {
    conectItem(state, products) {
      state.products = products;
    },
    addItem(state, newProduct) {
      state.products.unshift(newProduct);
    },
    editItem(state, changeItem) {
      state.products.forEach((el) => {
        if (changeItem.id === el.id) {
          el = changeItem;
        }
      });
    },
    delItem(state, deleteiTem) {
      state.products.forEach((el) => {
        if (deleteiTem.id === el.id) {
          state.products.splice(el, 1);
        }
      });
    },
    increment(state, countProduct) {
      state.products.forEach((item) => {
        if (countProduct.id === item.id) {
          countProduct++;
        }
      });
    },
  },
  state: {
    products: [],
    select: [],
  },
  getters: {
    ITEM_NAME: (state) => {
      return state.products.filter((p) => {
        return p.name && p.compound;
      });
    },
  },
};
