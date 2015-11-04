(function() {
  'use strict';

  angular
    .module('pokedex')
    .factory('pokedexFactory', pokedexFactory);

  /** @ngInject */
  function pokedexFactory($http) {
    var apiHost = 'http://pokeapi.co';

    return {
      getPokemonByName: function(name){
        return $http.get( apiHost + '/api/v1/pokemon/' + name)
      },
      getInfo: function(urn){
        return $http.get(apiHost + urn)
      }
    };

  }
})();
