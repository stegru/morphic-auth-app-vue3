<template>
  <b-form @submit.stop.prevent="onSubmit" role="form" aria-labelledby="community-heading">
    <b-alert variant="danger" :show="errorAlert">
      {{ errorMessage }}
    </b-alert>
    <ValidatedInput id="email"
                    label="Email"
                    :validation="$v.form.email"
                    :description="emailDescription"
                    autofocus
    />
    <ValidatedInput id="new-password"
                    ref="newPassword"
                    label="Password"
                    :validation="$v.form.password"
                    type="password"
                    :errors="{minLength: 'Passwords must be at least 6 characters'}"
                    password-toggle
                    password-confirm="new-password-confirm"
    />
    <ValidatedInput id="new-password-confirm"
                    ref="passwordConfirm"
                    label="Password confirmation"
                    :validation="$v.form.confirmPassword"
                    type="password"
    />

    <div class="text-center mb-4">
      <b-button v-if="existingAccountButton" variant="link" @click="$emit('existing-account', $event)">I already have a Morphic account</b-button>
      <b-link v-else variant="link" :to="{name: 'Login'}">I already have a Morphic account</b-link>
    </div>

    <div class="m-3 small">
        <div>By signing up for Morphic you are agreeing to the <b-link :href="externalLinks.termsOfUse">Terms of Service</b-link> and <b-link :href="externalLinks.privacyPolicy">Privacy Policy</b-link></div>
    </div>
    <div v-if="!noButtons" style="display: flex; justify-content: space-between">
        <b-link style="color: inherit; text-decoration: none; border: 1px solid black; padding: 10px; border-radius: 5px" to="/">
            {{ backLink }}
        </b-link>
        <b-button type="submit" variant="success" class="w-25">{{ submitButtonText }}</b-button>
    </div>

  </b-form>
</template>

<style>
</style>

<script>
import { validationMixin } from "vuelidate";
import { email, minLength, required, sameAs } from "vuelidate/lib/validators";
import ValidatedInput from "@/components/ValidatedInput";

export default {
    components: {ValidatedInput},
    props: {
        backLink: String,
        submitButtonText: String,
        /** true to hide the buttons (parent will call onSubmit) */
        noButtons: Boolean,
        /** true to make the 'I have an account' link a button, and raise 'existing-account' */
        existingAccountButton: Boolean,
        /** pre-fill the email */
        initialEmail: String,
        /** override the email description text */
        emailDescription: String,
        stayOnPage: Boolean

    },
    mixins: [validationMixin],
    data() {
        return {
            form: {
                communityName: "",
                email: this.initialEmail || "",
                password: "",
                confirmPassword: ""
            },
            errorAlert: false,
            errorMessage: null
        };
    },
    validations: {
        form: {
            // communityName: {
            //     required
            // },
            email: {
                required,
                email
            },
            password: {
                required,
                minLength: minLength(6)
            },
            confirmPassword: {
                required,
                sameAsPassword: sameAs("password")
            }
        }
    },
    methods: {
        validateState(name) {
            const { $dirty, $error } = this.$v.form[name];
            return $dirty ? !$error : null;
        },
        async onSubmit(throwError) {
            let success = false;
            if (this.validateForm(this.$v.form)) {
                try {
                    await this.$store.dispatch("register", this.$v.form.$model);

                    this.showMessage(this.$t("UserRegistration.success"));

                    const dest = await this.$store.dispatch("login", this.$v.form.$model);
                    if (!this.stayOnPage) {
                        this.$router.push(dest);
                    }

                    success = true;

                } catch (err) {
                    if (throwError) {
                        throw err;
                    } else {
                        this.handleServerError(err);
                    }
                }
            }
            return success;
        }
    }
};
</script>
