# morphic-auth-app

## Running locally

This requires the [Morphic API Server](https://github.com/raisingthefloor/morphic-api-server/) to be running.

Install the project dependencies:

    npm install

Serve the web-app:

    npm run dev

This will start a development server on `0.0.0.0:8080` ([http://localhost:8080/](http://localhost:8080/)), which reloads
when a file has been changed. Additionally, the web-app will assume the API server is listening at the same address
(the development server redirects requests to the real address), so there should be no cross-origin related issues. This
also provides the ability to hook-up to an external API server.

Inspect [src/config/config.js](src/config/config.js) and [vue.config.js](vue.config.js) for the details.

## More Information

### Project setup

    npm install

### Compiles and hot-reloads for development

    npm run dev

### Compiles and minifies for production

    npm run build

### Lints and fixes files

    npm run lint

### Unit tests

    npm test

### Customize configuration

See [Configuration Reference](https://cli.vuejs.org/config/).
