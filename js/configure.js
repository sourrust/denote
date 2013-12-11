require.config({
  shim: {
    backbone: {
      deps: ['underscore', 'jquery'],
      exports: 'Backbone'
    }
  },
  paths: {
    backbone: 'lib/backbone',
    jquery: 'lib/jquery',
    underscore: 'lib/lodash',
    template: '../templates'
  }
});
