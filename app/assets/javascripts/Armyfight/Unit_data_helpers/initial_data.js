var initial_data = angular.module('initial_data', ['bg_canvas']);
initial_data.factory('initial_data', ['bg_canvas', function (BgCanvas) {
    'use strict';

    function InitialData() {
        this.images_to_show = 2;
        this.loop_speed = 80;
        this.multiplied = 1;
        this.unit_width = 3;
        this.distance_x = 4;
        this.distance_y = 4;
        this.temp_ally = {};
        this.temp_enemy = {};
        this.canvas  = document.getElementById("game");
        this.ctx = this.canvas.getContext("2d");
        this.frame = 0;
        this.core = {};
        this.first_attack = true;
        this.drag_screen = false;
        this.drag_x_first = 0;
        this.drag_x = 0;
        this.drag_y_first = 0;
        this.drag_y = 0;
        this.editing = true;
        this.image_graphics_width = 30;
        this.image_graphics_height = 30;
        this.drag_army = false;
        this.set_target = false;
        this.cursor_position = {x: 0, y: 0};
        this.army_drag_x_first = 0;
        this.army_drag_y_first = 0;
        this.formations = {};
        this.selected = {};
        this.unit_for_stats_change = {};
        this.last_id = {'ally': 0, 'enemy': 0};
        this.image = {
            spear   : document.getElementById("spear"),
            axe     : document.getElementById("axe"),
            bow     : document.getElementById("bow"),
            sword   : {
              m_b : document.getElementById("sword_m_b"),
              m_r : document.getElementById("sword_m_r"),
              h_r : document.getElementById("sword_h_r"),
              h_b : document.getElementById("sword_h_b"),
              d_r : document.getElementById("sword_d_r"),
              d_b : document.getElementById("sword_d_b"),
              ground  : document.getElementById("ground")
            },
            mounted : document.getElementById("mounted"),
            heavy   : document.getElementById("heavy"),
            light   : document.getElementById("light")
        }
        this.unit_stats = {
            spear: {
                hp_from: 1000,
                hp_to: 1000,
                dmg_from: 10,
                dmg_to: 10,
                def_inf_from: 25,
                def_inf_to: 25,
                def_hors_from: 45,
                def_hors_to: 45,
                def_arch_from: 10,
                def_arch_to: 10,
                speed: 12,
                type: 'inf',
                unit: 'spear'
            },
            sword: {
                hp_from: 1000,
                hp_to: 1000,
                dmg_from: 25,
                dmg_to: 25,
                def_inf_from: 55,
                def_inf_to: 55,
                def_hors_from: 5,
                def_hors_to: 5,
                def_arch_from: 30,
                def_arch_to: 30,
                speed: 10,
                type: 'inf',
                unit: 'sword'
            },
            axe: {
                hp_from: 1000,
                hp_to: 1000,
                dmg_from: 45,
                dmg_to: 45,
                def_inf_from: 10,
                def_inf_to: 10,
                def_hors_from: 5,
                def_hors_to: 5,
                def_arch_from: 10,
                def_arch_to: 10,
                speed: 12,
                type: 'inf',
                unit: 'axe'
            },
            bow: {
                hp_from: 1000,
                hp_to: 1000,
                dmg_from: 25,
                dmg_to: 25,
                def_inf_from: 10,
                def_inf_to: 10,
                def_hors_from: 30,
                def_hors_to: 30,
                def_arch_from: 60,
                def_arch_to: 60,
                speed: 12,
                type: 'arch',
                unit: 'bow'
            },
            mounted: {
                hp_from: 1000,
                hp_to: 1000,
                dmg_from: 140,
                dmg_to: 140,
                def_inf_from: 40,
                def_inf_to: 40,
                def_hors_from: 30,
                def_hors_to: 30,
                def_arch_from: 50,
                def_arch_to: 50,
                speed: 24,
                type: 'arch',
                unit: 'mounted'
            },
            heavy: {
                hp_from: 1000,
                hp_to: 1000,
                dmg_from: 150,
                dmg_to: 150,
                def_inf_from: 200,
                def_inf_to: 200,
                def_hors_from: 160,
                def_hors_to: 160,
                def_arch_from: 180,
                def_arch_to: 180,
                speed: 20,
                type: 'horse',
                unit: 'heavy'
            },
            light: {
                hp_from: 1000,
                hp_to: 1000,
                dmg_from: 130,
                dmg_to: 130,
                def_inf_from: 30,
                def_inf_to: 30,
                def_hors_from: 40,
                def_hors_to: 40,
                def_arch_from: 30,
                def_arch_to: 30,
                speed: 24,
                type: 'horse',
                unit: 'light'
            }
        }
    }

    InitialData.prototype = new BgCanvas();

    InitialData.prototype.get_formations = function(type) {
        var ally_id = this.last_id['ally'];
        var enemy_id = this.last_id['enemy'];
        if(type == 'both') {
            this.last_id['ally'] ++;
            this.last_id['enemy'] ++;
        } else if(type == 'ally') {
            this.last_id['ally'] ++;
        } else if(type == 'enemy') {
            this.last_id['enemy'] ++;
        }
        
        return {
            'ally': [
                {unit: 'sword', stats: this.unit_stats['sword'], column: 1, row: 1, 
                x: 56, y: 135, targets: [], id: ally_id, unit_type: 'ally' }
            ],
            'enemy': [
                {unit: 'sword', stats: this.unit_stats['sword'], column: 1, row: 1, 
                x: 92, y: 134, targets: [], id: enemy_id, unit_type: 'enemy' }
            ]
        }
    }

//
// Image related functions
//
    InitialData.prototype.get_image_data = function(number) {
        this.images_to_show = number;
        this.core.images_to_show = number;
        return {
                  m_b : document.getElementById("sword_m_b"+number),
                  m_r : document.getElementById("sword_m_r"+number),
                  h_r : document.getElementById("sword_h_r"+number),
                  h_b : document.getElementById("sword_h_b"+number),
                  d_r : document.getElementById("sword_d_r"+number),
                  d_b : document.getElementById("sword_d_b"+number),
                  ground  : document.getElementById("ground"+number)
            };
    }

    InitialData.prototype.image_stats = function() {
        return {
            0: {
                time: 2000,
                images_to_show: 0,
                image_graphics_width: 420,
                image_graphics_height: 394
            },
            1: {
                time: 1000,
                images_to_show: 1,
                image_graphics_width: 105,
                image_graphics_height: 98.5
            },
            2: {
                time: 500,
                images_to_show: 2,
                image_graphics_width: 30,
                image_graphics_height: 30
            }
        }
    }

//
// Global functions
//
    InitialData.prototype.do_clone = function(obj) {
        if (null == obj || "object" != typeof obj) return obj;
        var copy = obj.constructor();
        for (var attr in obj) {
            if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
        }
        return copy;
    }

    InitialData.prototype.getMousePos = function(canvas, evt) {
        var rect = canvas.getBoundingClientRect();
        return {
            x: evt.clientX - rect.left,
            y: evt.clientY - rect.top
        };
    }

    InitialData.prototype.getMobileMousePos = function(canvas, evt) {
        var rect = canvas.getBoundingClientRect();
        return {
            x: evt.targetTouches[0].pageX - rect.left,
            y: evt.targetTouches[0].pageY - rect.top
        };
    }

    InitialData.prototype.clear_canvas = function() {
        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    }

    InitialData.prototype.log = function() {
        console.log('ally', this.core.ally, 'enemy', this.core.enemy);
    }

    return InitialData;
}]);
