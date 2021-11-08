module.exports = {

    pages: {
        login: {
            entry: "src/pages/login.js",
            template: "public/template.html",
            filename: "index.html"
        },
        signup: {
            entry: "src/pages/signup.js",
            template: "public/template.html",
            filename: "signup/index.html"
        }
    },

    lintOnSave: "warning",

    devServer: {
        port: 8080,
        disableHostCheck: true,

        // Redirect API requests to the API server.
        proxy: {
            "^/v1/": {
                target: "http://localhost:5002/",
                secure: false
            }
        }
    },

    chainWebpack: (config) => {
        config.plugins.delete("prefetch");
    },

    pluginOptions: {
        i18n: {
            locale: "en",
            fallbackLocale: "en",
            localeDir: "locales",
            enableInSFC: false
        }
    }
};
