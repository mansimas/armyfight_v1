var iteration = angular.module('iteration', ['helper']);
iteration.factory('iteration', ['helper', function (Helper) {
    'use strict';

    function Iteration() {}

    Iteration.prototype = new Helper();

    Iteration.prototype.calculate_units = function() {

        var self = this;

        var numbers =       { ally: 0,         enemy: 0          };
        var group =         { ally: self.ally, enemy: self.enemy };

        _.each(['enemy', 'ally'], function(type) {
            _.each(group[type], function (val, y) {
                y = parseInt(y);
                var closest_y = self.iterate_Y(y, type);
                _.each(val, function (unit, x) {
                    if(unit) {
                        x = parseInt(x);
                        unit.setAllyEnemy(self.ally, self.enemy);
                        if (unit.survived()) {
                            unit.changed = false;

                            if ( unit.able_to_move && (unit['target'] == undefined || self.frame % 500 === 0) ){
                                var target = search_for_target(closest_y, self, unit);
                                unit['target'] = {x: target.x, y: target.y};
                                unit.changed = true;
                            }

                            if(unit.old_move_x != unit.move_x || unit.old_move_y != unit.move_y ) {
                                if(unit.status != 1) {
                                    unit.changed = true;
                                    unit.able_surroundings_to_move();
                                }
                                unit.status = 1;
                            } else {
                                if(unit.status != 0) {
                                    unit.changed = true;
                                } 
                                if(unit.able_to_move && !unit.can_move_somewhere()) {
                                    unit.able_to_move = false;
                                }
                                unit.status = 0;
                            }

                            if( (parseInt(x) != unit['x']) || (parseInt(y) != unit['y']) ) {
                                delete self[type][y][x];
                                if(_.isEmpty(self[type][y])) {
                                    delete self[type][y];
                                }
                                if(!_.has(self[type], unit['y'])) self[type][unit['y']] = {};
                            } 
                            numbers[type] ++;

                            unit.draw(
                                self.ctx, self.unit_width, self.drag_x, self.drag_y, 
                                self.image[unit['stats']['unit']], self.image_graphics_width, self.image_graphics_height
                            );

                            self[type][unit['y']][unit['x']] = unit;
                           
                        } else {
                            delete self[type][y][x];
                            if(_.isEmpty(self[type][y])) {
                                delete self[type][y];
                            }
                            var random_direction = Math.floor(Math.random() * 8);
                            if(unit.stats.unit == 'sword') {
                                self.died_units.push([{
                                        x: unit.x,
                                        y: unit.y,
                                        move_y: unit.move_y,
                                        team: unit.team,
                                        random_direction: random_direction,
                                        move_x: unit.move_x,
                                        unit: unit.stats.unit
                                    }, 16]
                                );
                            }
                        }
                    }
                });
            });
        });

        _.each(['enemy', 'ally'], function(type) {
            _.each(group[type], function (val, y) {
                y = parseInt(y);
                var closest_y = self.iterate_Y(y, type);
                _.each(val, function (unit, x) {
                    if(unit.changed) {
                        if(!_.has(self.changed_units, unit.y)) self.changed_units[unit.y] = {};
                        self.changed_units[unit.y][unit.x] = jQuery.extend({}, unit);  // slows down 100 times
                    }
                });
            });
        });

        this.countAlly  = numbers['ally'];
        this.countEnemy = numbers['enemy'];
    };

// {
//     5: {
//         19: {y: 5, x: 19},
//         20: {y: 5, x: 20},
//         21: {y: 5, x: 20},
//     },
//     44: {
//         -50: {y: 44, x: -50},
//         -49: {y: 44, x: -49},
//         -48: {y: 44, x: -48},
//     },
// }


// {
//     4: {
//         18: {y: 4, x: 18},
//         19: {y: 4, x: 19},
//         20: {y: 4, x: 20},
//     },
//     45: {
//         -50: {y: 44, x: -50},
//         -49: {y: 44, x: -49},
//         -48: {y: 44, x: -48},
//     },
// }




    function search_for_target(closest_y, self, unit) {

        if(!unit.targets[unit.target_id]) {
            closest_y = parseInt(closest_y);
            var y = parseInt(unit.y);
            var x = parseInt(unit.x);
            var type = unit.unit_type;
            if(closest_y != y) {
                var target = self.iterate_X(closest_y, x, type);
            } else {
                target = self.iterate_X_X(closest_y, x, type);
            }
            if (target == undefined) {
                if(closest_y != y) {
                    target = self.iterate_backwards_X_X(closest_y, x, type);
                } else {
                    target = self.iterate_backwards_X(closest_y, x, type);
                }
            }
        } else {
            target = {
                id: unit.target_id,
                x: unit.targets[unit.target_id].x,
                y: unit.targets[unit.target_id].y,
                time: unit.targets[unit.target_id].time,
                stats: {
                    hp: 1000000,
                    type: 'inf'
                },
                dmg: 0
            } 
        }
        return target;

        
    }

    function getLength(arr) {
        return Object.keys(arr).length;
    }

    Iteration.prototype.redraw_units = function() {
        var new_positions = { ally: {},        enemy: {}         };
        var numbers =       { ally: 0,         enemy: 0          };
        var group =         { ally: this.ally, enemy: this.enemy };
        var self = this;

        _.each(['ally', 'enemy'], function(type) {
            _.each(group[type], function (val, y) {
                y = parseInt(y);
                _.each(val, function (unit, x) {
                    unit.setAllyEnemy(self.ally, self.enemy);
                    numbers[type]++;
                    unit.distance_x = self.distance_x;
                    unit.distance_y = self.distance_y;
                    unit.draw(self.ctx, self.unit_width, self.drag_x, self.drag_y, self.image[unit['stats']['unit']], 
                        self.image_graphics_width, self.image_graphics_height);
                    if (!_.has(new_positions[type], unit['y'])) {
                        new_positions[type][unit['y']] = {};
                        new_positions[type][unit['y']][unit['x']] = unit;
                    } else {
                        new_positions[type][unit['y']][unit['x']] = unit;
                    }
                });
            });
        });

        this.ally       = new_positions['ally'];
        this.enemy      = new_positions['enemy'];
        this.countAlly  = numbers['ally'];
        this.countEnemy = numbers['enemy'];
    };

 

    return Iteration;
}]);