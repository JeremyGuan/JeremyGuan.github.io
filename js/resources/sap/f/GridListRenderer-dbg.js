/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2018 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

sap.ui.define([
	"sap/ui/core/Renderer",
	"sap/m/ListBaseRenderer",
	"sap/ui/layout/cssgrid/GridLayoutBase"
], function (Renderer, ListBaseRenderer, GridLayoutBase) {
	"use strict";

/**
 * GridListRenderer renderer
 * @namespace
 */
var GridListRenderer = Renderer.extend(ListBaseRenderer);

// List Hook
GridListRenderer.renderContainerAttributes = function (rm, oControl) {
	rm.addClass("sapFGridList");
	ListBaseRenderer.renderContainerAttributes.apply(this, arguments);
};

// List Hook
GridListRenderer.renderListStartAttributes = function (rm, oControl) {
	ListBaseRenderer.renderListStartAttributes.apply(this, arguments);
	this.renderGrid(rm, oControl);
};

GridListRenderer.renderGrid = function (rm, oControl) {
	var oGridLayout = oControl.getGridLayoutConfiguration();
	if (oGridLayout) {
		GridLayoutBase.renderSingleGridLayout(rm, oGridLayout);
	} else {
		rm.addClass("sapFGridListDefault");
	}

	if (oControl.isGrouped()) {
		rm.addClass("sapFGridListGroup");
	}
};

return GridListRenderer;

});