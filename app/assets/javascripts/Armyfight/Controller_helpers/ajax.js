var ajax = angular.module('ajax', []);
ajax.factory('ajax', ['$http', function ($http) {
    'use strict';

    function Ajax() {}

    Ajax.prototype.get_armies = function(id, callback) {
        var url = '/en/fights/'+ String(id);
        $http.get(url).then(function(response) {

            var map_elements = {};
            var data_map_elements = response.data.map_elements;
            for(var x = 0, len = data_map_elements.length; x < len; x++) {
              var element = data_map_elements[x];

              if(!map_elements[element.color]) {
                map_elements[element.color] = {};
              }
              if(!map_elements[element.color][element.shape]) {
                map_elements[element.color][element.shape] = [];
              }
              map_elements[element.color][element.shape] = JSON.parse(element.elements);
            }

            var armies_list = response.data.fight;
            var formations = {ally: [], enemy: [] };
            for(var x = 0, len = armies_list.length; x < len; x++) {
                var army = armies_list[x];
                var targets = [];
                for (var t = 0; t < response.data.targets.length; t++) {
                    if( response.data.targets[t][1] == army.id) {
                        targets.push({ 
                            x: response.data.targets[t][2], 
                            y: response.data.targets[t][3],
                            time: response.data.targets[t][4]
                        });
                    }
                }
                var data = {
                    unit: army.unit_name,
                    column: army.columns,
                    row: army.rows,
                    x: army.x_pos,
                    y: army.y_pos,
                    stats: {
                        hp_from: army.hp_from,
                        hp_to: army.hp_to,
                        dmg_from: army.dmg_from,
                        dmg_to: army.dmg_to,
                        def_inf_from: army.def_inf_from,
                        def_inf_to: army.def_inf_to,
                        def_hors_from: army.def_hors_from,
                        def_hors_to: army.def_hors_to,
                        def_arch_from: army.def_arch_from,
                        def_arch_to: army.def_arch_to,
                        speed: army.speed,
                        type: army.unit_type,
                        unit: army.unit_name
                    },
                    unit_type: army.direction,
                    id: x,
                    targets: targets
                };
                formations[army.direction].push(data);
            }
            callback({ name: response.data.name, formations: formations, map_elements: map_elements});
        });
    }

    Ajax.prototype.flush_armies_to_db = function(formations, id) {
        var self = this;
        var data = {items: [], fight_id: id};

        _.each(['ally', 'enemy'], function(type) {
            var formations_length = formations[type].length;
            for(var x = 0; x < formations_length; x++) {
                data.items.push(
                    {
                        direction: type,
                        fight_id: id,
                        army: formations[type][x]
                    }
                );
            }
        });

        var url = "/en/armies.json";

        var config = {
            headers: {
              'X-Transaction': 'POST Example',
              'X-CSRF-Token': $('meta[name="csrf-token"]').attr('content')
            }
        };

        $http.post(url, data, config).then(function(response) {
        });
    }

    Ajax.prototype.flush_map_elements_to_db = function(elements_array, fight_id) {
        var data = {items: [], fight_id: fight_id};
        _.each(elements_array, function(shapes_list, color) {
            _.each(shapes_list, function(x_y_array, shape) {
              data.items.push([color, shape, x_y_array]);
            });
        });

        var url = "/en/add_map_elements";

        var config = {
            headers: {
              'X-Transaction': 'POST Example',
              'X-CSRF-Token': $('meta[name="csrf-token"]').attr('content')
            }
        };

        $http.post(url, data, config).then(function(response) {
        });
    }

    Ajax.prototype.edit_fight = function(id, name) {
        var url = '/en/fights/'+ String(id);

        var data = {
            fight_name: name
        }

        var config = {
            headers: {
              'X-Transaction': 'POST Example',
              'X-CSRF-Token': $('meta[name="csrf-token"]').attr('content')
            }
        };

        $http.put(url, data, config).then(function(response) {
        });
    }

    Ajax.prototype.add_fight = function(name, callback) {
        var url = "/en/fights.json";

        var data = {
            fight_name: name
        }

        var config = {
            headers: {
              'X-Transaction': 'POST Example',
              'X-CSRF-Token': $('meta[name="csrf-token"]').attr('content')
            }
        };

        $http.post(url, data, config).then(function(response) {
            callback(response);
        });
    }


    Ajax.prototype.delete_all_armies = function(id) {
        var url = "/en/destroy_armies";

        var data = {
            fight_id: id
        }

        var config = {
            headers: {
              'X-Transaction': 'POST Example',
              'X-CSRF-Token': $('meta[name="csrf-token"]').attr('content')
            }
        };

        $http.post(url, data, config).then(function(response) {
        });
    }

    Ajax.prototype.count_fight_watches = function(id) {
        var url = "/en/watched_fight";

        var data = {
            id: id
        }

        var config = {
            headers: {
              'X-Transaction': 'POST Example',
              'X-CSRF-Token': $('meta[name="csrf-token"]').attr('content')
            }
        };

        if(id) {
            $http.post(url, data, config).then(function(response) {
            });
        }
    }


    return Ajax;
}]);