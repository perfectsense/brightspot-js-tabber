(function(globals, factory) {

    "use strict";

    if (typeof define === 'function' && define.amd) {
        define(['jquery','bsp-utils','bsp-tabber'], factory);

    } else {
        factory(globals.jQuery, globals.bsp_utils, globals.bsp_tabber, globals);
    }

})(this, function($, bsp_utils, bsp_tabber, globals) {
    "use strict";

    var thePlugin = {
        '_each': function(item) {
            var options = this.option(item);
            var moduleInstance = Object.create(bsp_tabber);
            moduleInstance.init($(item), options);
        }
    };

    return bsp_utils.plugin(false, 'bsp', 'tabber', thePlugin);
});