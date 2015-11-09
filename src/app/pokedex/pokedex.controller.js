(function () {
	'use strict';

	angular
		.module('pokedex')
		.controller('PokedexController', PokedexController);

	function PokedexController(pokedexFactory, $scope, $q) {
		var vm = this;
		var host = 'http://pokeapi.co';
		vm.pokemon = {};
		vm.result = {};
		vm.allPokemon = [];
		getAllPokemon();
		vm.displayPokemon = [];

		// Helpers

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
					if (data.data.evolutions.length > 0) {
						getEvolutions(data.data.evolutions[0].resource_uri);
					}
				})
		};

		function getEvolutionsV2(urn, index) {
			pokedexFactory.getInfo(urn)
				.then(function (data) {
					vm.displayPokemon[index].info.evolutionsList.push(data.data);
					if (data.data.evolutions.length > 0) {
						getEvolutionsV2(data.data.evolutions[0].resource_uri, index);
					}
				})
		}

		function getDescriptions(urn) {
			pokedexFactory.getInfo(urn)
				.then(function (data) {
					vm.pokemon.descriptions = data.data.description;
				})
		}



		// Paggination

		var has_more,
			per_page,
			offset,
			total,
			page;
		page = 1;
		per_page = 10;
		offset = 0;

		function getInfoPagination() {
			angular.forEach(vm.displayPokemon, function (pokemon, index) {
				vm.displayPokemon[index].info = {};
				pokedexFactory.getInfo('/' + pokemon.resource_uri)
					.then(function (data) {
						vm.displayPokemon[index].info = data.data;
						// Get Image
						pokedexFactory.getInfo(data.data.sprites[data.data.sprites.length - 1].resource_uri)
							.then(function (data) {
								vm.displayPokemon[index].info.image = "";
								vm.displayPokemon[index].info.image = host + data.data.image;
								vm.loading = false;
							});
						// Get Description
						pokedexFactory.getInfo(data.data.descriptions[0].resource_uri)
							.then(function (data) {
								vm.displayPokemon[index].info.descriptions = "";
								vm.displayPokemon[index].info.descriptions = data.data.description;
							});
						// Get Weakness
						angular.forEach(data.data.types, function (value) {
							pokedexFactory.getInfo(value.resource_uri)
								.then(function (data) {
									vm.displayPokemon[index].info.weakness = [];
									vm.displayPokemon[index].info.weakness = vm.displayPokemon[index].info.weakness.concat(data.data.weakness);
								})
						});
						// Get Evolutions
						if (data.data.evolutions.length > 0) {
							vm.displayPokemon[index].info.evolutionsList = [];
							getEvolutionsV2(data.data.evolutions[0].resource_uri, index);

						}

					})
			})
		}

		function getAllPokemon() {
			vm.loading = true;
			pokedexFactory.getAllPokemon()
				.then(function (data) {
					vm.allPokemon = data.data.pokemon
					total = vm.allPokemon.length;
					vm.displayPokemon = vm.allPokemon.slice(page - 1, per_page);
					getInfoPagination();
				});
		};

		vm.nextPage = function () {
			if ((offset + per_page) < total) {
				vm.loading = true;
				vm.displayPokemon = [];
				page = page + 1;
				offset = (page - 1) * per_page;
				vm.displayPokemon = vm.allPokemon.slice(offset, offset + per_page);
				getInfoPagination();
			}
		}

		vm.backPage = function () {
			if (offset > 0) {
				vm.loading = true;
				vm.displayPokemon = [];
				page = page - 1;
				offset = (page - 1) * per_page;
				vm.displayPokemon = vm.allPokemon.slice(offset, offset + per_page);
				getInfoPagination();
			}
		}
		vm.selectPokemon = function (index) {
			vm.result.status = 200;
			vm.pokemon = vm.displayPokemon[index].info;
		}
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
						if (data.data.evolutions.length > 0) {
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

		// For Drag and Drop
		vm.draggableObjects = [];
		vm.droppedPokemon = [];

		vm.onDropComplete1 = function (data, evt) {
			var index = vm.droppedPokemon.indexOf(data);
			if (index == -1 && vm.droppedPokemon.length < 2) {
				vm.droppedPokemon.push(angular.copy(data));
			}
			if (vm.droppedPokemon.length === 2) {
				if (vm.droppedPokemon[0].hp > vm.droppedPokemon[1].hp) {
					vm.droppedPokemon[0].hpCompare = 1;
					vm.droppedPokemon[1].hpCompare = 0;
				} else {
					vm.droppedPokemon[0].hpCompare = 0;
					vm.droppedPokemon[1].hpCompare = 1;
				}

				if (vm.droppedPokemon[0].attack > vm.droppedPokemon[1].attack) {
					vm.droppedPokemon[0].atkCompare = 1;
					vm.droppedPokemon[1].atkCompare = 0;
				} else {
					vm.droppedPokemon[0].atkCompare = 0;
					vm.droppedPokemon[1].atkCompare = 1;
				}

				if (vm.droppedPokemon[0].defense > vm.droppedPokemon[1].defense) {
					vm.droppedPokemon[0].defCompare = 1;
					vm.droppedPokemon[1].defCompare = 0;
				} else {
					vm.droppedPokemon[0].defCompare = 0;
					vm.droppedPokemon[1].defCompare = 1;
				}

				// check Weakness for vm.droppedPokemon[0]
				angular.forEach(vm.droppedPokemon[0].weakness, function (weakness, weaknessIndex) {
					angular.forEach(vm.droppedPokemon[1].types, function (type, typeIndex) {
						if (weakness.name === type.name) {
							vm.droppedPokemon[0].weakness[weaknessIndex].match = true
						}
					})
				});

				// check Weakness for vm.droppedPokemon[1]
				angular.forEach(vm.droppedPokemon[1].weakness, function (weakness, weaknessIndex) {
					angular.forEach(vm.droppedPokemon[0].types, function (type, typeIndex) {
						if (weakness.name === type.name) {
							vm.droppedPokemon[1].weakness[weaknessIndex].match = true
						}
					})
				});

			}
		}

		var inArray = function (array, obj) {
			var index = array.indexOf(obj);
		}


	}
})();
