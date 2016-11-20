var preloader = angular.module('preloader', []);
preloader.factory('preloader', [function () {
    'use strict';

    function Preloader() {
        this.preloader_count = 0;
        this.compressed_lengthx = 0;
        this.tester = [];
    }

// [30,5,55,25,10,i,s],[0,0,0,0,0,16,0,50,0,0,f,0,1,a,f,0,1000][232,232,26,35]


    Preloader.prototype.register_load_data = function() {


        // var units = [
        //     [[71,143]],
        //     [[72,143]]
        // ];

    
        if(this.frame == 1) {
            console.log("this.core.changed_units", this.core.changed_units);
        }

        // console.log('uncompressed', this.core.changed_units);
        // this.armies_encoding(this.core.changed_units);
        // this.core.changed_units = {};
    }

    Preloader.prototype.armies_encoding = function(units) {
        var compressed_units = this.first_compression_level(units);
       
        for(var x = 0; x < compressed_units['armies_array'].length; x++) {
            console.log('Next army')
             console.log(JSON.stringify(compressed_units['armies_array'][x]));

        //     var compressed = compress_array(compressed_units['armies_array'][x]);
        
        //     // if(compressed.length > 1) {
        //     //     this.compressed_lengthx++;
        //     // }
        //     // this.preloader_count += compressed.length;
        //     // if(this.preloader_count % 1000 === 0) {
        //     //     console.log(this.preloader_count, this.compressed_lengthx);
               
        //     // }
        }
        
        // var units_arr = this.second_compression_level(compressed_units['armies_array']);
        // console.log('2nd compression', units_arr);
        // var comp_arr = this.third_compression_level(units_arr);
        // console.log('3rd compression', comp_arr);
        // if(this.frame == 2) {
        //     var a = this.decompress([5, 4, 17, 11, +1, +1, 1, 4, 92, 35, 0, +1]);
        //     console.log('DECOMPRESSED');
        //     console.log(a);
        // }
    }

    Preloader.prototype.contains_arrays = function(arr1, arr2, attrs) {
        for(var x = 0; x < arr1.length; x++) {
            var temp = arr1[x];
            var same_elements = 0;
            for(var y=0; y<arr1[x].length; y++) {
                if(arr1[x][y] == arr2[y]) {
                    same_elements++;
                }
            }
            if(same_elements == arr1[x].length) {
                if(attrs == 'index') {
                    return x;
                } else {
                    return true;
                }
            }
        }
        if(attrs == 'index') {
            return -1;
        } else {
            return false;
        }
    }

    Preloader.prototype.first_compression_level = function(units) {
        var unit_global_stats = [];
        var unit_local_stats = [];
        var armies_array = [];
        var self = this;
        _.each(units, function (val, y) {
            _.each(val, function (u, x) {
                var global_stats = [u.stats.def_arch, u.stats.def_hors, u.stats.def_inf,
                    u.stats.dmg, u.stats.speed, u.stats.type, u.stats.unit];
                var glob = 0;

                for(var x=0; x<unit_global_stats.length; x++) {
                    var temp = unit_global_stats[x];
                    var same_elements = 0;
                    for(var y=0; y<unit_global_stats[x].length; y++) {
                        if(unit_global_stats[x][y] == global_stats[y]) {

                        }
                    }
                }

                if(!self.contains_arrays(unit_global_stats, global_stats)) {
                    glob = unit_global_stats.push(global_stats) - 1;
                } else {
                    glob = self.contains_arrays(unit_global_stats, global_stats, 'index');
                }

                var local_stats = [glob, u.attacking, u.direction_x, u.direction_y, u.facedirection,
                    u.frame, u.killed, u.move_x, u.move_y, u.status, u.stopped, u.target_id, 
                    u.team, u.unit_type, u.waiting, u.waiting_time, u.stats.hp ];

                // if(u['target']) {
                    // var active_stats = [u.x, u.y, u['target']['x'], u['target']['y']];  // dar targetu nepushinu
                // } else {
                //     active_stats = [u.x, u.y];
                // }

                // armies_array = [ // armiju kiekiai. bendras array
                //         [ //pirmos x eiles kiekiai
                //             [x, y],[x, y] //ixai ygrikai
                //     ]
                // ]
                if(!self.contains_arrays(unit_local_stats, local_stats)) {
                    unit_local_stats.push(local_stats);
                    var indx1 = armies_array.push([]) - 1; // new army
                    if(indx1 == 105) {
                        self.tester = ['val', val, 'y', y, 'unit', u, 'x', x];
                    }
                    var indx2 = armies_array[indx1].push([]) - 1; //  new arr of x
                    armies_array[indx1][indx2].push([u.x, u.y, u.target.x, u.target.y]); 
                } else {
                    var indx = self.contains_arrays(unit_local_stats, local_stats, 'index'); // susirandu kuri armija
                    var x_index = self.exist_x_row(armies_array[indx], u.x);
                    // console.log('x_index', x_index, 'armies_array[indx], u.x', armies_array[indx], u.x);
                    if(x_index === false) {
                        var x_index = armies_array[indx].push([]) - 1 ;
                        armies_array[indx][x_index].push([u.x, u.y, u.target.x, u.target.y]);
                    } else {
                        armies_array[indx][x_index].push([u.x, u.y, u.target.x, u.target.y]);
                    }
                }
            });
        });

        return {
            global_stats: unit_global_stats,
            local_stats: unit_local_stats,
            armies_array: armies_array
        }
    };

    Preloader.prototype.exist_x_row = function(army, last_x) {
        for(var x = 0; x < army.length; x++) {
            if(army[x][0][0] == last_x) {
                return x;
            }
        }
        return false;
    }

    Preloader.prototype.second_compression_level = function(army_units) {
        var splitted_armies_arr = [];
        for(var x = 0; x < army_units.length; x++) {
            splitted_armies_arr[x] = [];
            for(var y = 0; y < army_units[x].length; y ++) {
                for(var z = 0; z < army_units[x][y].length; z ++) {
                    if(y == 0) splitted_armies_arr[x][z] = [];
                    splitted_armies_arr[x][z].push(army_units[x][y][z]);
                }
            }
        }
        return splitted_armies_arr;

    };

    Preloader.prototype.third_compression_level = function(units_arr) {
        var compressed_armies_arr = [];
        var self = this;
        for(var x = 0; x < units_arr.length; x++) { //viso armiju. gali buti 12
            var completed_array = [];
            if(units_arr[x][0][0].length > 2) {
                compressed_armies_arr.push(['susitvarkyasiu']);
            } else {
                compressed_armies_arr.push(self.find_pattern(units_arr[x]));
            }
            // for(var y = 0; y < units_arr[x].length; y++) { //viso x,y,ex,ey variantu. yra 4
            //     self.find_pattern(units_arr[x][y]);
                // for(var z = 0; z < units_arr[x][y].length; z++) { //viso unitu. visada vienodai
                //     completed_array[y] = [];
                //     if(units_arr[x][y].length > 2) { // jei armijai priklauso virs 2 unitu
                //         if(z == 0) {
                //         } else if(z == 1) {
                //             differences.push(units_arr[x][y][1] - units_arr[x][y][0]);
                //         } else {
                //             self.find_pattern(units_arr[x][y], differences,  z);
                //         }
                //     } else { //jei armija iki 2 unitu, tiesiog ikeli unitus
                //         completed_array[y].push(z);
                //     }
                // }
            
        }
        return compressed_armies_arr;

    };

    Preloader.prototype.find_pattern = function(units_arr) {
        var pattern = [];

        for(var y = 0; y < units_arr.length; y++) { //viso x,y,ex,ey variantu. yra 4
            var first_x = 0;
            var differences = 0;
            var same_ixes = 0;
            var same_ygrix = 0;
            var last_changed = 0;
            var cap_reached = false;
            for(var z = 0; z < units_arr[y].length; z++) {
                if(z == 0) {
                    first_x = units_arr[y][z];
                    same_ixes++;
                    same_ygrix++;
                } else if (z == 1) {
                    differences = units_arr[y][1] - units_arr[y][0];
                    same_ixes++;
                } else {
                    if(units_arr[y][z] - units_arr[y][z-1] == differences) {
                        if(!cap_reached) same_ixes++;
                    } else {
                        cap_reached = true;
                        same_ygrix++;
                    }
                }
            }
            pattern.push({
                units_arr: units_arr[y],
                first_x: first_x,
                differences: differences,
                same_ixes: same_ixes,
                same_ygrix: same_ygrix
            })
        }

        return pattern;
        
    }

    // items = [5, 4, 17, 11, +1, +1, 1, 4, 92, 35, 0, +1]

    // items[0] (in example 5) is rows;
    // items[1] (in example 4) is columns;
    // items[2] (in example 17) is unit x start;
    // items[3] (in example 11) is unit y start;
    // items[4] (in example 1) is unit x multiplier;
    // items[5] (in example 1)  is unit y multiplier;

    // items[6] (in example 1) is target rows;
    // items[7] (in example 4) is target columns;
    // items[8] (in example 92) is target x start;
    // items[9] (in example 35) is target y start;
    // items[10] (in example 0) is target x multiplier;
    // items[11] (in example 1)  is target y multiplier;

    // // items = [5, 4, 17, 11, +1, +1, 1, 4, 92, 35, 0, +1]


    Preloader.prototype.decompress = function(items) {
        var targets_object = {};

        for(var a = 0; a < items[6]; a++) { // iterate target rows
            if(items[8]) {
                var target_x_coordinate = items[8] + items[10]*a; // extract unit x coordinate
            } else {
                target_x_coordinate = undefined;
            }
            if(!_.has(targets_object, a)) targets_object[a] = {}; // register target
            for(var b = 0; b < items[7]; b++) { // iterate unit columns
                if(items[9]) {
                    var target_y_coordinate = items[9] + items[11]*b; // extract unit y coordinate
                } else {
                    target_y_coordinate = undefined;
                }
                targets_object[a][b] = [target_x_coordinate, target_y_coordinate]; // populate targets
            }
        }

        var units_object = {};

        for(var x = 0; x < items[0]; x++) { // iterate unit rows
            var real_x_coordinate = items[2] + items[4]*x; // extract unit x coordinate
            if(!_.has(units_object, x)) units_object[x] = {}; // register target
            for(var y = 0; y < items[1]; y++) { // iterate unit columns
                var real_y_coordinate = items[3] + items[5]*y; // extract unit y coordinate
                var a = 0;
                var b = 0;
                if(items[10] > 0) a = x;
                if(items[11] > 0) b = y;

                var target_coordinates = targets_object[a][b];
                units_object[x][y] = [real_x_coordinate, real_y_coordinate, target_coordinates[0], target_coordinates[1]]; 
            }
        }

        return {units_object: units_object, targets_object: targets_object};

    };




    function compress_array(army) {
        var compressed_armies = [];
        var last_compressed_army = false;

        while (true) {
            army = armies_reducer(army, last_compressed_army);
            last_compressed_army = extract_compressed_army(army);
            if(last_compressed_army) { compressed_armies.push(last_compressed_army); }
            else {break;}
        }
        return compressed_armies;
    }


    // last_compressed_army = [first_x, ending_x, first_y, ending_y]
    function armies_reducer(army, last_compressed_army) {

        if(last_compressed_army) {
            var new_army = [];
            for(var x = 0, len_x = army.length; x < len_x; x++) {
                var holder = false;
                for(var y = 0, len_y = army[x].length; y < len_y; y++ ) {
                    if(army[x][y][0] >= last_compressed_army[0] && army[x][y][0] <= last_compressed_army[1] &&
                       army[x][y][1] >= last_compressed_army[2] && army[x][y][1] <= last_compressed_army[3]) {
                      // do nothing
                    } else {
                        if(!holder) {
                            holder = [];
                        }
                        holder.push([army[x][y][0], army[x][y][1]]);
                    }
                }
                if(holder) {
                    new_army.push(holder);
                }
            }
            return new_army;
        } else {
            return army;
        }

    }


    // Purpose of this function: It must return only ONE rectangular area from given array.
    // This function will be called so many times over and over until there is no armies left. This is compression of armies.
    // Right now it returns only the first army starting from the top left corner.
    // During real army fight of 20.000 units, this function is called about 1 million times.
    // Thats why it should be fast and accurate. 
    //
    // army EXAMPLE:
    //
    //
    // army = [
    //     [11, 51], [11, 52], [11, 53],        
    //     [12, 51], [12, 52], [12, 53],
    //     [13, 51], [13, 52], [13, 53]
    // ]
    //
    //
    // This is the simplest example of army with 9 units on field.
    //
    // Unit = [X, Y], in comments - this is coordinates, not a variable.
    // Iteration = [x, y] , in comments - this is loop variable.
    function extract_compressed_army(army) {
        if(army.length > 0) {
            var first_x = 0;
            var last_x = 0;
            var ending_x = 0;
            var first_y = 'undefined';
            var ending_y = 'undefined';

            // Iterate the X of this army. In this example, X = [11, 12, 13]
            loop1: for(var x = 0, army_x_length = army.length; x < army_x_length; x++) {

                // Check if x == 0. Select the overall first element of this army, which is [11, 51]. 
                // X = 11, Y = 51. So, make first_x and last_x to 11. 
                // For example, army[0] has many array elements. But every elements first value is the same (11). 
                // This way is easy to find the X for all arrays. Just need to take army[0][0][0], this is X.
                 if(x == 0) { 
                    first_x = army[0][0][0];
                    last_x = army[0][0][0];

                // Check if X is by 1 higher than last_x. If yes, then it is perfect situation. Just update last_x.
                } else if(army[x][0][0] == last_x+1) { 
                    last_x = army[x][0][0];

                // But if X is not higher by 1? Then it should not be included in current rectangular army anymore.
                // So just exclude this X. And stop all iterations. Just set that ending_x is last_x and return result.
                } else {
                    ending_x = last_x;
                    break;
                }

                var last_y = 0;

                // So, X iteration is clear. Now its time for Y iterations.
                for(var y = 0, army_y_length = army[x].length; y < army_y_length; y++ ) {

                    // the same as with X. But this happends every time the X is looped.
                    if(y == 0) {

                        // this happends only once. later first_y is always defined.
                        if(first_y == 'undefined') {
                            first_y = army[x][y][1];
                            last_y = army[x][y][1];

                            // if this is last element in Y array, set it as ending_y.
                            // This happends if army is made only of one units column. This situation is common.
                            if(y == army_y_length-1) { 
                                ending_y = last_y;
                            }

                            // if this is also last element in X array, set it as ending_x.
                            // This happends if army is made only of one units row. This situation is common.
                            // It can also be so, that army is made of overall only one unit. So only here ending_x becomes value.
                            if(x == army_x_length-1) { 
                                ending_x = last_x;
                            }

                        // This happends if x!=0, but y==0. But y is not the same as first_y = bad. It means, that It is not rectangular.
                        // So, iteration ends here. Ends all iterations, including X iteration. Just need to input the ending_x.
                        //
                        // But this can be improved. If y < first_y, i could check maybe exist same y as first_y and then proceed looping.
                        //
                        // example_army = [
                        //               [11, 52], [11, 53],    
                        //     [12, 51], [12, 52], [12, 53],   <= Situation here. first_y=52. But last_y is 51.
                        //     [13, 51], [13, 52], [13, 53]
                        // ]
                        //
                        // So, i could always start iterations from first_y when it is present. Just if Y != first_y, break until i find it is.
                        // But if there are 1 million Y before first_y? I waste so many iterations. So this function would be much slower.
                        // And anyway the next time i will start iterations with the new army, without this X (11) line anymore and start from 12.
                        // So, in this situation, preformance is better. But database space can be more used in some cases.
                        } else if(army[x][y][1] != first_y) {
                            ending_x = last_x-1;
                            break loop1;

                        // This happends when everything is fine, when y==0 and last_y == first_y.
                        } else {
                            last_y = army[x][y][1];

                            // check if y is last element of y arrays. It means, that iteration is over, but need to register ending_y.
                            // ending_y should be updated only once and never again.
                            if(y == army_y_length-1) {
                                ending_y = last_y;
                            }

                            // check if x is last element of x arrays. Need to register ending_x.
                            // ending_x should be updated only once and never again.
                            if(x == army_x_length-1) {
                                ending_x = last_x;
                            }
                            
                        }

                    // This happends only when x != 0. If i have already found ending_y.
                    } else if (ending_y != 'undefined') {
                        
                        // This happends when everything is fine. Y is increased by 1, as it should be. 
                        // And Y is not lower then first_y. And Y is not higher then ending_y. It is in perfect situation.
                        if(army[x][y][1] >= first_y && army[x][y][1] <= ending_y && army[x][y][1] == last_y+1) {

                            // Check maybe Y is last element in array. But it must be also same as ending_y.
                            if(y == army_y_length-1 && army[x][y][1] == ending_y) {

                                // Check maybe and X is last element of array. If yes, update ending_x. 
                                // Iteration should end here naturally. Y and X are last elements of array.
                                // as ending_y must be updated only once, and it is already, i dont need to update it here again. 
                                if(x == army_x_length-1) {
                                    ending_x = last_x;
                                } 

                            // And if y is last element of array. Yes, Y is between first_y and ending_y, and increased by 1 from last_y.
                            // BUT y it is last element of array and != ending_y. Its bad. All loops must end.
                            // In future this can be improved. It should compare possible candidate to previous army.
                            // For example:
                            //
                            // example_army = [
                            //     [11, 51], [11, 52], [11, 53],    
                            //     [12, 51], [12, 52],              <= Situation here. ending_y=53. But last_y is 52. And it's last.
                            //     [13, 51], [13, 52]
                            // ]
                            //
                            // In this situation, i should compare two rectangulars, which is bigger.
                            // I could extract two rectangulars by changing ending_y. First ending_y is 53. But if i reduce it to 52,
                            // I extract higher rectangular in this example than by having ending_y with 53.
                            //
                            // But in this way, the comparison takes longer and much more iterations. So, it can be faster in some
                            // situations if i just make as less iterations as possible. Anyway there will be 2 rectangulars in both cases.

                            } else if(y == army_y_length-1 && army[x][y][1] != ending_y) {
                                ending_x = last_x-1;
                                break loop1;
                            }

                            // If no breaks, just update last_y
                            last_y = army[x][y][1];

                        // This happends when y < first_y or y > ending_y. This is not first element of y array. So y!=0. 
                        // So, y < first_y probably is not logical? Because it should have to be absolutely breaked before, 
                        // when y was 0 and not equal first_y. 
                        // What about y > ending_y? It can be logical. But if Y != last_y+1. It could be like Y == last_y+10.
                        // So just skip this y iteration and go to the next x line. But this looks buggy. Giving it TODO action
                        // for further investigation what to do in this situation.
                        } else if(army[x][y][1] < first_y || army[x][y][1] > ending_y) {
                            break;

                        // This happends in all the other cases.. Or probably in one case? When Y >= first_y and Y <= ending_y and
                        // Y != last_y+1. It means this x row is corrupted, missing unit or somewhat like that. Just stop all iterations. 
                        } else {
                            ending_x = last_x-1;
                            break loop1;
                        }

                    // Ok, in this situation ending_y is undefined. So, it means, x==0. And this situation is when Y < first_y and y != 0.
                    // It should happend when first_y is already present. Y are always sorted. So this is unlogical. This should never happend.
                    // But it can happend if something happends to an army and Y is not sorted anymore.. somehow. This should report a bug.
                    } else if(army[x][y][1] < first_y) {
                        console.log('BUG. Y is less then first_y. y != 0. x == 0. ending_y == undefined. Given Y array is probably unsorted!');
                        break;

                    // This should happend when ending_y is undefined. So x==0. y > 0. and Y > last_y+1. Thats not good. Loop must end.
                    } else if(army[x][y][1] > last_y+1) {
                        ending_y = last_y;
                        ending_x = last_x;
                        break loop1;

                    // This should happend when ending_y is undefined. So x==0. y > 0. and Y == last_y+1. And y is last element of array.
                    // So, everything is good. The y loop ends here and goes to the next x loop. Just update variables.
                    } else if(army[x][y][1] == last_y+1 && y == army_y_length-1) {
                        ending_y = army[x][y][1];

                        // If not only y is last element of array, but also and x is last, need to not forget to update ending_x.
                        if(x == army_x_length-1) {
                            ending_x = last_x;
                        }
                        
                    // This should happend when ending_y is undefined. So x==0. y > 0. But Y can be same as first_y. Or Y can be higher then 
                    // first_y and be by 1 higher then last_y. This is good. This place should be reached many times when x==0.
                    } else if(army[x][y][1] == first_y || (army[x][y][1] > first_y && army[x][y][1] == last_y+1)) { 
                        last_y = army[x][y][1];

                    // This should happend when ending_y is undefined. So x==0. y > 0. But if Y == last_y, then i have duplicated Y values,
                    // what should never happed. If happends, it menas, that my army is bugged. It must never have duplicated x/y values.  
                    } else if(army[x][y][1] == last_y) {
                        console.log('BUG. Duplicated Y value on same X value');
                        ending_y = last_y;
                        ending_x = last_x;
                        break loop1;

                    // This should be when x==0, ending_y==undefined, Y > first_y, Y < last_y+1. This should never logically happend.  
                    } else {
                        console.log('BUG. Y value is less then last_y+1, but more then first_y, x==0, ending_y==undefined');
                        break;
                    }
                }
            }

            return [first_x, ending_x, first_y, ending_y];
        } else {
            return false;
        }
    }


    return Preloader;
}]);












// // drawing start

// var canvas  = document.getElementById("canvas");
// var ctx = canvas.getContext("2d");
// var army = {};

// canvas.addEventListener('mousedown', function(evt) { 
//    var rect = canvas.getBoundingClientRect();
//    var unit_x = Math.floor ((evt.clientX - rect.left) / 50);
//    var unit_y = Math.floor ((evt.clientY - rect.top) / 50);
//    var row = army.hasOwnProperty(unit_x) ? army[unit_x] : army[unit_x] = {};
//    if(!row.hasOwnProperty(unit_y)) row[unit_y] = -1;
//    else delete row[unit_y];
//    //alert('->['+unit_x+','+unit_y+']<-');
//    draw();
// }, false);

// document.getElementById ("compress").addEventListener ("click", compress, false);

// function stroke_grid() {
//   for(var a = 0; a <= 10; a++) {
//     ctx.strokeStyle = 'black';
//     ctx.beginPath();
//     ctx.moveTo(a*50, 0);
//     ctx.lineTo(a*50, 500);
//     ctx.fillStyle = 'black';
//     ctx.font = '15px serif'
//     ctx.fillText(a, a*50 + 25, 515);
    
//     ctx.moveTo(0,   a*50);
//     ctx.lineTo(500, a*50);
//     ctx.stroke();
//     ctx.fillText(a, 510, a*50 + 25);
//   }
//   ctx.fillText("X:", 0, 515);
//   ctx.fillText("Y:", 505, 11);
// }

// function draw_army() {
//   for (var x in army){
//     for(var y in army[x]) {
//     //alert('('+x+','+y+')');
//       ctx.fillStyle = 'red';
//       ctx.fillRect(x*50, y*50, 50, 50);
//       ctx.fillStyle = 'black';
//       ctx.font = '10px serif'
//         ctx.fillText(String(x) + ", " + String(y), x*50 + 5, y*50 + 10);
//     }
//   }
// }

// function clear_canvas() { ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height); }

// function draw() {
//     clear_canvas();
//   draw_army();
//   stroke_grid();
// }

// function draw_grouped_army(army) {
//   for (var x in army){
//     var row = army[x];
//     for(var y in row) {
//       ctx.fillStyle = 'blue';
//       ctx.font = '20px serif'
//         ctx.fillText(row[y], x*50 + 30, y*50 + 40);
//     }
//   }
// }

// draw();


// // drawing end. compressing start


// function compress() {
//     reconstruct_army(army);
//   calculate_groups(army);
//   draw_grouped_army(army);
// }

// function reconstruct_army(army) {
//   for (var x in army){
//     var row = army[x];
//     for(var y in row) 
//       row[y] = -1;
//   }
// }

// function calculate_groups(army) {
//   var num = -1;
//   var findyy = function(row, y){
//     while (row.hasOwnProperty(y) && row[y] == -1) y++;
//     return y;
//   }
//   var asgnyy = function(row, y, yy){ for (var i = y; i < yy; ++i) row[i] = num; }
//   var assign = function(row, x, y){
//     num++;
//     var yy = findyy(row,y);
//     do {
//       asgnyy(row,y,yy);
//       x++;
//       if (!army.hasOwnProperty(x)) return;
//       row = army[x];
//       var yx = findyy(row,y);
//       if (yx < yy) return;
//     } while (true);
//   }
//   for (var x in army) {
//     var row = army[x];
//     for(var y in row) {
//       if (row[y] == -1)
//         assign(row,x,y);
//     }
//   }
// }

