(function() {
    Object.defineProperties(Object.prototype, {
        each : {
            value: function(callback) {
                for (var key in this) {
                    callback(this[key], key);
                }
                return this;
            },
        },
        map : {
            value: function(callback) {
                for (var key in this) {
                    this[key] = callback(this[key], key);
                }
                return this;
            }
        },
        collect : {
            value: function(callback) {
                var ret = {};
                for (var key in this) {
                    ret[key] = callback(this[key], key);
                }
                return ret;
            }
        },
        reduce : {
            value : function(callback) {
                var ret = (arguments.length > 1) ? arguments[1] : null;
                for (var key in this) {
                    ret = callback(this[key], ret);
                }
                return ret;
            }
        },
        has : {
            value: function(needle) {
                if (needle instanceof Array) {
                    var ref = this;
                    var collectCallback = function(eachNeedle) {
                        return ref.has(eachNeedle);
                    }
                    var reduceCallback  = function(current, ret) {
                        return (current && ret);
                    }
                    return needle
                        .collect(collectCallback)
                        .reduce(reduceCallback, true);
                }

                var force = (arguments.length > 1) ? arguments[1] : false;
                if (force) {
                    for (var key in this) {
                        if (this[key] === needle) {
                            return true;
                        }
                    }
                    return false;
                } else {
                    for (var key in this) {
                        if (this[key] == needle) {
                            return true;
                        }
                    }
                    return false;
                }
            }
        },
        hasKey : {
            value: function(needle) {
                if (needle instanceof Array) {
                    var ref = this;
                    var collectCallback = function(eachNeedle) {
                        return ref.hasKey(eachNeedle);
                    }
                    var reduceCallback  = function(current, ret) {
                        return (current && ret);
                    }
                    return needle
                        .collect(collectCallback)
                        .reduce(reduceCallback, true);
                }

                return (this[needle] != undefined);
            }
        },
        merge : {
            value : function(target) {
                if (!(target instanceof Object)) {
                    throw 'only an object can be merge to an object';
                }
                var ref = this;
                target.each(function(value, key) {
                    ref.key = value;
                });
                return this;
            },
        },
        toJson : {
            value : function() {
                return JSON.stringify(this);
            }
        },
    });
})();
