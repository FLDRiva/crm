<template>
  <v-container class="user-profile" fluid>
    <v-row justify="center">
      <v-col :cols="12" :md="6" :lg="6">

        <v-alert v-if="loading" type="info" prominent class="custom-alert">Загрузка...</v-alert>
        <v-alert v-else-if="error" type="error" prominent class="custom-alert">{{ error }}</v-alert>

        <v-card class="profile-card" v-else>
          <v-card-title>
            <v-avatar size="40" class="avatar">
              <img :src="avatarUrl" alt="User Avatar" />
            </v-avatar>
            <v-spacer></v-spacer>
            <div class="btn-gr">
              <v-btn class="update-btn" @click="showAddTaskDialog = true">Добавить</v-btn>
              <v-btn class="update-btn" @click="logout">Выход</v-btn>
            </div>
            <v-dialog v-model="showAddTaskDialog" max-width="500px">
               <v-card>
                <v-card-title>
                  <span class="headline">Добавить задачу</span>
                </v-card-title>
                    <v-card-text>
              <!-- Форма для ввода данных -->
                      <v-form>
                        <v-text-field
                          v-model="newTask.title"
                          label="Название задачи"
                          required
                        />
                        <v-textarea
                          v-model="newTask.description"
                          label="Описание задачи"
                          required
                        />
                        <v-date-picker
                          v-model="newTask.due_date"
                          label="Дата выполнения"
                          required
                        />
                      </v-form>
            </v-card-text>
            <v-card-actions>
            <v-btn @click="addTask">Сохранить</v-btn>
            <v-btn @click="showAddTaskDialog = false">Отмена</v-btn>
          </v-card-actions>
                </v-card>
            </v-dialog>
          </v-card-title>
          <v-card-subtitle class="profile-name">{{ profile.name }}</v-card-subtitle>
          <v-card-text class="profile-info">
            <v-list>
              <v-list-item>
                <v-list-item-icon>
                  <v-icon class="custom-icon">mdi-email</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title>Email: {{ profile.email }}</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
              <v-list-item>
                <v-list-item-icon>
                  <v-icon class="custom-icon">mdi-calendar</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title>Возраст: {{ profile.age }}</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
              <v-list-item>
                <v-list-item-icon>
                  <v-icon class="custom-icon">mdi-briefcase</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title>Должность: {{ profile.bio }}</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col :cols="12" :md="6" :lg="6" >
      <v-card
        v-for="task in tasks" 
        :key="task.id" 
        class="task-card">
        <v-card-title>{{ task.title }}</v-card-title>
        <v-card-text>
          <div><strong>Описание:</strong> {{ task.description }}</div>
          <div><strong>Срок выполнения:</strong> {{ new Date(task.due_date).toLocaleDateString() }}</div>
        </v-card-text>
        <v-card-actions>
          <v-btn class="del-btn" @click="deleteTask(task.id)">Выполненно</v-btn>
          </v-card-actions>
      </v-card>
    </v-col>
    </v-row>

  </v-container>
</template>

<script>
import axios from "axios";

export default {
  name: "UserProfile",
  data() {
    return {
      profile: {
        name: "",
        age: null,
        email: "",
        bio: "",
        avatar: "",
        role: "",
      },
      tasks: [],
      newTask: {
        title: "",
        description: "", 
        due_date: null,
        assignedUser: "",
      },
      users: [],
      showAssignDialog: false,
      selectedTaskId: null,
      selectedUserId: null,
      showAddTaskDialog: false,
      loading: true,
      error: null,
    };
  },
  computed: {
    avatarUrl() {
      return this.profile.avatar || "https://via.placeholder.com/100";
    },
    isAdmin() {
      return this.profile.role === "admin";
    }
  },
  methods: {
    async fetchProfile() {
      try {
        const response = await axios.get("http://localhost:5000/profile", {
          withCredentials: true, 
        });
        this.profile = response.data;
      } catch (err) {
        this.error = "Не удалось загрузить профиль пользователя.";
      }
    },
    async fetchTasks() {
      try {
        const response = await axios.get("http://localhost:5000/tasks", {
          withCredentials: true, 
        }); 
        this.tasks = response.data;
      } catch (err) {
        this.error = "Не удалось загрузить задачи пользователя.";
      }
      
    },
    async logout() {
      try {
        await axios.post('http://localhost:5000/logout', {}, { 
          withCredentials: true,
        });
        this.$router.push('/login');
      } catch (error) {
        console.error('Ошибка при выходе:', error);
      }
    },
    async deleteTask(id) {
      try {
        if (!id) {
      console.error("Invalid task ID:", id);
      return;
      }
        await axios.delete(`http://localhost:5000/tasks/${id}`, {
          withCredentials: true,
        });
        this.tasks = this.tasks.filter((task) => task.id !== id);
      } catch (error) {
        console.error("Не удалось удалить задачу:", error);
      }
    },
    async addTask() {
      try {
        const response = await axios.post("http://localhost:5000/tasks1", this.newTask, {
          withCredentials: true,
        });
        this.tasks.push(response.data); 
        this.showAddTaskDialog = false; 
        this.newTask = { title: "", description: "", due_date: "" }; 
      } catch (error) {
        console.error("Не удалось добавить задачу:", error.response ? error.response.data : error);
      }
    },
    startDataUpdates() {
      this.updateInterval = setInterval(() => {
        this.fetchProfile();
        this.fetchTasks();
      }, 1200000); 
    },
    
  },
    async mounted() {
        try {
        await this.fetchProfile();
        await this.fetchTasks();
      } catch (err) {
        this.error = "Произошла ошибка при загрузке данных.";
      } finally {
        this.loading = false;
      }
    },
    async created() {
      try {
        this.startDataUpdates();
      } catch (err) {
        this.error = "Произошла ошибка при загрузке данных.";
      } finally {
        this.loading = false;
      }
    },

    beforeDestroy() {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
      this.updateInterval = null;
    }
  },
};
</script>

<style lang="scss" scoped>
.user-profile {
  display: flex;
  align-items: center;
  padding: 20px;
  background-color: #f5f5f5; 
}
.profile-card {
  border-radius: 12px; 
  background-color: #ffffff;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1); 
  margin-bottom: 20px;
  padding: 20px;
  transition: transform 0.3s ease; 
}
.profile-card:hover {
  transform: translateY(-5px); 
}
.avatar img {
  border-radius: 50%;
  object-fit: cover;
}
.btn-gr {
  display: flex;
  align-items: center;
  gap: 20px;
  .update-btn {
  background-color: #f5d5a5; 
  color: rgb(95, 93, 93);
  border-radius: 50px;
  padding: 10px 20px;
  font-weight: 600;
  transition: background-color 0.3s ease;
  }
}
.profile-name {
  font-size: 22px;
  font-weight: 600;
  color: #333333;
  margin-top: 10px;
}
.profile-info {
  color: #666666;
}
.custom-alert {
  margin-top: 20px;
  border-radius: 8px;
}
.custom-icon {
  color: #ff9900; 
}
.v-list-item {
  border-bottom: 1px solid #e0e0e0;
  padding: 10px 0;
}
.v-btn {
  font-size: 16px;
}
.task-card {
  margin-bottom: 20px;
  padding: 10px; 
}
.del-btn {
  background-color: #f5d5a5; 
  color: rgb(95, 93, 93);
  border-radius: 500px;
  padding: 10px 20px;
  font-weight: 10;
  transition: background-color 0.3s ease;
  }
@media (max-width: 600px) {
  .profile-card {
    padding: 15px;
  }
  .update-btn {
    width: 100%;
    margin-top: 10px;
  }
  .btn-gr {
    flex-direction: column;
  }
}
</style>
