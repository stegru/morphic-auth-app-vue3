<!-- A dialog that accepts a single text field -->
<template>
  <b-modal :id="id" :title="title"
           @ok="onOK"
           @show="onShow"
           :ok-title="okTitle"
           :ok-disabled="submitting"
           :modal-class="{submitting}"
           :cancel-title="cancelTitle"
           :centered="centered"
           dialog-class="textInputDialog"
  >

    <ValidatedInput
            class="textInputDialogField"
            ref="textInput"
            @keydown.native.enter="onEnter"
            @input="changed = true"
            autofocus required
            :label="prompt"
            :placeholder="placeholder"
            :description="description"
            :validation="$v.newValue"
            v-bind="$attrs"
      />

    <b-alert :show="errorAlert" variant="danger" class="small p-2">{{ errorMessage }}</b-alert>
  </b-modal>

</template>

<script>

import ValidatedInput from "@/components/ValidatedInput";
import { validationMixin } from "vuelidate";
import { required, email } from "vuelidate/lib/validators";

/**
 * Event object for the `ok` event.
 * @typedef {Object} TextInputOKEvent
 * @property {String} oldValue The original value.
 * @property {String} newValue The new value.
 * @property {Promise?} promise Resolves with true to dismiss the dialog.
 */

export default {
    name: "TextInputDialog",
    components: {ValidatedInput},
    mixins: [validationMixin],
    props: {
        /** Dialog title */
        title: String,
        /** Text above the field */
        prompt: String,
        /** Placeholder text for the input field */
        placeholder: String,
        /** Initial field value */
        value: String,
        /** Modal ID */
        id: String,
        /** Small text under the field */
        description: String,
        okTitle: String,
        cancelTitle: String,
        centered: Boolean,
        /** type of validation ("email") */
        validation: String,
        /** Clear the initial value when showing */
        clear: Boolean
    },
    data: function () {
        return {
            newValue: null,
            changed: false,
            errorAlert: false,
            errorMessage: null,
            submitting: false
        };
    },
    validations() {
        const v = { required: required };
        if (this.validation) {
            const rules = this.validation.toLowerCase().split(/\s*,\s*|\s+/);
            if (rules.includes("email")) {
                v.email = email;
            }
        }

        return {
            newValue: v
        };
    },
    methods: {
        onShow: function () {
            this.newValue = (!this.clear && this.value) || "";
            this.changed = false;

            if (this.$v) {
                this.$v.$reset();
            }
            this.$emit("show");
        },
        onEnter: function (event) {
            this.onOK(event);
        },
        /**
         * OK button was clicked. Raises an "ok" event, and closes the dialog. If the event object comes back with the
         * promise field set, then the dialog is closed when the promise resolves with true.
         * @param {Event} event BvModalEvent object.
         */
        onOK: function (event) {
            event.preventDefault();

            if (this.$v) {
                this.$v.$touch();
                if (this.$v.$anyError) {
                    this.$refs.textInput.focus();
                    return;
                }
            }


            const okEvent = {
                oldValue: this.value,
                newValue: this.newValue,
                promise: undefined
            };

            this.$emit("ok", okEvent);

            const p = okEvent.promise || Promise.resolve(true);
            this.submitting = !!okEvent.promise;

            p.then(success => {
                this.submitting = false;
                if (success) {
                    this.$emit("input", this.newValue);
                    this.hideDialog();
                }
            }).catch(err => {
                this.submitting = false;
                // TODO: make it more sexy when MOR-450 is merged
                this.errorMessage = err.message;
                this.errorAlert = true;
            });

        },
        hideDialog: function () {
            this.$bvModal.hide(this.id);
        }
    }
};
</script>

<style lang="scss">
.textInputDialog {
  .textInputDialogField .requiredText {
    display: none;
  }

  footer.modal-footer {
    flex-wrap: nowrap;

    .alert {
      margin-right: auto;
      width: fit-content;
    }
  }
}
</style>
