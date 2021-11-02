<template>
  <b-container v-if="loaded" fluid id="PageContainer" :class="focusMode ? 'focusMode' : 'dashboardMode'">
    <Header ref="Header" />
    <div role="main" id="PageContent" class="main">
      <router-view />
    </div>
    <div class="screenReader">
      <div id="ScreenReaderAnnouncements" aria-live="polite"></div>
      <div id="ScreenReaderAnnouncementsAssertive" aria-live="assertive"></div>
    </div>
    <Footer />
  </b-container>
</template>

<style lang="scss">

  body {
    font-family: 'Open Sans', sans-serif !important;
  }

  // this is shown when the recaptcha token is used by getRecaptchaToken()
  body:not(.show-recaptcha) .grecaptcha-badge {
    visibility: hidden;
  }

  // Put the footer at the bottom of the viewport, if the page is too short
  body:not(.modal-open) {
    height: 100vh;
  }
  #PageContainer {
    padding: 0;
    display: flex;
    flex-direction: column;
    min-height: 100%;

    .main {
      flex-grow: 1;
    }
  }


  #MainHeading, h1 {
    font-size: 1.7rem;
  }

  // Hide something, but keep it available for screen-readers
  .screenReader {
    position: absolute !important;
    overflow: hidden;
    width: 1px;
    height: 1px;
    clip: rect(0, 0, 0, 0);
  }
</style>

<script>
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { loadLocaleMessagesAsync } from "@/i18n/i18n";
import * as errorHandler from "@/utils/errorHandler";

export default {
    name: "App",

    components: {
        Header,
        Footer
    },
    data() {
        return {
            loaded: false,
            /** @type {MediaQueryList} */
            mobileMatchMedia: null,
            headerHeight: null,
            headerHeightStyle: null,
            headerSizeObserver: null
        };
    },
    computed: {
        /**
         * Gets the classes for the body element.
         * @return {Object} The classes.
         */
        bodyClasses: function () {
            return {
                focusMode: this.focusMode,
                dashboardMode: !this.focusMode,
                isMobile: this.isMobile,
                isLite: this.isLite,
                editorPage: this.$route.meta.isEditorPage
            };
        }
    },
    mounted() {
        const work = [];
        // Set the locale to the lang= parameter on the URL, or use what was detected.
        const locale = this.$route.query.lang || this.$i18n.locale;
        work.push(this.setLocale(locale));
        Promise.all(work).then(() => {
            this.loaded = true;
        });

        errorHandler.useErrorHandler(this.showError);

        this.detectMobile();

        this.getHeaderHeight();
        this.dialogScroll();

        // For screen-readers, having a footer on a dialog is not desired.
        this.$root.$on("bv::modal::shown", (bvEvent, modalId) => {
            document.querySelectorAll("footer.modal-footer").forEach(elem => {
                elem.setAttribute("role", "presentation");
            });
        });

        // Refresh when some things have changed in another tab.
        const watchKeys = ["token", "userId", "role", "communityId"];
        let updateRequired;
        window.addEventListener("storage", (e) => {
            if (!e.key || watchKeys.includes(e.key)) {
                if (this.$route.meta && !this.$route.meta.public) {
                    if (document.visibilityState === "hidden") {
                        updateRequired = true;
                    } else {
                        this.$router.go();
                    }
                }
            }
        });

        window.addEventListener("visibilitychange", (e) => {
            if (updateRequired && document.visibilityState !== "hidden") {
                updateRequired = false;
                this.$router.go();
            }
        });

    },
    watch: {
        bodyClasses: {
            deep: true,
            immediate: true,
            /**
             * Sets the classes of the body element, based on `this.bodyClasses`.
             */
            handler: function () {
                const add = [];
                const remove = [];
                for (const [key, value] of Object.entries(this.bodyClasses)) {
                    (value ? add : remove).push(key);
                }
                document.body.classList.remove(...remove);
                document.body.classList.add(...add);
            }
        },
        "$route.path": function (newValue, oldValue) {
            this.newPage();
        }
    },
    methods: {
        /**
         * A new page has been loaded.
         */
        newPage: function () {
            // When a new page is loaded, announce the title and move focus to the skip to content link.
            this.screenReaderMessage(this.$route.meta.title);
            const skipLink = document.getElementById("SkipToContent");
            if (skipLink) {
                // Don't show the link, until the next time it's focused.
                skipLink.classList.add("screenReader");
                skipLink.addEventListener("blur", () => skipLink.classList.remove("screenReader"), {once: true});
                skipLink.focus();
            }
        },
        /**
         * Set the local of the page.
         * @param {String} locale Identifier of the locale.
         * @return {Promise<String>} Resolves when complete.
         */
        setLocale(locale) {
            return loadLocaleMessagesAsync(locale).catch(() => {
                // Let the page load anyway.
            });
        },

        /**
         * Detects if the device could be a mobile device, and monitors the state.
         * $store.isMobile will be updated to match the current state.
         */
        detectMobile() {
            if (!this.mobileMatchMedia) {
                this.mobileMatchMedia = window.matchMedia("only screen and (max-width: 767.98px)");
                if (this.mobileMatchMedia.addEventListener) {
                    this.mobileMatchMedia.addEventListener("change", this.detectMobile);
                } else {
                    this.mobileMatchMedia.addListener(this.detectMobile);
                }
            }

            this.$store.commit("isMobile", this.mobileMatchMedia.matches);
        },

        /**
         * Updates some css rules based on the header on the page, and continue to monitor it.
         * Used to locate dialogs just above the header on mobile devices.
         */
        getHeaderHeight() {
            const content = document.querySelector("#PageContainer #top");

            if (this.headerHeight === null) {
                window.addEventListener("resize", () => this.getHeaderHeight());
            }

            let height = 0;
            if (content) {
                height = content.getBoundingClientRect().height;

                // Use the ResizeObserver if it's available.
                if (!this.headerSizeObserver && window.ResizeObserver) {
                    this.headerSizeObserver = new ResizeObserver(() => this.getHeaderHeight());
                    this.headerSizeObserver.observe(content);
                }

                if (height !== this.headerHeight) {

                    if (this.headerHeightStyle) {
                        document.head.removeChild(this.headerHeightStyle);
                    }
                    this.headerHeightStyle = document.createElement("style");

                    document.head.appendChild(this.headerHeightStyle);
                    const styleSheet = this.headerHeightStyle.sheet;

                    // Add some rules to adjust position and height of things while taking the header into consideration
                    [".", "body.focusMode .focus-", "body.isMobile .mobile-", "body:not(.isMobile, .focusMode) .desktop-"].forEach(prefix => {
                        styleSheet.insertRule(`${prefix}headerMarginTop { margin-top: ${height}px !important; }`);
                        styleSheet.insertRule(`${prefix}headerPaddingTop { padding-top: ${height}px !important; }`);
                        styleSheet.insertRule(`${prefix}headerMaxHeight { max-height: calc(100vh - ${height}px) !important; }`);
                        styleSheet.insertRule(`${prefix}headerMinHeight { min-height: calc(100vh - ${height}px) !important; }`);
                    });
                }
            } else {
                // Content is not available yet.
                setTimeout(() => this.getHeaderHeight(), 1000);
            }

            this.headerHeight = height;
        },

        /**
         * For mobile: When a full-screen dialog is shown, scroll to the top (and restore when hidden).
         * This prevents the the active input field being scrolled out of view when the on-screen keyboard opens.
         */
        dialogScroll: function () {
            const scrollPos = {};

            // Scroll to the top of a window when a large dialog is shown.
            this.$root.$on("bv::modal::shown", (event) => {
                if (this.isLite) {
                    const elem = event.target;
                    const large = !!elem.querySelector(".modal-lg");
                    if (large) {
                        scrollPos[event.componentId] = {x: window.scrollY, y: window.scrollY};
                        window.scrollTo(0, 0);
                        // Handle header clicks when a dialog is shown
                        elem.addEventListener("click", (e) => {
                            if (e.target === e.currentTarget) {
                                if (e.clientY < this.headerHeight) {
                                    this.$refs.Header.$refs.navToggle.$el.click(e);
                                }
                            }
                        });
                    }
                }
            });

            // Restore the scroll position when a large dialog is hidden.
            this.$root.$on("bv::modal::hidden", (event) => {
                if (this.isLite) {
                    const pos = scrollPos[event.componentId];
                    if (pos) {
                        window.scrollTo(pos.x, pos.y);
                    }
                }
            });
        }
    }
};
</script>
