var unit = angular.module('units', ['parent_unit']);
unit.factory('units', ['parent_unit', function (parent_unit) {
    'use strict';
    function Unit(x, y, stats, team, distance_x, distance_y, id, unit_type, targets) {
        this.x = x;
        this.y = y;
        this.move_y = 0;
        this.move_x = 0;
        this.direction_y = 0;
        this.direction_x = 0;
        this.target = undefined;
        this.team = team;
        this.stopped = false;
        this.stats = stats;
        this.attacking = 0;
        this.killed = 0;
        this.facedirection = 0;
        this.frame = 16;
        this.distance_x = distance_x;
        this.distance_y = distance_y;
        this.dieing = false;
        this.id = id;
        this.unit_type = unit_type;
        this.targets = targets;
        this.target_id = 0;
        this.waiting = false;
        this.waiting_time = 0;
    }
    Unit.prototype = new parent_unit();

    return Unit;
}]);


var parent_unit = angular.module('parent_unit', []);
parent_unit.factory('parent_unit', function () {
    'use strict';

    function Unit() {}

    Unit.prototype.survived = function() {
        if(this['stats']['hp'] < 1) {
            return false;
        }
        this.check_forward();
        return true;
    };

    Unit.prototype.setAllyEnemy = function(ally, enemy) {
        if(this.team == 1) {
            this.ally = ally;
            this.enemy = enemy;
        } else {
            this.ally = enemy;
            this.enemy = ally;
        }
    };

    Unit.prototype.check_forward = function() {
        if(this.targets[this.target_id]) {
            this.waiting_time++;
        }
        if(this.targets[this.target_id] && this.targets[this.target_id].time < this.waiting_time) {
            this.waiting_time = 0;
            this.waiting = false;
            this.target_id++;
            this.target = undefined;
        } else if (this.stopped) {
            this.frame--;
            this.check_temporary_moves();
            if (this.attacking == 0) {
                this.try_moving();
            } else {
                if(this.attacking['stats']['hp'] > 0) {
                    if(this.team == 1) {
                        this.attacking['stats']['hp'] -= this.stats.dmg;
                    } else {
                        if(this.attacking['stats']['type'] == 'inf') {
                            this.attacking['stats']['hp'] -= this.stats.def_inf;
                        } else if(this.attacking['stats']['type'] == 'horse') {
                            this.attacking['stats']['hp'] -= this.stats.def_hors;
                        } else if(this.attacking['stats']['type'] == 'arch') {
                            this.attacking['stats']['hp'] -= this.stats.def_arch;
                        } else {
                            console.log('unexpected unit type');
                        }
                    }
                    if(this.attacking['attacking'] == 0) {
                        this.attacking['attacking'] = this.ally[this.y][this.x];
                        this.attacking['target'] = this.ally[this.y][this.x];
                    }
                    if(this.attacking['stats']['hp'] < 1) {
                        this.killed += 1;
                    }
                } else {
                    this.attacking = 0;
                }
            }
        } else {
            if (!this.find_opponent()) {
                if(this.target && this.x == this.target.x && this.y == this.target.y) {
                    this.waiting = true;
                } else {
                    this.try_moving();
                }
            }
        }
    };

    Unit.prototype.check_temporary_moves = function() {
        if(this.direction_y == 1 && this.move_y < 99) {
            if(this.attacking != 0 && this.attacking['move_y'] > this.move_y + 1) {
                this.move_y += this['stats']['speed'];
            } else if (this.attacking == 0 && this.move_y < 99) {
                this.move_y += this['stats']['speed'];
            }
        } else if(this.direction_y == -1 && this.move_y > 1) {
            if(this.attacking != 0 && this.attacking['move_y'] < this.move_y - 1) {
                this.move_y -= this['stats']['speed'];
            } else if (this.attacking == 0 && this.move_y > 1) {
                this.move_y -= this['stats']['speed'];
            }
        }
        if(this.direction_x == 1 && this.move_x < 99) {
            if(this.attacking != 0 && this.attacking['move_x'] > this.move_x + 1) {
                this.move_x += this['stats']['speed'];
            } else if (this.attacking == 0 && this.move_x < 99) {
                this.move_x += this['stats']['speed'];
            }
        } else if(this.direction_x == -1 && this.move_x > 1) {
            if(this.attacking != 0 && this.attacking['move_x'] < this.move_x - 1) {
                this.move_x -= this['stats']['speed'];
            } else if (this.attacking == 0 && this.move_x > 1) {
                this.move_x -= this['stats']['speed'];
            }
        }

    };

    Unit.prototype.try_moving = function() {
        this.stopped = false;
        this.attacking = 0;
        if (this.target && this.target['stats']['hp'] > 0) {
            this.frame--;
            this.move_forward();
            if(this.target['y'] > this.y) {
                if (this.check_around_for_allies(1)) {
                    this.move_y_axis(1);
                }
            } else if(this.target['y'] < this.y) {
                if (this.check_around_for_allies(-1)) {
                    this.move_y_axis(-1);
                }
            }
        }
    };

    Unit.prototype.move_y_axis = function(direction) {
        this.move_y += this['stats']['speed'] * direction;
        this.direction_y = direction;
        if (this.move_y > 99 || this.move_y < 1) {
            this.y += direction;
            this.move_y = this.move_y - (100 * direction);
        }
    };

    Unit.prototype.check_around_for_allies = function(direction) {
        var new_y = this.y + direction;
        if(this.ally[new_y] && this.ally[new_y][this.x]) {
            return false;
        }
        return true;
    };

    Unit.prototype.move_forward = function() {
        if(this.target['x'] > this.x) {
            if (!_.has(this.ally[this.y], this.x + 1)) {
                this.move_x_axis(1);
                if (this.target['y'] > this.y) {
                    this.facedirection = 0;
                } else if (this.target['y'] < this.y) {
                    this.facedirection = 2;
                } else {
                    this.facedirection = 1;
                }
            } else {
                if (this.facedirection == 5) {
                    this.frame = 13;
                } else {
                    this.frame = 3;
                }
            }
        }
        else if(this.target['x'] < this.x)  {
            if (!_.has(this.ally[this.y], this.x - 1)) {
                this.move_x_axis(-1);
                if (this.target['y'] > this.y) {
                    this.facedirection = 6;
                } else if (this.target['y'] < this.y) {
                    this.facedirection = 4;
                } else {
                    this.facedirection = 5;
                }
            } else {
                if (this.facedirection == 5) {
                    this.frame = 13;
                } else {
                    this.frame = 3;
                }
            }
        } else {
            if (this.target['y'] > this.y) {
                this.facedirection = 7;
            } else if (this.target['y'] < this.y) {
                this.facedirection = 3;
            }
        }
    };

    Unit.prototype.move_x_axis = function(direction) {
        this.move_x += this['stats']['speed'] * direction;
        this.direction_x = direction;
        if (this.move_x > 99 || this.move_x < 1) {
            this.x += direction;
            this.move_x = this.move_x - (100 * direction);
        }
    };

    Unit.prototype.find_opponent = function() {
        if(this.target) {
            if(this.target['y'] == this.y) {
                var y_array = [0, 1, -1];
                for(var yy = 0; yy < 3; yy++) {
                    var new_y = this.y + y_array[yy];
                    var new_x = this.x + this.direction_x;
                    if(this.enemy[new_y]) {
                        if(this.enemy[new_y][new_x]) {
                            this.attacking = this.enemy[new_y][new_x];
                            this.target = this.enemy[new_y][new_x];
                            this.stopped = true;
                            return true; 
                        }
                    }
                }
            } else {
                var new_y = this.y + this.direction_y;
                if(this.enemy[new_y] && this.enemy[new_y][this.x]) {
                    this.attacking = this.enemy[new_y][this.x];
                    this.target = this.enemy[new_y][this.x];
                    this.stopped = true;
                    return true; 
                }
            }
        } else {
            var new_y = this.y;
            var new_x = this.x + this.direction_x;
            if(this.enemy[new_y]) {
                if(this.enemy[new_y][new_x]) {
                    this.attacking = this.enemy[new_y][new_x];
                    this.target = this.enemy[new_y][new_x];
                    this.stopped = true;
                    return true; 
                }
            }

        }
        return false;
    };

    Unit.prototype.draw = function (ctx, unit_width, drag_x, drag_y, image, graphics_width, graphics_height) {
        var xx = (this.x * this.distance_x) + (this.distance_x / 100 * this.move_x) - drag_x;
        var yy = (this.y * this.distance_y) + (this.distance_y / 100 * this.move_y) - drag_y;

        if (this.stats['unit'] == 'sword') {
            if (this.team == 1) {
                if (this.attacking == 0) {
                  var newimage = image.m_r;
                } else {
                  newimage = image.h_r;
                }
            } else {
                if (this.attacking == 0) {
                  newimage = image.m_b;
                } else {
                  newimage = image.h_b;
                }
            }


            if (this.frame > 0) {
                var swox = this.frame * graphics_width;
            } else {
                swox = 0;
                this.frame = 16
            }

            var swoy = this.facedirection * graphics_height;
            ctx.drawImage(
                newimage, 
                swox, 
                swoy, 
                graphics_width, 
                graphics_height, 
                xx - unit_width*2.3  , 
                yy - unit_width, 
                unit_width*5, 
                unit_width*3
            );

        } else {
            ctx.drawImage(image, xx, yy, unit_width, unit_width);

        }
    };

    return Unit;
});



