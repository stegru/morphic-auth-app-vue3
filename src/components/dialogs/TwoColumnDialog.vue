<!-- A dialog with two columns - 1st contains a form, the 2nd contains instructions -->
<template>
  <b-modal
          :id="dialogId"
          modal-class="twoColumnDialog desktop-headerPaddingTop"
          content-class=""
          :size="size || 'xl'"
          v-bind="dialogAttrs"
          hide-footer
          @show="onShow"
          @shown="$emit('shown', $event); shown = true"
          @hide="$emit('hide', $event); shown = false"
  >

    <b-container class="p-0">
      <b-row class="align-items-start">

        <b-col v-if="!isMobile" lg="6" cols="12" order="2" class="dialog-info">
          <div class="bg-silver rounded-lg p-3 mb-3 mr-3">
            <h6 class="logoHeading">
              <img src="/img/logo-color.svg" class="logo" alt="" aria-hidden="true"/><slot name="info-heading"/>
            </h6>

            <slot name="info"/>
          </div>
        </b-col>

        <b-col class="dialog-form">
          <div class="pt-2 mb-3 mr-4 d-flex flex-column align-self-stretch">

            <slot name="form" />


            <b-alert v-if="errorAlert && errorMessage" variant="danger" show>
              <p v-if="errorMessageTitle" class="font-weight-bold">{{errorMessageTitle}}</p>
              {{errorMessage}}
            </b-alert>

            <div class="flex-grow-1" />

            <div class="buttons d-flex justify-content-around">
              <slot name="buttons" v-bind:ok="okClicked" v-bind:cancel="hideDialog">
                <b-button class="pl-3 pr-3 pt-2 pb-2"
                          variant="invert-dark"
                          @click="hideDialog">
                  {{ cancelTitle || "Cancel" }}
                </b-button>
                <b-button class="pl-3 pr-3 pt-2 pb-2"
                          variant="morphic-green"
                          @click="okClicked($event)">
                  {{ okTitle || "OK" }}
                </b-button>
              </slot>
            </div>

          </div>
        </b-col>

      </b-row>

    </b-container>
  </b-modal>

</template>

<style lang="scss">
@import "~@/styles/_variables.scss";

.twoColumnDialog {
  .modal-header {
    border-bottom: none;
    padding-bottom: 0;
  }

  .modal-body {
    padding-top: 0;
  }

  h5, h6 {
    color: $morphic-blue-color;
    font-size: 1.5em;
  }

  .logoHeading {
    img {
      width: 1.75em;
      height: 1.75em;
      margin-right: 0.2em;
    }
  }
  .rounded-lg {
    border-radius: 1em !important;
  }

  .buttons {
    .btn {
      min-width: 9em;
    }
  }

}

</style>

<script>

import {dialogMixin} from "@/mixins/dialog.js";

export default {
    name: "TwoColumnDialog",
    mixins: [dialogMixin],
    props: {
        id: String,
        size: String,
        okTitle: String,
        cancelTitle: String,
        formData: Object,
        v: Object
    },
    data: function () {
        return {
            loaded: false,
            dialogId: this.id || this.generateId("TwoColumnDialog"),
            /** @type {BillingPlan} */
            billingPlan: null,
            errorAlert: false,
            errorMessage: null,
            errorMessageTitle: null,
            shown: false
        };
    },
    computed: {
        $v: function () {
            return this.v;
        }
    },
    mounted() {
    },

    methods: {
        onShow: function () {
            this.errorAlert = false;
            this.$emit("show");
        },

        okClicked: function ($event) {
            this.onOK($event, this.formData);
        },

        waitForShown: function () {
            return new Promise(resolve => {
                if (this.shown) {
                    resolve();
                } else {
                    this.$once("shown", resolve);
                }
            });
        }
    }
};
</script>
