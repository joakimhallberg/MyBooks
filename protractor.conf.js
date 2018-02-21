exports.config = {
  directConnect: true,
  capabilities: {
    'browserName': 'chrome'
  },
  plugins: [{
    package: 'aurelia-protractor-plugin'
  }],
  jasmineNodeOpts: {
    showColors: true,
    defaultTimeoutIntervall: 30000
  }
};
