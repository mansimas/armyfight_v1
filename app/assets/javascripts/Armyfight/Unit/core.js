var core = angular.module('core', ['units', 'iteration']);
core.factory('core', ['units', 'iteration', function (Unit, Iteration) {
    'use strict';

    function Core(ud, formations, temp_ally, temp_enemy, frame) {
        this.images_to_show = ud.images_to_show;
        this.multiplied = ud.multiplied;
        this.ally = temp_ally;
        this.enemy = temp_enemy;
        this.formations = formations;
        this.unit_width = ud.unit_width;
        this.distance_x = ud.distance_x;
        this.distance_y = ud.distance_y;
        this.attacking = false;
        this.countAlly = 0;
        this.countEnemy = 0;
        this.ctx = ud.ctx;
        this.old_unit = {};
        this.drag_x = ud.drag_x;
        this.drag_y = ud.drag_y;
        this.army_drag_x_first = ud.army_drag_x_first;
        this.army_drag_y_first = ud.army_drag_y_first;
        this.image = ud.image;
        this.image_graphics_width = ud.image_graphics_width;
        this.image_graphics_height = ud.image_graphics_height;
        this.changed_units = {};
        this.frame = frame;
    }

    Core.prototype = new Iteration();

    Core.prototype.clone = function(obj) {
        if (null == obj || "object" != typeof obj) return obj;
        var copy = obj.constructor();
        for (var attr in obj) {
            if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
        }
        return copy;
    };

    Core.prototype.initiate = function() {
        var ally_length = this.formations['ally'].length;
        for(var row = 0; row < ally_length; row++) {
            var stats = this.clone(this.formations['ally'][row]['stats']);
            var ally_row_y = parseInt(this.formations['ally'][row]['y']);
            var ally_row_row = parseInt(this.formations['ally'][row]['row']) + ally_row_y;
            for(var y = ally_row_y; y < ally_row_row; y++) {
                if(!_.has(this.ally, y)) {
                    var columns = {};
                } else {
                    columns = this.ally[y];
                }
                var ally_row_x = parseInt(this.formations['ally'][row]['x']);
                var ally_row_column = -parseInt(this.formations['ally'][row]['column']) + ally_row_x;
                for (var x = ally_row_x; x > ally_row_column; x--) {
                    var new_stats = {};
                    new_stats.speed = stats.speed;
                    new_stats.type = stats.type;
                    new_stats.unit = stats.unit;
                    new_stats.hp = stats.hp_from;
                    new_stats.dmg = stats.dmg_from;
                    new_stats.def_inf = stats.def_inf_from;
                    new_stats.def_hors = stats.def_hors_from;
                    new_stats.def_arch = stats.def_arch_from;
                    var army_targets = []
                    var targets_length = this.formations['ally'][row].targets.length;
                    for(var t = 0; t < targets_length; t++ ) {
                        var army_target = this.clone(this.formations['ally'][row].targets[t]);
                        army_target.x = parseInt((army_target.x - this.formations['ally'][row].column * this.distance_x / 2) / 
                        this.distance_x + x - ally_row_x);
                        army_target.y = parseInt((army_target.y - this.formations['ally'][row].row * this.distance_y / 2) / 
                        this.distance_y + y - ally_row_y);
                        army_targets.push(army_target);
                    }
                    var able_to_move = false;
                    if(
                        y == ally_row_y || x == ally_row_x || 
                        y == ally_row_row-1 || 
                        x == ally_row_column+1) {
                        able_to_move = true;
                    }
                    columns[x] = new Unit(
                        x,
                        y,
                        new_stats,
                        1,
                        parseInt(this.distance_x),
                        parseInt(this.distance_y),
                        this.formations['ally'][row].id,
                        this.formations['ally'][row].unit_type,
                        army_targets,
                        true
                    );
                }
                this.ally[y] = columns;
            }
        }
        var enemies_length = this.formations['enemy'].length;
        for(row = 0; row < enemies_length; row++) {
            var stats = this.clone(this.formations['enemy'][row]['stats']);
            var enemy_row_y = parseInt(this.formations['enemy'][row]['y']);
            var enemy_row_row = parseInt(this.formations['enemy'][row]['row']) + enemy_row_y;
            for( y = enemy_row_y; y < enemy_row_row; y++) {
                if(!_.has(this.enemy, y)) {
                    columns = {};
                } else {
                    columns = this.enemy[y];
                }
                var enemy_row_x = parseInt(this.formations['enemy'][row]['x']);
                var enemy_row_column = parseInt(this.formations['enemy'][row]['column']) + enemy_row_x;
                for (x = enemy_row_x; x < enemy_row_column; x++) {
                    var new_stats = {};
                    new_stats.speed = stats.speed;
                    new_stats.type = stats.type;
                    new_stats.unit = stats.unit;
                    new_stats.hp = stats.hp_from;
                    new_stats.dmg = stats.dmg_from;
                    new_stats.def_inf = stats.def_inf_from;
                    new_stats.def_hors = stats.def_hors_from;
                    new_stats.def_arch = stats.def_arch_from;
                    var army_targets = []
                    var targets_length = this.formations['enemy'][row].targets.length;
                    for(var t = 0; t < targets_length; t++ ) {
                        var army_target = this.clone(this.formations['enemy'][row].targets[t]);
                        army_target.x = parseInt((army_target.x - this.formations['enemy'][row].column * this.distance_x / 2) / 
                        this.distance_x + x - enemy_row_x);
                        army_target.y = parseInt((army_target.y - this.formations['enemy'][row].row * this.distance_y / 2) / 
                        this.distance_y + y - enemy_row_y);
                        army_targets.push(army_target);
                    }
                    var able_to_move = false;
                    if(
                        y == enemy_row_y || x == enemy_row_x || 
                        y == enemy_row_row-1 || 
                        x == enemy_row_column-1) {
                        able_to_move = true;
                    }
                    columns[x] = new Unit(
                        x,
                        y,
                        new_stats,
                        -1,
                        parseInt(this.distance_x),
                        parseInt(this.distance_y),
                        this.formations['enemy'][row].id,
                        this.formations['enemy'][row].unit_type,
                        army_targets,
                        true
                    );
                }
                this.enemy[y] = columns;
            }
        }
    };

//
// Functions called from UnitData
//
    Core.prototype.redraw = function(drag_x, drag_y, image_graphics_width, image_graphics_height) {
        this.drag_x = drag_x;
        this.drag_y = drag_y;
        this.image_graphics_width = image_graphics_width;
        this.image_graphics_height = image_graphics_height;
        this.redraw_units();
    };

    Core.prototype.canvasChanged = function(direction) {
        this.multiplied += direction;
        this.unit_width = this.unit_width + 4 * direction;
        this.distance_x = this.distance_x + 4 * direction;
        this.distance_y = this.distance_y + 4 * direction;
        this.drag_x += 130;
        this.drag_y += 60;
        this.redraw_units();
    };

    Core.prototype.fix_canvas_size = function(width, height) {
        this.dth_ctx.canvas.width = width;
        this.dth_ctx.canvas.height = height;
    };

    Core.prototype.resetCounts = function() {
        this.countAlly = 0;
        this.countEnemy = 0;
    };

//
// Functions called from controller
//
    Core.prototype.getCountAlly = function() {
        return this.countAlly;
    };
    Core.prototype.getCountEnemy = function() {
        return this.countEnemy;
    };

//
// Click on unit functions. (Deprecated)
//
    // need to FIX.
    Core.prototype.getPosData = function(x, y) {
        var unit_y = parseInt(y/this.distance_y);
        var unit_x = parseInt(x/this.distance_x);
        var new_unit_x = unit_x-this.unit_width;
        for(var xx = unit_x; xx > new_unit_x; xx--) {
            if (_.has(this.ally[unit_y], xx)) {
                this.change_old_unit(this.ally[unit_y][xx]);
                return true;
            }
            if (_.has(this.enemy[unit_y], xx)) {
                this.change_old_unit(this.enemy[unit_y][xx]);
                return true;
            }
        }
        return false;
    };

    Core.prototype.change_old_unit = function(unit) {
        this.old_unit = unit;
    };

    Core.prototype.getUnitData = function() {
        if(!_.isEmpty(this.old_unit)) {
            return {
                hp: this.old_unit['stats']['hp'],
                dmg: this.old_unit['stats']['dmg'],
                def_inf: this.old_unit['stats']['def_inf'],
                def_hors: this.old_unit['stats']['def_hors'],
                def_arch: this.old_unit['stats']['def_arch'],
                x: this.old_unit['x'],
                y: this.old_unit['y'],
                move_y: this.old_unit['move_y'],
                team: this.old_unit['team'],
                killed: this.old_unit['killed']
            };
        } else {
            return {
                hp: 0,
                dmg: 0,
                def_inf: 0,
                def_hors: 0,
                def_arch: 0,
                x: 0,
                y: 0,
                move_y: 0,
                team: 0,
                killed: 0
            };
        }
    };

    return Core;
}]);