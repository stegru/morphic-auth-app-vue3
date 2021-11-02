<template>
  <div>
    <h1 v-if="!formOnly" class="mb-3" id="user-login-heading" v-t="'UserLogin.heading'" />
    <b-alert variant="danger" :show="errorAlert">
      {{ errorMessage }}
    </b-alert>
    <b-form @submit.stop.prevent="onSubmit(false)" role="form" aria-labelledby="user-login-heading">
      <ValidatedInput id="login-user-email"
                      :label="$t('UserLogin.email_label')"
                      :validation="$v.userInfo.email"
                      @input="storeResetEmail"
                      autofocus
      />

      <ValidatedInput id="login-user-password"
                      :label="$t('UserLogin.password_label')"
                      :validation="$v.userInfo.password"
                      type="password"
                      password-toggle
      />
      <br/>

      <b-button v-if="linkEvents" variant="link" @click.prevent="$emit('reset-password')" v-t="'UserLogin.password-reset_link'" class="alignRight" />
      <b-link v-else to="/reset-password" v-t="'UserLogin.password-reset_link'" class="alignRight" />

      <div v-if="!formOnly" class="loginAction">
        <b-button type="submit"
                  id="loginButton"
                  variant="success"
                  class="w-25"
                  v-t="'UserLogin.sign-in_button'" />
      </div>
      <div v-if="!formOnly" class="loginAction mb-4">
        <b-link :to="{name: 'Register'}" v-t="'UserLogin.create-account_link'" />
      </div>
    </b-form>
  </div>
</template>

<style lang="scss">
.loginAction {
  text-align: center;
  margin-top: 1em;
}
</style>

<script>
import { validationMixin } from "vuelidate";
import { required, email } from "vuelidate/lib/validators";
import ValidatedInput from "@/components/ValidatedInput";


export default {
    components: {ValidatedInput},
    mixins: [validationMixin],
    data() {
        return {
            userInfo: {
                email: this.initialEmail || "",
                password: "",
                keep_logged: 1
            },
            errorAlert: false,
            errorMessage: null
        };
    },
    props: {
        /** true to only show the input fields */
        formOnly: Boolean,
        /** true to raise events for the links ("reset-password" and "create-account"), rather than navigating. */
        linkEvents: Boolean,
        /** pre-fill the email */
        initialEmail: String
    },
    validations: {
        userInfo: {
            email: {
                required,
                email
            },
            password: {
                required
            }
        }
    },
    methods: {
        storeResetEmail() {
            this.$store.commit("reset_password_email", this.userInfo.email);
        },
        onSubmit(noNavigate) {
            if (!this.validateForm(this.$v.userInfo)) {
                return;
            }

            return this.$store.dispatch("login", this.$v.userInfo.$model)
                .then((dest) => {
                    this.userInfo.password = "";
                    if (!noNavigate) {
                        this.$router.push(dest);
                    }
                    return true;
                })
                .catch(this.handleServerError);
        }
    }
};
</script>
