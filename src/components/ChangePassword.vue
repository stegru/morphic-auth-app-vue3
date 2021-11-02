<template>
  <b-form @submit.stop.prevent="onSubmit" role="form" aria-labelledby="community-heading">
    <b-alert variant="danger" :show="errorAlert">
      {{ errorMessage }}
    </b-alert>
    <ValidatedInput id="current-password"
                    ref="currentPassword"
                    label="Current Password"
                    :validation="$v.form.currentPassword"
                    type="password"
                    password-toggle
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
import { minLength, required, sameAs } from "vuelidate/lib/validators";
import ValidatedInput from "@/components/ValidatedInput";
import { changePassword } from "@/services/userService";

export default {
    components: {ValidatedInput},
    props: {
        backLink: String,
        submitButtonText: String,
        /** true to hide the buttons (parent will call onSubmit) */
        noButtons: Boolean,
        stayOnPage: Boolean

    },
    mixins: [validationMixin],
    data() {
        return {
            form: {
                currentPassword: "",
                password: "",
                confirmPassword: ""
            },
            errorAlert: false,
            errorMessage: null
        };
    },
    validations: {
        form: {
            currentPassword: {
                required
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

                    await changePassword(this.userId, this.form.currentPassword, this.form.password);

                    this.showMessage("Password changed");
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
