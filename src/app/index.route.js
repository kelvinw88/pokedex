(function() {
  'use strict';

  angular
    .module('pokedex')
    .config(routerConfig);

  /** @ngInject */
  function routerConfig($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('home', {
        url: '/',
        templateUrl: 'app/main/main.html',
        controller: 'MainController',
        controllerAs: 'main'
      })
      .state('pokedex', {
        url: '/pokedex',
        templateUrl: 'app/pokedex/pokedex.html',
        controller: 'PokedexController',
        controllerAs: 'pokedex'
      });

    $urlRouterProvider.otherwise('/');
  }

})();
