/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2018 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/fl/descriptorRelated/api/DescriptorInlineChangeFactory","sap/ui/fl/Utils","sap/ui/fl/LrepConnector","sap/ui/fl/descriptorRelated/internal/Utils","sap/ui/fl/registry/Settings","sap/ui/thirdparty/jquery","sap/base/util/merge"],function(D,F,L,U,S,q,b){"use strict";var a=function(p,f,d,s){if(p&&d){this._id=p.id;this._mode='DELETION';this._mMap=f;}else if(p){this._id=p.id;this._reference=p.reference;this._layer=p.layer;if(typeof p.isAppVariantRoot!="undefined"){this._isAppVariantRoot=p.isAppVariantRoot;}if(typeof p.referenceVersion!="undefined"){this._referenceVersion=p.referenceVersion;}this._mode='NEW';this._skipIam=p.skipIam;}else if(f){this._mMap=f;this._mode='FROM_EXISTING';}this._oSettings=s;this._sTransportRequest=null;this._content=[];};a.prototype.addDescriptorInlineChange=function(d){var t=this;return new Promise(function(r){var s=function(_,i){if(_["setHostingIdForTextKey"]){_.setHostingIdForTextKey(i);}};switch(t._mode){case'NEW':s(d,t._id);t._content.push(d.getMap());break;case'FROM_EXISTING':s(d,t._mMap.id);t._mMap.content.push(d.getMap());break;default:}r(null);});};a.prototype.setTransportRequest=function(t){try{U.checkTransportRequest(t);}catch(e){return Promise.reject(e);}this._sTransportRequest=t;return Promise.resolve();};a.prototype.setPackage=function(p){try{U.checkPackage(p);}catch(e){return Promise.reject(e);}this._package=p;return Promise.resolve();};a.prototype.submit=function(){var r='/sap/bc/lrep/appdescr_variants/';var m;switch(this._mode){case'NEW':m='POST';break;case'FROM_EXISTING':m='PUT';r=r+this._getMap().id;break;case'DELETION':m='DELETE';r=r+this._id;break;default:}var M=this._getMap();if(this._sTransportRequest){r+='?changelist='+this._sTransportRequest;}else if(this._oSettings.isAtoEnabled()&&F.isCustomerDependentLayer(M.layer)){r+='?changelist=ATO_NOTIFICATION';}if(this._skipIam){r+=(r.indexOf('?')<0)?'?':'&';r+='skipIam='+this._skipIam;}var l=L.createConnector();return l.send(r,m,M);};a.prototype.getId=function(){return this._id;};a.prototype.setReference=function(r){if(r===undefined||typeof r!=="string"){throw new Error("No parameter sReference of type string provided");}this._reference=r;};a.prototype.getReference=function(){return this._reference;};a.prototype.getNamespace=function(){return this._getMap().namespace;};a.prototype.getSettings=function(){return this._oSettings;};a.prototype.getJson=function(){return b({},this._getMap());};a.prototype._getMap=function(){switch(this._mode){case'NEW':var r={"fileName":this._getNameAndNameSpace().fileName,"fileType":"appdescr_variant","namespace":this._getNameAndNameSpace().namespace,"layer":this._layer,"packageName":this._package?this._package:"$TMP","reference":this._reference,"id":this._id,"content":this._content};if(typeof this._isAppVariantRoot!="undefined"){r.isAppVariantRoot=this._isAppVariantRoot;}if(r.isAppVariantRoot!=undefined&&!r.isAppVariantRoot){r.fileType="cdmapp_config";}if(typeof this._referenceVersion!="undefined"){r.referenceVersion=this._referenceVersion;}return r;case'FROM_EXISTING':case'DELETION':{return this._mMap;}default:}};a.prototype._getNameAndNameSpace=function(){return U.getNameAndNameSpace(this._id,this._reference);};var c={};c._getDescriptorVariant=function(i){var r='/sap/bc/lrep/appdescr_variants/'+i;var l=L.createConnector();return l.send(r,'GET');};c.createNew=function(p){U.checkParameterAndType(p,"reference","string");U.checkParameterAndType(p,"id","string");if(!p.layer){p.layer='CUSTOMER';}else{U.checkParameterAndType(p,"layer","string");if(p.layer!='VENDOR'&&p.layer!='PARTNER'&&!F.isCustomerDependentLayer(p.layer)){throw new Error("Parameter \"layer\" needs to be 'VENDOR', 'PARTNER' or customer dependent");}}if(p.isAppVariantRoot){U.checkParameterAndType(p,"isAppVariantRoot","boolean");}if(p.skipIam){U.checkParameterAndType(p,"skipIam","boolean");}return S.getInstance().then(function(s){return Promise.resolve(new a(p,null,false,s));});};c.createForExisting=function(i){if(i===undefined||typeof i!=="string"){throw new Error("Parameter \"sId\" must be provided of type string");}var _;return c._getDescriptorVariant(i).then(function(r){_=r;return S.getInstance();}).then(function(s){var d=_.response;if(!q.isPlainObject(d)){d=JSON.parse(d);}return Promise.resolve(new a(null,d,false,s));});};c.createFromJson=function(p){if(!q.isPlainObject(p)){throw new Error("Parameter \"mParameters\" must be provided of type object");}return S.getInstance().then(function(s){return Promise.resolve(new a(null,p,false,s));});};c.createDeletion=function(i){if(i===undefined||typeof i!=="string"){throw new Error("Parameter \"sId\" must be provided of type string");}var p={};p.id=i;var _;return c._getDescriptorVariant(i).then(function(r){_=r;return S.getInstance();}).then(function(s){var d=JSON.parse(_.response);return Promise.resolve(new a(p,d,true,s));});};return c;},true);
