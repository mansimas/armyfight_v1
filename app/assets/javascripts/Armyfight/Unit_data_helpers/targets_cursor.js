var targets_cursor = angular.module('targets_cursor', []);
targets_cursor.factory('targets_cursor', [function() {
    'use strict';

    function TargetsCursor() {
    	this.radius = 10;
    	this.radius_direction = -1;
    	this.last_cursor_pos = {x: 0, y: 0};
    }

    TargetsCursor.prototype.set_cursor_pos = function(evt) {
        var mousePos = this.getMousePos(this.canvas, evt);
        this.cursor_position = {x: mousePos.x, y: mousePos.y};
    }

    TargetsCursor.prototype.set_last_cursor_pos = function(evt) {
    	this.set_cursor_pos(evt);
        var mousePos = this.getMousePos(this.canvas, evt);
        this.last_cursor_pos = {x: mousePos.x, y: mousePos.y};
    }

    TargetsCursor.prototype.set_target_cursor = function(evt) {
        var mousePos = this.getMousePos(this.canvas, evt);
        return (this.last_cursor_pos.x == mousePos.x && this.last_cursor_pos.y == mousePos.y); 
    }

    TargetsCursor.prototype.draw_cursor = function() {
		var centerX = this.cursor_position.x - this.radius/2;
		var centerY = this.cursor_position.y - this.radius/2;

		this.ctx.beginPath();
		this.ctx.arc(centerX, centerY, this.radius, 0, 2 * Math.PI, false);
		this.ctx.fillStyle = '#836FFF';
		this.ctx.fill();
		this.ctx.lineWidth = 3;
		this.ctx.strokeStyle = '#4876FF';
		this.ctx.stroke();

		if(this.radius_direction == -1 && this.radius > 3) {
			this.radius--;
		} else if (this.radius_direction == -1 && this.radius <= 3) {
			this.radius_direction = 1;
		} else if (this.radius_direction == 1 && this.radius <= 10) {
			this.radius++;
		} else if (this.radius_direction == 1 && this.radius > 10) {
			this.radius_direction = -1;
		}

    }

    TargetsCursor.prototype.draw_targets = function() {
        var self = this;
        _.each(['enemy', 'ally'], function(type) {
            for(var x = 0; x < self.formations[type].length; x++) {
                var army = self.formations[type][x];
                for(var t = 0; t < army.targets.length; t++) {
                    if(t == 0) {
                        if( type == 'ally') { 
                            var xx = (army.x * self.distance_x) - self.drag_x - army.column 
                            * self.distance_x + self.unit_width + army.column * self.distance_x / 2;
                        } else {                
                            xx = (army.x * self.distance_x) - self.drag_x + army.column * self.distance_x / 2; 
                        }

                        var yy = (army.y * self.distance_y) - self.drag_y + army.row * self.distance_y / 2;


                        self.draw_target_lines(
                            xx, yy,
                            army.targets[t].x - self.drag_x, army.targets[t].y - self.drag_y,
                            type, x
                        );
                    } else {
                        self.draw_target_lines(
                            army.targets[t-1].x - self.drag_x, army.targets[t-1].y - self.drag_y,
                            army.targets[t].x - self.drag_x, army.targets[t].y - self.drag_y,
                            type, x
                        );
                    }
                }
            }
        });
    }

    TargetsCursor.prototype.draw_target_lines = function(x_from, y_from, x_to, y_to, type, number) {
        if(type == 'ally') {
            this.ctx.strokeStyle = 'red';
        } else {
            this.ctx.strokeStyle = 'blue';
        }
        if(this.unit_for_stats_change.unit_type == type &&
           this.unit_for_stats_change.id-1 == number) {
            this.ctx.lineWidth = 3;
        } else {
            this.ctx.lineWidth = 1;
        }

        this.ctx.beginPath();
        this.ctx.moveTo(x_from, y_from);
        this.ctx.lineTo(x_to, y_to);
        this.ctx.stroke();
    }

    return TargetsCursor;
}]);