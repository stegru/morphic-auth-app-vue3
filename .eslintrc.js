module.exports = {
    root: true,
    env: {
        node: true
    },
    extends: [
        "plugin:vue/vue3-essential",
        "@vue/airbnb"
    ],
    parserOptions: {
        parser: "babel-eslint"
    },
    rules: {
        "comma-dangle": [
            "error",
            "never"
        ],
        "comma-style": [
            "error",
            "last"
        ],
        "no-console": process.env.NODE_ENV === "production" ? "warn" : "off",
        "no-debugger": process.env.NODE_ENV === "production" ? "warn" : "off",
        "no-multiple-empty-lines": "warn",
        indent: [
            "error",
            4
        ],
        quotes: [
            "error",
            "double"
        ]

    }
};
