/*
 * ! UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2018 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/fl/FakeLrepConnector","sap/ui/fl/LrepConnector","sap/ui/fl/Cache","sap/ui/fl/ChangePersistenceFactory","sap/ui/fl/Utils"],function(F,L,C,a,U){"use strict";return function(f){b._oBackendInstances={};function b(S){this.mSettings=Object.assign({"isKeyUser":true,"isAtoAvailable":false,"isProductiveSystem":false},S);}Object.assign(b.prototype,F.prototype);b.prototype.create=function(v){var r;if(Array.isArray(v)){r=v.map(function(m){return this._saveChange(m);}.bind(this));}else{r=this._saveChange(v);}return Promise.resolve({response:r,status:'success'});};b.prototype._saveChange=function(m){if(!m.creation){m.creation=new Date().toISOString();}f.saveChange(m.fileName,m);return m;};b.prototype.update=function(m,e,g,i){return Promise.resolve({response:this._saveChange(m),status:'success'});};b.prototype.send=function(u,m,D,o){function _(e,r){if((e.reference===r.parameters[1]||e.reference+".Component"===r.parameters[1])&&e.layer===r.parameters[2]){return true;}}if(m==="DELETE"){return F.prototype.send.apply(this,arguments).then(function(r){f.getChanges().forEach(function(e){if(_(e,r.response)){f.deleteChange(e.fileName);}});return Promise.resolve({response:undefined,status:"nocontent"});});}else{return F.prototype.send.apply(this,arguments);}};b.prototype.deleteChange=function(o){f.deleteChange(o.sChangeName);return Promise.resolve({response:undefined,status:"nocontent"});};b.prototype.deleteChanges=function(){f.deleteChanges();return Promise.resolve({response:undefined,status:"nocontent"});};b.prototype.loadChanges=function(e){var g=f.getChanges();return new Promise(function(r,h){var R={};if(this.mSettings.sInitialComponentJsonPath){jQuery.getJSON(this.mSettings.sInitialComponentJsonPath).done(function(o){R={changes:o,componentClassName:e};r(R);}).fail(function(i){h(i);});}else{r(R);}}.bind(this)).then(function(r){var v=[];var h=[];var i=[];var j=[];g.forEach(function(o){if(o.fileType==="ctrl_variant"&&o.variantManagementReference){v.push(o);}else if(o.fileType==="ctrl_variant_change"){h.push(o);}else if(o.fileType==="ctrl_variant_management_change"){i.push(o);}else{j.push(o);}});r=this._createChangesMap(r,v);r=this._addChangesToMap(r,j,h,i);r=this._sortChanges(r);r=this._assignVariantReferenceChanges(r);r.changes.contexts=[];r.changes.settings=this.mSettings;r.componentClassName=e;return r;}.bind(this));};b.prototype._createChangesMap=function(r,v){if(!r||!r.changes){r={changes:{}};}if(!r.changes.changes){r.changes.changes=[];}if(!r.changes.variantSection){r.changes.variantSection={};}var e=function(E,n){return E.some(function(o){return o.content.fileName===n.fileName;});};var V={};v.forEach(function(o){V=r.changes.variantSection[o.variantManagementReference];if(!V){var S=this._fakeStandardVariant(o.variantManagementReference);V=this._getVariantManagementStructure([this._getVariantStructure(S,[],{}),this._getVariantStructure(o,[],{})],{});r.changes.variantSection[o.variantManagementReference]=V;}else if(!e(V.variants,o)){V.variants.push(this._getVariantStructure(o,[],{}));}}.bind(this));return r;};b.prototype._getVariantStructure=function(v,e,V){return{content:v,controlChanges:e,variantChanges:V};};b.prototype._getVariantManagementStructure=function(v,V){return{variants:v,variantManagementChanges:V};};function s(A){A.sort(c);}function c(o,e){var l=U.getLayerIndex(o.layer);var i=U.getLayerIndex(e.layer);if(l!==i){return l-i;}return new Date(o.creation)-new Date(e.creation);}b.prototype._sortChanges=function(r){if(r.changes.changes){s(r.changes.changes);}d(r,function(v){s(v.controlChanges);});return r;};function d(r,e){Object.keys(r.changes.variantSection).forEach(function(v){var V=r.changes.variantSection[v].variants;V.forEach(e);});}b.prototype._assignVariantReferenceChanges=function(r){d(r,function(v){var V=v.content.variantReference;var e=v.controlChanges;if(V){e=this._getReferencedChanges(r,v).concat(e);}v.controlChanges=e;}.bind(this));return r;};function w(r,v,V,e){r.changes.variantSection[v].variants.some(function(o){if(o.content.fileName===V){e(o);return true;}});}b.prototype._getReferencedChanges=function(r,o){var R=[];w(r,o.content.variantManagementReference,o.content.variantReference,function(v){R=v.controlChanges.filter(function(e){return U.compareAgainstCurrentLayer(e.layer)===-1;});if(v.content.variantReference){R=R.concat(this._getReferencedChanges(r,v));}}.bind(this));return R;};b.prototype._addChangesToMap=function(r,e,g,h){var A=function(r,V,o){w(r,V,o.variantReference,function(j){j.controlChanges.push(o);});};var i=function(r,V,o){w(r,V,o.selector.id,function(j){if(!j.variantChanges[o.changeType]){j.variantChanges[o.changeType]=[];}j.variantChanges[o.changeType].push(o);});};var v={};h.forEach(function(V){var j=V.selector.id;if(Object.keys(r.changes.variantSection).length===0){r.changes.variantSection[j]=this._getVariantManagementStructure([this._getVariantStructure(this._fakeStandardVariant(j),[],{})],{});}v=r.changes.variantSection[j].variantManagementChanges;if(!v[V.changeType]){v[V.changeType]=[];}v[V.changeType].push(V);}.bind(this));e.forEach(function(o){if(!o.variantReference){r.changes.changes.push(o);}else if(Object.keys(r.changes.variantSection).length===0){r.changes.variantSection[o.variantReference]=this._getVariantManagementStructure([this._getVariantStructure(this._fakeStandardVariant(o.variantReference),[o],{})],{});}else{Object.keys(r.changes.variantSection).forEach(function(V){A(r,V,o);});}}.bind(this));g.forEach(function(V){if(Object.keys(r.changes.variantSection).length===0){var m={};m[V.changeType]=[V];r.changes.variantSection[V.selector.id]=this._getVariantManagementStructure([this._getVariantStructure(this._fakeStandardVariant(V.selector.id),[],m)],{});}else{Object.keys(r.changes.variantSection).forEach(function(j){i(r,j,V);});}}.bind(this));return r;};b.prototype._fakeStandardVariant=function(v){return{fileName:v,fileType:"ctrl_variant",variantManagementReference:v,variantReference:"",content:{title:sap.ui.getCore().getLibraryResourceBundle("sap.ui.fl").getText("STANDARD_VARIANT_TITLE")}};};b.enableFakeConnector=function(S,A,e){S=S||{};function r(){b.enableFakeConnector.original=L.createConnector;L.createConnector=function(){if(!b._oFakeInstance){b._oFakeInstance=new b(S);}return b._oFakeInstance;};}if(A&&e){var o=a.getChangePersistenceForComponent(A,e);if(!(o._oConnector instanceof b)){C.clearEntry(A,e);if(!b._oBackendInstances[A]){b._oBackendInstances[A]={};}b._oBackendInstances[A][e]=o._oConnector;o._oConnector=new b(S);}r();return;}C.clearEntries();if(b.enableFakeConnector.original){return;}r();};b.disableFakeConnector=function(A,e){function r(){if(b.enableFakeConnector.original){L.createConnector=b.enableFakeConnector.original;b.enableFakeConnector.original=undefined;b._oFakeInstance=undefined;}}if(A&&e){var o=a.getChangePersistenceForComponent(A,e);if(!(o._oConnector instanceof L)){C.clearEntry(A,e);if(b._oBackendInstances[A]&&b._oBackendInstances[A][e]){o._oConnector=b._oBackendInstances[A][e];b._oBackendInstances[A][e]=undefined;}}r();return;}C.clearEntries();r();};return b;};},true);