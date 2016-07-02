var drawings = angular.module('drawings', ['death_canvas']);
drawings.factory('drawings', ['death_canvas', function (DeathCanvas) {
    'use strict';

    function Drawings() {}

    Drawings.prototype = new DeathCanvas();

    return Drawings;
}]);






//     next_canvas.addEventListener('touchstart', function(evt) {
//     $scope.touches = $scope.touches + evt.changedTouches.length;

//     if(!_.isEmpty(core2)) {
//         army_drag_x_first = evt.targetTouches[0].pageX;
//         army_drag_y_first = evt.targetTouches[0].pageY;
//         var mousePos = getMobileMousePos(canvas, evt);
//         check_draggable_army(mousePos.x, mousePos.y);
//     }
//     if(!_.isEmpty(selected_army)) {
//         drag_army = true;
//         $scope.unit_for_stats_change = selected_army;
//         if(selected_army.unit_type == 'ally') {
//             $scope.unit_for_stats_change.stats = $scope.ally_formation[selected_army.id].stats;
//             $scope.unit_for_stats_change.x = $scope.ally_formation[selected_army.id].x;
//             $scope.unit_for_stats_change.y = $scope.ally_formation[selected_army.id].y;
//         } else {
//             $scope.unit_for_stats_change.stats = $scope.enemy_formation[selected_army.id].stats;
//             $scope.unit_for_stats_change.x = $scope.enemy_formation[selected_army.id].x;
//             $scope.unit_for_stats_change.y = $scope.enemy_formation[selected_army.id].y;
//         }
//         $scope.formation_changed();
//         draw_army_borders();
//     } else {
//         army_drag_x_first = 0;
//         army_drag_y_first = 0;
//         selected_army = {};
//         $scope.formation_changed();
//         drag_screen = true;
//         drag_x_first = evt.targetTouches[0].pageX + drag_x;
//         drag_y_first = evt.targetTouches[0].pageY + drag_y;

//         if(!_.isEmpty(core)) {
//             var mousePos = getMobileMousePos(canvas, evt);
//             if (core.getPosData(mousePos.x+drag_x, mousePos.y+drag_y)) {
//                 background_canvas_ctx.clearRect(0, 0, $scope.canvas_width, $scope.canvas_height);
//                 background_canvas_ctx_drawing();
//                 clear_canvas();
//                 draw_deaths();
//                 core.redraw_units();
//                 show_unit_stats(mousePos.x+drag_x, mousePos.y+drag_y);
//                 show_unit_data = true;
//             } else {
//                 next_canvas_ctx.clearRect(0, 0, next_canvas_ctx.canvas.width, next_canvas_ctx.canvas.height);
//                 show_unit_data = false;
//             }
//         }
//     }
// }, false);

// next_canvas.addEventListener('touchend', function(e) {
//     drag_screen = false;
//     drag_army = false;
//     selected_army = {};
// }, false);

// next_canvas.addEventListener('touchmove', function(e) {
//     if(drag_screen) {
//         if(!_.isEmpty(core)) {
//             drag_x = drag_x_first - e.targetTouches[0].pageX;
//             drag_y = drag_y_first - e.targetTouches[0].pageY;
//             background_canvas_ctx.clearRect(0, 0, $scope.canvas_width, $scope.canvas_height);
//             background_canvas_ctx_drawing();
//             clear_canvas();
//             draw_deaths();
//             core.drag_x = drag_x;
//             core.drag_y = drag_y;
//             core.redraw_units();
//             $scope.countAlly = core.getCountAlly();
//             $scope.countEnemy = core.getCountEnemy();
//             if(show_unit_data == true) show_unit_stats();
//             next_canvas_ctx.clearRect(0, 0, next_canvas_ctx.canvas.width, next_canvas_ctx.canvas.height);
//             show_unit_data = false;
//         } else if(!_.isEmpty(core2)) {
//             drag_x = drag_x_first - e.targetTouches[0].pageX;
//             drag_y = drag_y_first - e.targetTouches[0].pageY;
//             background_canvas_ctx.clearRect(0, 0, $scope.canvas_width, $scope.canvas_height);
//             background_canvas_ctx_drawing();
//             $scope.formation_changed();
//         }

//     } else if(drag_army) {
//         if(!_.isEmpty(core2) && !_.isEmpty(selected_army)) {
//             var armyN = selected_army;
//             if(selected_army.unit_type == 'ally') {                   
//                 var armyO = $scope.ally_formation[armyN.id];
//                 var adrag_x = army_drag_x_first - e.targetTouches[0].pageX;
//                 var adrag_y = army_drag_y_first - e.targetTouches[0].pageY;

//                 if(adrag_x > 0) {
//                     var bdrag_x = Math.ceil(adrag_x/($scope.distance_x+1));
//                 } else {
//                     bdrag_x = Math.floor(adrag_x/($scope.distance_x+1));
//                 }
//                 if(adrag_y > 0) {
//                     var bdrag_y = Math.ceil(adrag_y/($scope.distance_y+1));
//                 } else {
//                     bdrag_y = Math.floor(adrag_y/($scope.distance_y+1));
//                 }

//                 $scope.ally_formation[armyN.id].x = armyO.x - bdrag_x;
//                 $scope.ally_formation[armyN.id].y = armyO.y - bdrag_y;
//                 $scope.unit_for_stats_change = $scope.ally_formation[armyN.id];

//             } else {
//                 armyO = $scope.enemy_formation[armyN.id];
//                 var adrag_x = army_drag_x_first - e.targetTouches[0].pageX;
//                 var adrag_y = army_drag_y_first - e.targetTouches[0].pageY;

//                 if(adrag_x > 0) {
//                     var bdrag_x = Math.ceil(adrag_x/($scope.distance_x+1));
//                 } else {
//                     bdrag_x = Math.floor(adrag_x/($scope.distance_x+1));
//                 }
//                 if(adrag_y > 0) {
//                     var bdrag_y = Math.ceil(adrag_y/($scope.distance_y+1));
//                 } else {
//                     bdrag_y = Math.floor(adrag_y/($scope.distance_y+1));
//                 }
//                 $scope.enemy_formation[armyN.id].x = armyO.x - bdrag_x;
//                 $scope.enemy_formation[armyN.id].y = armyO.y - bdrag_y;
//                 $scope.unit_for_stats_change = $scope.enemy_formation[armyN.id];
//             }

//             army_drag_x_first = e.targetTouches[0].pageX;
//             army_drag_y_first = e.targetTouches[0].pageY;

//             $scope.formation_changed();
//             $scope.saved = false;
//         }
//     }
// });
