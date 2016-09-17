var draggable_armies = angular.module('draggable_armies', []);
draggable_armies.factory('draggable_armies', [function () {
    'use strict';

    function DraggableArmies() {
        this.draggable_armies = [];
    }

    DraggableArmies.prototype.draw_army_borders = function(ctx) {
        this.draggable_armies = [];
        var self = this;

        _.each(['enemy', 'ally'], function(type) {
            var army_size = self.formations[type].length;
            ctx.lineWidth = 1;
            if(type == 'ally') ctx.strokeStyle = '#ec5840'; else ctx.strokeStyle = 'blue';
            for(var row = 0; row < army_size; row++) {
                var unit = self.formations[type][row];
                var width = unit.column * self.distance_x;
                var height = unit.row * self.distance_y;
                if( type == 'ally') { var xx = (unit.x * self.distance_x) - self.drag_x - width + self.unit_width;
                } else {                  xx = (unit.x * self.distance_x) - self.drag_x; }
                var yy = (unit.y * self.distance_y) - self.drag_y;

                self.draggable_armies.push({
                    id: row,
                    unit_type: type,
                    x: xx,
                    y: yy,
                    width:  width,
                    height: height
                })

                ctx.strokeRect(xx, yy, width, height);
                if(!_.isEmpty(self.selected) && self.selected.unit_type == type && self.selected.id == row) {
                    ctx.fillStyle = "rgba(150, 150, 40, 0.5)";
                    ctx.fillRect(xx, yy, width, height);
                }
            }
        });
    }


    DraggableArmies.prototype.check_draggable_army = function(x, y) {
        var count = 0;
        var self = this;
        _.each(this.draggable_armies, function(army) {
            if(x > army.x - 5 && x < army.x + army.width + 5 && y > army.y - 5 && y < army.y + army.height + 5) {
                self.selected = army;
                count = 1;
            }
        });
        if (count == 0) {
            self.selected = {};
        }
    }

    DraggableArmies.prototype.drag_armies = function(e) {
        var selected_unit_type = this.selected.unit_type;
        var selected_army_id = this.selected.id;
        var selected_army = this.formations[selected_unit_type][selected_army_id];
        var army_after_drag_x = this.army_drag_x_first - e.pageX;
        var army_after_drag_y = this.army_drag_y_first - e.pageY;
        if(army_after_drag_x > 0) {
            var army_multated_drag_x = Math.ceil(army_after_drag_x/(this.distance_x+1));
        } else {
            army_multated_drag_x = Math.floor(army_after_drag_x/(this.distance_x+1));
        }
        if(army_after_drag_y > 0) {
            var army_mutated_drag_y = Math.ceil(army_after_drag_y/(this.distance_y+1));
        } else {
            army_mutated_drag_y = Math.floor(army_after_drag_y/(this.distance_y+1));
        }
        var x = selected_army.x - army_multated_drag_x;
        var y = selected_army.y - army_mutated_drag_y;

        return { type: selected_unit_type, id: selected_army_id, x: x, y: y };

    }

    return DraggableArmies;
}]);