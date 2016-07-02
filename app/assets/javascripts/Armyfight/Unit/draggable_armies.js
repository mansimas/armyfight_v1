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
            if(type == 'ally') ctx.strokeStyle = '#ec5840'; else ctx.strokeStyle = '#ec5840';
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
                if(!_.isEmpty(self.selected_army) && self.selected_army.unit_type == type && self.selected_army.id == row) {
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
                self.selected_army = army;
                count = 1;
            }
        });
        if (count == 0) {
            self.selected_army = {};
        }
    }

    DraggableArmies.prototype.drag_army = function(e) {
        var selex = this.selected_army.unit_type;
        var armyN = this.selected_army;
        var armyO = this.formations[selex][armyN.id];
        var adrag_x = this.army_drag_x_first - e.pageX;
        var adrag_y = this.army_drag_y_first - e.pageY;
        if(adrag_x > 0) {
            var bdrag_x = Math.ceil(adrag_x/(this.distance_x+1));
        } else {
            bdrag_x = Math.floor(adrag_x/(this.distance_x+1));
        }
        if(adrag_y > 0) {
            var bdrag_y = Math.ceil(adrag_y/(this.distance_y+1));
        } else {
            bdrag_y = Math.floor(adrag_y/(this.distance_y+1));
        }
        var x = armyO.x - bdrag_x;
        var y = armyO.y - bdrag_y;

        return { type: selex, id: armyN.id, x: x, y: y };

    }

    return DraggableArmies;
}]);