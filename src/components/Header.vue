<template>
  <b-navbar toggleable="md" type="light" variant="light" id="top" ref="nav" tag="div" role="banner">
    <header>
      <a class="contentLink" id="SkipToContent" href="#PageContent" @click.prevent="skipToContent">Skip to content</a>
      <b-navbar-brand>
        <b-link to="/">
          <img src="/img/logo-color.svg" class="logo" :alt="$t('Header.product-name')" />
        </b-link>

        <span v-if="hideHeading || !heading" class="headerTitle" aria-hidden="true">{{ $t("Header.product-name") }}</span>
        <h1 v-if="heading" class="headerTitle" :class="{screenReader: hideHeading}">{{ heading }}</h1>
      </b-navbar-brand>
    </header>

    <template v-if="isLoggedIn">
      <b-navbar-toggle target="nav-actions" ref="navToggle"/>
      <b-collapse id="nav-actions" is-nav v-model="showMenu">
        <b-navbar-nav class="ml-auto loggedInNav" :role="isMobile && 'presentation'">
          <b-nav-text v-if="!isMobile">
            <b-button v-if="focusMode && !isMobile"
                      variant="invert-dark"
                      @click="showMenu = false; setFocusMode(false)" v-t="'Header.standard-mode_button'" />
            <b-button v-else-if="!isMobile"
                      variant="invert-dark"
                      @click="showMenu = false; setFocusMode(true)" v-t="'Header.focus-mode_button'" />
          </b-nav-text>

          <b-nav-text>
            <b-button variant="invert-dark" @click="showMenu = false; logout()"><b-icon icon="box-arrow-right"/> {{ $t('Header.logout_button') }}</b-button>
          </b-nav-text>
        </b-navbar-nav>
      </b-collapse>
    </template>

    <b-navbar-nav v-else-if="$route.name !== 'Login'" class="ml-auto loggedOutNav" role="presentation">
      <b-nav-text>
        <b-button variant="invert-dark" :to="{name: 'Login'}"><b-icon icon="box-arrow-in-right"/> {{ $t('Header.login_button') }}</b-button>
      </b-nav-text>
    </b-navbar-nav>

    <!-- clicking outside the menu will close it -->
    <div v-show="showMenu" tabindex="0" class="onlyMobile modal-backdrop headerMarginTop" @focusin="$refs.navToggle && $refs.navToggle.$el.focus()" @click="showMenu = false"/>
  </b-navbar>
</template>

<style lang="scss">
  @import "~@/styles/bootstrap-util";

  #top {
    border-bottom: 2px solid $morphic-blue-color;
    padding: 0;

    // Skip to content link - off-screen until focused
    .contentLink {
      font-size: larger;
      background-color: white;
      padding: 2px;
      position: absolute;
      z-index: 100;
      transform: translateX(-100%);

      @media (prefers-reduced-motion: no-preference) {
        transition: transform 250ms ease-out;
      }

      &:not(.screenReader):focus-visible {
        transform: translateX(0);
      }
    }

    a.nav-link:focus {
      outline: 0;
    }

    a.nav-link.active {
      color: white;
      background: #002957;
      border-bottom: 3px solid #84c661;
    }


    .navbar-brand {
      margin-left: 1rem;
      @include media-breakpoint-down(sm) {
        margin-left: 3px;
      }
    }

    max-width: 100%;
    overflow: hidden;

    .navbar-toggler, .navbar-collapse,  {
      margin-right: 1rem;
      @include media-breakpoint-down(sm) {
        margin-right: 0.3rem;
      }
    }

    .navbar-brand {
      flex-grow: 0;
      .headerTitle {
        display: inline;
        color:  $morphic-blue-color;

        font-weight: bold;

        margin: 0 0 0 0.8em;
        font-size: 22px;

        @include media-breakpoint-down(sm) {
          margin-left: 0.4em;
          font-size: 20px;
        }
      }
      .logo {
        height: 2.4rem;
        @include media-breakpoint-down(sm) {
          height: 2rem;
        }
      }
    }

    .loggedOutNav {
      margin-right: 1em;
    }

    #nav-actions {
      flex-grow: 1;

      .navbar-nav {
        button {
          margin-left: 1em;
          overflow: hidden;
        }
      }

      // When the buttons are collapsed, make them look like a menu
      &.navbar-collapse.show, &.navbar-collapse.collapsing {
        margin-right: 0;
        .navbar-text {
          margin: 0;
          padding: 0;
        }
        background-color: #000;
        .btn {
          text-align: left;
          margin: 0 0 -1px;

          width: 100%;
          border-radius: 0;

          font-size: 1.3em;
          padding: 0.5em 0.5em;
        }
      }
    }
  }
  body.menu-open {
    #top {
      .navbar-collapse {
        z-index: ($zindex-modal + 102);
      }

      .modal-backdrop {
        z-index: ($zindex-modal + 100);

        &:focus-within {
          background-color: red !important;
        }
      }
    }
  }
  //z-index: ($zindex-modal + 101);
</style>

<script>

export default {
    data() {
        return {
            showMenu: false
        };
    },
    computed: {
        isLoggedIn: function () {
            return this.$store.getters.isLoggedIn;
        },
        focusedUrl: function () {
            return this.getUrl(true).href;
        },
        dashboardUrl: function () {
            return this.getUrl(false).href;
        },
        /**
         * @return {String} The main heading for the page.
         */
        heading: function () {
            return this.$route.meta.noHeading ? null : this.$route.meta.heading || this.$route.meta.title;
        },
        /**
         * Determines if the heading should be hidden.
         * @return {Boolean} true to hide the header.
         */
        hideHeading: function () {
            return this.$route.meta.hideHeading;
        }
    },

    mounted() {
        this.showMenu = false;
    },

    methods: {
        logout: function () {
            this.$store.dispatch("logout").then(() => {
                this.$router.push("/");
            });
        },
        getBarId: function () {
            return this.$route.query.barId;
        },
        getUrl: function (focused) {
            const barId = this.getBarId();
            if (barId) {
                const name = focused ? "Focused: Bar Editor" : "MorphicBar Editor";
                return this.$router.resolve({name: name, query: {barId: barId}});
            } else {
                const name = focused ? "Home: Bar and Member Page" : "Dashboard";
                return this.$router.resolve({name: name});
            }
        },
        /**
         * Sets focus mode.
         * @param {Boolean} flag true to enable.
         */
        setFocusMode: function (flag) {
            this.$store.dispatch("forceFocusMode", !!flag);
        },
        /**
         * Scroll the content to the top of the window, and set the focus to the first focusable element in the content.
         */
        skipToContent() {
            const content = document.querySelector("#PageContent");
            content.scrollIntoView(true);
            const firstFocusable = content.querySelector("a,input,button,[tabindex]");
            if (firstFocusable?.focus) {
                firstFocusable.focus();
            }
        }
    },
    watch: {
        showMenu: function () {
            document.body.classList.toggle("menu-open", this.showMenu);
        }
    }
};
</script>
