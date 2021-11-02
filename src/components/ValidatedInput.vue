<!-- form input group for a text input field, which handles validation -->
<template>
  <div>
    <b-form-group
            :id="inputId + '_group'"
        :label="labelText"
        :label-for="inputId"
        :class="{
            validatedInputGroup: true,
            passwordToggle: !!passwordToggle,
            passwordConfirm: !!passwordConfirm
        }"
    >

      <template #label v-if="labelText">{{labelText}}<span v-if="required" class="requiredText" aria-hidden="true">Required</span></template>

      <slot>
        <b-form-input
            :value="value || (validation && validation.$model)"
            ref="inputField"
            @input="onInput"
            @blur="onBlur"
            :state="state"
            :id="inputId"
            class="h-20 w-80"
            :class="{autofocus}"
            :autofocus="autofocus"
            :aria-required="required"
            :type="inputType"
            v-bind="$attrs"
        />
      </slot>

      <template #invalid-feedback>
        <span v-if="state === false">{{ errorText }}</span>
      </template>

      <template #description>
        <span v-if="description">{{description}}</span>
        <!-- Reserves space for the validation error, to stop fields below being nudged down -->
        <div v-if="state !== false" class="invalid-feedback invalid-feedback-reserved" aria-hidden="true">
          <span>.</span>
        </div>
      </template>

    </b-form-group>

    <b-button v-if="passwordToggle"
              ref="toggleButton"
              @click="togglePassword"
              @focus="lastFocus = $event.relatedTarget"
              variant="info"
              class="showPasswordButton"
              size="sm">
      <b-icon :icon="showPassword ? 'eye-slash' : 'eye'"/>
      {{ showPassword ? "Hide password" : "Show password" }}
    </b-button>

  </div>
</template>

<style lang="scss">
.requiredText {
  float: right;
  margin-top: 0.8rem;
  font-size: 0.8rem;
}
.invalid-feedback span {
  font-size: 0.9rem;
}

.invalid-feedback-reserved {
  display: block !important;
  visibility: hidden;
}

button.showPasswordButton {
  margin-left: auto !important;
  display: block;
}
.validatedInputGroup.form-group:not(.passwordConfirm) {
  button.showPasswordButton {
    float: right;
  }
}

</style>

<script>

const defaultErrorMessages = {
    email: "Please enter a valid email address.",
    required: "This field is required",
    sameAsPassword: "Passwords do not match"
};

export default {
    name: "ValidatedInput",
    components: {},
    props: {
        /** The $v object for the value */
        validation: Object,
        /** Error messages, for each validation rule */
        errors: Object,
        label: String,
        id: String,
        noColon: Boolean,
        value: String,
        description: String,
        type: String,
        /** Show the toggle button to show/hide the password */
        passwordToggle: Boolean,
        /** ID of the related password confirm input */
        passwordConfirm: String,
        autofocus: Boolean
    },
    data() {
        return {
            inputId: this.id || "input" + Math.random(),
            errorMessages: Object.assign({}, defaultErrorMessages, this.errors),
            currentValue: this.value || (this.validation && this.validation.$model),
            showPassword: undefined,
            hasChanged: false
        };
    },
    computed: {
        state: function () {
            return (this.validation && this.validation.$anyDirty && (this.required || this.currentValue !== "")) ? !this.validation.$anyError : null;
        },
        required: function () {
            return this.validation && this.validation.required !== undefined;
        },
        labelText: function () {
            return this.label && (this.noColon ? this.label : `${this.label}:`);
        },
        errorText: function () {
            let result;
            if (this.state === false) {
                if (this.validation.$message) {
                    result = this.validation.$message;
                } else {
                    for (const [key, value] of Object.entries(this.validation)) {
                        if (!key.startsWith("$") && !value) {
                            result = this.errorMessages[key];
                            break;
                        }
                    }
                }
            }
            return result;
        },
        inputValue: function () {
            return this.currentValue;
        },
        inputType: function () {
            const show = this.showPassword;
            return this.passwordToggle
                ? (show ? "text" : "password")
                : this.type;
        }
    },
    mounted() {
        if (this.passwordToggle && !this.passwordConfirm) {
            try {
                // Move the toggle button closer to the input
                this.$refs.inputField.$el.parentNode.insertBefore(this.$refs.toggleButton, this.$refs.inputField.$el.nextSibling);
            } catch {
                // This is only display-related, so errors (probably due to browser compatibility) can be safely ignored
            }
        }
    },
    methods: {
        onInput($event) {
            this.hasChanged = true;
            if (this.validation) {
                this.validation.$model = $event;
            }
            this.currentValue = $event;
            this.$emit("input", $event);
        },
        onBlur($event) {
            // Only validate a field if it was changed.
            if (this.hasChanged && this.validation) {
                this.validation.$touch();
            }
        },
        focus() {
            this.$refs.inputField.focus();
        },
        /**
         * Toggles whether or not the password text should be visible.
         *
         * This changes the type between `password` and `text`, and focuses the last password input.
         *
         * @param {MouseEvent} event Event object
         */
        togglePassword(event) {
            this.showPassword = !this.showPassword;
            this.$emit("toggle-password", this.showPassword);

            // Update the password confirmation
            const confirmElem = this.passwordConfirm && window.document.querySelector(`#${this.passwordConfirm}`);
            if (confirmElem) {
                confirmElem.type = this.inputType;
            }

            if (event.screenX && event.screenY) {
                // Set the focus to the last password field used.
                let focusElem;
                if (this.passwordConfirm && this.lastFocus && this.lastFocus.id === confirmElem.id) {
                    focusElem = confirmElem;
                } else {
                    focusElem = this.$refs.inputField;
                }

                setTimeout(() => {
                    focusElem.focus();
                    focusElem.selectionStart = 0xff;
                }, 100);
            }
        }
    }
};
</script>
