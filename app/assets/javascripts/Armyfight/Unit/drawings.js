var drawings = angular.module('drawings', ['death_canvas']);
drawings.factory('drawings', ['death_canvas', function (DeathCanvas) {
    'use strict';

    function Drawings() {}

    Drawings.prototype = new DeathCanvas();

    return Drawings;
}]);
