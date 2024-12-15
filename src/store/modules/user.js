import axios from 'axios';

const state = {
  profile: {
    name: '',
    age: null,
    email: '',
    bio: '',
    avatar: '',
  },
  tasks: [],
  loading: true,
  error: null,
};

const getters = {
  avatarUrl: state => {
    return state.profile.avatar || "https://via.placeholder.com/100";
  }
};

const mutations = {
  setProfile(state, profile) {
    state.profile = profile;
  },
  setTasks(state, tasks) {
    state.tasks = tasks;
  },
  setLoading(state, loading) {
    state.loading = loading;
  },
  setError(state, error) {
    state.error = error;
  }
};

const actions = {
  async fetchProfile({ commit }) {
    try {
      commit('setLoading', true);
      const response = await axios.get("http://localhost:5000/profile", {
        withCredentials: true,
      });
      commit('setProfile', response.data);
      commit('setLoading', false);
    } catch (err) {
      console.error("Ошибка загрузки профиля:", err);
      commit('setError', "Не удалось загрузить профиль пользователя.");
    }
  },
  async fetchTasks({ commit }) {
    try {
      const response = await axios.get("http://localhost:5000/tasks", {
        withCredentials: true,
      });
      commit('setTasks', response.data);
    } catch (err) {
      console.error("Ошибка загрузки задач:", err);
      commit('setError', "Не удалось загрузить задачи пользователя.");
    }
  },

  async loadData({ dispatch, commit }) {
    commit('setLoading', true);
    try {
      await Promise.all([dispatch('fetchProfile'), dispatch('fetchTasks')]);
    } catch (err) {
      commit('setError', "Произошла ошибка при загрузке данных.");
    } finally {
      commit('setLoading', false);
    }
  }  
};

export default {
  state,
  getters,
  mutations,
  actions
};
