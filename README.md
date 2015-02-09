# Installation


Manually:

- Download [jQuery 1.7.0 or above](http://jquery.com/download/)
- Download [bsp-utils.js](https://raw.githubusercontent.com/perfectsense/brightspot-js-utils/master/bsp-utils.js) ([repository](https://github.com/perfectsense/brightspot-js-utils))
- Download [bsp-tabber.js](https://raw.githubusercontent.com/perfectsense/brightspot-js-tabber/master/bsp-tabber.js)

# Usage

[General Brightspot plugin configuration documentation](https://github.com/perfectsense/brightspot-js-utils/blob/master/PLUGIN.md).

## Options

-	classActive: defaults to 'active', the class to assign active tabs and tab nav elements
-	loop: when using prevTab/nextTab in the API, should tabber loop
-	navClass: defaults to 'bsp-tabber-nav', assigned to automatically-generated nav links
-	navClassContainer: defaults to 'bsp-tabber-nav-container', assigned to automatically-generated wrapper of nav links
-	navPosition: defaults to 'top', 'bottom' is other valid option
-	showNav: defaults to true, nav will be disabled if set to false
-	showTabOverride: defaults to false, if you wanted 
-	tabClass: defaults to 'bsp-tab', the class tabber assigned to tabs

Configuration is passed like this:

	<div data-bsp-tabber data-bsp-tabber-options='{ "showNav" : false }'>
		.. child divs ..
	</div>

## Basic example

	<div data-bsp-tabber>
		<div class="bsp-tab" data-nav-title="Tab 1">Tab 1 content</div>
		<div class="bsp-tab" data-nav-title="Tab 2">Tab 2 content</div>
		<div class="bsp-tab" data-nav-title="Tab 3">Tab 3 content</div>
	</div>

The structure will look like this after the JS renderer runs:

	<div data-bsp-tabber>
		<div class="bsp-tabber-nav-container">
			<a href="" class="bsp-tabber-nav tab1 active" data-show-tab="1">Tab 1</a>
			<a href="" class="bsp-tabber-nav tab2" data-show-tab="2">Tab 2</a>
			<a href="" class="bsp-tabber-nav tab3" data-show-tab="3">Tab 3</a>
		</div>
		<div class="bsp-tab active" data-nav-title="Tab 1" data-tab-index="1">Tab 1 content</div>
		<div class="bsp-tab" data-nav-title="Tab 2" data-tab-index="2">Tab 2 content</div>
		<div class="bsp-tab" data-nav-title="Tab 3" data-tab-index="3">Tab 3 content</div>
	</div>

## Configurable data attributes

These data attributes can be added to the individual tab elements to configure the tab navigation:

-	data-nav-title: Title of the navigation element that will show this tab
-	data-nav-class: Custom class added to the navigation element that will show this tab
-	data-nav-name: Name of tab which can be passed to tabber.showTab() regardless of index

## API

The tabber js object is exposed as a data attribute on the tabber DOM element. Here is an example
calling the showTab API method:

	var $tabber = $('.my-tabber').data('tabber');
	$tabber.showTab(2);

tabber.showTab(index)
Goes to a tab by numeric index (assigned automatically) or tab name (assigned
with data-nav-name attribute on DOM element)

	var $tabber = $('.my-tabber').data('tabber');
	$tabber.showTab(2);
	$tabber.showTab('mytab');
 
tabber.doShowTab(index)
Used together with the showTabOverride = true option to delay or disable
the display of a tab (see demo 4 in demo.html)
  
tabber.nextTab()
Goes to the next tab. If you are on the last tab and looping is enabled, goes
back to the beginning.
 
tabber.prevTab()
Goes to the previous tab. If you are on the first tab and looping is enabled, goes
back to the end.
 
tabber.getTab(index)
Retrieves a jquery object containing the tab at the specified string or numeric index
  
tabber.addTab(options)
-	options.title - sets the data-nav-title attribute on the new tab
-	options.navClass - sets the data-nav-class attribute on the new tab
-	options.navName - sets the data-nav-name attribute on the new tab
-	options.content - can be text or a DOM element
-	options.insertAfter - index of tab that new tab should be inserted after. if unspecified, inserts tab at the end. if 0, inserts at beginning (prepend).
  
tabber.removeTab(index)
Removes a tab at a specified index
  
tabber.render
It's possible to manually trigger the render function, though usually
this is called by other functions in the API.

## Events

-	init: fires after tabber is loaded, passes an object with
		- tabber: reference to the tabber object
 
-	showTab: fires when a tab is shown, passes an object with
		- $currentTab - current tab dom element
		- $nextTab - the tab that is about to be shown
		- index - index of current tab (base 1, not base 0)
		- tabber - reference to the tabber object
 
-	addTab - fires when a new tab is created, passes an object with
		- $newTab - the new tab which was created
		- tabber - reference to the tabber object
 
-	removeTab - fires when a new tab is created, passes an object with
		- tabber - reference to the tabber object

Example:

	var $tabber = $('.my-tabber').data('tabber');
	$tabber.on('init', function() {
		alert('Ding! Your tabber is ready!');
	});