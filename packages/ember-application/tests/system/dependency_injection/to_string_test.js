import { ENV, context } from 'ember-environment'; // lookup, etc
import run from 'ember-metal/run_loop';
import Application from 'ember-application/system/application';
import EmberObject from 'ember-runtime/system/object';
import DefaultResolver from 'ember-application/system/resolver';
import { guidFor } from 'ember-metal/utils';

let originalLookup, App, originalModelInjections;

QUnit.module('Ember.Application Dependency Injection – toString', {
  setup() {
    originalModelInjections = ENV.MODEL_FACTORY_INJECTIONS;
    ENV.MODEL_FACTORY_INJECTIONS = true;

    originalLookup = context.lookup;

    run(() => {
      App = Application.create();
      context.lookup = {
        App: App
      };
    });

    App.Post = EmberObject.extend();
  },

  teardown() {
    context.lookup = originalLookup;
    run(App, 'destroy');
    ENV.MODEL_FACTORY_INJECTIONS = originalModelInjections;
  }
});

QUnit.test('factories', function() {
  let PostFactory = App.__container__.lookupFactory('model:post');
  equal(PostFactory.toString(), 'App.Post', 'expecting the model to be post');
});

QUnit.test('instances', function() {
  let post = App.__container__.lookup('model:post');
  let guid = guidFor(post);

  equal(post.toString(), '<App.Post:' + guid + '>', 'expecting the model to be post');
});

QUnit.test('with a custom resolver', function() {
  run(App, 'destroy');

  run(() => {
    App = Application.create({
      Resolver: DefaultResolver.extend({
        makeToString(factory, fullName) {
          return fullName;
        }
      })
    });
  });

  App.register('model:peter', EmberObject.extend());

  let peter = App.__container__.lookup('model:peter');
  let guid = guidFor(peter);

  equal(peter.toString(), '<model:peter:' + guid + '>', 'expecting the supermodel to be peter');
});
