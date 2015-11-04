(function() {
  'use strict';

  angular
    .module('pokedex')
    .run(runBlock);

  /** @ngInject */
  function runBlock($log) {

    $log.debug('runBlock end');
  }

})();
