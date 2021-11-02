module.exports = {
    preset: "@vue/cli-plugin-unit-jest",
    verbose: true,
    transformIgnorePatterns: ["/node_modules"],
    moduleFileExtensions: ["js", "json", "vue"],
    transform: {
        ".*\\.(js)$": "babel-jest"
    },
    moduleNameMapper: {
        "^@/(.*)$": "<rootDir>/src/$1"
    }
};
