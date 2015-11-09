(function() {
  'use strict';

  angular
    .module('pokedex')
    .factory('pokedexFactory', pokedexFactory);

  /** @ngInject */
  function pokedexFactory($http) {
    var apiHost = 'http://pokeapi.co';

    return {
      getAllPokemon: function(){
        return $http.get( apiHost + '/api/v1/pokedex/1', { cache: true})
      },
      getPokemonByName: function(name){
        return $http.get( apiHost + '/api/v1/pokemon/' + name, { cache: true})
      },
      getInfo: function(urn){
        return $http.get(apiHost + urn, { cache: true})
      }
    };

  }
})();
