<template>
  <b-container id="RegistrationPage">
    <b-row>
      <b-col md="6" order="2">
        <div class="bg-light mt-5 p-4 rounded-lg">
          <div class="d-flex justify-content-around align-items-center">
            <img src="/img/logo-color.svg" alt="" class="mr-3">
            <h3 v-t="'Registration.side-heading'" />
          </div>
          <div class="mt-4 lead font-weight-bold">
            <p class="h4" v-t="'Registration.account-benefits-lead'" />
            <ul>
              <li v-for="(item, index) in $t('Registration.account-benefits_list')"
                  :key="index">{{ item }}</li>
            </ul>
          </div>
        </div>
      </b-col>

      <b-col md="6">
        <div class="mb-3">
          <h2 v-t="'Registration.form_heading'" />
          <div v-t="'Registration.form_lead'" />
        </div>
        <UserRegistration :back-link="$t('Registration.back_link')" :submit-button-text="$t('Registration.submit_button')"/>
      </b-col>
    </b-row>
  </b-container>
</template>


<style lang="scss">

#RegistrationPage {
  h1, h2, h3 {
    color: #022957;
  }

  .rounded-lg {
    border-radius: 2em !important;
  }

  li {
    margin-top: 1em;
  }

}
</style>

<script>
import UserRegistration from "@/components/UserRegistration";

export default {
    components: {
        UserRegistration
    }
};
</script>
