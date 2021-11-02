import Vue from "vue";
import VueI18n from "vue-i18n";
import supportedLocales from "@/config/locales";

Vue.use(VueI18n);

const defaultLocale = "en";
const loadedLanguages = [];

/**
 * Loads (and applies) the messages for a locale.
 * @param {String} overrideLocale The locale id to set (default: the detected language).
 * @return {Promise<String>} Resolves when loaded.
 */
export async function loadLocaleMessagesAsync(overrideLocale) {
    let locale = overrideLocale || i18n.locale;

    if (!loadedLanguages.includes(locale)) {

        try {
            const messages = await import(/* webpackChunkName: "locale-[request]" */ "@/locales/" + locale + ".json");

            i18n.setLocaleMessage(locale, messages);
            loadedLanguages.push(locale);
        } catch (err) {
            // eslint-disable-next-line no-console
            console.error(`Unable to load locale '${locale}':`, err);
            if (locale === defaultLocale) {
                throw err;
            } else {
                locale = defaultLocale;
                return loadLocaleMessagesAsync(defaultLocale);
            }
        }
    }
    i18n.locale = locale;
    return locale;
}

/**
 * Gets the user's preferred languages from the browser.
 * @return {Array<String>} List of preferred language, in order of priority.
 */
function getPreferredLanguages() {
    let langs = navigator.languages;
    if (!langs || langs.length === 0) {
        langs = navigator.language ? [navigator.language] : [];
    }
    return langs;
}

/**
 * Determines if a given language is supported.
 * @param {String} lang The language to check.
 * @param {Boolean} ignoreCountry true to ignore the country
 * @return {String} The locale id if the language is supported, or undefined.
 */
function isSupported(lang, ignoreCountry) {
    let locale = lang;
    if (ignoreCountry) {
        const m = lang.match(/^[^-_]*/);
        if (m) {
            locale = m[0];
        }
    }
    return supportedLocales[locale] ? locale : undefined;
}

/**
 * Get the supported locale that the user prefers the most (or the default, if there's no match).
 * @return {String} The id of the supported locale.
 */
function getInitialLocale() {
    const preferred = getPreferredLanguages();

    let locale;
    let found = preferred.some(lang => (locale = isSupported(lang)));

    if (!found) {
        found = preferred.some(lang => (locale = isSupported(lang, true)));
    }

    return found ? locale : defaultLocale;
}

const initialLocale = getInitialLocale();

const i18n = new VueI18n({
    locale: initialLocale,
    fallbackLocale: defaultLocale,
    postTranslation: function (str, key) {
        if (Array.isArray(str)) {
            // Get the complete translation for each array item
            for (let i = 0; i < str.length; i++) {
                str[i] = this.t(`${key}.${i}`);
            }
        }
        return str;
    },
    messages: {}
});

export default i18n;
