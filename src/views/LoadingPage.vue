<template>
  <div class="container">
    <user-input v-model="user" placeholder="Email" :required="true"> </user-input>
    <user-input v-model="password" placeholder="Пароль" :type="'password'" :required="true" />
    <login-btn @click="loginUser" :labelButton="'Sign in'"> Войти </login-btn>
    <save-me v-model="saveMe" @change="saveUser"/>
    <div class="reg-pass">
      <sign-in />
      <resset-pass />
    </div>
    <div v-if="errorMessage" class="error">{{ errorMessage }}</div>
  </div>
</template>

<script>
import axios from "axios";
import UserInput from "../components/ui/UserInput";
import SaveMe from "../components/ui/SaveMe";
import LoginBtn from "../components/ui/LoginBtn";
import SignIn from "../components/ui/SignIn";
import RessetPass from "../components/ui/ResetPass";

export default {
  name: "loadingPage",
  components: {
    UserInput,
    SaveMe,
    LoginBtn,
    SignIn,
    RessetPass,
  },
  data() {
    return {
      user: "",
      password: "",
      saveMe: false,
      errorMessage: "",
    };
  },
  methods: {
    async loginUser() {
      try {
        const response = await axios.post('http://localhost:5000/login', {
          email: this.user,
          password: this.password,
        });

          localStorage.setItem('token', response.data.token);
          if (this.saveMe) {
          localStorage.setItem("savedUser", this.user);
          } else {
            localStorage.removeItem("savedUser");
          }
          this.$router.push('/profile'); 

      } catch (error) {
        this.errorMessage = error.response?.data?.message || 'Ошибка авторизации';
      }
    },
    saveUser() {
      if (!this.saveMe) {
        localStorage.removeItem("savedUser");
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.container {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  align-self: center;
  width: 500px;
  min-height: auto;
  background-color: #eeeeee;
  box-shadow: 8px 10px 12px 0px rgba(3, 5, 7, 0.2);
  border: 1px solid #80808047;
  border-radius: 4%;
  .reg-pass {
    display: flex;
    flex-direction: row;
    gap: 10vw;
    font-size: 16px;
    margin: 3vh 1vw 1vh 1vw;
    font-family: "Roboto Condensed", sans-serif;
    font-weight: 400;
    color: #7d7a7a;
  }
}
@media (max-width: 767px) {
  .container {
    width: 388px;
  }
}
</style>
