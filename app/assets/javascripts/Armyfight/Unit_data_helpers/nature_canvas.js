
var nature_canvas = angular.module('nature_canvas', []);
nature_canvas.factory('nature_canvas', [function () {
    'use strict';

    function Nature_canvas() {
        var draw_nature_canvas  = document.getElementById("nature");
        this.nat_ctx = draw_nature_canvas.getContext("2d");
        this.nature_coordinates = {};
    }

    Nature_canvas.prototype.enable_nature_drawing = function() {
        this.draw_nature = !this.draw_nature;
        this.drag_screen = false;
        this.drag_army = false;
    }

    Nature_canvas.prototype.register_forms = function(x, y) {
      if(!this.nature_coordinates[this.nature_color]) {
        this.nature_coordinates[this.nature_color] = {};
      }
      if(!this.nature_coordinates[this.nature_color][this.drawing_shape]) {
        this.nature_coordinates[this.nature_color][this.drawing_shape] = [];
      }
      this.nature_coordinates[this.nature_color][this.drawing_shape].push([this.drag_x+x, this.drag_y+y, this.map_range])
    }

    Nature_canvas.prototype.draw_forms = function() {
        this.clear_nature_ctx();
        var self = this;
        _.each(self.nature_coordinates, function(shapes_list, color) {
            self.nat_ctx.fillStyle = '#' + color;
            _.each(shapes_list, function(x_y_array, shape) {
              if(shape == 'square') {
                for(var item = 0, len = x_y_array.length; item < len; item++) {
                  var coord = x_y_array[item];
                  self.nat_ctx.fillRect(coord[0] - self.drag_x-coord[2]/2, coord[1]-self.drag_y-coord[2]/2, coord[2], coord[2]);
                }
              } else if(shape == 'circle') {
                for(var item = 0, len = x_y_array.length; item < len; item++) {
                  self.nat_ctx.beginPath();

                  var coord = x_y_array[item];
                  self.nat_ctx.arc(coord[0] - self.drag_x-coord[2]/2, coord[1]-self.drag_y-coord[2]/2, coord[2], 0, 2*Math.PI);
                  self.nat_ctx.fill();

                }
              } else {
                var image = document.getElementById(shape);
                for(var item = 0, len = x_y_array.length; item < len; item++) {
                  var coord = x_y_array[item];
                  var width = coord[2] * 10;
                  self.nat_ctx.drawImage(
                    image,
                    coord[0] - self.drag_x - width/2,
                    coord[1] - self.drag_y - width/2,
                    width,
                    width
                  );
                }
              }
            });
        });
    }

    Nature_canvas.prototype.clear_nature_ctx = function() {
        this.nat_ctx.clearRect(0, 0, this.nat_ctx.canvas.width, this.nat_ctx.canvas.height);
    }

    return Nature_canvas;
}]);
