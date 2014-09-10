App.rootElement = '#main-navbar';
App.setupForTesting();
App.injectTestHelpers();

module("Integration tests", {
  setup: function() {
    Ember.run(App, App.advanceReadiness);
  },
  teardown: function() {
    App.reset();
  }
});

test("/", function() {
  visit("/").then(function() {
    equal(find("h1").text(), "Easy Staffing");
  });
});