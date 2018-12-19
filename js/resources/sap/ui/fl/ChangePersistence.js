/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2018 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/fl/Change","sap/ui/fl/Variant","sap/ui/fl/Utils","sap/ui/fl/LrepConnector","sap/ui/fl/Cache","sap/ui/fl/context/ContextManager","sap/ui/fl/registry/Settings","sap/ui/fl/transport/TransportSelection","sap/ui/fl/variants/VariantController","sap/ui/core/BusyIndicator","sap/ui/core/Component","sap/m/MessageBox","sap/ui/model/json/JSONModel","sap/ui/thirdparty/jquery","sap/base/util/merge"],function(C,V,U,L,a,b,S,T,c,B,d,M,J,q,f){"use strict";var e=function(m){this._mComponent=m;this._mChanges={mChanges:{},mDependencies:{},mDependentChangesOnMe:{},aChanges:[]};this._mChangesInitial=f({},this._mChanges);this._mVariantsChanges={};if(!this._mComponent||!this._mComponent.name){U.log.error("The Control does not belong to an SAPUI5 component. Personalization and changes for this control might not work as expected.");throw new Error("Missing component name.");}this._oVariantController=new c(this._mComponent.name,this._mComponent.appVersion,{});this._oTransportSelection=new T();this._oConnector=this._createLrepConnector();this._aDirtyChanges=[];this._oMessagebundle=undefined;this._mChangesEntries={};this._bHasChangesOverMaxLayer=false;this.HIGHER_LAYER_CHANGES_EXIST="higher_layer_changes_exist";};e.prototype.getComponentName=function(){return this._mComponent.name;};e.prototype._createLrepConnector=function(){return L.createConnector();};e.prototype.getCacheKey=function(){return a.getCacheKey(this._mComponent);};e.prototype._preconditionsFulfilled=function(A,i,o){if(!o.fileName){U.log.warning("A change without fileName is detected and excluded from component: "+this._mComponent.name);return false;}function _(){if(i){return(o.fileType==="change")||(o.fileType==="variant");}return(o.fileType==="change")&&(o.changeType!=="defaultVariant");}function g(){if(i){if((o.fileType==="variant")||(o.changeType==="defaultVariant")){return o.selector&&o.selector.persistencyKey;}}return true;}function h(){return b.doesContextMatch(o,A);}function j(){if((o.fileType==="ctrl_variant")||(o.fileType==="ctrl_variant_change")||(o.fileType==="ctrl_variant_management_change")){return o.variantManagementReference||o.variantReference||(o.selector&&o.selector.id);}}if((_()&&g()&&h())||j()){return true;}return false;};e.prototype.getChangesForComponent=function(p){return a.getChangesFillingCache(this._oConnector,this._mComponent,p).then(function(w){var A=p&&p.component&&U.getAppComponentForControl(p.component);if(w.changes&&w.changes.settings){S._storeInstance(w.changes.settings);}var F=w.changes&&Array.isArray(w.changes.changes)&&w.changes.changes.length!==0;var v=w.changes&&w.changes.variantSection&&!q.isEmptyObject(w.changes.variantSection);if(!F&&!v){return[];}var i=w.changes.changes;if(!this._oMessagebundle&&w.messagebundle&&A){if(!A.getModel("i18nFlexVendor")){if(i.some(function(t){return t.layer==="VENDOR";})){this._oMessagebundle=w.messagebundle;var m=new J(this._oMessagebundle);A.setModel(m,"i18nFlexVendor");}}}var I=p&&p.includeCtrlVariants&&v;var s=p&&p.currentLayer;var j=!(p&&p.ignoreMaxLayerParameter);if(s){i=i.filter(this._filterChangeForCurrentLayer.bind(null,s));if(!I&&v){this._getAllCtrlVariantChanges(w.changes.variantSection,false,s);}}else if(U.isLayerFilteringRequired()&&j){i=i.filter(this._filterChangeForMaxLayer.bind(this));if(!I&&v){this._getAllCtrlVariantChanges(w.changes.variantSection,true);}}else if(this._bHasChangesOverMaxLayer&&!j){this._bHasChangesOverMaxLayer=false;return this.HIGHER_LAYER_CHANGES_EXIST;}if(I){i=i.concat(this._getAllCtrlVariantChanges(w.changes.variantSection));}var o=A?A.getComponentData():(p&&p.componentData||{});if(w.changes.variantSection&&Object.keys(w.changes.variantSection).length!==0&&Object.keys(this._oVariantController._getChangeFileContent()).length===0){this._oVariantController._setChangeFileContent(w,o&&o.technicalParameters);}if(Object.keys(this._oVariantController._getChangeFileContent()).length>0){var k=this._oVariantController.loadInitialChanges();i=I?i:i.concat(k);}var l=p&&p.includeVariants;var n=w.changes.contexts||[];return new Promise(function(t){b.getActiveContexts(n).then(function(u){t(i.map(function(x){return x instanceof C?x.getDefinition():x;}).filter(this._preconditionsFulfilled.bind(this,u,l)).map(h.bind(this,w)));}.bind(this));}.bind(this));}.bind(this));function g(w,o){var F;Object.keys(w.changes.variantSection).some(function(v){return w.changes.variantSection[v].variants.some(function(i){if(i.content.fileName===o.getDefinition().variantReference){F=i;return true;}});});return F;}function r(v,o){return v.controlChanges.some(function(i,j){if(i.fileName===o.getDefinition().fileName){v.controlChanges.splice(j,1,o);return true;}});}function h(w,o){var i;if(!this._mChangesEntries[o.fileName]){this._mChangesEntries[o.fileName]=new C(o);}i=this._mChangesEntries[o.fileName];i.setState(C.states.PERSISTED);if(o.variantReference){var v=g(w,i);r(v,i);}return i;}};e.prototype._filterChangeForMaxLayer=function(o){if(U.isOverMaxLayer(o.layer)){if(!this._bHasChangesOverMaxLayer){this._bHasChangesOverMaxLayer=true;}return false;}return true;};e.prototype._filterChangeForCurrentLayer=function(l,o){return l===o.layer;};e.prototype._getAllCtrlVariantChanges=function(v,F,s){var g=[];var h=function(){return true;};if(F){h=this._filterChangeForMaxLayer.bind(this);}else if(typeof s==="string"&&s!==""){h=this._filterChangeForCurrentLayer.bind(this,s);}Object.keys(v).forEach(function(i){var o=v[i];o.variants=o.variants.filter(function(j){return!j.content.layer||h(j.content);});o.variants.forEach(function(j){if(Array.isArray(j.variantChanges.setVisible)){j.variantChanges.setVisible=j.variantChanges.setVisible.filter(h);var A=j.variantChanges.setVisible.slice(-1)[0];if(A&&!A.content.visible&&A.content.createdByReset){return;}else{g=g.concat(j.variantChanges.setVisible);}}Object.keys(j.variantChanges).forEach(function(k){if(k!=="setVisible"){j.variantChanges[k]=j.variantChanges[k].filter(h);g=j.variantChanges[k].length>0?g.concat(j.variantChanges[k].slice(-1)[0]):g;}});g=(j.content.fileName!==i)?g.concat([j.content]):g;j.controlChanges=j.controlChanges.filter(h);g=g.concat(j.controlChanges);});Object.keys(o.variantManagementChanges).forEach(function(j){o.variantManagementChanges[j]=o.variantManagementChanges[j].filter(h);g=o.variantManagementChanges[j].length>0?g.concat(o.variantManagementChanges[j].slice(-1)[0]):g;});});return g;};e.prototype.getChangesForVariant=function(s,g,p){if(this._mVariantsChanges[g]){return Promise.resolve(this._mVariantsChanges[g]);}var i=function(o){var h=false;var j=o._oDefinition.selector;q.each(j,function(k,v){if(k===s&&v===g){h=true;}});return h;};var l=function(k,t){U.log.error("key : "+k+" and text : "+t.value);};return this.getChangesForComponent(p).then(function(h){return h.filter(i);}).then(function(h){this._mVariantsChanges[g]={};if(h&&h.length===0){return L.isFlexServiceAvailable().then(function(j){if(j===false){return Promise.reject();}return Promise.resolve(this._mVariantsChanges[g]);}.bind(this));}var I;h.forEach(function(o){I=o.getId();if(o.isValid()){if(this._mVariantsChanges[g][I]&&o.isVariant()){U.log.error("Id collision - two or more variant files having the same id detected: "+I);q.each(o.getDefinition().texts,l);U.log.error("already exists in variant : ");q.each(this._mVariantsChanges[g][I].getDefinition().texts,l);}this._mVariantsChanges[g][I]=o;}}.bind(this));return this._mVariantsChanges[g];}.bind(this));};e.prototype.addChangeForVariant=function(s,g,p){var F,i,I,o,h;if(!p){return undefined;}if(!p.type){U.log.error("sap.ui.fl.Persistence.addChange : type is not defined");}var j=q.type(p.content);if(j!=='object'&&j!=='array'){U.log.error("mParameters.content is not of expected type object or array, but is: "+j,"sap.ui.fl.Persistence#addChange");}I={};if(typeof(p.texts)==="object"){q.each(p.texts,function(k,t){I[k]={value:t,type:"XFLD"};});}var v={creation:this._mComponent.appVersion,from:this._mComponent.appVersion};if(this._mComponent.appVersion&&p.developerMode){v.to=this._mComponent.appVersion;}i={changeType:p.type,service:p.ODataService,texts:I,content:p.content,reference:this._mComponent.name,isVariant:p.isVariant,packageName:p.packageName,isUserDependent:p.isUserDependent,validAppVersions:v};i.selector={};i.selector[s]=g;F=C.createInitialFileContent(i);if(p.id){F.fileName=p.id;}o=new C(F);h=o.getId();if(!this._mVariantsChanges[g]){this._mVariantsChanges[g]={};}this._mVariantsChanges[g][h]=o;return o.getId();};e.prototype.saveAllChangesForVariant=function(s){var p=[];var t=this;q.each(this._mVariantsChanges[s],function(i,o){var g=o.getId();switch(o.getPendingAction()){case"NEW":p.push(t._oConnector.create(o.getDefinition(),o.getRequest(),o.isVariant()).then(function(r){o.setResponse(r.response);if(a.isActive()){a.addChange({name:t._mComponent.name,appVersion:t._mComponent.appVersion},r.response);}return r;}));break;case"UPDATE":p.push(t._oConnector.update(o.getDefinition(),o.getId(),o.getRequest(),o.isVariant()).then(function(r){o.setResponse(r.response);if(a.isActive()){a.updateChange({name:t._mComponent.name,appVersion:t._mComponent.appVersion},r.response);}return r;}));break;case"DELETE":p.push(t._oConnector.deleteChange({sChangeName:o.getId(),sLayer:o.getLayer(),sNamespace:o.getNamespace(),sChangelist:o.getRequest()},o.isVariant()).then(function(r){var o=t._mVariantsChanges[s][g];if(o.getPendingAction()==="DELETE"){delete t._mVariantsChanges[s][g];}if(a.isActive()){a.deleteChange({name:t._mComponent.name,appVersion:t._mComponent.appVersion},o.getDefinition());}return r;}));break;default:break;}});return Promise.all(p);};e.prototype._addChangeIntoMap=function(A,o){var s=o.getSelector();if(s&&s.id){var g=s.id;if(s.idIsLocal){g=A.createId(g);}this._addMapEntry(g,o);if(s.idIsLocal===undefined&&g.indexOf("---")!=-1){var h=g.split("---")[0];if(h!==A.getId()){g=g.split("---")[1];g=A.createId(g);this._addMapEntry(g,o);}}}return this._mChanges;};e.prototype._addMapEntry=function(s,o){if(!this._mChanges.mChanges[s]){this._mChanges.mChanges[s]=[];}if(this._mChanges.mChanges[s].indexOf(o)===-1){this._mChanges.mChanges[s].push(o);}if(this._mChanges.aChanges.indexOf(o)===-1){this._mChanges.aChanges.push(o);}};e.prototype._addDependency=function(D,o,r){var m=r?this._mChangesInitial:this._mChanges;if(!m.mDependencies[D.getId()]){m.mDependencies[D.getId()]={changeObject:D,dependencies:[]};}m.mDependencies[D.getId()].dependencies.push(o.getId());if(!m.mDependentChangesOnMe[o.getId()]){m.mDependentChangesOnMe[o.getId()]=[];}m.mDependentChangesOnMe[o.getId()].push(D.getId());};e.prototype._addControlsDependencies=function(D,g,r){var m=r?this._mChangesInitial:this._mChanges;if(g.length>0){if(!m.mDependencies[D.getId()]){m.mDependencies[D.getId()]={changeObject:D,dependencies:[],controlsDependencies:[]};}m.mDependencies[D.getId()].controlsDependencies=g;}};e.prototype.loadChangesMapForComponent=function(A,p){p.component=!q.isEmptyObject(A)&&A;return this.getChangesForComponent(p).then(g.bind(this));function g(h){this._mChanges={mChanges:{},mDependencies:{},mDependentChangesOnMe:{},aChanges:[]};h.forEach(this._addChangeAndUpdateDependencies.bind(this,A));this._mChangesInitial=f({},this._mChanges);return this.getChangesMapForComponent.bind(this);}};e.prototype.checkForOpenDependenciesForControl=function(s,m,A){return Object.keys(this._mChanges.mDependencies).some(function(k){return this._mChanges.mDependencies[k].changeObject.getDependentSelectorList().some(function(D){return D===m.getControlIdBySelector(s,A);});},this);};e.prototype.copyDependenciesFromInitialChangesMap=function(o,D){var i=f({},this._mChangesInitial.mDependencies);var I=i[o.getId()];if(I){var n=[];I.dependencies.forEach(function(s){if(D(s)){if(!this._mChanges.mDependentChangesOnMe[s]){this._mChanges.mDependentChangesOnMe[s]=[];}this._mChanges.mDependentChangesOnMe[s].push(o.getId());n.push(s);}}.bind(this));I.dependencies=n;this._mChanges.mDependencies[o.getId()]=I;}return this._mChanges;};e.prototype._addChangeAndUpdateDependencies=function(A,o){this._addChangeIntoMap(A,o);this._updateDependencies(o,false);};e.prototype._addRunTimeCreatedChangeAndUpdateDependencies=function(A,o){this._addChangeIntoMap(A,o);this._updateDependencies(o,true);};e.prototype._updateDependencies=function(o,r){var g=this.getChangesMapForComponent().aChanges;var D=o.getDependentSelectorList();var h=o.getDependentControlSelectorList();this._addControlsDependencies(o,h,r);g.slice(0,g.length-1).reverse().forEach(function(p){var P=p.getDependentSelectorList();D.some(function(i){var j=U.indexOfObject(P,i);if(j>-1){this._addDependency(o,p,r);return true;}}.bind(this));}.bind(this));};e.prototype.getChangesMapForComponent=function(){return this._mChanges;};e.prototype.getChangesForView=function(v,p){var t=this;return this.getChangesForComponent(p).then(function(h){return h.filter(g.bind(t));});function g(o){var s=o.getSelector();if(!s){return false;}var h=s.id;if(!h||!p){return false;}var i=h.slice(0,h.lastIndexOf("--"));var v;if(o.getSelector().idIsLocal){var j=p.appComponent;if(j){v=j.getLocalId(p.viewId);}}else{v=p.viewId;}return i===v;}};e.prototype.addChange=function(v,A){var o=this.addDirtyChange(v);this._addRunTimeCreatedChangeAndUpdateDependencies(A,o);this._addPropagationListener(A);return o;};e.prototype.addDirtyChange=function(v){var n;if(v instanceof C||v instanceof V){n=v;}else{n=new C(v);}if(this._aDirtyChanges.indexOf(n)===-1){this._aDirtyChanges.push(n);}return n;};e.prototype._addPropagationListener=function(o){var A=U.getAppComponentForControl(o);if(A instanceof d){var g=function(p){return!p._bIsSapUiFlFlexControllerApplyChangesOnControl;};var n=A.getPropagationListeners().every(g);if(n){var m=A.getManifestObject();var v=U.getAppVersionFromManifest(m);var F=sap.ui.require("sap/ui/fl/FlexControllerFactory");var h=F.create(this.getComponentName(),v);var p=h.getBoundApplyChangesOnControl(this.getChangesMapForComponent.bind(this),A);A.addPropagationListener(p);}}};e.prototype.saveDirtyChanges=function(s){var D=this._aDirtyChanges.slice(0);var g=this._aDirtyChanges;var r=this._getRequests(D);var p=this._getPendingActions(D);if(p.length===1&&r.length===1&&p[0]==="NEW"){var R=r[0];var P=this._prepareDirtyChanges(g);return this._oConnector.create(P,R).then(function(o){this._massUpdateCacheAndDirtyState(g,D,s);return o;}.bind(this));}else{return D.reduce(function(h,o){var i=h.then(this._performSingleSaveAction(o));i.then(this._updateCacheAndDirtyState.bind(this,g,o,s));return i;}.bind(this),Promise.resolve());}};e.prototype.saveSequenceOfDirtyChanges=function(D,s){var A=this.getDirtyChanges();return D.reduce(function(g,o){var h=g.then(this._performSingleSaveAction(o));h.then(this._updateCacheAndDirtyState.bind(this,A,o,s));return h;}.bind(this),Promise.resolve());};e.prototype._performSingleSaveAction=function(D){return function(){if(D.getPendingAction()==="NEW"){return this._oConnector.create(D.getDefinition(),D.getRequest());}if(D.getPendingAction()==="DELETE"){return this._oConnector.deleteChange({sChangeName:D.getId(),sLayer:D.getLayer(),sNamespace:D.getNamespace(),sChangelist:D.getRequest()});}}.bind(this);};e.prototype._updateCacheAndDirtyState=function(D,o,s){if(!s){if(o.getPendingAction()==="NEW"&&o.getFileType()!=="ctrl_variant_change"&&o.getFileType()!=="ctrl_variant_management_change"&&o.getFileType()!=="ctrl_variant"&&!o.getVariantReference()){a.addChange(this._mComponent,o.getDefinition());}else if(o.getPendingAction()==="DELETE"){a.deleteChange(this._mComponent,o.getDefinition());}}var i=D.indexOf(o);if(i>-1){D.splice(i,1);}};e.prototype._massUpdateCacheAndDirtyState=function(D,g,s){g.forEach(function(o){this._updateCacheAndDirtyState(D,o,s);},this);};e.prototype._getRequests=function(D){var r=[];D.forEach(function(o){var R=o.getRequest();if(r.indexOf(R)===-1){r.push(R);}});return r;};e.prototype._getPendingActions=function(D){var p=[];D.forEach(function(o){var P=o.getPendingAction();if(p.indexOf(P)===-1){p.push(P);}});return p;};e.prototype._prepareDirtyChanges=function(D){var g=[];D.forEach(function(o){g.push(o.getDefinition());});return g;};e.prototype.getDirtyChanges=function(){return this._aDirtyChanges;};e.prototype.deleteChange=function(o){var n=this._aDirtyChanges.indexOf(o);if(n>-1){if(o.getPendingAction()==="DELETE"){return;}this._aDirtyChanges.splice(n,1);this._deleteChangeInMap(o);return;}o.markForDeletion();this.addDirtyChange(o);this._deleteChangeInMap(o);};e.prototype._deleteChangeInMap=function(o){var s=o.getId();var m=this._mChanges.mChanges;var D=this._mChanges.mDependencies;var g=this._mChanges.mDependentChangesOnMe;Object.keys(m).some(function(k){var h=m[k];var n=h.map(function(E){return E.getId();}).indexOf(o.getId());if(n!==-1){h.splice(n,1);return true;}});Object.keys(D).forEach(function(k){if(k===s){delete D[k];}else if(D[k].dependencies&&Array.isArray(D[k].dependencies)&&D[k].dependencies.indexOf(s)!==-1){D[k].dependencies.splice(D[k].dependencies.indexOf(s),1);if(D[k].dependencies.length===0){delete D[k];}}});Object.keys(g).forEach(function(k){if(k===s){delete g[k];}else if(Array.isArray(g[k])&&g[k].indexOf(s)!==-1){g[k].splice(g[k].indexOf(s),1);if(g[k].length===0){delete g[k];}}});var i=this._mChanges.aChanges.indexOf(o);if(i!==-1){this._mChanges.aChanges.splice(i,1);}};e.prototype.loadSwitchChangesMapForComponent=function(p){p.changesMap=this._mChanges.mChanges;return this._oVariantController.getChangesForVariantSwitch(p);};e.prototype.transportAllUIChanges=function(r,s,l){var h=function(E){B.hide();var R=sap.ui.getCore().getLibraryResourceBundle("sap.ui.fl");var m=R.getText("MSG_TRANSPORT_ERROR",E?[E.message||E]:undefined);var t=R.getText("HEADER_TRANSPORT_ERROR");U.log.error("transport error"+E);M.show(m,{icon:M.Icon.ERROR,title:t,styleClass:s});return"Error";};return this._oTransportSelection.openTransportSelection(null,r,s).then(function(t){if(this._oTransportSelection.checkTransportInfo(t)){B.show(0);return this.getChangesForComponent({currentLayer:l,includeCtrlVariants:true}).then(function(A){return this._oTransportSelection._prepareChangesForTransport(t,A).then(function(){B.hide();});}.bind(this));}else{return"Cancel";}}.bind(this))['catch'](h);};e.prototype.resetChanges=function(l,g){return this.getChangesForComponent({currentLayer:l,includeCtrlVariants:true}).then(function(h){return S.getInstance(this.getComponentName()).then(function(s){if(!s.isProductiveSystem()&&!s.hasMergeErrorOccured()){return this._oTransportSelection.setTransports(h,d.get(this.getComponentName()));}}.bind(this)).then(function(){var u="?reference="+this.getComponentName()+"&appVersion="+this._mComponent.appVersion+"&layer="+l+"&generator="+g;if(h.length>0){u=u+"&changelist="+h[0].getRequest();}return this._oConnector.send("/sap/bc/lrep/changes/"+u,"DELETE");}.bind(this));}.bind(this));};return e;},true);
