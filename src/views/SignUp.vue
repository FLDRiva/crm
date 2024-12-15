<template>
  <div class="container">
    <div class="container-signup">
      <form>
        <user-input v-model="user.name" placeholder="ФИО" />
        <user-input v-model="user.email" placeholder="Email" :type="'email'" />
        <user-input v-model="user.age" placeholder="Возраст" :type="'number'" />
        <user-input v-model="user.bio" placeholder="Должность" :type="'text'" />
        <user-input
          v-model="user.password"
          placeholder="Пароль"
          :type="'password'"
        />
        <user-input
          v-model="user.repeatPassword"
          placeholder="Подтвердите пароль"
          :type="'password'"
        />
      </form>
      <div class="btn-register">
        <login-btn @click="registerUsers" class="reg-btn" :labelButton="'Registration'">
          Зарегистрировать
        </login-btn>
        <login-btn @click="backUsers" class="back-btn" :labelButton="'Registration'">
          Назад
        </login-btn>
      </div>
        <div v-if="errorMessage" class="error" style="margin: 10px;">{{ errorMessage }}</div>
      </div>
  </div>
</template>

<script>
import axios from "axios";
import UserInput from "../components/ui/UserInput.vue";
import LoginBtn from "../components/ui/LoginBtn.vue";
export default {
  name: "SignUp",
  data() {
    return {
      user: {
        name: "",
        email: "",
        password: "",
        repeatPassword: "",
        age: null,
        bio: "",
      },
      errorMessage: '',
    };
  },
  methods: {
    async registerUsers() {
      if (!this.user.name || !this.user.email || !this.user.password || !this.user.repeatPassword || !this.user.age || !this.user.bio) {
        this.errorMessage = 'Необходимо заполнить все поля!';
        return;
      }

      if (this.user.password !== this.user.repeatPassword) {
        this.errorMessage = 'Пароли не совпадают!';
        return;
      }

      if (this.user.password.length < 4) {
        this.errorMessage = 'Пароль должен содержать минимум 4 символов.';
        return;
      }

      const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!emailPattern.test(this.user.email)) {
        this.errorMessage = 'Неверный формат email';
        return;
      } 

      try {
        const response = await axios.post(
          'http://localhost:5000/reg',
        {
          name: this.user.name,
          email: this.user.email,
          password: this.user.password,
          age: this.user.age || null, 
          bio: this.user.bio || '',
        });

        if (response && response.data) {
          if (response.data.redirectURL) {
            alert(response.data.message);
            this.$router.push(response.data.redirectURL);
          } else {
            console.error('Server response is missing redirectUrl');
            this.errorMessage = 'Не удалось получить правильный ответ от сервера.';
          }
        } else {
          console.error('Unexpected response:', response);
          this.errorMessage = 'Unexpected server response';
        }
      } catch (error) {
        console.error('Error');
      }
    },
    async backUsers() {
      this.$router.push("/");
    }
  },
  components: {
    UserInput,
    LoginBtn,
  },
};
</script>

<style lang="scss" scoped>
.container {
  display: flex;
  justify-content: center;
  .container-signup {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    width: 500px;
    min-height: auto;
    background-color: #eeeeee;
    box-shadow: 8px 10px 12px 0px rgba(3, 5, 7, 0.2);
    border: 1px solid rgba(128, 128, 128, 0.2784313725);
    border-radius: 4%;
    @media (max-width: 767px) {
      width: 390px;
    }
    @media (max-width: 400px) {
      width: 366px;
    }
    .reg-btn {
      margin-bottom: 2vh;
    }
    .btn-register {
      display: flex;
      gap: 20px;
    }
  }
}
</style>
