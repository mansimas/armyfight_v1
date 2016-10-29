//  require underscore 
    var unit_stats = {
        sword: {
            dmg: 25,
            def_inf: 55,
            def_hors: 5,
            def_arch: 30,
            speed: 10,
            type: 'inf',
            unit: 'sword'
        }
    };

    var formations = {
        'ally': [
            {stats: unit_stats['sword'], column: 2, row: 2, 
            x: 56, y: 135, unit_type: 'ally' }
        ],
        'enemy': [
            {stats: unit_stats['sword'], column: 2, row: 2, 
            x: 92, y: 134, unit_type: 'enemy' }
        ]
    };

    var group = { ally: {}, enemy: {} };
    var frame = 0;
    var distance_x = 0;
    var distance_y = 0;
    var unit = {};
    var army = {};
    var stats = {};
    var target = {};
    var closest_y = 0;
    var string_y = 0;

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
                if(!_.has(group.ally, y)) {
                    var columns = {};
                } else {
                    columns = group.ally[y];
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
                        id: army_id,
                        hp: 100
                    };
                }
                group.ally[y] = columns;
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
                if(!_.has(group.enemy, y)) {
                    columns = {};
                } else {
                    columns = group.enemy[y];
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
                        id: army_id,
                        hp: 100
                    };
                }
                group.enemy[y] = columns;
            }
        }
    };






    function start() {
        initiate();

        console.log(
            'ally', group.ally,
            'enemy', group.enemy,
            'frame', frame,
            'distance_x', distance_x,
            'distance_y', distance_y,
            'unit', unit,
            'army', army
        );  
        for(var a = 0; a < 10; a++) {
            calculate_units();
            console.log('llllllllllllllllllllllllllll');
        }

    }

    start();

 
    function calculate_units() {

        _.each(['enemy', 'ally'], function(type) {
            _.each(group[type], function (val, y) {
                string_y = y;
                var y = parseInt(y);
                closest_y = iterate_Y(y, type);
                _.each(val, function (unitas, x) {

                    var x = parseInt(x);
                    unit = unitas;
                    stats = army[unit.id].stats;
                    setAllyEnemy();
                    target = unit.target;

                    if (survived()) {
                        unit.changed = false;

                        if ( unit.able_to_move && (unit.target  == undefined || frame % 500 === 0) ){
                            search_for_target();
                            unit.target = target;
                            unit.changed = true;
                        }

                        if(unit.old_move_x != unit.move_x || unit.old_move_y != unit.move_y ) {
                            if(unit.status != 1) {
                                unit.changed = true;
                                able_surroundings_to_move();
                            }
                            unit.status = 1;
                        } else {
                            if(unit.status != 0) {
                                unit.changed = true;
                            } 
                            if(unit.able_to_move && !can_move_somewhere()) {
                                unit.able_to_move = false;
                            }
                            unit.status = 0;
                        }

                        if( (x != unit.x) || (y != unit.y) ) {
                            delete group[type][y][x];
                            if(_.isEmpty(group[type][y])) {
                                delete group[type][y];
                            }
                            if(!_.has(group[type], unit.y)) group[type][unit.y] = {};
                        } 

                        group[type][unit.y][unit.x] = unit;
                       
                    } else {
                        delete group[type][y][x];
                        if(_.isEmpty(group[type][y])) {
                            delete group[type][y];
                        }
                    }

                    console.log(unit);
                });
            });
        });

    };



    function search_for_target() {
        target == undefined; 
        if(closest_y != unit.y) {
            target = iterate_X();
        } else {
            target = iterate_X_X();
        }
        if (target == undefined) {
            if(closest_y != unit.y) {
                target = iterate_backwards_X_X();
            } else {
                target = iterate_backwards_X();
            }
        }
    }


    function iterate_backwards_X() {
        if(army[unit.id].unit_type == 'ally')  return _.find(group.enemy[closest_y], function (v, k) { return parseInt(k) <= unit.x });
        if(army[unit.id].unit_type == 'enemy')  return _.find(group.ally[closest_y], function (v, k) { return parseInt(k) >= unit.x });
    };

    function iterate_backwards_X_X() {
        if(army[unit.id].unit_type == 'ally')  return _.find(group.enemy[closest_y], function (v, k) { return parseInt(k) <= unit.x });
        if(army[unit.id].unit_type == 'enemy')  return _.find(group.ally[closest_y], function (v, k) { return parseInt(k) >= unit.x });
    };

    function iterate_X() { 
        if(army[unit.id].unit_type == 'ally')  return _.find(group.enemy[closest_y], function (v, k) { return parseInt(k) >= unit.x });
        if(army[unit.id].unit_type == 'enemy')  return _.find(group.ally[closest_y], function (v, k) { return parseInt(k) <= unit.x });
    };

    function iterate_X_X() {
        if(army[unit.id].unit_type == 'enemy') return _.find(group.ally[closest_y],  function (v, k) { return parseInt(k) <= unit.x });
        if(army[unit.id].unit_type == 'ally') return _.find(group.enemy[closest_y],  function (v, k) { return parseInt(k) >= unit.x });
    };

    function iterate_Y(y, units) {
        try {
            if (units == 'ally') {
                if (_.has(group.enemy, y)) {
                    return y;
                } else {
                    var direction = 0;
                    for (var i = 1; i < 300; i++) {
                        i = parseInt(i);
                        if (_.has(group.enemy, parseInt(y) + i)) {
                            direction = i;
                            break;
                        } else if (_.has(group.enemy, parseInt(y) - i)) {
                            direction = -i;
                            break;
                        }
                    }
                    if(direction > 0) {
                        var last = 0;
                        for (i = direction; i < 300; i++) {
                            i = parseInt(i);
                            if (_.has(group.enemy, parseInt(y) + i)) {
                                last = i;
                            } else {
                                return y + last;
                            }
                        }
                    } else if(direction < 0) {
                        last = 0;
                        for (i = direction; i > -300; i--) {
                            i = parseInt(i);
                            if (_.has(group.enemy, parseInt(y) + i)) {
                                last = i;
                            } else {
                                return y + last;
                            }
                        }
                    }
                    return y;
                }
            }
            else if (units == 'enemy') {
                if (_.has(group.ally, y)) {
                    return y;
                } else {
                    direction = 0;
                    for (i = 1; i < 300; i++) {
                        i = parseInt(i);
                        if (_.has(group.ally, parseInt(y) + i)) {
                            direction = i;
                            break;
                        } else if (_.has(group.ally, parseInt(y) - i)) {
                            direction = -i;
                            break;
                        }
                    }
                    if(direction > 0) {
                        last = 0;
                        for (i = direction; i < 300; i++) {
                            i = parseInt(i);
                            if (_.has(group.ally, parseInt(y) + i)) {
                                last = i;
                            } else {
                                return y + last;
                            }
                        }
                    } else if(direction < 0) {
                        last = 0;
                        for (i = direction; i > -300; i--) {
                            i = parseInt(i);
                            if (_.has(group.ally, parseInt(y) + i)) {
                                last = i;
                            } else {
                                return y + last;
                            }
                        }
                    }
                    return y;
                }
            }
        } catch(err) {
            console.log('iterate_Y');
        }
    };

// unit

    function check_forward() {
        if (unit.stopped) {
            check_temporary_moves();
            if (unit.attacking == 0) {
                try_moving();
            } else {
                var attacking = group[army[unit.attacking.id].unit_type][unit.attacking.y][unit.attacking.x];
                if(attacking.hp > 0) {
                    if(unit.team == 1) {
                        attacking.hp -= stats.dmg;
                    } else {
                        if(army[attacking.id].stats.type == 'inf') {
                            attacking.hp -= stats.def_inf;
                        } else if(army[attacking.id].stats.type == 'horse') {
                            attacking.hp -= stats.def_hors;
                        } else if(army[attacking.id].stats.type == 'arch') {
                            attacking.hp -= stats.def_arch;
                        } else {
                            console.log('unexpected unit type');
                        }
                    }
                    if(attacking.attacking == 0) {
                        attacking.attacking = unit;
                        attacking.target = unit;
                        attacking.able_to_move = true;
                        attacking.stopped = true;
                    }
                    if(attacking.hp < 1) {
                        unit.killed += 1;
                        target = undefined;
                        unit.target = undefined;
                    }
                } else if(unit.attacking != 0) {
                    unit.attacking = 0;
                    target = undefined;
                    unit.target = undefined;
                }
            }
        } else {
            if (!find_opponent()) {
                if(target && unit.x == target.x && unit.y == target.y) {
                    unit.waiting = true;
                } else {
                    try_moving();
                }
            }
        }
    };

    function check_temporary_moves() {
        if(unit.direction_y == 1 && unit.move_y < 99) {
            if(unit.attacking != 0 && unit.attacking['move_y'] > unit.move_y + 1) {
                unit.move_y += stats.speed;
            } else if (unit.attacking == 0 && unit.move_y < 99) {
                unit.move_y += stats.speed;
            }
        } else if(unit.direction_y == -1 && unit.move_y > 1) {
            if(unit.attacking != 0 && unit.attacking['move_y'] < unit.move_y - 1) {
                unit.move_y -= stats.speed;
            } else if (unit.attacking == 0 && unit.move_y > 1) {
                unit.move_y -= stats.speed;
            }
        }
        if(unit.direction_x == 1 && unit.move_x < 99) {
            if(unit.attacking != 0 && unit.attacking['move_x'] > unit.move_x + 1) {
                unit.move_x += stats.speed;
            } else if (unit.attacking == 0 && unit.move_x < 99) {
                unit.move_x += stats.speed;
            }
        } else if(unit.direction_x == -1 && unit.move_x > 1) {
            if(unit.attacking != 0 && unit.attacking['move_x'] < unit.move_x - 1) {
                unit.move_x -= stats.speed;
            } else if (attacking == 0 && move_x > 1) {
                unit.move_x -= stats.speed;
            }
        }

    };

    function try_moving() {
        unit.stopped = false;
        unit.attacking = 0;
        if (unit.target) {
            move_forward();
            if(unit.target.y > unit.y) {
                if (check_around_for_allies(1)) {
                    move_y_axis(1);
                }
            } else if(unit.target.y < unit.y) {
                if (check_around_for_allies(-1)) {
                    move_y_axis(-1);
                }
            }
        }
    };

    function move_y_axis(direction) {
        unit.move_y += stats.speed * direction;
        unit.direction_y = direction;
        if (unit.move_y > 99 || unit.move_y < 1) {
            unit.y += direction;
            unit.move_y = unit.move_y - (100 * direction);
        }
    };

    function check_around_for_allies(direction) {
        var new_y = unit.y + direction;
        if(group[unit.ally][new_y] && group[unit.ally][new_y][unit.x]) {
            return false;
        }
        return true;
    };

    function move_forward() {
        if(unit.target.x > unit.x) {
            if (!_.has(group[unit.ally][unit.y], unit.x+1)) {
                start_movements(1, 0, 2, 1);
            } else {
                if (unit.facedirection == 5) {
                    unit.frame = 13;
                } else {
                    unit.frame = 3;
                }
            }
        }
        else if(unit.target.x < unit.x)  {
            if (!_.has(group[unit.ally][unit.y], unit.x-1)) {
                if(unit.status == 0) {
                    if(!_.has(group[unit.ally][unit.y], unit.x-2)) {
                        start_movements(-1, 6, 4, 5);
                    }
                } else {
                    start_movements(-1, 6, 4, 5);
                }
            } else {
                if (unit.facedirection == 5) {
                    unit.frame = 13;
                } else {
                    unit.frame = 3;
                }
            }
        } else {
            if (unit.target.y > unit.y) {
                unit.facedirection = 7;
            } else if (unit.target.y < unit.y) {
                unit.facedirection = 3;
            }
        }
    };


    function start_movements(axis, face1, face2, face3) {
        unit.frame--;
        move_x_axis(axis);
        if (unit.target.y > unit.y) {
            unit.facedirection = face1;
        } else if (unit.target.y < unit.y) {
            unit.facedirection = face2;
        } else {
            unit.facedirection = face3;
        }
    }

    function move_x_axis(direction) {
        unit.move_x += stats.speed * direction;
        unit.direction_x = direction;
        if (unit.move_x > 99 || unit.move_x < 1) {
            unit.x += direction;
            unit.move_x = unit.move_x - (100 * direction);
        }
    };

    function find_opponent() {
        if(target) {
            if(target.y == unit.y) {
                var y_array = [0, 1, -1];
                for(var yy = 0; yy < 3; yy++) {
                    var new_y = unit.y + y_array[yy];
                    var new_x = unit.x + unit.direction_x;
                    if(group[unit.enemy][new_y]) {
                        if(group[unit.enemy][new_y][new_x]) {
                            unit.attacking = group[unit.enemy][new_y][new_x];
                            unit.target = group[unit.enemy][new_y][new_x];
                            target = group[unit.enemy][new_y][new_x];
                            unit.stopped = true;
                            return true; 
                        }
                    }
                }
            } else {
                var new_y = unit.y + unit.direction_y;
                if(group[unit.enemy][new_y] && group[unit.enemy][new_y][unit.x]) {
                    unit.attacking = group[unit.enemy][new_y][unit.x];
                    unit.target = group[unit.enemy][new_y][unit.x];
                    target = group[unit.enemy][new_y][unit.x];
                    unit.stopped = true;
                    return true; 
                }
            }
        } else {
            var new_y = unit.y;
            var new_x = unit.x + unit.direction_x;
            if(group[unit.enemy][new_y]) {
                if(group[unit.enemy][new_y][new_x]) {
                    unit.attacking = group[unit.enemy][new_y][new_x];
                    unit.target = group[unit.enemy][new_y][new_x];
                    target = group[unit.enemy][new_y][new_x];
                    unit.stopped = true;
                    return true; 
                }
            }

        }
        return false;
    };


    function able_surroundings_to_move() {
        for(var xx = -1; xx < 2; xx+= 2) {
            var new_x_1 = unit.x+xx;
            var new_y_1 = unit.y+xx;
            if(_.has(group[unit.ally][unit.y], new_x_1)) {
                group[unit.ally][unit.y][new_x_1].able_to_move = true;

            }
            if(_.has(group[unit.ally], new_y_1) && _.has(group[unit.ally][new_y_1], unit.x)) {
                group[unit.ally][new_y_1][unit.x].able_to_move = true;
            }
        }
    }

    function can_move_somewhere() {
        var ability_to_move = false;
        for(var xx = -1; xx < 2; xx+= 2) {
            if(!_.has(group[unit.ally][unit.y], unit.x+xx)) ability_to_move = true;
            if(!_.has(group[unit.ally][unit.y+xx], unit.x)) ability_to_move = true;
        }
        return ability_to_move;
    }

    function survived() {
        if(unit.hp < 1) {
            able_surroundings_to_move();
            return false;
        }
        unit.old_move_y = unit.move_y;
        unit.old_move_x = unit.move_x;
        check_forward();
        return true;
    };

    function setAllyEnemy() {
        if(unit.team == 1) {
            unit.ally = 'ally';
            unit.enemy = 'enemy';
        } else {
            unit.ally = 'enemy';
            unit.enemy = 'ally';
        }
    };