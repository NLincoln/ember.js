/**
@module ember
@submodule ember-handlebars
*/

var get = Ember.get;

/**
  @class TabPaneView
  @namespace Ember
  @extends Ember.View
  @deprecated
*/
Ember.TabPaneView = Ember.View.extend({
  tabsContainer: Ember.computed(function() {
    return this.nearestOfType(Ember.TabContainerView);
  }).volatile(),

  isVisible: Ember.computed(function() {
    return get(this, 'viewName') === get(this, 'tabsContainer.currentView');
  }).property('tabsContainer.currentView').volatile(),

  init: function() {
    Ember.deprecate("Ember.TabPaneView is deprecated and will be removed from future releases.");
    this._super();
  }
});
