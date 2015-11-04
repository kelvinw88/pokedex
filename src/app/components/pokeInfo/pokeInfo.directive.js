(function() {
  'use strict';

  angular
    .module('pokedex')
    .directive('pokeInfo', pokeInfo);

  /** @ngInject */
  function pokeInfo() {
    var directive = {
      restrict: 'E',
      templateUrl: 'app/components/pokeInfo/pokeInfo.html',
      scope: {
          pokemon: '='
      },
      controller: PokeInfoCtrl,
      controllerAs: 'vm',
      bindToController: true
    };

    return directive;

    /** @ngInject */
    function PokeInfoCtrl($scope) {
      var vm = this;
      $scope.$watch('vm.pokemon', function(current,original){
        vm.pokemon = current;
      })
    }
  }

})();
