module.exports = {
    "extends": "airbnb-base",
    "rules": {
        "no-unused-vars": ["error", { "argsIgnorePattern": "next" }],
        "no-param-reassign": ["error", { "props": false }],
    }
};