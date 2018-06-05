module.exports = {
    extends: "airbnb-base",
    rules: { 
      "import/no-extraneous-dependencies": ["error", { "devDependencies": true }] ,
      "no-param-reassign": ["error", { "props": false }],
    },
    env: {
      node: true,
      mocha: true
    }
  };