# Installation


Manually:

- Download [jQuery 1.7.0 or above](http://jquery.com/download/)
- Download [bsp-utils.js](https://raw.githubusercontent.com/perfectsense/brightspot-js-utils/master/bsp-utils.js) ([repository](https://github.com/perfectsense/brightspot-js-utils))
- Download [bsp-tabber.js](https://raw.githubusercontent.com/perfectsense/brightspot-js-tabber/master/bsp-tabber.js)

# Usage

[General Brightspot plugin configuration documentation](https://github.com/perfectsense/brightspot-js-utils/blob/master/PLUGIN.md).

Options:

-	classActive : defaults to 'active'
-	navSelector : defaults to '.bsp-tabber-nav'
-	tabSelector : defaults to '.bsp-tab'

Example:

	<div data-bsp-tabber data-bsp-tabber-options='{"classActive" : "myActiveClass"}'>
		<a href="" class="bsp-tabber-nav active" data-show-tab="1">Tab 1</a>
		<a href="" class="bsp-tabber-nav" data-show-tab="2">Tab 2</a>
		<a href="" class="bsp-tabber-nav" data-show-tab="3">Tab 3</a>
		<div class="bsp-tab active">tab 1 content</div>
		<div class="bsp-tab">tab 2 content</div>
		<div class="bsp-tab">tab 3 content</div>
	</div>

When a tab is switched, the `showTab` event is fired, which passes an object containing:

-	$currentTab - current tab dom element
-	index - index of current tab (base 1, not base 0)

The tabber js object is exposed as a data attribute on the tabber DOM element, so tabs can switched externally like this:

	var $tabber = $('.my-tabber').data('tabber');
	$tabber.showTab(2);