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
 * navClass - defaults to 'bsp-tabber-nav'
 * tabClass - defaults to 'bsp-tab'
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
(function(globals, factory) {

    "use strict";

    if (typeof define === 'function' && define.amd) {
        define(['jquery','bsp-utils'], factory);

    } else {
        factory(globals.jQuery, globals.bsp_utils, globals);
    }

})(this, function($, bsp_utils, globals) {
    "use strict";

    var module = {
        currentTab: 1,
        showNav: true,
        tabCount: 0,
        init: function($el, options) {
            var self = this;
            self.$el = $el;
            self.options = options;
            $el.data('tabber', self);
            self.setDefaultTab();
            self.render();
        },
        setDefaultTab: function() {
            var self = this;
            this.$el.find('.' + this.options.tabClass).each(function(key, tab) {
                if ($(tab).hasClass(self.options.classActive)) {
                    self.currentTab = key+1;
                }
            });
        },
        showTab: function(index) {
            var self = this;
            var $currentTab = this.$el.find('.' + this.options.tabClass + '[data-tab-index='+this.currentTab+']');
            var $nextTab = this.$el.find('.' + this.options.tabClass + '[data-tab-index='+index+']');
            if (!this.options.showTabOverride) {
                this.doShowTab(index);
            }
            this.$el.trigger('showTab', {
                $currentTab: $currentTab,
                $nextTab: $nextTab,
                index: index,
                tabber: self
            });
        },
        doShowTab: function(index) {
            this.currentTab = index;
            this.render();
        },
        nextTab: function() {
            if (this.currentTab < this.tabCount) {
                this.showTab(this.currentTab+1);
            } else if (this.currentTab == this.tabCount && this.options.loop) {
                this.showTab(1);
            }
        },
        prevTab: function() {
            if (this.currentTab > 1) {
                this.showTab(this.currentTab-1);
            } else if (this.currentTab == 1 && this.options.loop) {
                this.showTab(this.tabCount);
            }
        },
        addTab: function(options) {
            var self = this;
            var newTab = $('<div></div>', {
                class: self.options.tabClass,
                'data-nav-title': options.title,
                'data-nav-class': options.navClass
            });
            newTab.append(options.content);
            if (options.insertAfter > 0) {
                self.$el.find('.' + self.options.tabClass).each(function(key, tab) {
                    if ((key+1) == options.insertAfter) {
                        $(tab).after(newTab);
                    }
                });
                if (options.insertAfter <= self.currentTab) {
                    self.currentTab++;
                }
            } else if (options.insertAfter === 0) {
                self.$el.prepend(newTab);
                self.currentTab++;
            } else {
                self.$el.append(newTab);
            }
            this.$el.trigger('addTab');
            self.render();
        },
        removeTab: function(i) {
            var $tab = this.$el.find('[data-tab-index='+i+']');
            if ($tab.hasClass(this.options.classActive)) {
                this.currentTab = 1;
            }
            $tab.remove();
            this.$el.trigger('removeTab');
            this.render();
        },
        indexTabs: function() {
            var self = this;
            self.tabCount = 0;
            this.$el.find('.' + this.options.tabClass).each(function(key, el) {
                $(el).attr('data-tab-index', key+1);
                self.tabCount++;
            });
        },
        render: function() {
            this.indexTabs();
            this.renderNav();
            this.renderTabs();
        },
        renderNav: function() {
            if (this.options.showNav) {
                var self = this;
                var selector = '.' + self.options.navContainerClass;
                var navHtml = '<div class="'+self.options.navContainerClass+'">';
            
                self.$el.find(selector).remove();

                self.$el.find('.' + self.options.tabClass).each(function(key, val) {
                    var linkText = key+1;
                    var navExtraClass = $(val).data('nav-class');
                    if ($(val).data('nav-title')) {
                        linkText = $(val).data('nav-title');
                    }
                    navHtml += '<a class="'+self.options.navClass;
                    if (navExtraClass) {
                        navHtml += ' ' + navExtraClass;
                    }
                    navHtml += '" href="" data-show-tab="'+(key+1)+'">'+linkText+'</a>';
                });

                navHtml += '</div>';

                if (self.options.navPosition == 'bottom') {
                    self.$el.append(navHtml);
                } else {
                    self.$el.prepend(navHtml);
                }

                this.$el.find('.' + this.options.navClass).removeClass( this.options.classActive );
                this.$el.find('[data-show-tab='+this.currentTab+']').addClass( this.options.classActive );

                self.$el.find('.' + self.options.navClass).on('click', function(e) {
                    var index = $(this).data('show-tab');
                    self.showTab(index);
                    e.preventDefault();
                });
            }
        },
        renderTabs: function() {
            this.$el.find('.' + this.options.tabClass).removeClass( this.options.classActive );
            this.$el.find('[data-tab-index='+this.currentTab+']').addClass( this.options.classActive );
        }
    };
    
    var thePlugin = {
        '_defaultOptions': {
            'classActive':        'active',
            'loop':               false,
            'navClass':           'bsp-tabber-nav',
            'navContainerClass':  'bsp-tabber-nav-container',
            'navPosition':        'top',
            'showNav':            true,
            'showTabOverride':    false,
            'tabClass':           'bsp-tab'
        },
        '_each': function(item) {
            var options = this.option(item);
            var moduleInstance = Object.create(module);
            moduleInstance.init($(item), options);
        }
    };

    return bsp_utils.plugin(false, 'bsp', 'tabber', thePlugin);
});