var bg_canvas = angular.module('bg_canvas', ['targets_cursor']);
bg_canvas.factory('bg_canvas', ['targets_cursor', function (TargetsCursor) {
    'use strict';

    function Bg_canvas() {
        var background_canvas  = document.getElementById("background");
        this.bg_ctx = background_canvas.getContext("2d");
    }

    Bg_canvas.prototype = new TargetsCursor();

    Bg_canvas.prototype.clear_bg_canvas = function() {
        this.bg_ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    };

    Bg_canvas.prototype.draw_background = function() {
        this.clear_bg_canvas();
        var cnv = this.bg_ctx.canvas;
        var map_width = this.multiplied * 100;
        var maps_x_direction = Math.ceil(cnv.width/100/this.multiplied) + 1;
        var maps_y_direction = Math.ceil(cnv.height/100/this.multiplied) + 1;

        if(this.drag_x > 0) {
            var drag_direction_x = 1;
        } else if (this.drag_x < 0) {
            var drag_direction_x = -1;
        } else {
            var drag_direction_x = 0;
        }
        if(this.drag_y > 0) {
            var drag_direction_y = 1;
        } else if (this.drag_y < 0) {
            var drag_direction_y = -1;
        } else {
            var drag_direction_y = 0;
        }

        if(this.images_to_show == 0) {
            var ground_size = 1000;

        } else if(this.images_to_show == 1){
            ground_size = 250;
        } else {
            ground_size = 100;
        }

        for(var x = -1; x < maps_x_direction; x++) {
            for(var y = -1; y < maps_y_direction; y++) {
                this.bg_ctx.drawImage(
                    this.image.sword['ground'], 
                    0, 
                    0,
                    ground_size,
                    ground_size,
                    x * map_width - this.drag_x + drag_direction_x * map_width * Math.ceil( this.drag_x / map_width * drag_direction_x ), 
                    y * map_width - this.drag_y + drag_direction_y * map_width * Math.ceil( this.drag_y / map_width * drag_direction_y ),
                    map_width, 
                    map_width 
                );
            }
        }
    }

    return Bg_canvas;
}]);