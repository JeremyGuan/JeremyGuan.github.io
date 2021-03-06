/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2018 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

sap.ui.define(["sap/ui/layout/cssgrid/GridLayoutBase"], function (GridLayoutBase) {
	"use strict";

	/**
	 * CSSGrid renderer.
	 * @namespace
	 */
	var CSSGridRenderer = {};

	/**
	 * Renders the HTML for the given control, using the provided {@link sap.ui.core.RenderManager}.
	 *
	 * @param {sap.ui.core.RenderManager} rm the RenderManager that can be used for writing to the render output buffer
	 * @param {sap.ui.core.Control} oControl an object representation of the control that should be rendered
	 */
	CSSGridRenderer.render = function(rm, oControl) {

		// container
		rm.write("<div");
		rm.addClass("sapUiLayoutCSSGrid");
		rm.writeControlData(oControl);

		if (oControl.getWidth()) {
			rm.addStyle("width", oControl.getWidth());
		}

		GridLayoutBase.renderSingleGridLayout(rm, oControl.getGridLayoutConfiguration());

		rm.writeStyles();
		rm.writeClasses();
		rm.write(">");

		// Render items
		oControl.getItems().forEach(rm.renderControl);

		rm.write("</div>");
	};

	return CSSGridRenderer;

});
