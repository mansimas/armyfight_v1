var unit_data = angular.module('unit_data', ['core', 'initial_data']);
unit_data.factory('unit_data', ['core', 'initial_data', function (Core, InitialData) {
    'use strict';

    function UnitData() {}

    UnitData.prototype = new InitialData();

//
// Mouse events
//
    UnitData.prototype.mouse_down = function(evt) {
        var mousePos = this.getMousePos(this.canvas, evt);
        if(this.draw_nature) {
          this.register_forms(mousePos.x, mousePos.y);
          this.draw_forms();
        }
        if(this.editing) {
            this.army_drag_x_first = evt.pageX;
            this.army_drag_y_first = evt.pageY;
            this.core.check_draggable_army(mousePos.x, mousePos.y);
        }
        if(this.set_target) { this.set_last_cursor_pos(evt); }
        if(!_.isEmpty(this.core.selected_army)) {
            this.drag_army = true;
            return 1;
        } else {
            this.drag_screen = true;
            this.army_drag_x_first = 0;
            this.army_drag_y_first = 0;
            this.drag_x_first = evt.pageX + this.drag_x;
            this.drag_y_first = evt.pageY + this.drag_y;
            if(!this.editing && this.core.getPosData(mousePos.x+this.drag_x, mousePos.y+this.drag_y)) {
                this.redraw_core();
            }
            return 0;
        }
    }

    UnitData.prototype.mouse_up = function(evt) {
        this.continued_drawing_nature = false;
        this.drag_screen = false;
        this.drag_army = false;
    }

    UnitData.prototype.mouse_move = function(evt) {
        if(this.editing) { this.formation_changed(); }
        if(this.set_target) { this.set_cursor_pos(evt); }
        if(this.drag_screen) {
            this.drag_x = this.drag_x_first - evt.pageX;
            this.drag_y = this.drag_y_first - evt.pageY;
            if(!this.editing) {
                this.redraw_core();
             } else if(this.editing) {
                return ['change_formation', {}];
            }
        } else if(this.drag_army && !_.isEmpty(this.core.selected_army)) {
            var result = this.core.drag_army(evt);
            this.army_drag_x_first = evt.pageX;
            this.army_drag_y_first = evt.pageY;
            return ['giving_result', result];
        }
        return false;
    }

//
// Fight begin functions
//
    UnitData.prototype.start_animation_loop = function() {
        this.edit_window_size();
    }

    UnitData.prototype.animate = function() {
        this.clear_canvas();
        this.draw_background();
        if(!this.editing) {
            this.core.draw_deaths();
            this.core.calculate_units();
        } else { this.formation_changed(); }
    }

//
// Canvas resize functions
//
    UnitData.prototype.edit_window_size = function() {
        this.ctx.canvas.width =  $(window).width() - 120;
        this.bg_ctx.canvas.width =  $(window).width() - 120;
        this.ctx.canvas.height =  $(window).height() - $(window).height()/10;
        this.bg_ctx.canvas.height =  $(window).height() - $(window).height()/10;
        this.nat_ctx.canvas.width =  $(window).width()  - 120;
        this.nat_ctx.canvas.height =  $(window).height() - $(window).height()/10;
        if(!_.isEmpty(this.core)) {
            this.core.dth_ctx.canvas.height =  $(window).height() - $(window).height()/10;
            this.core.dth_ctx.canvas.width =  $(window).width() - 120;
        }
        if(this.first_attack) this.formation_changed();
    }

    UnitData.prototype.plus_size = function() {
        if(!this.editing && this.multiplied < 100) this.size_changed_helper(1);
    }

    UnitData.prototype.minus_size = function() {
        if(!this.editing && this.multiplied > 1)   this.size_changed_helper(-1);
    }

    UnitData.prototype.size_changed_helper = function(direction) {
        this.clear_canvas();
        this.core.canvasChanged(direction);
        this.multiplied = this.core.multiplied;
        this.unit_width = this.core.unit_width;
        this.distance_x = this.core.distance_x;
        this.distance_y = this.core.distance_y;
        this.drag_x = this.core.drag_x;
        this.drag_y = this.core.drag_y;
    }

//
// Fight edit functions
//
    UnitData.prototype.formation_changed = function() {
        this.draw_background();
        this.draw_forms();
        this.generate_core(this.formations, this.core.selected_army, {}, {});
        this.core.calculate_units();
        this.core.draw_army_borders(this.ctx);
        if(this.editing) this.draw_targets();
        this.core.fix_canvas_size(this.ctx.canvas.width, this.ctx.canvas.height);
    }

    UnitData.prototype.deselect_army = function() {
         this.core.selected_army = {};
         this.formation_changed();
    }


    UnitData.prototype.remove_army = function(formation, key) {
        if(this.core.selected_army && this.core.selected_army.unit_type == formation && this.core.selected_army.id == key) {
            this.core.selected_army = {};
        }
        this.formation_changed();
    }

    UnitData.prototype.center_army = function(unit) {
        if(this.editing && !_.isEmpty(unit)) {
            this.drag_x = -300 + parseInt(unit.x) * this.distance_x;
            this.drag_y = -480 + parseInt(unit.y) * this.distance_y;
            this.core.selected_army = unit;
            this.formation_changed();
        }
    }

    UnitData.prototype.redraw_core = function() {
        this.clear_canvas();
        this.draw_background();
        this.draw_forms();
        this.core.draw_deaths();
        this.core.redraw(this.drag_x, this.drag_y, this.image_graphics_width, this.image_graphics_height);
    }

//
// Fight watch functions
//
    UnitData.prototype.start_attack = function(formations) {
        this.first_attack = false;
        this.generate_core(this.formations, {}, this.temp_ally, this.temp_enemy);
        this.temp_ally = {};
        this.temp_enemy = {};
    }

    UnitData.prototype.generate_core = function(formations, selected, temp_ally, temp_enemy) {
        this.clear_canvas();
        this.core = new Core(this, formations, selected, temp_ally, temp_enemy);
        this.core.initiate();
    }

    return UnitData;
}]);
