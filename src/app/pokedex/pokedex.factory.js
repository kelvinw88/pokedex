(function() {
  'use strict';

  angular
    .module('pokedex')
    .factory('pokedexFactory', pokedexFactory);

  /** @ngInject */
  function pokedexFactory($http) {
    var apiHost = 'http://pokeapi.co/api/v1/pokemon/';

    return {
      getPokemonByName: function(name){
        return $http.get('http://pokeapi.co/api/v1/pokemon/' + name)
      }
    };

  }
})();
