(function() {

"use strict";


skate("io-random-quote", {

  ready: function(el) {
    el.instance = new RandomQuote(el);
  },


  events: {
    "click .random-quote__nav-button": function(el, event) {
      el.instance.render();
    }
  }

});



function RandomQuote(el) {
  _.bindAll(this,
    "last_quotes_fetch_change",
    "render"
  );

  // element
  this.el = el;

  // events
  App.StateManagerNotifier.on(
    "change:last_quotes_fetch",
    this.last_quotes_fetch_change
  );

  // initial render
  this.render();
}


//
//  Rendering
//
RandomQuote.prototype.render = function() {
  var quote = App.Storage.get_random_quote();
  var status;

  if (quote) {
    status = {
      total_quotes: App.Storage.get_quotes().length,
      quotes_seen: App.Storage.get_previous_random_quotes().length
    };

    this.el.innerHTML = Mustache.render(
      App.Helpers.get_template("modules-random-quote"),
      _.extend({ status: status }, quote)
    );

  } else if (!App.Storage.get_quotes_url()) {
    this.el.no_quote = true;
    this.el.innerHTML = '<p>No quotes collection has been setup yet.</p>';

  } else {
    this.el.no_quote = true;
    this.el.innerHTML = '<p>No quotes found.</p>';

  }
};


//
//  Event handlers
//
RandomQuote.prototype.last_quotes_fetch_change = function() {
  if (this.el.no_quote) this.render();
};



}());
