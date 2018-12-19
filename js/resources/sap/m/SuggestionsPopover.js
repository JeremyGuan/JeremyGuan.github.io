/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2018 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['sap/ui/Device','sap/ui/base/Object','sap/ui/core/InvisibleText','sap/ui/core/ListItem','sap/ui/core/ResizeHandler','sap/m/library','sap/m/Bar','sap/m/Button','sap/m/ColumnListItem','sap/m/Dialog','sap/m/DisplayListItem','sap/m/List','sap/m/Popover','sap/m/StandardListItem','sap/m/Table','sap/m/Toolbar','sap/m/ToolbarSpacer',"sap/base/security/encodeXML"],function(D,B,I,L,R,l,a,b,C,c,d,e,P,S,T,f,g,h){"use strict";var j=l.ListMode;var k=l.PlacementType;var m=l.ListType;var n=B.extend("sap.m.SuggestionsPopover",{constructor:function(i){B.apply(this,arguments);this._oInput=i;this._oInput.addEventDelegate({onsapup:function(E){this._onsaparrowkey(E,"up",1);},onsapdown:function(E){this._onsaparrowkey(E,"down",1);},onsappageup:function(E){this._onsaparrowkey(E,"up",5);},onsappagedown:function(E){this._onsaparrowkey(E,"down",5);},onsaphome:function(E){if(this._oList){this._onsaparrowkey(E,"up",this._oList.getItems().length);}},onsapend:function(E){if(this._oList){this._onsaparrowkey(E,"down",this._oList.getItems().length);}}},this);},destroy:function(){if(this._oPopover){this._oPopover.destroy();this._oPopover=null;}if(this._oList){this._oList.destroy();this._oList=null;}if(this._oSuggestionTable){this._oSuggestionTable.destroy();this._oSuggestionTable=null;}if(this._oButtonToolbar){this._oButtonToolbar.destroy();this._oButtonToolbar=null;}if(this._oShowMoreButton){this._oShowMoreButton.destroy();this._oShowMoreButton=null;}}});n._wordStartsWithValue=function(t,v){var i;while(t){if(typeof v==="string"&&v!==""&&t.toLowerCase().startsWith(v.toLowerCase())){return true;}i=t.indexOf(' ');if(i==-1){break;}t=t.substring(i+1);}return false;};n._DEFAULTFILTER=function(v,i){if(i instanceof L&&n._wordStartsWithValue(i.getAdditionalText(),v)){return true;}return n._wordStartsWithValue(i.getText(),v);};n._DEFAULTFILTER_TABULAR=function(v,o){var p=o.getCells(),i=0;for(;i<p.length;i++){if(p[i].getText){if(n._wordStartsWithValue(p[i].getText(),v)){return true;}}}return false;};n._DEFAULTRESULT_TABULAR=function(o){var p=o.getCells(),i=0;for(;i<p.length;i++){if(p[i].getText){return p[i].getText();}}return"";};n.prototype._createSuggestionPopup=function(){var i=this._oInput;var M=i._oRb;if(i._bUseDialog){this._oPopupInput=new sap.m.Input(i.getId()+"-popup-input",{width:"100%",valueLiveUpdate:true,showValueHelp:i.getShowValueHelp(),valueHelpRequest:function(E){i.fireValueHelpRequest({fromSuggestions:true});i._iPopupListSelectedIndex=-1;i._closeSuggestionPopup();},liveChange:function(E){var v=E.getParameter("newValue");i.setDOMValue(i._getInputValue(this._oPopupInput.getValue()));i._triggerSuggest(v);i.fireLiveChange({value:v,newValue:v});}.bind(this)}).addStyleClass("sapMInputSuggInDialog");}this._oPopover=!i._bUseDialog?(new P(i.getId()+"-popup",{showArrow:false,showHeader:false,placement:k.Vertical,initialFocus:i,horizontalScrolling:true}).attachAfterClose(function(){i._updateSelectionFromList();if(this._oList instanceof T){this._oList.removeSelections(true);}else{this._oList.destroyItems();}this._deregisterResize();}.bind(this)).attachBeforeOpen(function(){i._sBeforeSuggest=i.getValue();this._resizePopup();this._registerResize();}.bind(this))):(new c(i.getId()+"-popup",{beginButton:new b(i.getId()+"-popup-closeButton",{text:M.getText("MSGBOX_CLOSE"),press:function(){i._closeSuggestionPopup();}}),stretch:i._bFullScreen,contentHeight:i._bFullScreen?undefined:"20rem",customHeader:new a(i.getId()+"-popup-header",{contentMiddle:this._oPopupInput.addEventDelegate({onsapenter:function(){if(!(sap.m.MultiInput&&i instanceof sap.m.MultiInput)){i._closeSuggestionPopup();}}},this)}),horizontalScrolling:false,initialFocus:this._oPopupInput}).attachBeforeOpen(function(){this._oPopupInput.setPlaceholder(i.getPlaceholder());this._oPopupInput.setMaxLength(i.getMaxLength());}.bind(this)).attachBeforeClose(function(){i.setDOMValue(i._getInputValue(this._oPopupInput.getValue()));i.onChange();if(i instanceof sap.m.MultiInput&&i._bUseDialog){i._onDialogClose();}}.bind(this)).attachAfterClose(function(){if(this._oList){if(T&&!(this._oList instanceof T)){this._oList.destroyItems();}else{this._oList.removeSelections(true);}}}.bind(this)).attachAfterOpen(function(){var v=i.getValue();this._oPopupInput.setValue(v);i._triggerSuggest(v);i._oSuggPopover._refreshListItems();}.bind(this)));this._oPopover.addStyleClass("sapMInputSuggestionPopup");this._oPopover.addAriaLabelledBy(I.getStaticId("sap.m","INPUT_AVALIABLE_VALUES"));i.setAggregation("_suggestionPopup",this._oPopover);if(!i._bUseDialog){this._overwritePopover();}if(this._oList){this._oPopover.addContent(this._oList);}if(i.getShowTableSuggestionValueHelp()){this._addShowMoreButton();}};n.prototype._createSuggestionPopupContent=function(t){var i=this._oInput;if(i._bIsBeingDestroyed||this._oList){return;}if(!i._hasTabularSuggestions()&&!t){this._oList=new e(i.getId()+"-popup-list",{showNoData:false,mode:j.SingleSelectMaster,rememberSelections:false,itemPress:function(E){var p=E.getParameter("listItem");i.setSelectionItem(p._oItem,true);}});this._oList.addEventDelegate({onAfterRendering:function(){if(!i.getEnableSuggestionsHighlighting()){return;}this._highlightListText(i.getValue());}.bind(this)});}else{if(i._fnFilter===n._DEFAULTFILTER){i._fnFilter=n._DEFAULTFILTER_TABULAR;}if(!i._fnRowResultFilter){i._fnRowResultFilter=n._DEFAULTRESULT_TABULAR;}this._oList=this._getSuggestionsTable();if(i.getShowTableSuggestionValueHelp()){this._addShowMoreButton(t);}}if(this._oPopover){if(i._bUseDialog){this._oPopover.addAggregation("content",this._oList,true);var r=this._oPopover.$("scrollCont")[0];if(r){var o=sap.ui.getCore().createRenderManager();o.renderControl(this._oList);o.flush(r);o.destroy();}}else{this._oPopover.addContent(this._oList);}}};n.prototype._destroySuggestionPopup=function(){if(this._oPopover){if(this._oList instanceof T){this._oPopover.removeAllContent();this._removeShowMoreButton();}this._oPopover.destroy();this._oPopover=null;}if(this._oList instanceof e){this._oList.destroy();this._oList=null;}};n.prototype._addShowMoreButton=function(t){if(!this._oPopover||!t&&!this._oInput._hasTabularSuggestions()){return;}if(this._oPopover instanceof c){var s=this._getShowMoreButton();this._oPopover.setEndButton(s);}else{var o=this._getButtonToolbar();this._oPopover.setFooter(o);}};n.prototype._removeShowMoreButton=function(){if(!this._oPopover||!this._oInput._hasTabularSuggestions()){return;}if(this._oPopover instanceof c){this._oPopover.setEndButton(null);}else{this._oPopover.setFooter(null);}};n.prototype._getShowMoreButton=function(){var i=this._oInput,M=i._oRb;return this._oShowMoreButton||(this._oShowMoreButton=new sap.m.Button({text:M.getText("INPUT_SUGGESTIONS_SHOW_ALL"),press:function(){if(i.getShowTableSuggestionValueHelp()){i.fireValueHelpRequest({fromSuggestions:true});i._iPopupListSelectedIndex=-1;i._closeSuggestionPopup();}}}));};n.prototype._getButtonToolbar=function(){var s=this._getShowMoreButton();return this._oButtonToolbar||(this._oButtonToolbar=new f({content:[new g(),s]}));};n.prototype._overwritePopover=function(){var i=this._oInput;this._oPopover.open=function(){this.openBy(i,false,true);};this._oPopover.oPopup.setAnimations(function(r,o,O){O();},function(r,o,p){p();});};n.prototype._resizePopup=function(){var i=this._oInput;if(this._oList&&this._oPopover){if(i.getMaxSuggestionWidth()){this._oPopover.setContentWidth(i.getMaxSuggestionWidth());}else{this._oPopover.setContentWidth((i.$().outerWidth())+"px");}setTimeout(function(){if(this._oPopover&&this._oPopover.isOpen()&&this._oPopover.$().outerWidth()<i.$().outerWidth()){this._oPopover.setContentWidth((i.$().outerWidth())+"px");}}.bind(this),0);}};n.prototype._registerResize=function(){if(!this._oInput._bFullScreen){this._sPopupResizeHandler=R.register(this._oInput,this._resizePopup.bind(this));}};n.prototype._deregisterResize=function(){if(this._sPopupResizeHandler){this._sPopupResizeHandler=R.deregister(this._sPopupResizeHandler);}};n.prototype._refreshListItems=function(){var o=this._oInput;var s=o.getShowSuggestion();var r=o._oRb;o._iPopupListSelectedIndex=-1;if(!s||!o._bShouldRefreshListItems||!o.getDomRef()||(!o._bUseDialog&&!o.$().hasClass("sapMInputFocused"))){return false;}var p,q=o.getSuggestionItems(),t=o.getSuggestionRows(),u=o.getDOMValue()||"",v=this._oList,F=o.getFilterSuggests(),H=[],w=0,x=this._oPopover,y={ontouchstart:function(G){(G.originalEvent||G)._sapui_cancelAutoClose=true;}},z,i;if(this._oList){if(this._oList instanceof T){v.removeSelections(true);}else{v.destroyItems();}}if(u.length<o.getStartSuggestion()){if(!o._bUseDialog){o._iPopupListSelectedIndex=-1;o.cancelPendingSuggest();x.close();}else{if(o._hasTabularSuggestions()&&this._oList){this._oList.addStyleClass("sapMInputSuggestionTableHidden");}}o.$("SuggDescr").text("");o.$("inner").removeAttr("aria-haspopup");o.$("inner").removeAttr("aria-activedescendant");return false;}if(o._hasTabularSuggestions()){if(o._bUseDialog&&this._oList){this._oList.removeStyleClass("sapMInputSuggestionTableHidden");}for(i=0;i<t.length;i++){if(!F||o._fnFilter(u,t[i])){t[i].setVisible(true);H.push(t[i]);}else{t[i].setVisible(false);}}this._oSuggestionTable.invalidate();}else{var A=(q[0]instanceof L?true:false);for(i=0;i<q.length;i++){p=q[i];if(!F||o._fnFilter(u,p)){if(A){z=new d(p.getId()+"-dli");z.setLabel(p.getText());z.setValue(p.getAdditionalText());}else{z=new S(p.getId()+"-sli");z.setTitle(p.getText());}z.setType(p.getEnabled()?m.Active:m.Inactive);z._oItem=p;z.addEventDelegate(y);H.push(z);}}}w=H.length;var E="";if(w>0){if(w==1){E=r.getText("INPUT_SUGGESTIONS_ONE_HIT");}else{E=r.getText("INPUT_SUGGESTIONS_MORE_HITS",w);}o.$("inner").attr("aria-haspopup","true");if(!o._hasTabularSuggestions()){for(i=0;i<w;i++){v.addItem(H[i]);}}if(!o._bUseDialog){if(o._sCloseTimer){clearTimeout(o._sCloseTimer);o._sCloseTimer=null;}if(!x.isOpen()&&!o._sOpenTimer&&(o.getValue().length>=o.getStartSuggestion())){o._sOpenTimer=setTimeout(function(){o._sOpenTimer=null;x.open();},0);}}}else{E=r.getText("INPUT_SUGGESTIONS_NO_HIT");o.$("inner").removeAttr("aria-haspopup");o.$("inner").removeAttr("aria-activedescendant");if(!o._bUseDialog){if(x.isOpen()){o._sCloseTimer=setTimeout(function(){o._iPopupListSelectedIndex=-1;o.cancelPendingSuggest();x.close();},0);}}else{if(o._hasTabularSuggestions()&&this._oList){this._oList.addStyleClass("sapMInputSuggestionTableHidden");}}}o.$("SuggDescr").text(E);};n.prototype._onsaparrowkey=function(E,s,i){var o=this._oInput;if(!o.getEnabled()||!o.getEditable()){return;}if(s!=="up"&&s!=="down"){return;}if(o._isIncrementalType()){E.setMarked();}if(!this._oPopover||!this._oPopover.isOpen()){return;}E.preventDefault();E.stopPropagation();var F=false,p=this._oList,q=o.getSuggestionItems(),r=p.getItems(),t=o._iPopupListSelectedIndex,N,O=t;if(s==="up"&&t===0){return;}if(s=="down"&&t===r.length-1){return;}var u;if(i>1){if(s=="down"&&t+i>=r.length){s="up";i=1;r[t].setSelected(false);u=t;t=r.length-1;F=true;}else if(s=="up"&&t-i<0){s="down";i=1;r[t].setSelected(false);u=t;t=0;F=true;}}if(t===-1){t=0;if(o._isSuggestionItemSelectable(r[t])){O=t;F=true;}else{s="down";}}if(s==="down"){while(t<r.length-1&&(!F||!o._isSuggestionItemSelectable(r[t]))){r[t].setSelected(false);t=t+i;F=true;i=1;if(u===t){break;}}}else{while(t>0&&(!F||!r[t].getVisible()||!o._isSuggestionItemSelectable(r[t]))){r[t].setSelected(false);t=t-i;F=true;i=1;if(u===t){break;}}}if(!o._isSuggestionItemSelectable(r[t])){if(O>=0){r[O].setSelected(true).updateAccessibilityState();o.$("inner").attr("aria-activedescendant",r[O].getId());}return;}else{r[t].setSelected(true).updateAccessibilityState();o.$("inner").attr("aria-activedescendant",r[t].getId());}if(D.system.desktop){this._scrollToItem(t);}if(C&&r[t]instanceof C){N=o._getInputValue(o._fnRowResultFilter(r[t]));}else{var v=(q[0]instanceof L?true:false);if(v){N=o._getInputValue(r[t].getLabel());}else{N=o._getInputValue(r[t].getTitle());}}o.setDOMValue(N);o._sSelectedSuggViaKeyboard=N;o._doSelect();o._iPopupListSelectedIndex=t;};n.prototype._scrollToItem=function(i){var p=this._oPopover,o=this._oList,s,q,r,t,u;if(!(p instanceof P)||!o){return;}s=p.getScrollDelegate();if(!s){return;}var v=o.getItems()[i],w=v&&v.getDomRef();if(!w){return;}q=p.getDomRef("cont").getBoundingClientRect();r=w.getBoundingClientRect();t=q.top-r.top;u=r.bottom-q.bottom;if(t>0){s.scrollTo(s._scrollX,Math.max(s._scrollY-t,0));}else if(u>0){s.scrollTo(s._scrollX,s._scrollY+u);}};n.prototype._getSuggestionsTable=function(){var i=this._oInput;if(i._bIsBeingDestroyed){return;}if(!this._oSuggestionTable){this._oSuggestionTable=new T(i.getId()+"-popup-table",{mode:j.SingleSelectMaster,showNoData:false,showSeparators:"All",width:"100%",enableBusyIndicator:false,rememberSelections:false,selectionChange:function(E){var s=E.getParameter("listItem");i.setSelectionRow(s,true);}});this._oSuggestionTable.addEventDelegate({onAfterRendering:function(){if(!i.getEnableSuggestionsHighlighting()){return;}this._highlightTableText(i.getValue());}.bind(this)});if(this._bUseDialog){this._oSuggestionTable.addStyleClass("sapMInputSuggestionTableHidden");}this._oSuggestionTable.updateItems=function(){T.prototype.updateItems.apply(i,arguments);i._refreshItemsDelayed();return i;};}i._oSuggestionTable=this._oSuggestionTable;return this._oSuggestionTable;};n.prototype._createHighlightedText=function(i){var t=i.innerText,v=this._oInput.getValue().toLowerCase(),o=v.length,p=t.toLowerCase(),s,q='';if(!n._wordStartsWithValue(t,v)){return h(t);}var r=p.indexOf(v);if(r>0){r=p.indexOf(' '+v)+1;}if(r>-1){q+=h(t.substring(0,r));s=t.substring(r,r+o);q+='<span class="sapMInputHighlight">'+h(s)+'</span>';q+=h(t.substring(r+o));}else{q=h(t);}return q;};n.prototype._highlightListText=function(){if(!this._oInput.getEnableSuggestionsHighlighting()){return;}var i,o,p=this._oList.$().find('.sapMDLILabel, .sapMSLITitleOnly, .sapMDLIValue');for(i=0;i<p.length;i++){o=p[i];o.innerHTML=this._createHighlightedText(o);}};n.prototype._highlightTableText=function(){if(!this._oInput.getEnableSuggestionsHighlighting()){return;}var i,o,p=this._oSuggestionTable.$().find('tbody .sapMLabel');for(i=0;i<p.length;i++){o=p[i];o.innerHTML=this._createHighlightedText(o);}};return n;});
