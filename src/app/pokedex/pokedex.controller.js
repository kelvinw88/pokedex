(function () {
	'use strict';

	angular
		.module('pokedex')
		.controller('PokedexController', PokedexController);

	function PokedexController(pokedexFactory) {
		var vm = this;
		var host = 'http://pokeapi.co';
		vm.pokemon = {};
    vm.result = {};
		vm.searchByName = function (input) {
			input = input.toLowerCase();
			vm.pokemon = {};
      if (input) {
        pokedexFactory.getPokemonByName(input)
          .then(function (data) {
            vm.result = data;

            vm.pokemon = data.data;
						vm.pokemon.weakness = [];
						vm.pokemon.evolutionsList = [];
            getSprite(data.data.sprites[data.data.sprites.length - 1].resource_uri);
						getDescriptions(data.data.descriptions[0].resource_uri);
            angular.forEach(data.data.types, function (value) {
              getWeakness(value.resource_uri);
            })
						if (data.data.evolutions.length > 0){
							getEvolutions(data.data.evolutions[0].resource_uri);
						}

          })
          .catch(function (error) {
            vm.result = error;
          });
      } else {
        vm.result.status = 404;
      }

		};

		function getSprite(urn) {
			pokedexFactory.getInfo(urn)
				.then(function (data) {
					vm.pokemon.image = host + data.data.image;
				})
		}

		function getWeakness(urn) {
			pokedexFactory.getInfo(urn)
				.then(function (data) {
					vm.pokemon.weakness = vm.pokemon.weakness.concat(data.data.weakness);
				})
		}

		function getEvolutions(urn) {
			pokedexFactory.getInfo(urn)
				.then(function (data) {
					vm.pokemon.evolutionsList.push(data.data);
					if (data.data.evolutions.length > 0){
						getEvolutions(data.data.evolutions[0].resource_uri);
					}
				})
		}

		function getDescriptions(urn) {
			pokedexFactory.getInfo(urn)
				.then(function (data) {
					vm.pokemon.descriptions = data.data.description;
				})
		}



		// For Drag and Drop
		vm.draggableObjects = [];
		vm.droppedPokemon = [];

		vm.onDropComplete1 = function (data, evt) {
			var index = vm.droppedPokemon.indexOf(data);
			if (index == -1)
				vm.droppedPokemon.push(data);
		}

		var inArray = function (array, obj) {
			var index = array.indexOf(obj);
		}


	}
})();
