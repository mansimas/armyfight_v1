var death_canvas = angular.module('death_canvas', ['draggable_armies']);
death_canvas.factory('death_canvas', ['draggable_armies', function (DraggableArmies) {
    'use strict';

    function DeathCanvas() {
        var death_canvas  = document.getElementById("unit_deaths");
        this.dth_ctx = death_canvas.getContext("2d");
        this.died_units = [];
    }

    DeathCanvas.prototype = new DraggableArmies();

    DeathCanvas.prototype.clear_dth_canvas = function() {
        this.dth_ctx.clearRect(0, 0, this.dth_ctx.canvas.width, this.dth_ctx.canvas.height);
    };

    DeathCanvas.prototype.draw_deaths = function() {
        this.clear_dth_canvas();
        for(var x = 0; x < this.died_units.length; x++) {
            unit = this.died_units[x];
            if(unit[0]['team'] == 1) {
                var img = this.image['sword']['d_r'];
            } else {
                img = this.image['sword']['d_b'];
            }
            this.death_drawing(
                img, 
                unit[1],
                unit[0]['x'],
                unit[0]['y'],
                unit[0]['move_y'],
                unit[0]['team'],
                unit[0]['random_direction'],
                unit[0]['move_x']
            );
            this.died_units[x][1]--; 
        }
    };

    DeathCanvas.prototype.death_drawing = function(img, frame, x, y, move_y, team, facedirection, move_x) {
        if(this.images_to_show == 0) {
            var graphics_width = 105;
            var graphics_height = 98.5;
        } else {
            graphics_width = this.image_graphics_height;
            graphics_height = this.image_graphics_width;
        }
        var swoy = facedirection * graphics_height;

        if (frame > 0) {
            var swox = frame * graphics_width;
        } else {
            swox = 0;
        }

        var xx = (x * this.distance_x) + (this.distance_x / 100 * move_x) - this.drag_x;
        var yy = (y * this.distance_y) + (this.distance_y / 100 * move_y) - this.drag_y;

        this.dth_ctx.drawImage(
            img, 
            swox, 
            swoy, 
            graphics_width, 
            graphics_height, 
            xx - this.unit_width * 2.3, 
            yy - this.unit_width, 
            this.unit_width * 4, 
            this.unit_width * 3
        );
    };

    return DeathCanvas;
}]);