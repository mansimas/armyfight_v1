//  require underscore 
    var unit_stats = {
            sword: {
                hp: 1000,
                dmg: 25,
                def_inf: 55,
                def_hors: 5,
                def_arch: 30,
                speed: 10,
                type: 'inf',
                unit: 'sword'
            }
        };
    formations = {
        'ally': [
            {stats: unit_stats['sword'], column: 1, row: 1, 
            x: 56, y: 135, unit_type: 'ally' }
        ],
        'enemy': [
            {stats: unit_stats['sword'], column: 1, row: 1, 
            x: 92, y: 134, unit_type: 'enemy' }
        ]
    };
    ally = {};
    enemy = {};
    frame = 0;
    distance_x = 0;
    distance_y = 0;
    var unit = {};
    var army = {};

    function initiate() {
        var army_id = 0;
        var ally_length = formations['ally'].length;
        for(var row = 0; row < ally_length; row++) {
            army_id++;
            army[army_id] = {
                team: 1,
                stats: formations['ally'][row].stats,
                unit_type: formations['ally'][row].unit_type
            }
            var ally_row_y = parseInt(formations['ally'][row]['y']);
            var ally_row_row = parseInt(formations['ally'][row]['row']) + ally_row_y;
            for(var y = ally_row_y; y < ally_row_row; y++) {
                if(!_.has(ally, y)) {
                    var columns = {};
                } else {
                    columns = ally[y];
                }
                var ally_row_x = parseInt(formations['ally'][row]['x']);
                var ally_row_column = -parseInt(formations['ally'][row]['column']) + ally_row_x;
                for (var x = ally_row_x; x > ally_row_column; x--) {
                    var able_to_move = false;
                    if(
                        y == ally_row_y || x == ally_row_x || 
                        y == ally_row_row-1 || 
                        x == ally_row_column+1) {
                        able_to_move = true;
                    }
                    columns[x] = {
                        x: x,
                        y: y,
                        able_to_move: able_to_move,
                        move_y: 0,
                        move_x: 50,
                        direction_y: 0,
                        direction_x: 0,
                        target: undefined,
                        stopped: false,
                        attacking: 0,
                        killed: 0,
                        facedirection: 0,
                        frame: 16,
                        status: 0,
                        old_move_y: 0,
                        old_move_x: 0,
                        changed: false,
                        army_id: army_id
                    };
                }
                ally[y] = columns;
            }
        }
        var enemies_length = formations['enemy'].length;
        for(row = 0; row < enemies_length; row++) {
            army_id++;
            army[army_id] = {
                team: -1,
                stats: formations['enemy'][row].stats,
                unit_type: formations['enemy'][row].unit_type
            }
            var enemy_row_y = parseInt(formations['enemy'][row]['y']);
            var enemy_row_row = parseInt(formations['enemy'][row]['row']) + enemy_row_y;
            for( y = enemy_row_y; y < enemy_row_row; y++) {
                if(!_.has(enemy, y)) {
                    columns = {};
                } else {
                    columns = enemy[y];
                }
                var enemy_row_x = parseInt(formations['enemy'][row]['x']);
                var enemy_row_column = parseInt(formations['enemy'][row]['column']) + enemy_row_x;
                for (x = enemy_row_x; x < enemy_row_column; x++) {
                    var able_to_move = false;
                    if(
                        y == enemy_row_y || x == enemy_row_x || 
                        y == enemy_row_row-1 || 
                        x == enemy_row_column-1) {
                        able_to_move = true;
                    }
                    columns[x] = {
                        x: x,
                        y: y,
                        able_to_move: able_to_move,
                        move_y: 0,
                        move_x: 50,
                        direction_y: 0,
                        direction_x: 0,
                        target: undefined,
                        stopped: false,
                        attacking: 0,
                        killed: 0,
                        facedirection: 0,
                        frame: 16,
                        status: 0,
                        old_move_y: 0,
                        old_move_x: 0,
                        changed: false,
                        army_id: army_id
                    };
                }
                enemy[y] = columns;
            }
        }
    };

    console.log('aa');

    initiate();

    console.log('a');
    console.log(
        'ally', ally,
        'enemy', enemy,
        'frame', frame,
        'distance_x', distance_x,
        'distance_y', distance_y,
        'unit', unit,
        'army', army
    );



    // function calculate_units() {

    //     var numbers =       { ally: 0,         enemy: 0          };
    //     var group =         { ally: ally, enemy: enemy };

    //     _.each(['enemy', 'ally'], function(type) {
    //         _.each(group[type], function (val, y) {
    //             y = parseInt(y);
    //             var closest_y = self.iterate_Y(y, type);
    //             _.each(val, function (unit, x) {
    //                 if(unit) {
    //                     x = parseInt(x);
    //                     unit.setAllyEnemy(self.ally, self.enemy);
    //                     if (unit.survived()) {
    //                         unit.changed = false;

    //                         if ( unit.able_to_move && (unit['target'] == undefined || self.frame % 500 === 0) ){
    //                             var target = search_for_target(closest_y, self, unit);
    //                             unit['target'] = {x: target.x, y: target.y};
    //                             unit.changed = true;
    //                         }

    //                         if(unit.old_move_x != unit.move_x || unit.old_move_y != unit.move_y ) {
    //                             if(unit.status != 1) {
    //                                 unit.changed = true;
    //                                 unit.able_surroundings_to_move();
    //                             }
    //                             unit.status = 1;
    //                         } else {
    //                             if(unit.status != 0) {
    //                                 unit.changed = true;
    //                             } 
    //                             if(unit.able_to_move && !unit.can_move_somewhere()) {
    //                                 unit.able_to_move = false;
    //                             }
    //                             unit.status = 0;
    //                         }

    //                         if( (parseInt(x) != unit['x']) || (parseInt(y) != unit['y']) ) {
    //                             delete self[type][y][x];
    //                             if(_.isEmpty(self[type][y])) {
    //                                 delete self[type][y];
    //                             }
    //                             if(!_.has(self[type], unit['y'])) self[type][unit['y']] = {};
    //                         } 
    //                         numbers[type] ++;

    //                         self[type][unit['y']][unit['x']] = unit;
                           
    //                     } else {
    //                         delete self[type][y][x];
    //                         if(_.isEmpty(self[type][y])) {
    //                             delete self[type][y];
    //                         }
    //                     }
    //                 }
    //             });
    //         });
    //     });

    //     _.each(['enemy', 'ally'], function(type) {
    //         _.each(group[type], function (val, y) {
    //             y = parseInt(y);
    //             var closest_y = self.iterate_Y(y, type);
    //             _.each(val, function (unit, x) {
    //                 if(unit.changed) {
    //                     if(!_.has(self.changed_units, unit.y)) self.changed_units[unit.y] = {};
    //                     self.changed_units[unit.y][unit.x] = jQuery.extend({}, unit);  // slows down 100 times
    //                 }
    //             });
    //         });
    //     });

    //     countAlly  = numbers['ally'];
    //     countEnemy = numbers['enemy'];
    // };


    // function search_for_target(closest_y, self, unit) {

    //     if(!unit.targets[unit.target_id]) {
    //         closest_y = parseInt(closest_y);
    //         var y = parseInt(unit.y);
    //         var x = parseInt(unit.x);
    //         var type = unit.unit_type;
    //         if(closest_y != y) {
    //             var target = self.iterate_X(closest_y, x, type);
    //         } else {
    //             target = self.iterate_X_X(closest_y, x, type);
    //         }
    //         if (target == undefined) {
    //             if(closest_y != y) {
    //                 target = self.iterate_backwards_X_X(closest_y, x, type);
    //             } else {
    //                 target = self.iterate_backwards_X(closest_y, x, type);
    //             }
    //         }
    //     } else {
    //         target = {
    //             id: unit.target_id,
    //             x: unit.targets[unit.target_id].x,
    //             y: unit.targets[unit.target_id].y,
    //             time: unit.targets[unit.target_id].time,
    //             stats: {
    //                 hp: 1000000,
    //                 type: 'inf'
    //             },
    //             dmg: 0
    //         } 
    //     }
    //     return target;

        
    // }


    // function iterate_backwards_X(y, x, units) {
    //     y = String(y);
    //     var self = 
    //     if(units == 'ally')  return _.find(self.enemy[y], function (v, k) { return parseInt(k) <= x });
    //     if(units == 'enemy')  return _.find(self.ally[y], function (v, k) { return parseInt(k) >= x });
    // };

    // function iterate_backwards_X_X(y, x, units) {
    //     y = String(y);
    //     var self = 
    //     if(units == 'ally')  return _.find(self.enemy[y], function (v, k) { return parseInt(k) <= x });
    //     if(units == 'enemy')  return _.find(self.ally[y], function (v, k) { return parseInt(k) >= x });
    // };

    // function iterate_X(y, x, units) {
    //     y = String(y);
    //     var self = 
    //     if(units == 'ally')  return _.find(self.enemy[y], function (v, k) { return parseInt(k) >= x });
    //     if(units == 'enemy')  return _.find(self.ally[y], function (v, k) { return parseInt(k) <= x });
    // };

    // function iterate_X_X(y, x, units) {
    //     y = String(y);
    //     var self = 
    //     if(units == 'enemy') return _.find(ally[y],  function (v, k) { return parseInt(k) <= x });
    //     if(units == 'ally') return _.find(enemy[y],  function (v, k) { return parseInt(k) >= x });
    // };

    // function iterate_Y(y, units) {
    //     try {
    //         if (units == 'ally') {
    //             if (_.has(enemy, y)) {
    //                 return y;
    //             } else {
    //                 var direction = 0;
    //                 for (var i = 1; i < 300; i++) {
    //                     i = parseInt(i);
    //                     if (_.has(enemy, parseInt(y) + i)) {
    //                         direction = i;
    //                         break;
    //                     } else if (_.has(enemy, parseInt(y) - i)) {
    //                         direction = -i;
    //                         break;
    //                     }
    //                 }
    //                 if(direction > 0) {
    //                     var last = 0;
    //                     for (i = direction; i < 300; i++) {
    //                         i = parseInt(i);
    //                         if (_.has(enemy, parseInt(y) + i)) {
    //                             last = i;
    //                         } else {
    //                             return y + last;
    //                         }
    //                     }
    //                 } else if(direction < 0) {
    //                     last = 0;
    //                     for (i = direction; i > -300; i--) {
    //                         i = parseInt(i);
    //                         if (_.has(enemy, parseInt(y) + i)) {
    //                             last = i;
    //                         } else {
    //                             return y + last;
    //                         }
    //                     }
    //                 }
    //                 return y;
    //             }
    //         }
    //         else if (units == 'enemy') {
    //             if (_.has(ally, y)) {
    //                 return y;
    //             } else {
    //                 direction = 0;
    //                 for (i = 1; i < 300; i++) {
    //                     i = parseInt(i);
    //                     if (_.has(ally, parseInt(y) + i)) {
    //                         direction = i;
    //                         break;
    //                     } else if (_.has(ally, parseInt(y) - i)) {
    //                         direction = -i;
    //                         break;
    //                     }
    //                 }
    //                 if(direction > 0) {
    //                     last = 0;
    //                     for (i = direction; i < 300; i++) {
    //                         i = parseInt(i);
    //                         if (_.has(ally, parseInt(y) + i)) {
    //                             last = i;
    //                         } else {
    //                             return y + last;
    //                         }
    //                     }
    //                 } else if(direction < 0) {
    //                     last = 0;
    //                     for (i = direction; i > -300; i--) {
    //                         i = parseInt(i);
    //                         if (_.has(ally, parseInt(y) + i)) {
    //                             last = i;
    //                         } else {
    //                             return y + last;
    //                         }
    //                     }
    //                 }
    //                 return y;
    //             }
    //         }
    //     } catch(err) {
    //         console.log('iterate_Y', err, y, units);
    //     }
    // };



    // class Unit {
    //     'use strict';

    //     function Unit(x, y, stats, team, distance_x, distance_y, id, unit_type, targets, able_to_move) {
    //         x = x;
    //         y = y;
    //         move_y = 0;
    //         move_x = 50;
    //         direction_y = 0;
    //         direction_x = 0;
    //         target = undefined; //
    //         team = team; // try to remove / move to global army
    //         stopped = false; //
    //         stats = stats; // try to remove / move to global army
    //         attacking = 0; //
    //         killed = 0;
    //         facedirection = 0;  // try to remove
    //         frame = 16; // try to remove
    //         distance_x = distance_x;
    //         distance_y = distance_y;
    //         unit_type = unit_type;
    //         targets = targets; // try to remove / move to global army
    //         target_id = 0; // try to remove / move to global army
    //         waiting = false; // try to remove / move to global army
    //         waiting_time = 0; // try to remove / move to global army
    //         status = 0;
    //         old_move_y = 0;
    //         old_move_x = 0;
    //         able_to_move = able_to_move;
    //         changed= false;
    //     }

    //     Unit.prototype.survived = function() {
    //         if('stats']['hp'] < 1) {
    //             able_surroundings_to_move();
    //             return false;
    //         }
    //         old_move_y = move_y;
    //         old_move_x = move_x;
    //         check_forward();
    //         return true;
    //     };

    //     Unit.prototype.setAllyEnemy = function(ally, enemy) {
    //         if(team == 1) {
    //             ally = ally;
    //             enemy = enemy;
    //         } else {
    //             ally = enemy;
    //             enemy = ally;
    //         }
    //     };

    //     Unit.prototype.check_forward = function() {
    //         if(targets[target_id]) {
    //             waiting_time++;
    //         }
    //         if(targets[target_id] && targets[target_id].time < waiting_time) {
    //             waiting_time = 0;
    //             waiting = false;
    //             target_id++;
    //             target = undefined;
    //         } else if (stopped) {
    //             check_temporary_moves();
    //             if (attacking == 0) {
    //                 try_moving();
    //             } else {
    //                 if(attacking['stats']['hp'] > 0) {
    //                     if(team == 1) {
    //                         attacking['stats']['hp'] -= stats.dmg;
    //                     } else {
    //                         if(attacking['stats']['type'] == 'inf') {
    //                             attacking['stats']['hp'] -= stats.def_inf;
    //                         } else if(attacking['stats']['type'] == 'horse') {
    //                             attacking['stats']['hp'] -= stats.def_hors;
    //                         } else if(attacking['stats']['type'] == 'arch') {
    //                             attacking['stats']['hp'] -= stats.def_arch;
    //                         } else {
    //                             console.log('unexpected unit type');
    //                         }
    //                     }
    //                     if(attacking['attacking'] == 0) {
    //                         attacking['attacking'] = ally[y][x];
    //                         attacking['target'] = {x: x, y: y};
    //                         attacking['able_to_move'] = true;
    //                         attacking['stopped'] = true;
                           
    //                     }
    //                     if(attacking['stats']['hp'] < 1) {
    //                         killed += 1;
    //                         target = undefined;
    //                     }
    //                 } else if(attacking != 0) {
    //                     attacking = 0;
    //                     target = undefined;
    //                 }
    //             }
    //         } else {
    //             if (!find_opponent()) {
    //                 if(target && x == target['x'] && y == target['y']) {
    //                     waiting = true;
    //                 } else {
    //                     try_moving();
    //                 }
    //             }
    //         }
    //     };

    //     Unit.prototype.check_temporary_moves = function() {
    //         if(direction_y == 1 && move_y < 99) {
    //             if(attacking != 0 && attacking['move_y'] > move_y + 1) {
    //                 move_y += 'stats']['speed'];
    //             } else if (attacking == 0 && move_y < 99) {
    //                 move_y += 'stats']['speed'];
    //             }
    //         } else if(direction_y == -1 && move_y > 1) {
    //             if(attacking != 0 && attacking['move_y'] < move_y - 1) {
    //                 move_y -= 'stats']['speed'];
    //             } else if (attacking == 0 && move_y > 1) {
    //                 move_y -= 'stats']['speed'];
    //             }
    //         }
    //         if(direction_x == 1 && move_x < 99) {
    //             if(attacking != 0 && attacking['move_x'] > move_x + 1) {
    //                 move_x += 'stats']['speed'];
    //             } else if (attacking == 0 && move_x < 99) {
    //                 move_x += 'stats']['speed'];
    //             }
    //         } else if(direction_x == -1 && move_x > 1) {
    //             if(attacking != 0 && attacking['move_x'] < move_x - 1) {
    //                 move_x -= 'stats']['speed'];
    //             } else if (attacking == 0 && move_x > 1) {
    //                 move_x -= 'stats']['speed'];
    //             }
    //         }

    //     };

    //     Unit.prototype.try_moving = function() {
    //         stopped = false;
    //         attacking = 0;
    //         if (target) {
                
    //             move_forward();
    //             if(target['y'] > y) {
    //                 if (check_around_for_allies(1)) {
    //                     move_y_axis(1);
    //                 }
    //             } else if(target['y'] < y) {
    //                 if (check_around_for_allies(-1)) {
    //                     move_y_axis(-1);
    //                 }
    //             }
    //         }
    //     };

    //     Unit.prototype.move_y_axis = function(direction) {
    //         move_y += 'stats']['speed'] * direction;
    //         direction_y = direction;
    //         if (move_y > 99 || move_y < 1) {
    //             y += direction;
    //             move_y = move_y - (100 * direction);
    //         }
    //     };

    //     Unit.prototype.check_around_for_allies = function(direction) {
    //         var new_y = y + direction;
    //         if(ally[new_y] && ally[new_y][x]) {
    //             return false;
    //         }
    //         return true;
    //     };

    //     Unit.prototype.move_forward = function() {
    //         if(target['x'] > x) {
    //             if (!_.has(ally[y], x+1)) {
    //                 start_movements(1, 0, 2, 1);
    //             } else {
    //                 if (facedirection == 5) {
    //                     frame = 13;
    //                 } else {
    //                     frame = 3;
    //                 }
    //             }
    //         }
    //         else if(target['x'] < x)  {


    //             if (!_.has(ally[y], x-1)) {
    //                 if(status == 0) {
    //                     if(!_.has(ally[y], x-2)) {
    //                         start_movements(-1, 6, 4, 5);
    //                     }
    //                 } else {
    //                     start_movements(-1, 6, 4, 5);
    //                 }
    //             } else {
    //                 if (facedirection == 5) {
    //                     frame = 13;
    //                 } else {
    //                     frame = 3;
    //                 }
    //             }
    //         } else {
    //             if (target['y'] > y) {
    //                 facedirection = 7;
    //             } else if (target['y'] < y) {
    //                 facedirection = 3;
    //             }
    //         }
    //     };

    //     Unit.prototype.move_forward = function() {
    //         if(target['x'] > x) {
    //             if (!_.has(ally[y], x+1)) {
    //                 if(status == 0) {
    //                     if(!_.has(ally[y], x+2) ||
    //                         (_.has(ally[y], x+2) && ally[y][x+2].move_x > 50)) {
    //                         start_movements(1, 0, 2, 1);
    //                     } else fix_frame();
    //                 } else start_movements(1, 0, 2, 1);
    //             } else fix_frame();
    //         }
    //         else if(target['x'] < x)  {
    //             if (!_.has(ally[y], x-1)) {
    //                 if(status == 0) {
    //                     if(!_.has(ally[y], x-2) || 
    //                         (_.has(ally[y], x-2) && ally[y][x-2].move_x < 50)) {
    //                         start_movements(-1, 6, 4, 5);
    //                     } else fix_frame();
    //                 } else start_movements(-1, 6, 4, 5);
    //             } else fix_frame();
    //         } else {
    //             if (target['y'] > y) {
    //                 facedirection = 7;
    //             } else if (target['y'] < y) {
    //                 facedirection = 3;
    //             }
    //         }
    //     };

    //     Unit.prototype.fix_frame = function() {
    //         if (facedirection == 5) {
    //             frame = 13;
    //         } else {
    //             frame = 3;
    //         }
    //     }

    //     Unit.prototype.start_movements = function(axis, face1, face2, face3) {
    //         frame--;
    //         move_x_axis(axis);
    //         if (target['y'] > y) {
    //             facedirection = face1;
    //         } else if (target['y'] < y) {
    //             facedirection = face2;
    //         } else {
    //             facedirection = face3;
    //         }
    //     }

    //     Unit.prototype.move_x_axis = function(direction) {
    //         move_x += 'stats']['speed'] * direction;
    //         direction_x = direction;
    //         if (move_x > 99 || move_x < 1) {
    //             x += direction;
    //             move_x = move_x - (100 * direction);
    //         }
    //     };

    //     Unit.prototype.find_opponent = function() {
    //         if(target) {
    //             if(target['y'] == y) {
    //                 var y_array = [0, 1, -1];
    //                 for(var yy = 0; yy < 3; yy++) {
    //                     var new_y = y + y_array[yy];
    //                     var new_x = x + direction_x;
    //                     if(enemy[new_y]) {
    //                         if(enemy[new_y][new_x]) {
    //                             attacking = enemy[new_y][new_x];
    //                             target = enemy[new_y][new_x];
    //                             stopped = true;
    //                             return true; 
    //                         }
    //                     }
    //                 }
    //             } else {
    //                 var new_y = y + direction_y;
    //                 if(enemy[new_y] && enemy[new_y][x]) {
    //                     attacking = enemy[new_y][x];
    //                     target = {x: x, y: new_y};
    //                     stopped = true;
    //                     return true; 
    //                 }
    //             }
    //         } else {
    //             var new_y = y;
    //             var new_x = x + direction_x;
    //             if(enemy[new_y]) {
    //                 if(enemy[new_y][new_x]) {
    //                     attacking = enemy[new_y][new_x];
    //                     target = {x: new_x, y: new_y};
    //                     stopped = true;
    //                     return true; 
    //                 }
    //             }

    //         }
    //         return false;
    //     };


    //     Unit.prototype.able_surroundings_to_move = function() {
    //         for(var xx = -1; xx < 2; xx+= 2) {
    //             var new_x_1 = x+xx;
    //             var new_y_1 = y+xx;
    //             if(_.has(ally[y], new_x_1)) {
    //                 ally[y][new_x_1].able_to_move = true;

    //             }
    //             if(_.has(ally, new_y_1) && _.has(ally[new_y_1], x)) {
    //                 ally[new_y_1][x].able_to_move = true;
    //             }
    //         }
    //     }

    //     Unit.prototype.can_move_somewhere = function() {
    //         var ability_to_move = false;
    //         for(var xx = -1; xx < 2; xx+= 2) {
    //             if(!_.has(ally[y], x+xx)) ability_to_move = true;
    //             if(!_.has(ally[y+xx], x)) ability_to_move = true;
    //         }
    //         return ability_to_move;
    //     }

    //     Unit.prototype.draw = function (ctx, unit_width, drag_x, drag_y, image, graphics_width, graphics_height) {
    //         var xx = (x * distance_x) + (distance_x / 100 * move_x) - drag_x;
    //         var yy = (y * distance_y) + (distance_y / 100 * move_y) - drag_y;

    //         if (stats['unit'] == 'sword') {
    //             if (team == 1) {
    //                 if (attacking == 0) {
    //                   var newimage = image.m_r;
    //                 } else {
    //                   newimage = image.h_r;
    //                 }
    //             } else {
    //                 if (attacking == 0) {
    //                   newimage = image.m_b;
    //                 } else {
    //                   newimage = image.h_b;
    //                 }
    //             }


    //             if (frame > 0) {
    //                 var swox = frame * graphics_width;
    //             } else {
    //                 swox = 0;
    //                 frame = 16
    //             }

    //             var swoy = facedirection * graphics_height;
    //             ctx.drawImage(
    //                 newimage, 
    //                 swox, 
    //                 swoy, 
    //                 graphics_width, 
    //                 graphics_height, 
    //                 xx - unit_width*2.3  , 
    //                 yy - unit_width, 
    //                 unit_width*5, 
    //                 unit_width*3
    //             );

    //         } else {
    //             ctx.drawImage(image, xx, yy, unit_width, unit_width);

    //         }
    //     };

    //     return Unit;
    // };
