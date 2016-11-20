var app = angular.module('app', ['Ctrl']);

var ctrl = angular.module('Ctrl', ['core', 'unit_data', 'ajax']);

ctrl.controller('game', ['$scope', '$interval', '$http', '$timeout', 'core', 'unit_data', 'ajax',
    function($scope, $interval, $http, $timeout, Core, UnitData, Ajax) {
        "use strict";

        var ajax = new Ajax();
        var ud = new UnitData();
        var graphic_settings = ud.image_stats();
        $scope.attacking = false;
        $scope.visible = false;
        $scope.countAlly = 0;
        $scope.countEnemy = 0;
        $scope.unit_for_stats_change = {};
        $scope.formations = ud.get_formations('both');
        $scope.images_to_show = 2;
        $scope.army_view = 3;
        $scope.frame = 0;

    //
    // Mouse events
    //
        ud.canvas.addEventListener('mousedown', function(evt) { 
            prepare_selected_army(ud.mouse_down(evt)); 
        }, false);

        ud.canvas.addEventListener('mouseup', function(evt) { 
            ud.mouse_up(evt); 
            if(ud.set_target && !_.isEmpty($scope.unit_for_stats_change) && ud.set_target_cursor(evt)) { 
                $scope.add_target_to_army(ud.getMousePos(ud.canvas, evt)); 
            }
        }, false);

        ud.canvas.addEventListener('mousemove', function(evt) {
            var mouse_move = ud.mouse_move(evt);

            if(mouse_move[0] == 'change_formation') ud.formation_changed();
            else if (mouse_move[0] == 'giving_result') {
                var result = mouse_move[1];
                $scope.formations[result.type][result.id].x = result.x;
                $scope.formations[result.type][result.id].y = result.y;
                $scope.unit_for_stats_change = $scope.formations[result.type][result.id];
                ud.formation_changed();
            }
        });

        function prepare_selected_army(value) {
            if(value == 1) {
                var selected = ud.selected_army;
                $scope.unit_for_stats_change = $scope.formations[selected.unit_type][selected.id];
                ud.formation_changed();
            }
        }

    //
    // Fight edit functions
    //
        $scope.add_army = function(formation) {
            $scope.formations[formation].push(ud.get_formations(formation)[formation][0]);
            ud.formation_changed();
        };

        $scope.remove = function(key, formation) {
            if($scope.unit_for_stats_change.unit_type == formation && $scope.unit_for_stats_change.id == key) {
                $scope.unit_for_stats_change = {};
            }
            $scope.formations[formation].splice(key, 1);
            ud.remove_army(key, formation);
        };

        $scope.change_stats = function(key, type) {
            var stats = ud.do_clone(ud.unit_stats[$scope.formations[type][key].unit]);
            $scope.formations[type][key].stats = stats;
            ud.formation_changed();
        };

        $scope.center_army = function() { ud.center_army($scope.unit_for_stats_change); }
        $scope.edit_army_view = function(number) { return number == $scope.army_view; }
        $scope.remove_target = function(key) { $scope.unit_for_stats_change.targets.splice(key, 1); }

        $scope.enable_targeting = function() { 
            ud.set_target = !ud.set_target; 
            if(ud.set_target == false) { animate(); }
        }

        $scope.add_target_to_army = function(mouse_pos) {
            ud.set_target = false; 
            $scope.unit_for_stats_change.targets.push({ 
                x: mouse_pos.x + ud.drag_x, 
                y: mouse_pos.y + ud.drag_y,
                time: 500 });
            animate();
        }

        $scope.change_unit_stats = function(unit, id) {
            ud.selected = $scope.formations[unit][id];
            ud.selected.unit_type = unit;
            ud.selected.id = id;
            $scope.unit_for_stats_change = $scope.formations[unit][id];
            $scope.unit_for_stats_change.unit_type = unit;
            $scope.unit_for_stats_change.id = id;
            ud.formation_changed();
        };

        $scope.find_class = function(key, direction) {
            if($scope.unit_for_stats_change.unit_type == direction &&
                $scope.unit_for_stats_change.id == key) {
                return 'btn btn-success';
            } else return 'btn btn-primary';
        }

    //
    // Fight watch functions
    //
        $scope.start_attack = function() {
            $scope.attacking = !$scope.attacking;
            if(ud.first_attack) {
                $scope.visible = false;
                $scope.stats_visible = false;
                ud.first_attack = false;
            }
        };

        $scope.deselect_army = function() {
            $scope.unit_for_stats_change = {};
            ud.deselect_army();
        };

        $scope.change_speed = function(speed) {
            ud.loop_speed = speed;
            $interval.cancel( $scope.promise );
            start_animation_loop();
        };

        $scope.change_speed_button = function(speed) {
            if(ud.loop_speed == speed) return 'btn btn-success';
            else return 'btn btn-primary';
        }

        function set_graphics(number) {
            $timeout(load_new_images, graphic_settings[number].time);
            $scope.images_to_show = graphic_settings[number].images_to_show;
            ud.image_graphics_width = graphic_settings[number].image_graphics_width;
            ud.image_graphics_height = graphic_settings[number].image_graphics_height;
        }

        function load_new_images() {
            ud.image['sword'] = ud.get_image_data($scope.images_to_show);
            ud.redraw_core();
        }

        $scope.plus_size = function()  { ud.plus_size(); };
        $scope.minus_size = function() { ud.minus_size(); };
        $scope.low_graphics = function()    { set_graphics(2); };
        $scope.normal_graphics = function() { set_graphics(1); };
        $scope.best_graphics = function()   { set_graphics(0); };

    //
    // ng-init functions
    //
        $scope.new_fight_starting = function() {
            $scope.formations = ud.get_formations('both');
            submit_initial_formations();
            $scope.saved = true;
        };

        function submit_initial_formations() {
            _.each(['enemy', 'ally'], function(type) {
                for(var x = 0; x < $scope.formations[type].length; x++) {
                    $scope.formations[type][x].stats = ud.do_clone(ud.unit_stats[$scope.formations[type][x].unit]);
                }
            });
        }

        $scope.fight_editing = function(id) {
            ud.editing = true;
            set_initial_data(id)
        };

        $scope.fight_playing = function(id) {
            ud.editing = false;
            set_initial_data(id)
        };

        function set_initial_data(id) {
            $scope.fight_id = id;
            $scope.saved = true;
            ajax_get_armies();
        }

    //
    // ajax functions
    //
        $scope.save_fight = function() {
            if($scope.fight_name) {
                if($scope.fight_id == undefined) ajax_add_fight();
                else {
                    ajax.delete_all_armies($scope.fight_id);
                    ajax.edit_fight($scope.fight_id, $scope.fight_name);
                    
                    ajax.flush_armies_to_db($scope.formations, $scope.fight_id);
                }
                $scope.saved = true;
            } else {
                var text = "";
                var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
                for( var i=0; i < 5; i++ )
                    text += possible.charAt(Math.floor(Math.random() * possible.length));
                $scope.fight_name = text;
                $scope.save_fight();
            }
        };

        function ajax_add_fight() {
            ajax.add_fight($scope.fight_name, function(response){
                $scope.fight_id = response.data.fight;
                ajax.flush_armies_to_db($scope.formations, $scope.fight_id);
            });
        }

        function ajax_get_armies() {
            ajax.get_armies($scope.fight_id, function(response){
                $scope.fight_name = response.name;
                $scope.formations = response.formations;
            });
        }

    //
    // Other events
    //
        $(window).on("resize.doResize", function (){
          $scope.$apply(function(){
            ud.edit_window_size();
          });
        });

        $scope.$watch('formations', function(newVal, oldVal){
            $scope.saved = false;
            ud.formations = $scope.formations;
            if(!_.isEmpty(ud.core)){
                $scope.countAlly = ud.core.getCountAlly();
                $scope.countEnemy = ud.core.getCountEnemy();
            }
        }, true);

        $scope.$watch('unit_for_stats_change', function(newVal, oldVal){
            if(!ud.first_attack) {
                ud.unit_for_stats_change = $scope.unit_for_stats_change;
                ud.formation_changed();
            }
        }, true);

        $scope.log = function() { ud.log(); };

    //
    // Fight begin functions
    //
        function start_animation_loop() {
            ud.start_animation_loop();
            $scope.promise = $interval(function() {
                do_interval();
            }, ud.loop_speed );
        }

        function do_interval() {
            if($scope.attacking == true) {
                $scope.animate();
            }
        }

        $scope.animate = function() {
            ud.animate();
            ud.frame ++;
            console.log(ud.frame);
            $scope.countAlly = ud.core.getCountAlly();
            $scope.countEnemy = ud.core.getCountEnemy();
        }

        $scope.frame = function() {
            return ud.frame;
        }

    //
    // Document starting
    //
        angular.element(document).ready(function () {
            $timeout(load_all_images, 1000);
        });

        function load_all_images() {
            ud.generate_core(ud.formations, {}, {});
            start_animation_loop();
            ajax.count_fight_watches($scope.fight_id);
        };

}]);