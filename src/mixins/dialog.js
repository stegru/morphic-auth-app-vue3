
/**
 * Mix-in for dialogs.
 * @type {Component}
 */
export const dialogMixin = {
    data: function () {
        return {
            errorMessage: null,
            dialogId: this.id || this.generateId("dialog")
        };
    },
    computed: {
        /**
         * Attributes for a b-modal.
         * @return {Object<String,String>} A modified $attrs object
         */
        dialogAttrs: function () {
            const noClose = (this.$attrs["no-close"] !== undefined) ? {
                noCloseOnBackdrop: true,
                noCloseOnEsc: true,
                hideHeaderClose: true
            } : {
                noCloseOnBackdrop: this.isLite
            };

            // Make some adjustments to the dialogs for mobiles
            const attrs = {
                ...noClose,
                ...this.$attrs,
                largeDialog: this.isLite,
                // Stop the back-drop covering the header (the dialog will be stretched over the screen anyway)
                hideBackdrop: this.isLite,
                // The buttons take up too much space when the on-screen keyboard is open
                scrollable: !this.isLite
            };

            attrs.dialogClass = `${attrs.dialogClass} mobile-headerMarginTop mobile-headerMinHeight focus-headerMarginTop focus-headerMinHeight`;

            return attrs;
        }
    },
    methods: {
        onShow: function () {
            this.$emit("show");
        },

        /**
         * OK button was clicked. Raises an "ok" event, and closes the dialog. If the event object comes back with the
         * promise field set, then the dialog is closed when the promise resolves with true.
         * @param {Event} event BvModalEvent object.
         * @param {Object} data Extra data for the event.
         */
        onOK: function (event, data) {
            event.preventDefault();

            if (this.$v) {
                if (!this.validateForm(this.$v, document.getElementById(this.dialogId))) {
                    return;
                }
            }

            const okEvent = {
                promise: undefined,
                data: data
            };

            this.$emit("ok", okEvent);

            const p = okEvent.promise || Promise.resolve(true);

            p.then(success => {
                if (success) {
                    this.$emit("input", this.newValue);
                    this.hideDialog();
                }
            }).catch(this.handleServerError);

        },
        hideDialog: function () {
            this.$bvModal.hide(this.dialogId);
        },

        /**
         * Displays a modal dialog, resolving when the dialog is dismissed.
         * @param {String} modalId The id of the modal dialog.
         * @return {Promise<String>} Resolves with the trigger value of the modal's hide event.
         */
        showModalDialog(modalId) {
            return new Promise((resolve, reject) => {

                const onHide = (event, id) => {
                    if (id === modalId) {
                        resolve(event.trigger);
                        this.$root.$off("bv::modal::hide", onHide);
                    }
                };

                this.$root.$on("bv::modal::hide", onHide);

                this.$bvModal.show(modalId);
            });
        }
    }
};
