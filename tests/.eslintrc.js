module.exports = {
    extends: "airbnb-base",
    rules: { 
      "import/no-extraneous-dependencies": ["error", { "devDependencies": true }] ,
      "no-underscore-dangle": ["error", { "allow": ["_id"] }],
      "no-param-reassign": ["error", { "props": false }],
    },
    env: {
      node: true,
      mocha: true
    }
  };