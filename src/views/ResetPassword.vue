<template>
  <b-jumbotron class="mb-0" bg-variant="light">
    <b-row class="pt-5 pb-5">
      <b-col md="3">
      </b-col>
      <b-col md="6">
        <h3 v-t="'ResetPassword.heading'" />
        <p id="instructions" class="lead" v-t="'ResetPassword.instructions'" />
        <br />
        <b-form @submit.stop.prevent="onSubmit">
          <b-alert variant="danger" :show="errorAlert">
            {{ errorMessage }}
          </b-alert>
          <ValidatedInput id="login-user-email"
                          :label="$t('ResetPassword.enter-your-email-address')"
                          placeholder="user@example.com"
                          :validation="$v.form.email"
                          autofocus
                          aria-describedby="instructions"
          />

          <b-row>
            <b-col md="6">
              <b-link to="/" variant="success" class="ml-1" v-t="'ResetPassword.return-to-login_link'" />
            </b-col>

            <b-col md="6" style="text-align: right" >
              <b-button type="submit" variant="primary" v-t="'ResetPassword.reset-password_button'" />
            </b-col>
          </b-row>
        </b-form>
      </b-col>
      <b-col md="3">
      </b-col>
    </b-row>
  </b-jumbotron>
</template>

<script>
import { required, email } from "vuelidate/lib/validators";
import ValidatedInput from "@/components/ValidatedInput";

export default {
    name: "ResetPassword",
    components: {ValidatedInput},
    data() {
        return {
            form: {
                email: this.$store.getters.resetPasswordEmail || ""
            },
            errorAlert: false,
            errorMessage: null,
            recaptchaToken: null,
            firstName: ""
        };
    },
    validations: {
        form: {
            email: {
                required,
                email
            }
        }
    },
    mounted() {
        setTimeout(() => this.showRecaptchaBadge(true), 100);
    },
    methods: {
        validateState(name) {
            const { $dirty, $error } = this.$v.form[name];
            return $dirty ? !$error : null;
        },
        async onSubmit() {
            this.$v.form.$touch();
            if (this.$v.form.$anyError) {
                return;
            }
            this.recaptchaToken = await this.getRecaptchaToken("requestpasswordreset");

            const body = {
                email: this.$v.form.$model.email,
                g_recaptcha_response: this.recaptchaToken
            };
            this.$store.dispatch("resetPassword", body)
                .then(() => {
                    this.showMessage(this.$t("ResetPassword.success"));
                    this.$router.push("/");
                })
                .catch(this.handleServerError);
        }
    }
};
</script>
