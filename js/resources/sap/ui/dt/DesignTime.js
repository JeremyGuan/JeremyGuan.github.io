/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2018 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['sap/ui/base/ManagedObject','sap/ui/dt/ElementOverlay','sap/ui/dt/AggregationOverlay','sap/ui/dt/OverlayRegistry','sap/ui/dt/SelectionManager','sap/ui/dt/ElementDesignTimeMetadata','sap/ui/dt/AggregationDesignTimeMetadata','sap/ui/dt/ElementUtil','sap/ui/dt/Overlay','sap/ui/dt/OverlayUtil','sap/ui/dt/MetadataPropagationUtil','sap/ui/dt/Util','sap/ui/dt/TaskManager',"sap/base/Log","sap/ui/thirdparty/jquery","sap/base/util/isPlainObject","sap/base/util/merge","sap/ui/dt/SelectionMode","sap/base/util/includes"],function(M,E,A,O,S,a,b,c,d,e,f,U,T,L,q,i,m,g,h){"use strict";var D=M.extend("sap.ui.dt.DesignTime",{metadata:{library:"sap.ui.dt",properties:{designTimeMetadata:{type:"object"},enabled:{type:"boolean",defaultValue:true},scope:{type:"string",defaultValue:"default"}},associations:{rootElements:{type:"sap.ui.core.Element",multiple:true}},aggregations:{plugins:{type:"sap.ui.dt.Plugin",multiple:true}},events:{addRootElement:{parameters:{element:{type:"sap.ui.core.Element"}}},enabledChanged:{parameters:{value:{type:"boolean"}}},elementOverlayCreated:{parameters:{elementOverlay:{type:"sap.ui.dt.ElementOverlay"}}},elementOverlayDestroyed:{parameters:{elementOverlay:{type:"sap.ui.dt.ElementOverlay"}}},elementOverlayAdded:{parameters:{id:{type:"string"},targetIndex:{type:"integer"},targetId:{type:"string"},targetAggregation:{type:"string"}}},elementOverlayMoved:{parameters:{id:{type:"string"},targetIndex:{type:"integer"},targetId:{type:"string"},targetAggregation:{type:"string"}}},elementOverlayEditableChanged:{parameters:{id:{type:"string"},elementId:{type:"string"},editable:{type:"boolean"}}},elementPropertyChanged:{parameters:{id:{type:"string"},name:{type:"string"},oldValue:{type:"any"},value:{type:"any"}}},syncing:{},synced:{},syncFailed:{}}},constructor:function(){this._mPendingOverlays={};this._oTaskManager=new T({complete:function(o){if(o.getSource().isEmpty()){this._registerElementOverlaysInPlugins();this.fireSynced();}}.bind(this),add:function(o){if(o.getSource().count()===1){this.fireSyncing();}}.bind(this)});this._oSelectionManager=new S();this._onElementOverlayDestroyed=this._onElementOverlayDestroyed.bind(this);M.apply(this,arguments);this.getRootElements().forEach(this._createOverlaysForRootElement,this);this.attachEvent("addRootElement",function(o){this._createOverlaysForRootElement(o.getParameter('element'));},this);this.attachEvent("enabledChanged",function(o){var v=o.getParameter('value');var $=d.getOverlayContainer();$[v?'show':'hide']();this.getRootElements().forEach(function(r){var R=O.getOverlay(r);R.setVisible(v);if(v){R.applyStyles(true);}});},this);this._collectOverlaysDuringSyncing();}});D.prototype._collectOverlaysDuringSyncing=function(){this._aOverlaysCreatedInLastBatch=[];this.attachElementOverlayCreated(function(o){var n=o.getParameter("elementOverlay");this._aOverlaysCreatedInLastBatch.push(n);}.bind(this));this.attachElementOverlayDestroyed(this._onOverlayDestroyedDuringSyncing,this);};D.prototype._onOverlayDestroyedDuringSyncing=function(o){var j=o.getParameter("elementOverlay");var I=this._aOverlaysCreatedInLastBatch.indexOf(j);if(I!==-1){this._aOverlaysCreatedInLastBatch.splice(I,1);}};D.prototype._registerElementOverlaysInPlugins=function(){var p=this.getPlugins();this._aOverlaysCreatedInLastBatch.forEach(function(o){p.forEach(function(P){P.callElementOverlayRegistrationMethods(o);});});this._aOverlaysCreatedInLastBatch=[];};D.prototype.exit=function(){this._bDestroyPending=true;this.detachElementOverlayDestroyed(this._onOverlayDestroyedDuringSyncing,this);this.getPlugins().forEach(function(p){p.destroy();});this._oSelectionManager.destroy();this._oTaskManager.destroy();this._destroyAllOverlays();delete this._aOverlaysCreatedInLastBatch;delete this._bDestroyPending;};D.prototype.getSelection=function(){return this.getSelectionManager().get();};D.prototype.getSelectionManager=function(){return this._oSelectionManager;};D.prototype.getPlugins=function(){return this.getAggregation("plugins")||[];};D.prototype.addPlugin=function(p){p.setDesignTime(this);this.addAggregation("plugins",p);return this;};D.prototype.insertPlugin=function(p,I){p.setDesignTime(this);this.insertAggregation("plugins",p,I);return this;};D.prototype.removePlugin=function(p){this.getPlugins().forEach(function(C){if(C===p){p.setDesignTime(null);return;}});this.removeAggregation("plugins",p);return this;};D.prototype.removeAllPlugins=function(){this.getPlugins().forEach(function(p){p.setDesignTime(null);});this.removeAllAggregation("plugins");return this;};D.prototype.getRootElements=function(){return(this.getAssociation("rootElements")||[]).map(function(s){return c.getElementInstance(s);});};D.prototype.getDesignTimeMetadataFor=function(o){var C;if(typeof o==='string'){C=o;L.error('sap.ui.dt.DesignTime#getDesignTimeMetadataFor / Function getDesignTimeMetadataFor() should be called with element instance');}else{C=o.getMetadata().getName();}return(this.getDesignTimeMetadata()||{})[C];};D.prototype.addRootElement=function(r){this.addAssociation("rootElements",r);this.fireAddRootElement({element:r});};D.prototype._createOverlaysForRootElement=function(r){var t=this._oTaskManager.add({type:'createOverlay',element:r,root:true});this.createOverlay({element:c.getElementInstance(r),root:true,visible:this.getEnabled()}).then(function(o){d.getOverlayContainer().append(o.render());o.applyStyles();this._oTaskManager.complete(t);return o;}.bind(this),function(o){var s='sap.ui.dt: root element with id = "{0}" initialization is failed';s=o?U.printf(s+' due to: {1}',r.getId(),o.message):U.printf(s,r.getId());this._oTaskManager.cancel(t);throw U.createError("DesignTime#createOverlay",s,"sap.ui.dt");}.bind(this));};D.prototype.removeRootElement=function(r){this.removeAssociation("rootElements",r);this._destroyOverlaysForElement(c.getElementInstance(r));return this;};D.prototype.removeAllRootElement=function(){this.removeAssociation("rootElements");this._destroyAllOverlays();return this;};D.prototype.getElementOverlays=function(){var j=[];this._iterateRootElements(function(r){j=j.concat(this._getAllElementOverlaysIn(r));},this);return j;};D.prototype.createOverlay=function(v){var p=Object.assign({},i(v)?v:{element:v});var t=this._oTaskManager.add({type:'createOverlay'});if(!p.element||p.element.bIsDestroyed||!c.isElementValid(p.element)){this._oTaskManager.cancel(t);return Promise.reject(U.createError("DesignTime#createOverlay","can't create overlay without element"));}else{var s=p.element.getId();var o=O.getOverlay(s);if(o){this._oTaskManager.complete(t);return Promise.resolve(o);}else if(s in this._mPendingOverlays){this._oTaskManager.complete(t);return this._mPendingOverlays[s];}else{if(typeof p.root==="undefined"&&!c.getParent(p.element)){p.root=true;}this._mPendingOverlays[s]=this._createElementOverlay(p).then(function(o){return this._createChildren(o,p.parentMetadata).then(function(){delete this._mPendingOverlays[s];if(this.bIsDestroyed){o.detachEvent('destroyed',this._onElementOverlayDestroyed);o.destroy();this._oTaskManager.cancel(t);return Promise.reject(U.createError("DesignTime#createOverlay","while creating overlay, DesignTime instance has been destroyed"));}else if(o.bIsDestroyed){this._oTaskManager.cancel(t);return Promise.reject(U.createError("DesignTime#createOverlay","while creating children overlays, its parent overlay has been destroyed"));}else{O.register(o);o.attachBeforeDestroy(function(j){O.deregister(j.getSource());});this.fireElementOverlayCreated({elementOverlay:o});this._oTaskManager.complete(t);return o;}}.bind(this));}.bind(this),function(j){throw j;}).catch(function(j){var k=U.propagateError(j,'DesignTime#createOverlay',U.printf("Failed attempt to create overlay for '{0}'",s));delete this._mPendingOverlays[s];this.fireSyncFailed({error:k});this._oTaskManager.cancel(t);return Promise.reject(k);}.bind(this));return this._mPendingOverlays[s];}}};D.prototype._createElementOverlay=function(p){var o=p.element;return new Promise(function(r,R){new E({element:o,isRoot:p.root,visible:typeof p.visible!=="boolean"||p.visible,metadataScope:this.getScope(),designTimeMetadata:(this.getDesignTimeMetadataFor(o)instanceof a?this.getDesignTimeMetadataFor(o):U.curry(function(j,P,o,k){k=m({},k,j);this._mMetadataOriginal=k;if(P){k=f.propagateMetadataToElementOverlay(k,P,o);}return k;})(this.getDesignTimeMetadataFor(o),p.parentMetadata,o)),init:function(j){r(j.getSource());},initFailed:function(s,j){var k=j.getSource();var l=U.propagateError(j.getParameter('error'),'DesignTime#_createElementOverlay',U.printf("Can't create overlay properly (id='{0}') for '{1}'",k.getId(),s));k.detachEvent('destroyed',this._onElementOverlayDestroyed);k.detachEvent('elementDestroyed',this._onElementDestroyed);k.destroy();R(l);}.bind(this,o.getId()),destroyed:this._onElementOverlayDestroyed,elementDestroyed:this._onElementDestroyed.bind(this),selectionChange:this._onElementOverlaySelectionChange.bind(this),elementModified:this._onElementModified.bind(this),editableChange:this._onEditableChanged.bind(this)});}.bind(this));};D.prototype._createChildren=function(o,p){return Promise.all(o.getAggregationNames().map(function(s){var j=o.getElement();var k=f.propagateMetadataToAggregationOverlay(o.getDesignTimeMetadata().getAggregation(s),j,p);var l=new A({aggregationName:s,element:j,designTimeMetadata:new b({data:k}),beforeDestroy:function(n){O.deregister(n.getSource());},destroyed:this._onAggregationOverlayDestroyed});O.register(l);return Promise.all(c[l.isAssociation()?'getAssociationInstances':'getAggregation'](j,s).map(function(j){return this.createOverlay({element:j,root:false,parentMetadata:k}).catch(function(n){return n;});},this)).then(function(C){C.map(function(n){if(n instanceof E&&!n.bIsDestroyed){l.addChild(n,true);}},this);return l;}.bind(this));},this)).then(function(j){j.forEach(function(k){if(o.bIsDestroyed){k.destroy();}else{o.addChild(k,true);}});});};D.prototype._destroyOverlaysForElement=function(o){var j=O.getOverlay(o);if(j){j.destroy();}};D.prototype._destroyAllOverlays=function(){this._iterateRootElements(function(r){this._destroyOverlaysForElement(r);},this);};D.prototype._onElementOverlayDestroyed=function(o){if(this._bDestroyPending){return;}var j=o.getSource();var s=j.getAssociation('element');if(s in this._mPendingOverlays){return;}if(!O.hasOverlays()){d.destroyMutationObserver();d.removeOverlayContainer();}if(j.isSelected()){this.getSelectionManager().remove(j);}this.fireElementOverlayDestroyed({elementOverlay:j});};D.prototype._onElementDestroyed=function(o){var s=o.getParameter("targetId");this.removeRootElement(s);};D.prototype._onAggregationOverlayDestroyed=function(){if(!O.hasOverlays()){d.removeOverlayContainer();}};D.prototype._onElementOverlaySelectionChange=function(o){var j=o.getSource();var s=o.getParameter("selected");if(s){if(this.getSelectionManager().getSelectionMode()===g.Multi){this.getSelectionManager().add(j);}else{this.getSelectionManager().set(j);}if(!h(this.getSelectionManager().get(),j)){j.setSelected(false);}}else{this.getSelectionManager().remove(j);}};D.prototype._onElementModified=function(o){var p=m({},o.getParameters());p.type=!p.type?o.getId():p.type;switch(p.type){case"addOrSetAggregation":case"insertAggregation":this._onAddAggregation(p.value,p.target,p.name);break;case"setParent":setTimeout(function(){if(!this.bIsDestroyed){this._checkIfOverlayShouldBeDestroyed(p.target);}}.bind(this),0);break;case"propertyChanged":p.id=o.getSource().getId();delete p.type;delete p.target;this.fireElementPropertyChanged(p);break;}};D.prototype._onEditableChanged=function(o){var p=m({},o.getParameters());p.id=o.getSource().getId();this.fireElementOverlayEditableChanged(p);};D.prototype._onAddAggregation=function(o,p,s){if(c.isElementValid(o)){var P=O.getOverlay(p);var j=P.getAggregationOverlay(s);var k=O.getOverlay(o);if(!k){var t=this._oTaskManager.add({type:'createChildOverlay',element:o});k=this.createOverlay({element:o,parentMetadata:j.getDesignTimeMetadata().getData()}).then(function(k){j.insertChild(null,k);k.applyStyles();var l=j.indexOfAggregation('children',k);this.fireElementOverlayAdded({id:k.getId(),targetIndex:l,targetId:j.getId(),targetAggregation:j.getAggregationName()});this._oTaskManager.complete(t);}.bind(this),function(v){throw v;}).catch(function(l,n,v){this._oTaskManager.cancel(t);var r=U.propagateError(v,"DesignTime#_onAddAggregation",U.printf("Failed to add new element overlay (elementId='{0}') into aggregation overlay (id='{1}')",l,n));if(!o.bIsDestroyed){L.error(U.errorToString(r));}}.bind(this,o.getId(),j.getId()));}else{if(k&&!this._isElementInRootElements(k)&&k.isRoot()){k.setIsRoot(false);}j.insertChild(null,k);k.setDesignTimeMetadata(f.propagateMetadataToElementOverlay(k._mMetadataOriginal,j.getDesignTimeMetadata().getData(),o));this.fireElementOverlayMoved({id:k.getId(),targetIndex:j.indexOfAggregation('children',k),targetId:j.getId(),targetAggregation:j.getAggregationName()});}}};D.prototype._checkIfOverlayShouldBeDestroyed=function(o){var j=O.getOverlay(o);if(!o.bIsDestroyed&&j&&(!this._isElementInRootElements(o)||o.sParentAggregationName==="dependents")){j.destroy();}};D.prototype._isElementInRootElements=function(o){var F=false;this._iterateRootElements(function(r){if(c.hasAncestor(o,r)){F=true;return false;}});return F;};D.prototype._iterateRootElements=function(s,o){var r=this.getRootElements();r.forEach(function(R){var j=c.getElementInstance(R);s.call(o||this,j);},this);};D.prototype._getAllElementOverlaysIn=function(o){var j=[];var k=O.getOverlay(o);if(k){e.iterateOverlayElementTree(k,function(C){if(C.getDesignTimeMetadata()){j.push(C);}});}return j;};D.prototype.setEnabled=function(v){v=!!v;if(this.getEnabled()!==v){this.setProperty('enabled',v);this.fireEnabledChanged({value:v});}};return D;},true);
