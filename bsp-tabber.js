/**
 * Generic tabber
 *
 * See demo.html for examples
 *
 * Module options:
 *  classActive - defaults to 'active', the class to assign active tabs and tab nav elements
 *  loop - when using prevTab/nextTab in the API, should tabber loop
 *  navClass - defaults to 'bsp-tabber-nav', assigned to automatically-generated nav links
 *  navClassContainer - defaults to 'bsp-tabber-nav-container', assigned to automatically-generated wrapper of nav links
 *  navPosition - defaults to 'top', 'bottom' is other valid option
 *  showNav - defaults to true, nav will be disabled if set to false
 *  showTabOverride - defaults to false, if you wanted 
 *  tabClass - defaults to 'bsp-tab', the class tabber assigned to tabs
 *
 * Configuration through data attributes:
 *  If the showTab config option is set to true and the tabber DOM structure looks like this:
 *  <div data-bsp-tabber>
 *    <div class="bsp-tab" data-nav-title="Tab 1" data-nav-name="t1" data-nav-class="tab1">Tab 1 content</div>
 *    <div class="bsp-tab" data-nav-title="Tab 2" data-nav-name="t2" data-nav-class="tab2">Tab 2 content</div>
 *  </div>
 *
 *  Tabber will create a nav element which looks like this and prepend or append it to its DOM element:
 * 
 *  <div class="bsp-tabber-nav-container">
 *    <a href="" class="bsp-tabber-nav tab1 active">Tab 1</a>
 *    <a href="" class="bsp-tabber-nav tab2">Tab 2</a>
 *  </div>
 * 
 * Events:
 *  init - fires after tabber is loaded
 *   tabber - reference to the tabber object
 *
 *  showTab - fires when a tab is shown, passes an object with
 *   $currentTab - current tab dom element
 *   $nextTab - the tab that is about to be shown
 *   index - index of current tab (base 1, not base 0)
 *   tabber - reference to the tabber object
 *
 *  addTab - fires when a new tab is created
 *   $newTab - the new tab which was created
 *   tabber - reference to the tabber object
 *
 *  removeTab - fires when a new tab is created
 *   tabber - reference to the tabber object
 *
 * API:
 * The tabber object is exposed as a data attribute on the dom element, 
 * so you can externally trigger the following:
 * 
 * tabber.showTab(index)
 * Goes to a tab by numeric index (assigned automatically) or tab name (assigned
 * with data-nav-name attribute on DOM element)
 *  var $tabber = $('.my-tabber').data('tabber');
 *  $tabber.showTab(2);
 *  $tabber.showTab('mytab');
 *
 * tabber.doShowTab(index)
 * Used together with the showTabOverride = true option to delay or disable
 * the display of a tab (see demo 4 in demo.html)
 * 
 * tabber.nextTab()
 * Goes to the next tab. If you are on the last tab and looping is enabled, goes
 * back to the beginning.
 *
 * tabber.prevTab()
 * Goes to the previous tab. If you are on the first tab and looping is enabled, goes
 * back to the end.
 *
 * tabber.getTab(index)
 * Retrieves a jquery object containing the tab at the specified string or numeric index
 * 
 * tabber.addTab(options)
 * options.title - sets the data-nav-title attribute on the new tab
 * options.navClass - sets the data-nav-class attribute on the new tab
 * options.navName - sets the data-nav-name attribute on the new tab
 * options.content - can be text or a DOM element
 * options.insertAfter - index of tab that new tab should be inserted after. if
 *  unspecified, inserts tab at the end. if 0, inserts at beginning (prepend).
 * 
 * tabber.removeTab(index)
 * Removes a tab at a specified index
 * 
 * tabber.render
 * It's possible to manually trigger the render function, though usually
 * this is called by other functions in the API.
 */
(function(globals, factory) {

    "use strict";

    if (typeof define === 'function' && define.amd) {
        define(['jquery','bsp-utils'], factory);

    } else {
        globals.bsp_tabber = factory(globals.jQuery, globals.bsp_utils);
    }

})(this, function($, bsp_utils, globals) {
    "use strict";

    return {
        currentTab: 1,
        showNav: true,
        tabCount: 0,
        init: function($el, options) {
            var self = this;
            self.$el = $el;
            self.options = options;
            self.$el.data('tabber', self);
            self.setDefaultTab();
            self.render();
            self.$el.trigger('init', {
                tabber: self
            });
        },
        setDefaultTab: function() {
            var self = this;
            this.$el.find('.' + this.options.tabClass).each(function(key, tab) {
                if ($(tab).hasClass(self.options.classActive)) {
                    self.currentTab = key+1;
                }
            });
        },
        getTab: function(index) {
            if (typeof index == 'string') {
                return this.$el.find('.' + this.options.tabClass + '[data-nav-name='+index+']');
            } else if (typeof index == 'number') {
                return this.$el.find('.' + this.options.tabClass + '[data-tab-index='+index+']');
            } else {
                return;
            }
        },
        showTab: function(index) {
            var self = this;
            var $currentTab = this.getTab(this.currentTab);
            var $nextTab = this.getTab(index);
            index = $nextTab.data('tab-index');
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
                'data-nav-class': options.navClass,
                'data-nav-name': options.navName
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
            self.render();
            this.$el.trigger('addTab', {
                tabber: self,
                $newTab: newTab
            });
        },
        removeTab: function(index) {
            var $tab = this.getTab(index);
            if ($tab.hasClass(this.options.classActive)) {
                this.currentTab = 1;
            } else if (i < this.currentTab) {
                this.currentTab--;
            }
            $tab.remove();
            this.render();
            this.$el.trigger('removeTab', {
                tabber: self
            });
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
    
});