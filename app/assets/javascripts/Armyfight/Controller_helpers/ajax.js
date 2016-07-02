var ajax = angular.module('ajax', []);
ajax.factory('ajax', ['$http', function ($http) {
    'use strict';

    function Ajax() {}

    Ajax.prototype.get_armies = function(id, callback) {
        var url = '/fights/'+ String(id);
        $http.get(url).then(function(response) {
            var armies_list = response.data.fight;
            var formations = {ally: [], enemy: [] };
            for(var x = 0; x < armies_list.length; x++) {
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
            callback({ name: response.data.name, formations: formations});
        });
    }

    Ajax.prototype.flush_armies_to_db = function(formations, id) {
        var self = this;
        _.each(['ally', 'enemy'], function(type) {
            for(var x = 0; x < formations[type].length; x++) {
                self.add_army(id, formations[type][x], type);
            }
        });
    }


    Ajax.prototype.edit_fight = function(id, name) {
        var url = '/fights/'+ String(id);

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
        var url = "/fights.json";

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

     Ajax.prototype.add_army = function(id, army, direction) {
        var url = "/armies.json";

        var data = {
            direction: direction,
            fight_id: id,
            army: army
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

    Ajax.prototype.delete_all_armies = function(id) {
        var url = "/destroy_armies";

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
        var url = "/watched_fight";

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