/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2018 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['sap/ui/core/Renderer','sap/ui/core/library','sap/ui/Device'],function(R,c,D){"use strict";var T=c.TextDirection;var V=c.ValueState;var I={};I.render=function(r,C){var v=C.getValueState(),t=C.getTextDirection(),s=R.getTextAlign(C.getTextAlign(),t),a=sap.ui.getCore().getConfiguration().getAccessibility(),b=C.getAggregation("_beginIcon")||[],e=C.getAggregation("_endIcon")||[],d,f;r.write("<div");r.writeControlData(C);this.addOuterStyles(r,C);this.addControlWidth(r,C);r.writeStyles();r.addClass("sapMInputBase");this.addPaddingClass(r,C);this.addCursorClass(r,C);this.addOuterClasses(r,C);if(!C.getEnabled()){r.addClass("sapMInputBaseDisabled");}if(!C.getEditable()){r.addClass("sapMInputBaseReadonly");}r.writeClasses();this.writeOuterAttributes(r,C);var g=C.getTooltip_AsString();if(g){r.writeAttributeEscaped("title",g);}r.write(">");r.write('<div ');r.writeAttribute("id",C.getId()+"-content");r.addClass("sapMInputBaseContentWrapper");if(!C.getEnabled()){r.addClass("sapMInputBaseDisabledWrapper");}else if(!C.getEditable()){r.addClass("sapMInputBaseReadonlyWrapper");}if(v!==V.None){this.addValueStateClasses(r,C);}if(b.length){d=b.filter(function(i){return i.getVisible();});d.length&&r.addClass("sapMInputBaseHasBeginIcons");}if(e.length){f=e.filter(function(i){return i.getVisible();});f.length&&r.addClass("sapMInputBaseHasEndIcons");}r.writeClasses();this.addWrapperStyles(r,C);r.writeStyles();r.write('>');if(b.length){this.writeIcons(r,b);}this.prependInnerContent(r,C);this.openInputTag(r,C);this.writeInnerId(r,C);if(C.getName()){r.writeAttributeEscaped("name",C.getName());}if(!C.bShowLabelAsPlaceholder&&C._getPlaceholder()){r.writeAttributeEscaped("placeholder",C._getPlaceholder());}if(C.getMaxLength&&C.getMaxLength()>0){r.writeAttribute("maxlength",C.getMaxLength());}if(!C.getEnabled()){r.writeAttribute("disabled","disabled");}else if(!C.getEditable()){r.writeAttribute("readonly","readonly");}if(t!=T.Inherit){r.writeAttribute("dir",t.toLowerCase());}this.writeInnerValue(r,C);if(a){this.writeAccessibilityState(r,C);}if(D.browser.mozilla){if(g){r.writeAttributeEscaped("x-moz-errormessage",g);}else{r.writeAttribute("x-moz-errormessage"," ");}}this.writeInnerAttributes(r,C);r.addClass("sapMInputBaseInner");this.addInnerClasses(r,C);r.writeClasses();if(s){r.addStyle("text-align",s);}this.addInnerStyles(r,C);r.writeStyles();r.write(">");this.writeInnerContent(r,C);this.closeInputTag(r,C);if(e.length){this.writeIcons(r,e);}r.write('</div>');this.writeDecorations(r,C);if(a){this.renderAriaLabelledBy(r,C);this.renderAriaDescribedBy(r,C);}r.write("</div>");};I.getAriaRole=function(C){return"textbox";};I.getAriaLabelledBy=function(C){if(this.getLabelledByAnnouncement(C)){return C.getId()+"-labelledby";}};I.getLabelledByAnnouncement=function(C){return C._getPlaceholder()||"";};I.renderAriaLabelledBy=function(r,C){var a=this.getLabelledByAnnouncement(C);if(a){r.write("<span");r.writeAttribute("id",C.getId()+"-labelledby");r.writeAttribute("aria-hidden","true");r.addClass("sapUiInvisibleText");r.writeClasses();r.write(">");r.writeEscaped(a.trim());r.write("</span>");}};I.getAriaDescribedBy=function(C){if(this.getDescribedByAnnouncement(C)){return C.getId()+"-describedby";}};I.getDescribedByAnnouncement=function(C){return C.getTooltip_AsString()||"";};I.renderAriaDescribedBy=function(r,C){var a=this.getDescribedByAnnouncement(C);if(a){r.write("<span");r.writeAttribute("id",C.getId()+"-describedby");r.writeAttribute("aria-hidden","true");r.addClass("sapUiInvisibleText");r.writeClasses();r.write(">");r.writeEscaped(a.trim());r.write("</span>");}};I.getAccessibilityState=function(C){var a=this.getAriaLabelledBy(C),A=this.getAriaDescribedBy(C),r=this.getAriaRole(C),m={};if(r){m.role=r;}if(C.getValueState()===V.Error){m.invalid=true;}if(a){m.labelledby={value:a.trim(),append:true};}if(A){m.describedby={value:A.trim(),append:true};}return m;};I.writeAccessibilityState=function(r,C){r.writeAccessibilityState(C,this.getAccessibilityState(C));};I.openInputTag=function(r,C){r.write("<input");};I.writeInnerValue=function(r,C){r.writeAttributeEscaped("value",C.getValue());};I.addCursorClass=function(r,C){};I.addPaddingClass=function(r,C){r.addClass("sapMInputBaseHeightMargin");};I.addOuterStyles=function(r,C){};I.addControlWidth=function(r,C){if(C.getWidth()){r.addStyle("width",C.getWidth());}else{r.addClass("sapMInputBaseNoWidth");}};I.addOuterClasses=function(r,C){};I.writeOuterAttributes=function(r,C){};I.addInnerStyles=function(r,C){};I.addWrapperStyles=function(r,C){r.addStyle("width","100%");};I.addInnerClasses=function(r,C){};I.writeInnerAttributes=function(r,C){};I.prependInnerContent=function(r,C){};I.writeInnerContent=function(r,C){};I.writeIcons=function(r,i){r.write("<div");r.writeAttribute("tabindex","-1");r.addClass("sapMInputBaseIconContainer");r.writeClasses();r.write(">");i.forEach(function(o){r.renderControl(o);});r.write("</div>");};I.writeDecorations=function(r,C){};I.closeInputTag=function(r,C){};I.addPlaceholderStyles=function(r,C){};I.addPlaceholderClasses=function(r,C){};I.addValueStateClasses=function(r,C){r.addClass("sapMInputBaseContentWrapperState");r.addClass("sapMInputBaseContentWrapper"+C.getValueState());};I.writeInnerId=function(r,C){r.writeAttribute("id",C.getId()+"-inner");};return I;},true);
