/**
 * Generic tabber
 *
 * Bare minimum example (you'd want to add other elements/classes for semantics/styling):
 * <div data-bsp-module-tabber>
 *   <a href="" class="bsp-tabber-nav active" data-show-tab="1">Tab 1</a>
 *   <a href="" class="bsp-tabber-nav" data-show-tab="2">Tab 2</a>
 *   <a href="" class="bsp-tabber-nav" data-show-tab="3">Tab 3</a>
 *   <div class="bsp-tab active">tab 1 content</div>
 *   <div class="bsp-tab">tab 2 content</div>
 *   <div class="bsp-tab">tab 3 content</div>
 * </div>
 *
 * If you choose not to set an active class on a nav button or tab in the html,
 * the JS will add the active class to the first item.
 *
 * Module options:
 * classActive - defaults to 'active'
 * navSelector - defaults to '.bsp-tabber-nav'
 * tabSelector - defaults to '.bsp-tab'
 * 
 * Events:
 * showTab - fires when a tab is shown, passes an object with
 *   $currentTab - current tab dom element
 *   index - index of current tab (base 1, not base 0)
 *
 * Triggering a tab:
 * The tabber object is exposed as a data attribute on the dom element, 
 * so you can externally trigger a tab to be shown like this:
 * var $tabber = $('.my-tabber').data('tabber');
 * $tabber.showTab(2);
 */
define(function(require){
    "use strict";
    var $           = require('jquery');
    var bsp_utils   = require('bsp-utils');

    var module = {
        currentTab: 1,
        init: function($el, options) {
            var self = this;
            var defaultTabSet = false;
            var defaultNavBtnSet = false;

            this.$el = $el;
            this.options = options;
            
            /** allow default nav to be set in html */
            $el.find(options.navSelector).each(function(key, el) {
                if ( $(el).hasClass(options.classActive) ) {
                    defaultNavBtnSet = true;
                }
            });

            /** default to first nav button if none set */
            if (!defaultNavBtnSet) {
                $el.find(options.navSelector).first().addClass(options.classActive);
            }

            $el.find(options.tabSelector).each(function(key, el) {
                /** save tab index */
                $(el).attr('data-tab-index', key+1);

                /** allow default open tab to be set in html */
                if ( $(el).hasClass(options.classActive) ) {
                    self.currentTab = key+1;
                    defaultTabSet = true;
                }
            });

            /** default to first tab if none set */
            if (!defaultTabSet) {
                $el.find(options.tabSelector).first().addClass(options.classActive);
            }

            /** click handlers for built-in nav */
            $el.find(options.navSelector).on('click', function(e) {
                var index = $(this).data('show-tab');
                self.showTab(index);
                $(options.navSelector).removeClass(options.classActive);
                $(this).addClass(options.classActive);
                e.preventDefault();
            });

            /** expose tabber js through data attribute */
            $el.data('tabber', this);
        },
        showTab: function(index) {
            var self = this;
            var $currentTab;
            this.$el.find(this.options.tabSelector).each(function(key, tab) {
                var $tab = $(tab);
                if ( $tab.data('tab-index') === index ) {
                    $tab.addClass(self.options.classActive);
                    $currentTab = $tab;
                } else {
                    $tab.removeClass(self.options.classActive);
                }
            });
            this.currentTab = index;
            this.$el.trigger('showTab', {
                $currentTab: $currentTab,
                index: index
            });
        }
    };
    
    var thePlugin = {
        '_defaultOptions': {
            'classActive': 'active',
            'navSelector':  '.bsp-tabber-nav',
            'tabSelector':  '.bsp-tab'
        },
        '_each': function(item) {
            var options = this.option(item);
            var moduleInstance = Object.create(module);
            moduleInstance.init($(item), options);
        }
    };

    return bsp_utils.plugin(false, 'bsp', 'tabber', thePlugin);
});