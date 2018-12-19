/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2018 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/base/Log","sap/ui/core/format/NumberFormat","sap/ui/model/FormatException","sap/ui/model/ParseException","sap/ui/model/ValidateException","sap/ui/model/odata/type/ODataType","sap/ui/thirdparty/jquery"],function(L,N,F,P,V,O,q){"use strict";var r=/^[-+]?(\d+)$/,R={minimum:"-9223372036854775808",maximum:"9223372036854775807"},s={minimum:"-9007199254740991",maximum:"9007199254740991"};function c(t,v,R){var A,m,n;m=r.exec(v);if(m){n=v.charAt(0)==='-';A=n?R.minimum.slice(1):R.maximum;if(m[1].length<A.length){return undefined;}if(m[1].length>A.length||m[1]>A){if(n){return a("EnterNumberMin",[t.formatValue(R.minimum,"string")]);}else{return a("EnterNumberMax",[t.formatValue(R.maximum,"string")]);}}return undefined;}return a("EnterInt");}function g(t){var f;if(!t.oFormat){f=q.extend({groupingEnabled:true},t.oFormatOptions);f.parseAsString=true;t.oFormat=N.getIntegerInstance(f);}return t.oFormat;}function a(k,p){return sap.ui.getCore().getLibraryResourceBundle().getText(k,p);}function i(t){return!t.oConstraints||t.oConstraints.nullable!==false;}function b(t,C){var n;t.oConstraints=undefined;if(C){n=C.nullable;if(n===false||n==="false"){t.oConstraints={nullable:false};}else if(n!==undefined&&n!==true&&n!=="true"){L.warning("Illegal nullable: "+n,null,t.getName());}}t._handleLocalizationChange();}var I=O.extend("sap.ui.model.odata.type.Int64",{constructor:function(f,C){O.apply(this,arguments);this.oFormatOptions=f;b(this,C);}});I.prototype.formatValue=function(v,t){var e;if(v===null||v===undefined){return null;}switch(this.getPrimitiveType(t)){case"any":return v;case"float":case"int":e=c(this,v,s);if(e){throw new F(e);}return parseInt(v,10);case"string":return g(this).format(v);default:throw new F("Don't know how to format "+this.getName()+" to "+t);}};I.prototype.getName=function(){return"sap.ui.model.odata.type.Int64";};I.prototype._handleLocalizationChange=function(){this.oFormat=null;};I.prototype.parseValue=function(v,S){var d;if(v===null||v===""){return null;}switch(this.getPrimitiveType(S)){case"string":d=g(this).parse(v);if(!d){throw new P(a("EnterInt"));}break;case"int":case"float":d=N.getIntegerInstance({maxIntegerDigits:Infinity,groupingEnabled:false}).format(v);break;default:throw new P("Don't know how to parse "+this.getName()+" from "+S);}return d;};I.prototype.validateValue=function(v){var e;if(v===null&&i(this)){return;}if(typeof v==="string"){e=c(this,v,R);if(e){throw new V(e);}return;}throw new V(a("EnterInt"));};return I;});
