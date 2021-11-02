module.exports = {
  root: true,
  env: {
    browser: true,
    commonjs: true,
    es6: true,
    node: true
  },
  extends: [
    "plugin:vue/essential",
    "@vue/standard",
    "plugin:jsdoc/recommended"
  ],
  parserOptions: {
    parser: "babel-eslint"
  },
  settings: {
    "jsdoc": {
      "tagNamePreference": {
        "returns": "return"
      },
      "preferredTypes": {
        "*": "Any",
        "any": "Any",
        "boolean": "Boolean",
        "number": "Number",
        "object": "Object",
        "string": "String"
      }
    }
  },
  rules: {
    "no-console": process.env.NODE_ENV === "production" ? "warn" : "off",
    "no-debugger": process.env.NODE_ENV === "production" ? "warn" : "off",
    "no-multiple-empty-lines": "off",
    "padded-blocks": "off",
    "object-curly-spacing": "off",
    "dot-notation": [
      "error",
      {
        "allowKeywords": true
      }
    ],

    "block-scoped-var": "error",
    "comma-dangle": [
      "error",
      "never"
    ],
    "comma-style": [
      "error",
      "last"
    ],
    "curly": [
      "error",
      "all"
    ],
    "dot-notation": [
      "error",
      {
        "allowKeywords": true
      }
    ],
    "eol-last": "error",
    "eqeqeq": [
      "error",
      "allow-null"
    ],
    "indent": [
      "error",
      4
    ],
    "keyword-spacing": "error",
    "linebreak-style": ["error", "unix"],
    "new-cap": [
      "error",
      {
        "properties": false
      }
    ],
    "no-caller": "error",
    "no-cond-assign": [
      "error",
      "except-parens"
    ],
    "no-console": "error",
    "no-debugger": "error",
    "no-empty": [
      "error",
      {
        "allowEmptyCatch": true
      }
    ],
    "no-eval": "error",
    "no-extend-native": "error",
    "no-irregular-whitespace": "error",
    "no-iterator": "error",
    "no-loop-func": "error",
    "no-multi-str": "error",
    "no-new": "error",
    "no-new-wrappers": "error",
    "no-proto": "error",
    "no-redeclare": "error",
    "no-script-url": "error",
    "no-sequences": "error",
    "no-trailing-spaces": "error",
    "no-undef": "error",
    "no-unused-vars": "error",
    "no-with": "error",
    "quotes": [
      "error",
      "double"
    ],
    "semi": [
      "error",
      "always"
    ],
    "space-before-blocks": [
      "error",
      "always"
    ],
    "space-before-function-paren": [
      "error",
      {
        "anonymous": "always",
        "named": "never"
      }
    ],
    "space-infix-ops": "error",
    "space-unary-ops": [
      "error",
      {
        "words": true,
        "nonwords": false,
        "overrides": {
          "typeof": false
        }
      }
    ],
    "strict": [
      "error",
      "safe"
    ],
    "valid-typeof": "error",
    "wrap-iife": [
      "error",
      "inside"
    ],


    "jsdoc/require-jsdoc": 0,
    "jsdoc/newline-after-description": 0,
    "jsdoc/require-hyphen-before-param-description": "off",
    "jsdoc/no-undefined-types": 0, // https://github.com/gajus/eslint-plugin-jsdoc/issues/99
    "jsdoc/check-alignment": 2,
    "jsdoc/check-param-names": 2,
    "jsdoc/check-tag-names": 2,
    "jsdoc/check-types": 1,
    "jsdoc/require-param": 2,
    "jsdoc/require-param-description": 2,
    "jsdoc/require-param-name": 2,
    "jsdoc/require-param-type": 2,
    "jsdoc/require-returns": 2,
    "jsdoc/require-returns-check": 2,
    "jsdoc/require-returns-description": 2,
    "jsdoc/require-returns-type": 2,
    "jsdoc/valid-types": 2
  }
};
