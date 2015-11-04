(function() {
  'use strict';

  angular
    .module('pokedex')
    .controller('PokedexController', PokedexController);

  function PokedexController($timeout, webDevTec, toastr, pokedexFactory) {
    var vm = this;

    vm.searchByName = function(input){
      input = input.toLowerCase();
      pokedexFactory.getPokemonByName(input)
        .then(function(data){
          vm.result = data;
        })
        .catch(function(error){
          vm.result = error;
        });
    };

  }
})();
