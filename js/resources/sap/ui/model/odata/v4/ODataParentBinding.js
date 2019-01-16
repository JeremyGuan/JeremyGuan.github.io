/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2018 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["./ODataBinding","./lib/_Helper","sap/base/Log","sap/ui/base/SyncPromise","sap/ui/model/ChangeReason","sap/ui/thirdparty/jquery"],function(a,_,L,S,C,q){"use strict";function O(){}a(O.prototype);var c="sap.ui.model.odata.v4.ODataParentBinding";O.prototype.attachPatchCompleted=function(f,l){this.attachEvent("patchCompleted",f,l);};O.prototype.detachPatchCompleted=function(f,l){this.detachEvent("patchCompleted",f,l);};O.prototype.firePatchCompleted=function(s){if(this.iPatchCounter===0){throw new Error("Completed more PATCH requests than sent");}this.iPatchCounter-=1;this.bPatchSuccess=this.bPatchSuccess&&s;if(this.iPatchCounter===0){this.fireEvent("patchCompleted",{success:this.bPatchSuccess});this.bPatchSuccess=true;}};O.prototype.attachPatchSent=function(f,l){this.attachEvent("patchSent",f,l);};O.prototype.detachPatchSent=function(f,l){this.detachEvent("patchSent",f,l);};O.prototype.firePatchSent=function(){this.iPatchCounter+=1;if(this.iPatchCounter===1){this.fireEvent("patchSent");}};O.prototype.addToSelect=function(Q,s){Q.$select=Q.$select||[];s.forEach(function(p){if(Q.$select.indexOf(p)<0){Q.$select.push(p);}});};O.prototype.aggregateQueryOptions=function(Q,b){var A=q.extend(true,{},this.mAggregatedQueryOptions);function m(d,Q,i){var e,s;function f(E){if(d.$expand[E]){return m(d.$expand[E],Q.$expand[E],true);}if(b){return false;}d.$expand[E]=e[E];return true;}function g(h){if(d.$select.indexOf(h)<0){if(b){return false;}d.$select.push(h);}return true;}e=Q.$expand;if(e){d.$expand=d.$expand||{};if(!Object.keys(e).every(f)){return false;}}s=Q.$select;if(s){d.$select=d.$select||[];if(!s.every(g)){return false;}}if(Q.$count){d.$count=true;}return Object.keys(Q).concat(Object.keys(d)).every(function(n){if(n==="$count"||n==="$expand"||n==="$select"||!i&&!(n in Q)){return true;}return Q[n]===d[n];});}if(m(A,Q)){this.mAggregatedQueryOptions=A;return true;}return false;};O.prototype.changeParameters=function(p){var b=q.extend(true,{},this.mParameters),s,k,t=this;function d(n){if(t.oModel.bAutoExpandSelect&&n in p){throw new Error("Cannot change $expand or $select parameter in "+"auto-$expand/$select mode: "+n+"="+JSON.stringify(p[n]));}}function u(n){if(n==="$filter"||n==="$search"){s=C.Filter;}else if(n==="$orderby"&&s!==C.Filter){s=C.Sort;}else if(!s){s=C.Change;}}this.checkSuspended();if(!p){throw new Error("Missing map of binding parameters");}d("$expand");d("$select");if(this.hasPendingChanges()){throw new Error("Cannot change parameters due to pending changes");}for(k in p){if(k.indexOf("$$")===0){throw new Error("Unsupported parameter: "+k);}if(p[k]===undefined&&b[k]!==undefined){u(k);delete b[k];}else if(b[k]!==p[k]){u(k);if(typeof p[k]==="object"){b[k]=q.extend(true,{},p[k]);}else{b[k]=p[k];}}}if(s){this.applyParameters(b,s);}};O.prototype.checkUpdate=function(){var t=this;function u(){t.getDependentBindings().forEach(function(d){d.checkUpdate();});}if(arguments.length>0){throw new Error("Unsupported operation: "+c+"#checkUpdate must not be"+" called with parameters");}this.oCachePromise.then(function(o){if(o&&t.bRelative&&t.oContext.fetchCanonicalPath){t.oContext.fetchCanonicalPath().then(function(s){if(o.$canonicalPath!==s){t.refreshInternal();}else{u();}}).catch(function(e){t.oModel.reportError("Failed to update "+t,c,e);});}else{u();}});};O.prototype.createInCache=function(u,v,p,i,f){var t=this;return this.oCachePromise.then(function(o){if(o){return o.create(u,v,p,i,f,function(e){t.oModel.reportError("POST on '"+v+"' failed; will be repeated automatically","sap.ui.model.odata.v4.ODataParentBinding",e);}).then(function(b){if(o.$canonicalPath){delete t.mCacheByContext[o.$canonicalPath];}return b;});}return t.oContext.getBinding().createInCache(u,v,_.buildPath(t.oContext.iIndex,t.sPath,p),i,f);});};O.prototype.createReadGroupLock=function(g,l,i){var G,t=this;function b(){sap.ui.getCore().addPrerenderingTask(function(){i-=1;if(i>0){Promise.resolve().then(b);}else if(t.oReadGroupLock===G){L.debug("Timeout: unlocked "+G,null,c);G.unlock(true);t.oReadGroupLock=undefined;}});}this.removeReadGroupLock();this.oReadGroupLock=G=this.lockGroup(g,l);if(l){i=2+(i||0);b();}};O.prototype.deleteFromCache=function(g,e,p,f){var o=this.oCachePromise.getResult(),G;if(!this.oCachePromise.isFulfilled()){throw new Error("DELETE request not allowed");}if(o){g.setGroupId(this.getUpdateGroupId());G=g.getGroupId();if(!this.oModel.isAutoGroup(G)&&!this.oModel.isDirectGroup(G)){throw new Error("Illegal update group ID: "+G);}return o._delete(g,e,p,f);}return this.oContext.getBinding().deleteFromCache(g,e,_.buildPath(this.oContext.iIndex,this.sPath,p),f);};O.prototype.fetchIfChildCanUseCache=function(o,s,b){var B,d,e,f,F,i,m=this.oModel.getMetaModel(),p,t=this;function g(){if(i){return m.fetchObject(F.slice(0,F.lastIndexOf("/")+1));}return m.fetchObject(F).then(function(P){if(P&&P.$kind==="NavigationProperty"){return m.fetchObject(F+"/").then(function(){return P;});}return P;});}if(this.oOperation||s==="$count"||s.slice(-7)==="/$count"||s[0]==="@"||this.getRootBinding().isSuspended()){return S.resolve(true);}d=this.oCachePromise.isRejected()||this.oCachePromise.isFulfilled()&&!this.oCachePromise.getResult()||this.oCachePromise.isFulfilled()&&this.oCachePromise.getResult().bSentReadRequest;B=m.getMetaPath(o.getPath());f=m.getMetaPath("/"+s).slice(1);i=f[0]==="#";F=_.buildPath(B,f);p=[this.doFetchQueryOptions(this.oContext),g(),b];e=S.all(p).then(function(r){var h=r[2],w,l=r[0],P=r[1];if(t.bAggregatedQueryOptionsInitial){t.selectKeyProperties(l,B);t.mAggregatedQueryOptions=q.extend(true,{},l);t.bAggregatedQueryOptionsInitial=false;}if(i){w={"$select":[f.slice(1)]};return t.aggregateQueryOptions(w,d);}if(f===""||P&&(P.$kind==="Property"||P.$kind==="NavigationProperty")){w=t.wrapChildQueryOptions(B,f,h);if(w){return t.aggregateQueryOptions(w,d);}return false;}if(f==="value"){return t.aggregateQueryOptions(h,d);}L.error("Failed to enhance query options for auto-$expand/$select as the path '"+F+"' does not point to a property",JSON.stringify(P),"sap.ui.model.odata.v4.ODataParentBinding");return false;});this.aChildCanUseCachePromises.push(e);this.oCachePromise=S.all([this.oCachePromise,e]).then(function(r){var h=r[0];if(h&&!h.bSentReadRequest){h.setQueryOptions(q.extend(true,{},t.oModel.mUriParameters,t.mAggregatedQueryOptions));}return h;}).catch(function(E){t.oModel.reportError("Failed to update cache for binding "+t,c,E);});return e;};O.prototype.getQueryOptionsForPath=function(p,o){var Q;if(Object.keys(this.mParameters).length){Q=this.mQueryOptions;this.oModel.getMetaModel().getMetaPath("/"+p).slice(1).split("/").some(function(s){Q=Q.$expand&&Q.$expand[s];if(!Q||Q===true){Q={};return true;}});return q.extend(true,{},Q);}o=o||this.oContext;if(!this.bRelative||!o.getQueryOptionsForPath){return{};}return o.getQueryOptionsForPath(_.buildPath(this.sPath,p));};O.prototype.initialize=function(){if((!this.bRelative||this.oContext)&&!this.getRootBinding().isSuspended()){this._fireChange({reason:C.Change});}};O.prototype.isPatchWithoutSideEffects=function(){return!!this.mParameters.$$patchWithoutSideEffects;};O.prototype.removeReadGroupLock=function(){if(this.oReadGroupLock){this.oReadGroupLock.unlock(true);this.oReadGroupLock=undefined;}};O.prototype.resume=function(){var t=this;if(this.oOperation){throw new Error("Cannot resume an operation binding: "+this);}if(this.bRelative&&(!this.oContext||this.oContext.fetchValue)){throw new Error("Cannot resume a relative binding: "+this);}if(!this.bSuspended){throw new Error("Cannot resume a not suspended binding: "+this);}this.bSuspended=false;this.createReadGroupLock(this.getGroupId(),true,1);sap.ui.getCore().addPrerenderingTask(function(){t.resumeInternal(true);});};O.prototype.selectKeyProperties=function(Q,m){var t=this.oModel.getMetaModel().getObject(m+"/");if(t&&t.$Key){this.addToSelect(Q,t.$Key.map(function(k){if(typeof k==="object"){return k[Object.keys(k)[0]];}return k;}));}};O.prototype.suspend=function(){if(this.oOperation){throw new Error("Cannot suspend an operation binding: "+this);}if(this.bRelative&&(!this.oContext||this.oContext.fetchValue)){throw new Error("Cannot suspend a relative binding: "+this);}if(this.bSuspended){throw new Error("Cannot suspend a suspended binding: "+this);}if(this.hasPendingChanges()){throw new Error("Cannot suspend a binding with pending changes: "+this);}this.bSuspended=true;if(this.oReadGroupLock){this.oReadGroupLock.unlock(true);this.oReadGroupLock=undefined;}};O.prototype.updateAggregatedQueryOptions=function(n){var A=Object.keys(n),t=this;if(this.mAggregatedQueryOptions){A=A.concat(Object.keys(this.mAggregatedQueryOptions));A.forEach(function(N){if(N==="$select"||N==="$expand"){return;}if(n[N]===undefined){delete t.mAggregatedQueryOptions[N];}else{t.mAggregatedQueryOptions[N]=n[N];}});}};O.prototype.wrapChildQueryOptions=function(b,s,m){var e="",i,M=s.split("/"),p,P=b,Q={},d=Q;if(s===""){return m;}for(i=0;i<M.length;i+=1){P=_.buildPath(P,M[i]);e=_.buildPath(e,M[i]);p=this.oModel.getMetaModel().getObject(P);if(p.$kind==="NavigationProperty"){d.$expand={};d=d.$expand[e]=(i===M.length-1)?m:{};this.selectKeyProperties(d,P);e="";}else if(p.$kind!=="Property"){return undefined;}}if(p.$kind==="Property"){if(Object.keys(m).length>0){L.error("Failed to enhance query options for "+"auto-$expand/$select as the child binding has query options, "+"but its path '"+s+"' points to a structural "+"property",JSON.stringify(m),"sap.ui.model.odata.v4.ODataParentBinding");return undefined;}this.addToSelect(d,[e]);}if("$apply"in m){L.debug("Cannot wrap $apply into $expand: "+s,JSON.stringify(m),"sap.ui.model.odata.v4.ODataParentBinding");return undefined;}return Q;};return function(p){if(p){q.extend(p,O.prototype);return;}a.call(this);this.iPatchCounter=0;this.bPatchSuccess=true;};},false);