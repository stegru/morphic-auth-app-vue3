<!-- Confirms an email address - emails link to this page -->
<template>
  <div>
    <div v-if="!loaded">{{ $t('ConfirmEmail.loading') }}</div>
    <div v-else-if="confirming || confirmed">
      <b-card class="confirmEmailMessageBox" title="Your Email is Confirmed">

        <template v-if="confirmed">
          <template v-if="confirmedAlready">
            <p>Thanks. You have already confirmed your email address.</p>
            <p>You can safely delete the email requesting your confirmation if you wish.</p>
          </template>
          <template v-else>
            <p>Thank you for confirming your email with Morphic.</p>
          </template>
          <p>If you do not have Morphic installed on your computer yet, you can <b-link :to="{name:'Download'}">download Morphic here</b-link>.</p>
        </template>

        <template v-else-if="badToken">
          <p>The link you clicked does not work.<br/>It might be a wrong link or a link that has expired.</p>
          <!-- <p>Please check your link. If you think the confirmation link as expired, log into your Morphic account and see if your account is confirmed or not.</p> -->
        </template>

      </b-card>
    </div>
    <div v-else-if="!confirming" style="height: calc(100vh - 90px)">
      <TwoColumnDialog
              id="ConfirmEmailDialog"
              visible="visible"
              no-close
              hide-backdrop
              no-fade

              size="lg"

              dialog-class="confirmEmailDialog"

              :title="$t('ConfirmEmail.dialog_title')"

              :ok-title="$t('ConfirmEmail.ok_button')"

              @ok="$event.promise = acceptInvite()"
              @shown="dialogShown"
      >
        <template #form>

          <p>Morphic just sent you an email with the subject "Welcome to Morphic."</p>

          <p>When you confirm using the email, it will take you to a page where you can download Morphic.</p>


        </template>

        <template #buttons>
          <b class="mt-4">Click the link in your email to confirm and continue.</b>
        </template>

        <template #info-heading>Didn't get email?</template>

        <template #info>
          <p id="EmailSteps">If you didn't get an email from Morphic, here are some steps you can try:</p>
          <ul aria-describedby="EmailSteps">
            <li>Wait a couple of minutes to the email to arrive.</li>
            <li>Check your junk or spam folder.</li>
            <li>Go back and check your email address.</li>
            <li>Press the "Resend email" button to get another copy.</li>
          </ul>

          <div class="text-center p-3">
            <b-button variant="invert-dark" class="pl-4 pr-4" @click="resendEmail()">Resend Email</b-button>
          </div>

        </template>

      </TwoColumnDialog>
    </div>
  </div>
</template>

<style lang="scss">

body:not(.isMobile) #ConfirmEmailDialog {
  pointer-events: none;
  & > * {
    pointer-events: auto;
  }
}

.confirmEmailMessageBox {
  width: fit-content;
  max-width: 500px;
  margin: 5em auto;
}

</style>

<script>

import TwoColumnDialog from "@/components/dialogs/TwoColumnDialog";
import { confirmEmail, getUser, resendEmailConfirmation } from "@/services/userService";

export default {
    name: "ConfirmEmail",
    components: {TwoColumnDialog},
    data() {
        return {
            loaded: false,
            message: null,
            messageTitle: null,
            confirmedAlready: undefined,
            badToken: false,
            confirmed: undefined,
            checkTimer: undefined,
            checkTimerCount: 0
        };
    },
    props: {
        // Accessed during sign in.
        signIn: Boolean,
        // Accessed after registration.
        registered: Boolean,
        confirmUserId: String,
        token: String
    },
    async mounted() {
        this.loaded = false;

        if (this.confirming) {
            // if (this.userId && this.confirmUserId !== this.userId) {
            //     const logout = await this.showConfirm("The link you clicked is for a different user than who is currently logged in.", ["Sign out and confirm email", "Cancel"]);
            //     if (logout) {
            //         await this.$store.dispatch("logout");
            //     } else {
            //         setTimeout(() => this.$router.replace("/"), 500);
            //         return;
            //     }
            // }

            // Submit the token
            try {
                await confirmEmail(this.confirmUserId, this.token);
            } catch (err) {
                if (err.response?.data?.error === "invalid_token") {
                    this.badToken = true;
                    err.handled = true;
                } else {
                    throw err;
                }
            }

            if (this.badToken) {
                if (this.userId && this.userId === this.confirmUserId) {
                    // Check if the user has already confirmed
                    this.confirmedAlready = await this.getConfirmationState();
                    this.confirmed = this.confirmedAlready;
                }
            } else {
                this.confirmed = true;
            }
        } else if (!this.isLoggedIn) {
            this.$router.replace({name: "Home"});
        } else {
            await this.waitForConfirmation();

            if (this.confirmed) {
                if (this.registered) {
                    this.$router.replace({name: "Download.Signup"});
                } else {
                    this.$router.replace({name: "Home"});
                }
            }
        }

        this.loaded = true;
    },
    computed: {
        confirming: function () {
            return this.confirmUserId && this.token;
        }
    },
    methods: {

        /**
         * Called when the dialog has been shown.
         */
        dialogShown: function () {
        },

        getConfirmationState: async function () {
            return !!(await getUser(this.userId)).email_verified;
        },

        /**
         * Starts a timer that polls the confirmation state.
         * @return {Promise<Boolean?>} Resolves with the current confirmation state.
         */
        waitForConfirmation: async function () {
            if (this.checkTimer === "here") {
                return;
            } else if (this.checkTimer) {
                clearTimeout(this.checkTimer);
            }

            this.checkTimer = "here";

            let togo;
            if (this.isLoggedIn && !this.confirming && !this.confirmed) {
                this.confirmed = await this.getConfirmationState();
                togo = this.confirmed;

                if (!this.confirmed && this.checkTimerCount++ < 100) {
                    this.checkTimer = setTimeout(() => this.waitForConfirmation(), 5000);
                }
            }

            return togo;
        },

        /**
         * Re-sends the confirmation email.
         */
        resendEmail: function () {
            resendEmailConfirmation(this.userId).then(() => this.showMessage("Re-sent your confirmation email"));
        }
    }
};
</script>
