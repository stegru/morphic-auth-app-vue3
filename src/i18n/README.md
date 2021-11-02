# Internationalisation

## Files

* [src/i18n/i18n.js](i18n.js) - Detects the locale, and loads the messages. (Invoked from [App.vue](../App.vue))
* [src/locales/*.json](../locales) - The locale message files.
* [src/config/locales.js](../config/locales.js) - Supported locales.


## Guide

* [vue-i18n](https://kazupon.github.io/vue-i18n) is used.
* Strings in the messages files are grouped by the file they are referenced in.
* Keys should describe the text, rather than duplicate it.
* Prefer to not re-use the strings for different elements, even if the text is the same. Instead, [Linked messages](https://kazupon.github.io/vue-i18n/guide/messages.html#linked-locale-messages)
  can be used, so the translator can override if required.
* For simple text, the `v-t` directive is preferred, because `$t()` gets evaluated on every re-render.

### Tooling

* IntelliJ IDEA: [i18nPlugin](https://github.com/nyavro/i18nPlugin)
* VS Code: [i18n-ally](https://github.com/lokalise/i18n-ally)

Regex to replace simple `$t` methods, where it is the only content of an element, with the `v-t` directive:

* / `(?<TAG><(\S+)[^>]*)>\{\{ *\$t\((?<KEY>'[^']*')\) }}(</\2>)` / `${TAG} v-t="${KEY}" />` /
* `<b class="a">{{ $t('hello-text') }}</b>` => `<b class="a" v-t="'hello-text'" />`

## Examples

Messages file

```json5
{
    "example-page": {
        // plain text
        "heading": "I18N example",
        // Text for an attribute
        "first-name_placeholder": "Your name",
        // Interpolation
        "greeting": "Hello, {name}",
        // Plurals
        "characters": "nothing entered | only one character | {n} characters",
        // Link message
        "product-name": "Morphic",
        "welcome-message": "Welcome to @:example-page.product-name"
    }
}
```

Input HTML

```html
<!-- plain text -->
<h1 v-t="'example-page.heading'" />

<!-- inside an attribute -->
<input :placeholder="$t('example-page.first-name_placeholder')" v-model="firstName" />

<!-- Interpolation -->
<p>{{ $t('example-page.greeting', { name: firstName }) }}</p>

<!-- Plurals -->
<p>{{ $tc('example-page.characters', firstName.length) }}</p>

<!-- Linked message -->
<p v-t="'example-page.welcome-message'" />
```


Result

```html
<h1>I18N example</h1>

<input placeholder="Your name" />

<p>Hello, abc</p>

<p>3 characters</p>

<p>Welcome to Morphic</p>
```

