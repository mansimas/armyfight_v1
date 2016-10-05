var helper = angular.module('helper', ['drawings']);
helper.factory('helper', ['drawings', function (Drawings) {
    'use strict';

    function Helper() {}

    Helper.prototype = new Drawings();

    Helper.prototype.iterate_backwards_X = function(y, x, units) {
        y = String(y);
        var self = this;
        if(units == 'ally')  return _.find(self.enemy[y], function (v, k) { return parseInt(k) <= x });
        if(units == 'enemy')  return _.find(self.ally[y], function (v, k) { return parseInt(k) >= x });
    };

    Helper.prototype.iterate_backwards_X_X = function(y, x, units) {
        y = String(y);
        var self = this;
        if(units == 'ally')  return _.find(self.enemy[y], function (v, k) { return parseInt(k) <= x });
        if(units == 'enemy')  return _.find(self.ally[y], function (v, k) { return parseInt(k) >= x });
    };

    Helper.prototype.iterate_X = function(y, x, units) {
        y = String(y);
        var self = this;
        if(units == 'ally')  return _.find(self.enemy[y], function (v, k) { return parseInt(k) >= x });
        if(units == 'enemy')  return _.find(self.ally[y], function (v, k) { return parseInt(k) <= x });
    };

    Helper.prototype.iterate_X_X = function(y, x, units) {
        y = String(y);
        var self = this;
        if(units == 'enemy') return _.find(this.ally[y],  function (v, k) { return parseInt(k) <= x });
        if(units == 'ally') return _.find(this.enemy[y],  function (v, k) { return parseInt(k) >= x });
    };

    Helper.prototype.iterate_Y = function(y, units, test) {
        if(test) console.log(this);
        try {
            if (units == 'ally') {
                if (_.has(this.enemy, y)) {
                    if(test) console.log('has 1. enemy:', this.enemy, 'y:', y, 'has?', _.has(this.enemy, y));
                    return y;
                } else {
                    var direction = 0;
                    for (var i = 1; i < 300; i++) {
                        i = parseInt(i);
                        if (_.has(this.enemy, parseInt(y) + i)) {
                            direction = i;
                            break;
                        } else if (_.has(this.enemy, parseInt(y) - i)) {
                            direction = -i;
                            break;
                        }
                    }
                    if(direction > 0) {
                        var last = 0;
                        for (i = direction; i < 300; i++) {
                            i = parseInt(i);
                            if (_.has(this.enemy, parseInt(y) + i)) {
                                last = i;
                            } else {
                                return y + last;
                            }
                        }
                    } else if(direction < 0) {
                        last = 0;
                        for (i = direction; i > -300; i--) {
                            i = parseInt(i);
                            if (_.has(this.enemy, parseInt(y) + i)) {
                                last = i;
                            } else {
                                return y + last;
                            }
                        }
                    }
                    return y;
                }
            }
            else if (units == 'enemy') {
                if (_.has(this.ally, y)) {
                    return y;
                } else {
                    direction = 0;
                    for (i = 1; i < 300; i++) {
                        i = parseInt(i);
                        if (_.has(this.ally, parseInt(y) + i)) {
                            direction = i;
                            break;
                        } else if (_.has(this.ally, parseInt(y) - i)) {
                            direction = -i;
                            break;
                        }
                    }
                    if(direction > 0) {
                        last = 0;
                        for (i = direction; i < 300; i++) {
                            i = parseInt(i);
                            if (_.has(this.ally, parseInt(y) + i)) {
                                last = i;
                            } else {
                                return y + last;
                            }
                        }
                    } else if(direction < 0) {
                        last = 0;
                        for (i = direction; i > -300; i--) {
                            i = parseInt(i);
                            if (_.has(this.ally, parseInt(y) + i)) {
                                last = i;
                            } else {
                                return y + last;
                            }
                        }
                    }
                    return y;
                }
            }
        } catch(err) {
            console.log('iterate_Y', err, y, units);
        }
    };

    return Helper;
}]);