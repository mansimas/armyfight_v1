var preloader = angular.module('preloader', []);
preloader.factory('preloader', [function () {
    'use strict';

    function Preloader() {}

    Preloader.prototype.register_load_data = function() {


        var units = [ // fully sort units by y and by x
            [[7,1], [7,3], [7,4], [7,8], [7,9]],
            [[8,21], [8,22], [8,23], [8,24]],
            [[9,21], [9,22], [9,23], [9,24]]
        ];

    
        if(this.frame == 1) {
            console.log('this.compress_army(units)');
            console.log(this.compress_array(units));
        }

        // console.log('uncompressed', this.core.changed_units);
        // this.armies_encoding(this.core.changed_units);
        // this.core.changed_units = {};
    }

    // Preloader.prototype.armies_encoding = function(units) {
    //     var compressed_units = this.first_compression_level(units);
    //     // console.log('1st compression', compressed_units);
    //     var units_arr = this.second_compression_level(compressed_units['armies_array']);
    //     // console.log('2nd compression', units_arr);
    //     var comp_arr = this.third_compression_level(units_arr);
    //     // console.log('3rd compression', comp_arr);
    //     // if(this.frame == 2) {
    //     //     var a = this.decompress([5, 4, 17, 11, +1, +1, 1, 4, 92, 35, 0, +1]);
    //     //     console.log('DECOMPRESSED');
    //     //     console.log(a);
    //     // }
    // }

    // Preloader.prototype.contains_arrays = function(arr1, arr2, attrs) {
    //     for(var x = 0; x < arr1.length; x++) {
    //         var temp = arr1[x];
    //         var same_elements = 0;
    //         for(var y=0; y<arr1[x].length; y++) {
    //             if(arr1[x][y] == arr2[y]) {
    //                 same_elements++;
    //             }
    //         }
    //         if(same_elements == arr1[x].length) {
    //             if(attrs == 'index') {
    //                 return x;
    //             } else {
    //                 return true;
    //             }
    //         }
    //     }
    //     if(attrs == 'index') {
    //         return -1;
    //     } else {
    //         return false;
    //     }
    // }

    // Preloader.prototype.first_compression_level = function(units) {
    //     var unit_global_stats = [];
    //     var unit_local_stats = [];
    //     var armies_array = [];
    //     var self = this;
    //     _.each(units, function (val, y) {
    //         _.each(val, function (u, x) {
    //             var global_stats = [u.stats.def_arch, u.stats.def_hors, u.stats.def_inf,
    //                 u.stats.dmg, u.stats.speed, u.stats.type, u.stats.unit];
    //             var glob = 0;

    //             for(var x=0; x<unit_global_stats.length; x++) {
    //                 var temp = unit_global_stats[x];
    //                 var same_elements = 0;
    //                 for(var y=0; y<unit_global_stats[x].length; y++) {
    //                     if(unit_global_stats[x][y] == global_stats[y]) {

    //                     }
    //                 }
    //             }

    //             if(!self.contains_arrays(unit_global_stats, global_stats)) {
    //                 glob = unit_global_stats.push(global_stats) - 1;
    //             } else {
    //                 glob = self.contains_arrays(unit_global_stats, global_stats, 'index');
    //             }

    //             var local_stats = [glob, u.attacking, u.direction_x, u.direction_y, u.facedirection,
    //                 u.frame, u.killed, u.move_x, u.move_y, u.status, u.stopped, u.target_id, 
    //                 u.team, u.unit_type, u.waiting, u.waiting_time, u.stats.hp ];

    //             if(u['target']) {
    //                 var active_stats = [u.x, u.y, u['target']['x'], u['target']['y']];
    //             } else {
    //                 active_stats = [u.x, u.y, undefined, undefined];
    //             }

    //             if(!self.contains_arrays(unit_local_stats, local_stats)) {
    //                 unit_local_stats.push(local_stats);
    //                 armies_array.push([active_stats]);
    //             } else {
    //                 var indx = self.contains_arrays(unit_local_stats, local_stats, 'index');
    //                 armies_array[indx].push(active_stats);
    //             }
    //         });
    //     });

    //     return {
    //         global_stats: unit_global_stats,
    //         local_stats: unit_local_stats,
    //         armies_array: armies_array
    //     }
    // };

    // Preloader.prototype.second_compression_level = function(army_units) {
    //     var splitted_armies_arr = [];
    //     for(var x = 0; x < army_units.length; x++) {
    //         splitted_armies_arr[x] = [];
    //         for(var y = 0; y < army_units[x].length; y ++) {
    //             for(var z = 0; z < army_units[x][y].length; z ++) {
    //                 if(y == 0) splitted_armies_arr[x][z] = [];
    //                 splitted_armies_arr[x][z].push(army_units[x][y][z]);
    //             }
    //         }
    //     }
    //     return splitted_armies_arr;

    // };

    // Preloader.prototype.third_compression_level = function(units_arr) {
    //     var compressed_armies_arr = [];
    //     var self = this;
    //     for(var x = 0; x < units_arr.length; x++) { //viso armiju. gali buti 12
    //         var completed_array = [];
    //         if(units_arr[x][0][0].length > 2) {
    //             compressed_armies_arr.push(['susitvarkyasiu']);
    //         } else {
    //             compressed_armies_arr.push(self.find_pattern(units_arr[x]));
    //         }
    //         // for(var y = 0; y < units_arr[x].length; y++) { //viso x,y,ex,ey variantu. yra 4
    //         //     self.find_pattern(units_arr[x][y]);
    //             // for(var z = 0; z < units_arr[x][y].length; z++) { //viso unitu. visada vienodai
    //             //     completed_array[y] = [];
    //             //     if(units_arr[x][y].length > 2) { // jei armijai priklauso virs 2 unitu
    //             //         if(z == 0) {
    //             //         } else if(z == 1) {
    //             //             differences.push(units_arr[x][y][1] - units_arr[x][y][0]);
    //             //         } else {
    //             //             self.find_pattern(units_arr[x][y], differences,  z);
    //             //         }
    //             //     } else { //jei armija iki 2 unitu, tiesiog ikeli unitus
    //             //         completed_array[y].push(z);
    //             //     }
    //             // }
            
    //     }
    //     return compressed_armies_arr;

    // };

    // Preloader.prototype.find_pattern = function(units_arr) {
    //     var pattern = [];

    //     for(var y = 0; y < units_arr.length; y++) { //viso x,y,ex,ey variantu. yra 4
    //         var first_x = 0;
    //         var differences = 0;
    //         var same_ixes = 0;
    //         var same_ygrix = 0;
    //         var last_changed = 0;
    //         var cap_reached = false;
    //         for(var z = 0; z < units_arr[y].length; z++) {
    //             if(z == 0) {
    //                 first_x = units_arr[y][z];
    //                 same_ixes++;
    //                 same_ygrix++;
    //             } else if (z == 1) {
    //                 differences = units_arr[y][1] - units_arr[y][0];
    //                 same_ixes++;
    //             } else {
    //                 if(units_arr[y][z] - units_arr[y][z-1] == differences) {
    //                     if(!cap_reached) same_ixes++;
    //                 } else {
    //                     cap_reached = true;
    //                     same_ygrix++;
    //                 }
    //             }
    //         }
    //         pattern.push({
    //             units_arr: units_arr[y],
    //             first_x: first_x,
    //             differences: differences,
    //             same_ixes: same_ixes,
    //             same_ygrix: same_ygrix
    //         })
    //     }

    //     return pattern;
        
    // }

    // // items = [5, 4, 17, 11, +1, +1, 1, 4, 92, 35, 0, +1]

    // // items[0] (in example 5) is rows;
    // // items[1] (in example 4) is columns;
    // // items[2] (in example 17) is unit x start;
    // // items[3] (in example 11) is unit y start;
    // // items[4] (in example 1) is unit x multiplier;
    // // items[5] (in example 1)  is unit y multiplier;

    // // items[6] (in example 1) is target rows;
    // // items[7] (in example 4) is target columns;
    // // items[8] (in example 92) is target x start;
    // // items[9] (in example 35) is target y start;
    // // items[10] (in example 0) is target x multiplier;
    // // items[11] (in example 1)  is target y multiplier;

    // // // items = [5, 4, 17, 11, +1, +1, 1, 4, 92, 35, 0, +1]


    // Preloader.prototype.decompress = function(items) {
    //     var targets_object = {};

    //     for(var a = 0; a < items[6]; a++) { // iterate target rows
    //         if(items[8]) {
    //             var target_x_coordinate = items[8] + items[10]*a; // extract unit x coordinate
    //         } else {
    //             target_x_coordinate = undefined;
    //         }
    //         if(!_.has(targets_object, a)) targets_object[a] = {}; // register target
    //         for(var b = 0; b < items[7]; b++) { // iterate unit columns
    //             if(items[9]) {
    //                 var target_y_coordinate = items[9] + items[11]*b; // extract unit y coordinate
    //             } else {
    //                 target_y_coordinate = undefined;
    //             }
    //             targets_object[a][b] = [target_x_coordinate, target_y_coordinate]; // populate targets
    //         }
    //     }

    //     var units_object = {};

    //     for(var x = 0; x < items[0]; x++) { // iterate unit rows
    //         var real_x_coordinate = items[2] + items[4]*x; // extract unit x coordinate
    //         if(!_.has(units_object, x)) units_object[x] = {}; // register target
    //         for(var y = 0; y < items[1]; y++) { // iterate unit columns
    //             var real_y_coordinate = items[3] + items[5]*y; // extract unit y coordinate
    //             var a = 0;
    //             var b = 0;
    //             if(items[10] > 0) a = x;
    //             if(items[11] > 0) b = y;

    //             var target_coordinates = targets_object[a][b];
    //             units_object[x][y] = [real_x_coordinate, real_y_coordinate, target_coordinates[0], target_coordinates[1]]; 
    //         }
    //     }

    //     return {units_object: units_object, targets_object: targets_object};

    // };




    // army = []. It must be sorted by "x" and by every "y" in "x"
    Preloader.prototype.compress_array = function(army) {
        var compressed_armies = [];
        var last_compressed_army = false;

        var alfa = 0;


        while (true) { // inifnite loop
            console.log("compressed_armies", compressed_armies);
            console.log('last_compressed_army',last_compressed_army);
          
            army = this.armies_reducer(army, last_compressed_army);
            last_compressed_army = this.extract_compressed_army(army);
         
            if(last_compressed_army) {compressed_armies.push(last_compressed_army);}
            else {break;}
            alfa++;
            if(alfa > 5) {
                break;
            }
        }
        console.log('TOTAL RESULT');
        return compressed_armies;
    }

    // last_compressed_army = [first_x, last_x, first_y, last_y]
    Preloader.prototype.armies_reducer = function(army, last_compressed_army) {

        if(last_compressed_army) {
            console.log('armies_reducer is under progress ');
            var new_army = [];
            console.log('new_army', new_army);

            console.log('pradedam killint');
            var army_x_length = army.length;
            for(var x = 0; x < army_x_length; x++) {

                console.log('killinimas x', x, 'succeed');
                var holder = false;
                var army_y_length = army[x].length;
                for(var y = 0; y < army_y_length; y++ ) {
                    if(army[x][y][0] >= last_compressed_army[0] && army[x][y][0] <= last_compressed_army[1] &&
                        army[x][y][1] >= last_compressed_army[2] && army[x][y][1] <= last_compressed_army[3]) {
                        // new_army.splice(x, 1);
                        console.log('killinimas x', x, 'failed');
                    } else {
                        if(!holder) {
                            holder = [];
                        }
                        console.log(army, x, y);
                        console.log('pushinaa yyyyyyyyyyyyyyyyyy', [army[x][y][0], army[x][y][1]]);
                        holder.push([army[x][y][0], army[x][y][1]]);
                    }

                   
                    
                }
                if(holder) {
                    console.log('pushinaa x', holder);
                    new_army.push(holder);
                }
                
            }
            console.log('new_army aaaaaaaaaaaaaaaaaaaaaaaaaa', new_army);
            return new_army;
        } else {
            return army;
        }

    }


    // var units = [ // fully sort units by y and by x
    //         [[1,1], [1,2], [1,3], [1,4]],
    //         [[2,1], [2,2]]
    //     ];

    Preloader.prototype.extract_compressed_army = function(army) {

        console.log('pradeda extract compressed army');

        if(army.length > 0) {
            var first_x = 0;
            var last_x = 0;
            var first_y = 'undefined';
            var last_y = 'undefined';

            var current_x = 0;
            var army_x_length = army.length;

            loop1: for(var x = 0; x < army_x_length; x++) {
                console.log('looping trough x ', x);
                if(x == 0) {
                    console.log('x is 0. first_x is', first_x, 'it will be', army[x][0][0], '. current_x is', current_x, 'it will be', army[x][0][0]);
                    first_x = army[x][0][0];
                    current_x = army[x][0][0];
                } else if(army[x][0][0] == current_x+1) { 
                    console.log('x != 0 and is +1 higher than last x. current_x is ', current_x, 'current_x will be', army[x][0][0]);
                    current_x = army[x][0][0];
                } else {
                    console.log('x != 0 and is not +1 higher. last_x is ', last_x, 'last_x will be', current_x, 'x value now is', army[x][0][0]);
                    last_x = current_x;
                    break;
                }

                var current_y = 0;
                var army_y_length = army[x].length;
                for(var y = 0; y < army_y_length; y++ ) {
                    console.log('looping trough y ', y, 'inside x ', x, 'current_arr is ', first_x, last_x, first_y, last_y);

                    if(y == 0) {
                        console.log('y is 0');
                        if(first_y == 'undefined') {
                            console.log('first_y is undefined. i am on y=0;y=0;. first_y=', army[x][y][1], 'current_y=', army[x][y][1]);

                            first_y = army[x][y][1];
                            current_y = army[x][y][1];
                        } else if(army[x][y][1] > first_y) {
                            console.log('y == 0 and y value is > first_y. total break to loop_1');
                            break loop1;
                        } else if(army[x][y][1] < first_y) {
                            console.log('alfa 55 y == 0 and y value is < first_y. total break to loop_1, x is ', x, 'current_x', current_x);
                            last_x = current_x-1;
                            break loop1;
                        } else {
                            console.log('fourth 14');
                            current_y = army[x][y][1];
                            console.log('i am on y=0;y=0;y=', first_y, 'current_y=', army[x][y][1]);
                            
                        }
                    } else if (last_y != 'undefined') {
                        console.log('last_y is not undefined anymore');
                        if(army[x][y][1] >= first_y && army[x][y][1] <= last_y && army[x][y][1] == current_y+1) {
                            console.log('y >= first_y and y <= last_y and y == current_y+1.');
                            if(y == army_y_length-1 && army[x][y][1] == last_y) {
                                console.log('yra gerai. y yra paskutinis array elementas ir atitinka last_y');
                                if(x == army_x_length-1) {
                                    console.log('y == current_y+1 and y == paskutinis elementas IR x == paskutinis elementas');
                                    last_x = current_x;
                                } 
                            } else if(y == army_y_length-1 && army[x][y][1] != last_y) {
                                console.log('yra blogai. y yra paskutinis array elementas ir NEatitinka last_y');
                                console.log('last_x reikia nusetinti i paskutini. dabar x yra ', x, 'first_x yra ', first_x, 
                                    'last_x yra ', last_x, 'last_x bus ', current_x-1);
                                last_x = current_x-1;

                                break loop1;
                            }
                            current_y = army[x][y][1];
                        } else if(army[x][y][1] < first_y || army[x][y][1] > last_y) {
                            console.log('y < first_y OR y > last_y.');
                            break;
                        } else {
                            console.log('total break; y >= first_y and y <= last_y BUT y != current_y+1.');
                            last_x = current_x-1;
                            break loop1;
                        }
                    } else if(army[x][y][1] < first_y) {
                        console.log('sixt 12');
                        break;
                    } else if(army[x][y][1] > current_y+1) {
                        console.log('sixt 13');
                        last_y = current_y;
                        last_x = current_x;
                        break loop1;
                    } else if(army[x][y][1] == current_y+1 && y == army_y_length-1) {
                        console.log('sixt 14. current_y is ', current_y, ' current_y will be ', army[x][y][1],
                            'last_y is', last_y, 'last_y will be', army[x][y][1]);
                        console.log('y == current_y+1 and y == paskutinis elementas');
                        last_y = army[x][y][1];
                        if(x == army_x_length-1) {
                            console.log('y == current_y+1 and y == paskutinis elementas IR x == paskutinis elementas');
                            last_x = current_x;
                        } 
                    } else if(army[x][y][1] == first_y || (army[x][y][1] > first_y && army[x][y][1] == current_y+1)) { 
                        console.log('y == first_y OR y > first_y and y == current_y+1');
                        current_y = army[x][y][1];
                    } else {
                        console.log('sixt 15');
                        console.log('unexpected behaviour');
                        break;
                    }
                }
            }

            console.log('returning new armies array');
            console.log([first_x, last_x, first_y, last_y]);
            return [first_x, last_x, first_y, last_y];
        } else {
            return false;
        }
    }


    return Preloader;
}]);

