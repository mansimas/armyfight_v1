var apc = angular.module('apc', ['Ctrl1']);

var ctrl1 = angular.module('Ctrl1', []);

ctrl1.controller('fight', ['$scope', '$interval', '$http', '$timeout',
    function($scope, $interval, $http, $timeout) {
        "use strict";

        $scope.ally_formation = [];
        $scope.enemy_formation = [];
        $scope.canvas_width = 1200;
        $scope.canvas_height = 750;
        $scope.multiplied = 1;
        $scope.unit_width = 3;
        $scope.distance_x = 4;
        $scope.distance_y = 4;
        var drag_screen = false;
        var drag_x_first = 0;
        var drag_x = 0;
        var drag_y_first = 0;
        var drag_y = 0;
        var background_canvas  = document.getElementById("background");
        var background_canvas_ctx = background_canvas.getContext("2d");

        var canvas  = document.getElementById("game");
        var ctx = canvas.getContext("2d");

        var image = {
            ground  : document.getElementById("ground")
        };

        $scope.canvas_size_changed = function() {
            background_canvas_ctx.canvas.width = $scope.canvas_width;
            background_canvas_ctx.canvas.height = $scope.canvas_height;
            background_canvas_ctx_drawing();
            ctx.canvas.width = $scope.canvas_width;
            ctx.canvas.height = $scope.canvas_height;
        }


        $scope.draw_units = function() {
        	var units_length = $scope.ally_formation.length;

	        for(var row = 0; row < units_length; row++) {
	        	var unit = $scope.ally_formation[row];

    	        var xx = (unit.x * $scope.distance_x) + ($scope.distance_x / 100 * 0) - drag_x;
		        var yy = (unit.y * $scope.distance_y) + ($scope.distance_y / 100 * 0) - drag_y;

				ctx.fillStyle="#ec5840";
				ctx.fillRect(
					xx,yy,$scope.unit_width,$scope.unit_width
				);
				
	        }
        }

        $scope.max_screen = function() {
            $scope.canvas_width =  $(window).width() - $(window).width()/3;
            $scope.canvas_height =  $(window).height() - $(window).height()/10;
            $scope.canvas_size_changed();
            background_canvas_ctx.clearRect(0, 0, $scope.canvas_width, $scope.canvas_height);
            background_canvas_ctx_drawing();
        }

        function clear_canvas() {
            ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
            // if(!_.isEmpty(core)) core.resetCounts();
        }

        function background_canvas_ctx_drawing() {
        	var ground_size = 100;
            var map_width = $scope.multiplied * 100;
            var maps_x_direction = Math.ceil($scope.canvas_width/100/$scope.multiplied) + 1;
            var maps_y_direction = Math.ceil($scope.canvas_height/100/$scope.multiplied) + 1;

            if(drag_x > 0) {
                var drag_direction_x = 1;
            } else if (drag_x < 0) {
                var drag_direction_x = -1;
            } else {
                var drag_direction_x = 0;
            }
            if(drag_y > 0) {
                var drag_direction_y = 1;
            } else if (drag_y < 0) {
                var drag_direction_y = -1;
            } else {
                var drag_direction_y = 0;
            }

            for(var x = -1; x < maps_x_direction; x++) {
                for(var y = -1; y < maps_y_direction; y++) {
                    background_canvas_ctx.drawImage(
                        image.ground, 
                        0, 
                        0,
                        ground_size,
                        ground_size,
                        x * map_width - drag_x + drag_direction_x * map_width * Math.ceil( drag_x / map_width * drag_direction_x ), 
                        y * map_width - drag_y + drag_direction_y * map_width * Math.ceil( drag_y / map_width * drag_direction_y ),
                        map_width, 
                        map_width 
                    );
                }
            }
        }

        $scope.change_stats = function() {
            // for(var x = 0; x < $scope.ally_formation.length; x++) {
            //     $scope.ally_formation[x].stats = $scope.unit_stats[$scope.ally_formation[x].unit];
            // }
            // for(x = 0; x < $scope.enemy_formation.length; x++) {
            //     $scope.enemy_formation[x].stats = $scope.unit_stats[$scope.enemy_formation[x].unit];
            // }
            // $scope.formation_changed();
        };

        $scope.add_attacker_army = function() {

        	$scope.max_screen();

            var stats = {
                hp: 1000,
                dmg: 25,
                def_inf: 55,
                def_hors: 5,
                def_arch: 30,
                type: 'inf',
                unit: 'sword'
            };

            $scope.ally_formation.push(
            	{unit: 'sword', stats: stats, column: 20, row: 20, x: 40, y: 10 }
            );

            new_army_creation('attacker');
        };

        $scope.add_defender_army = function() {
        	$scope.max_screen();

			var stats = {
                hp: 1000,
                dmg: 25,
                def_inf: 55,
                def_hors: 5,
                def_arch: 30,
                type: 'inf',
                unit: 'sword'
            };

            $scope.enemy_formation.push(
            	{unit: 'sword', stats: stats, column: 20, row: 20, x: 55, y: 20 }
            );

            new_army_creation('defender');
        };

        function new_army_creation(army) {

            var url = "/armies/new";
            var data = army;

		    $http.get(url, data).then(function(response) {
		        // $scope.fight_name = response.data.message;
		    });
        }

	    angular.element(document).ready(function () {
	    	$timeout($scope.max_screen, 500);
	    });


}]);