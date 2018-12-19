/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2018 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['sap/ui/core/library','sap/ui/core/Locale','sap/ui/core/LocaleData','sap/ui/core/date/UniversalDate',"sap/base/util/deepEqual","sap/base/strings/formatMessage","sap/base/Log","sap/ui/thirdparty/jquery"],function(l,L,a,U,d,f,b,q){"use strict";var C=l.CalendarType;var D=function(){throw new Error();};var c={};D.oDateInfo={oDefaultFormatOptions:{style:"medium",relativeScale:"day",relativeStyle:"wide"},aFallbackFormatOptions:[{style:"short"},{style:"medium"},{pattern:"yyyy-MM-dd"},{pattern:"yyyyMMdd",strictParsing:true}],bShortFallbackFormatOptions:true,bPatternFallbackWithoutDelimiter:true,getPattern:function(o,s,i){return o.getDatePattern(s,i);},oRequiredParts:{"text":true,"year":true,"weekYear":true,"month":true,"day":true},aRelativeScales:["year","month","week","day"],aRelativeParseScales:["year","quarter","month","week","day","hour","minute","second"],aIntervalCompareFields:["FullYear","Quarter","Month","Week","Date"]};D.oDateTimeInfo={oDefaultFormatOptions:{style:"medium",relativeScale:"auto",relativeStyle:"wide"},aFallbackFormatOptions:[{style:"short"},{style:"medium"},{pattern:"yyyy-MM-dd'T'HH:mm:ss"},{pattern:"yyyyMMdd HHmmss"}],getPattern:function(o,s,i){var S=s.indexOf("/");if(S>0){return o.getCombinedDateTimePattern(s.substr(0,S),s.substr(S+1),i);}else{return o.getCombinedDateTimePattern(s,s,i);}},oRequiredParts:{"text":true,"year":true,"weekYear":true,"month":true,"day":true,"hour0_23":true,"hour1_24":true,"hour0_11":true,"hour1_12":true},aRelativeScales:["year","month","week","day","hour","minute","second"],aRelativeParseScales:["year","quarter","month","week","day","hour","minute","second"],aIntervalCompareFields:["FullYear","Quarter","Month","Week","Date","DayPeriod","Hours","Minutes","Seconds"]};D.oTimeInfo={oDefaultFormatOptions:{style:"medium",relativeScale:"auto",relativeStyle:"wide"},aFallbackFormatOptions:[{style:"short"},{style:"medium"},{pattern:"HH:mm:ss"},{pattern:"HHmmss"}],getPattern:function(o,s,i){return o.getTimePattern(s,i);},oRequiredParts:{"text":true,"hour0_23":true,"hour1_24":true,"hour0_11":true,"hour1_12":true},aRelativeScales:["hour","minute","second"],aRelativeParseScales:["year","quarter","month","week","day","hour","minute","second"],aIntervalCompareFields:["DayPeriod","Hours","Minutes","Seconds"]};D.getInstance=function(o,i){return this.getDateInstance(o,i);};D.getDateInstance=function(o,i){return this.createInstance(o,i,this.oDateInfo);};D.getDateTimeInstance=function(o,i){return this.createInstance(o,i,this.oDateTimeInfo);};D.getTimeInstance=function(o,i){return this.createInstance(o,i,this.oTimeInfo);};function e(o){var P=o.oLocaleData.getIntervalPattern("",o.oFormatOptions.calendarType);P=P.replace(/[^\{\}01 ]/,"-");return P.replace(/\{(0|1)\}/g,o.oFormatOptions.pattern);}D.createInstance=function(o,i,I){var j=Object.create(this.prototype);if(o instanceof L){i=o;o=undefined;}if(!i){i=sap.ui.getCore().getConfiguration().getFormatSettings().getFormatLocale();}j.oLocale=i;j.oLocaleData=a.getInstance(i);j.oFormatOptions=q.extend(false,{},I.oDefaultFormatOptions,o);if(!j.oFormatOptions.calendarType){j.oFormatOptions.calendarType=sap.ui.getCore().getConfiguration().getCalendarType();}if(!j.oFormatOptions.pattern){if(j.oFormatOptions.format){j.oFormatOptions.pattern=j.oLocaleData.getCustomDateTimePattern(j.oFormatOptions.format,j.oFormatOptions.calendarType);}else{j.oFormatOptions.pattern=I.getPattern(j.oLocaleData,j.oFormatOptions.style,j.oFormatOptions.calendarType);}}if(j.oFormatOptions.interval){if(j.oFormatOptions.format){j.intervalPatterns=j.oLocaleData.getCustomIntervalPattern(j.oFormatOptions.format,null,j.oFormatOptions.calendarType);if(typeof j.intervalPatterns==="string"){j.intervalPatterns=[j.intervalPatterns];}j.intervalPatterns.push(j.oLocaleData.getCustomDateTimePattern(j.oFormatOptions.format,j.oFormatOptions.calendarType));}else{j.intervalPatterns=[j.oLocaleData.getCombinedIntervalPattern(j.oFormatOptions.pattern,j.oFormatOptions.calendarType),j.oFormatOptions.pattern];}var s=e(j);j.intervalPatterns.push(s);}if(!j.oFormatOptions.fallback){if(!I.oFallbackFormats){I.oFallbackFormats={};}var k=i.toString(),n=j.oFormatOptions.calendarType,K=k+"-"+n,P,t;if(j.oFormatOptions.pattern&&I.bPatternFallbackWithoutDelimiter){K=K+"-"+j.oFormatOptions.pattern;}if(j.oFormatOptions.interval){K=K+"-"+"interval";}var u=I.oFallbackFormats[K]?Object.assign({},I.oFallbackFormats[K]):undefined;if(!u){t=I.aFallbackFormatOptions;if(I.bShortFallbackFormatOptions){P=I.getPattern(j.oLocaleData,"short");t=t.concat(D._createFallbackOptionsWithoutDelimiter(P));}if(j.oFormatOptions.pattern&&I.bPatternFallbackWithoutDelimiter){t=D._createFallbackOptionsWithoutDelimiter(j.oFormatOptions.pattern).concat(t);}u=D._createFallbackFormat(t,n,i,I,j.oFormatOptions.interval);}j.aFallbackFormats=u;}j.oRequiredParts=I.oRequiredParts;j.aRelativeScales=I.aRelativeScales;j.aRelativeParseScales=I.aRelativeParseScales;j.aIntervalCompareFields=I.aIntervalCompareFields;j.init();return j;};D.prototype.init=function(){var s=this.oFormatOptions.calendarType;this.aMonthsAbbrev=this.oLocaleData.getMonths("abbreviated",s);this.aMonthsWide=this.oLocaleData.getMonths("wide",s);this.aMonthsNarrow=this.oLocaleData.getMonths("narrow",s);this.aMonthsAbbrevSt=this.oLocaleData.getMonthsStandAlone("abbreviated",s);this.aMonthsWideSt=this.oLocaleData.getMonthsStandAlone("wide",s);this.aMonthsNarrowSt=this.oLocaleData.getMonthsStandAlone("narrow",s);this.aDaysAbbrev=this.oLocaleData.getDays("abbreviated",s);this.aDaysWide=this.oLocaleData.getDays("wide",s);this.aDaysNarrow=this.oLocaleData.getDays("narrow",s);this.aDaysShort=this.oLocaleData.getDays("short",s);this.aDaysAbbrevSt=this.oLocaleData.getDaysStandAlone("abbreviated",s);this.aDaysWideSt=this.oLocaleData.getDaysStandAlone("wide",s);this.aDaysNarrowSt=this.oLocaleData.getDaysStandAlone("narrow",s);this.aDaysShortSt=this.oLocaleData.getDaysStandAlone("short",s);this.aQuartersAbbrev=this.oLocaleData.getQuarters("abbreviated",s);this.aQuartersWide=this.oLocaleData.getQuarters("wide",s);this.aQuartersNarrow=this.oLocaleData.getQuarters("narrow",s);this.aQuartersAbbrevSt=this.oLocaleData.getQuartersStandAlone("abbreviated",s);this.aQuartersWideSt=this.oLocaleData.getQuartersStandAlone("wide",s);this.aQuartersNarrowSt=this.oLocaleData.getQuartersStandAlone("narrow",s);this.aErasNarrow=this.oLocaleData.getEras("narrow",s);this.aErasAbbrev=this.oLocaleData.getEras("abbreviated",s);this.aErasWide=this.oLocaleData.getEras("wide",s);this.aDayPeriods=this.oLocaleData.getDayPeriods("abbreviated",s);this.aFormatArray=this.parseCldrDatePattern(this.oFormatOptions.pattern);this.sAllowedCharacters=this.getAllowedCharacters(this.aFormatArray);};D._createFallbackFormat=function(i,s,o,I,j){return i.map(function(O){var k=Object.assign({},O);if(j){k.interval=true;}k.calendarType=s;k.fallback=true;var n=D.createInstance(k,o,I);n.bIsFallback=true;return n;});};D._createFallbackOptionsWithoutDelimiter=function(B){var i=/[^dMyGU]/g,o={regex:/d+/g,replace:"dd"},M={regex:/M+/g,replace:"MM"},y={regex:/[yU]+/g,replace:["yyyy","yy"]};B=B.replace(i,"");B=B.replace(o.regex,o.replace);B=B.replace(M.regex,M.replace);return y.replace.map(function(R){return{pattern:B.replace(y.regex,R),strictParsing:true};});};var p={isNumber:function(i){return i>=48&&i<=57;},findNumbers:function(v,M){var i=0;while(i<M&&this.isNumber(v.charCodeAt(i))){i++;}if(typeof v!=="string"){v=v.toString();}return v.substr(0,i);},findEntry:function(v,i){var k=-1,M=0;for(var j=0;j<i.length;j++){if(i[j]&&i[j].length>M&&v.indexOf(i[j])===0){k=j;M=i[j].length;}}return{index:k,value:k===-1?null:i[k]};},parseTZ:function(v,i){var j=0;var t=v.charAt(0)=="+"?-1:1;var P;j++;P=this.findNumbers(v.substr(j),2);var T=parseInt(P,10);j+=2;if(i){j++;}P=this.findNumbers(v.substr(j),2);j+=2;var k=parseInt(P,10);return{length:j,tzDiff:(k+60*T)*t};},checkValid:function(t,P,o){if(t in o.oRequiredParts&&P){return false;}}};D.prototype.oSymbols={"":{name:"text",format:function(o,i,u,j){return o.value;},parse:function(v,P,o,i){var s;var V=true;var j=0;var k=0;for(;k<P.value.length;k++){s=P.value.charAt(k);if(s!==" "){if(v.charAt(j)!==s){V=false;}j++;}else{while(v.charAt(j)===" "){j++;}}if(!V){break;}}if(V){return{length:j};}else{var n=false;if(i.index<i.formatArray.length-1){n=(i.formatArray[i.index+1].type in o.oRequiredParts);}return{valid:p.checkValid(P.type,n,o)};}}},"G":{name:"era",format:function(o,i,u,j){var E=u?i.getUTCEra():i.getEra();if(o.digits<=3){return j.aErasAbbrev[E];}else if(o.digits===4){return j.aErasWide[E];}else{return j.aErasNarrow[E];}},parse:function(v,P,o,j){var E=[o.aErasWide,o.aErasAbbrev,o.aErasNarrow];for(var i=0;i<E.length;i++){var V=E[i];var k=p.findEntry(v,V);if(k.index!==-1){return{era:k.index,length:k.value.length};}}return{era:o.aErasWide.length-1,valid:p.checkValid(P.type,true,o)};}},"y":{name:"year",format:function(o,i,u,j){var y=u?i.getUTCFullYear():i.getFullYear();var Y=String(y);var s=j.oFormatOptions.calendarType;if(o.digits==2&&Y.length>2){Y=Y.substr(Y.length-2);}if(s!=C.Japanese&&o.digits==1&&y<100){Y=Y.padStart(4,"0");}return Y.padStart(o.digits,"0");},parse:function(v,P,o,i){var s=o.oFormatOptions.calendarType;var j;if(P.digits==1){j=p.findNumbers(v,4);}else if(P.digits==2){j=p.findNumbers(v,2);}else{j=p.findNumbers(v,P.digits);}var y=parseInt(j,10);if(s!=C.Japanese&&j.length<=2){var k=U.getInstance(new Date(),s),n=k.getFullYear(),t=Math.floor(n/100),Y=t*100+y-n;if(Y<-70){y+=(t+1)*100;}else if(Y<30){y+=t*100;}else{y+=(t-1)*100;}}return{length:j.length,valid:p.checkValid(P.type,j==="",o),year:y};}},"Y":{name:"weekYear",format:function(o,i,u,j){var w=u?i.getUTCWeek():i.getWeek();var W=w.year;var s=String(W);var k=j.oFormatOptions.calendarType;if(o.digits==2&&s.length>2){s=s.substr(s.length-2);}if(k!=C.Japanese&&o.digits==1&&W<100){s=s.padStart(4,"0");}return s.padStart(o.digits,"0");},parse:function(v,P,o,i){var s=o.oFormatOptions.calendarType;var j;if(P.digits==1){j=p.findNumbers(v,4);}else if(P.digits==2){j=p.findNumbers(v,2);}else{j=p.findNumbers(v,P.digits);}var y=parseInt(j,10);var w;if(s!=C.Japanese&&j.length<=2){var k=U.getInstance(new Date(),s),n=k.getFullYear(),t=Math.floor(n/100),Y=t*100+w-n;if(Y<-70){w+=(t+1)*100;}else if(Y<30){w+=t*100;}else{w+=(t-1)*100;}}return{length:j.length,valid:p.checkValid(P.type,j==="",o),year:y,weekYear:w};}},"M":{name:"month",format:function(o,i,u,j){var M=u?i.getUTCMonth():i.getMonth();if(o.digits==3){return j.aMonthsAbbrev[M];}else if(o.digits==4){return j.aMonthsWide[M];}else if(o.digits>4){return j.aMonthsNarrow[M];}else{return String(M+1).padStart(o.digits,"0");}},parse:function(v,P,o,j){var M=[o.aMonthsWide,o.aMonthsWideSt,o.aMonthsAbbrev,o.aMonthsAbbrevSt,o.aMonthsNarrow,o.aMonthsNarrowSt];var V;var k;var s;if(P.digits<3){s=p.findNumbers(v,Math.max(P.digits,2));V=p.checkValid(P.type,s==="",o);k=parseInt(s,10)-1;if(j.strict&&(k>11||k<0)){V=false;}}else{for(var i=0;i<M.length;i++){var n=M[i];var t=p.findEntry(v,n);if(t.index!==-1){return{month:t.index,length:t.value.length};}}V=p.checkValid(P.type,true,o);}return{month:k,length:s?s.length:0,valid:V};}},"L":{name:"monthStandalone",format:function(o,i,u,j){var M=u?i.getUTCMonth():i.getMonth();if(o.digits==3){return j.aMonthsAbbrevSt[M];}else if(o.digits==4){return j.aMonthsWideSt[M];}else if(o.digits>4){return j.aMonthsNarrowSt[M];}else{return String(M+1).padStart(o.digits,"0");}},parse:function(v,P,o,j){var M=[o.aMonthsWide,o.aMonthsWideSt,o.aMonthsAbbrev,o.aMonthsAbbrevSt,o.aMonthsNarrow,o.aMonthsNarrowSt];var V;var k;var s;if(P.digits<3){s=p.findNumbers(v,Math.max(P.digits,2));V=p.checkValid(P.type,s==="",o);k=parseInt(s,10)-1;if(j.strict&&(k>11||k<0)){V=false;}}else{for(var i=0;i<M.length;i++){var n=M[i];var t=p.findEntry(v,n);if(t.index!==-1){return{month:t.index,length:t.value.length};}}V=p.checkValid(P.type,true,o);}return{month:k,length:s?s.length:0,valid:V};}},"w":{name:"weekInYear",format:function(o,i,u,j){var w=u?i.getUTCWeek():i.getWeek();var W=w.week;var s=String(W+1);if(o.digits<3){s=s.padStart(o.digits,"0");}else{s=j.oLocaleData.getCalendarWeek(o.digits===3?"narrow":"wide",s.padStart(2,"0"));}return s;},parse:function(v,P,o,i){var V;var s;var w;var j=0;if(P.digits<3){s=p.findNumbers(v,2);j=s.length;w=parseInt(s,10)-1;V=p.checkValid(P.type,!s,o);}else{s=o.oLocaleData.getCalendarWeek(P.digits===3?"narrow":"wide");s=s.replace("{0}","[0-9]+");var k=new RegExp(s),R=k.exec(v);if(R){j=R[0].length;w=parseInt(R[0],10)-1;}else{V=p.checkValid(P.type,true,o);}}return{length:j,valid:V,week:w};}},"W":{name:"weekInMonth",format:function(o,i,u,j){return"";},parse:function(){return{};}},"D":{name:"dayInYear",format:function(o,i,u,j){},parse:function(){return{};}},"d":{name:"day",format:function(o,i,u,j){var k=u?i.getUTCDate():i.getDate();return String(k).padStart(o.digits,"0");},parse:function(v,P,o,i){var s=p.findNumbers(v,Math.max(P.digits,2));var V=p.checkValid(P.type,s==="",o);var j=parseInt(s,10);if(i.strict&&(j>31||j<1)){V=false;}return{day:j,length:s.length,valid:V};}},"Q":{name:"quarter",format:function(o,i,u,j){var Q=u?i.getUTCQuarter():i.getQuarter();if(o.digits==3){return j.aQuartersAbbrev[Q];}else if(o.digits==4){return j.aQuartersWide[Q];}else if(o.digits>4){return j.aQuartersNarrow[Q];}else{return String(Q+1).padStart(o.digits,"0");}},parse:function(v,P,o,j){var V;var Q;var s;var k=[o.aQuartersWide,o.aQuartersWideSt,o.aQuartersAbbrev,o.aQuartersAbbrevSt,o.aQuartersNarrow,o.aQuartersNarrowSt];if(P.digits<3){s=p.findNumbers(v,Math.max(P.digits,2));V=p.checkValid(P.type,s==="",o);Q=parseInt(s,10)-1;if(j.strict&&Q>3){V=false;}}else{for(var i=0;i<k.length;i++){var n=k[i];var t=p.findEntry(v,n);if(t.index!==-1){return{quarter:t.index,length:t.value.length};}}V=p.checkValid(P.type,true,o);}return{length:s?s.length:0,quarter:Q,valid:V};}},"q":{name:"quarterStandalone",format:function(o,i,u,j){var Q=u?i.getUTCQuarter():i.getQuarter();if(o.digits==3){return j.aQuartersAbbrevSt[Q];}else if(o.digits==4){return j.aQuartersWideSt[Q];}else if(o.digits>4){return j.aQuartersNarrowSt[Q];}else{return String(Q+1).padStart(o.digits,"0");}},parse:function(v,P,o,j){var V;var Q;var s;var k=[o.aQuartersWide,o.aQuartersWideSt,o.aQuartersAbbrev,o.aQuartersAbbrevSt,o.aQuartersNarrow,o.aQuartersNarrowSt];if(P.digits<3){s=p.findNumbers(v,Math.max(P.digits,2));V=p.checkValid(P.type,s==="",o);Q=parseInt(s,10)-1;if(j.strict&&Q>3){V=false;}}else{for(var i=0;i<k.length;i++){var n=k[i];var t=p.findEntry(v,n);if(t.index!==-1){return{quarter:t.index,length:t.value.length};}}V=p.checkValid(P.type,true,o);}return{length:s?s.length:0,quarter:Q,valid:V};}},"F":{name:"dayOfWeekInMonth",format:function(o,i,u,j){return"";},parse:function(){return{};}},"E":{name:"dayNameInWeek",format:function(o,i,u,j){var k=u?i.getUTCDay():i.getDay();if(o.digits<4){return j.aDaysAbbrev[k];}else if(o.digits==4){return j.aDaysWide[k];}else if(o.digits==5){return j.aDaysNarrow[k];}else{return j.aDaysShort[k];}},parse:function(v,P,o,j){var k=[o.aDaysWide,o.aDaysWideSt,o.aDaysAbbrev,o.aDaysAbbrevSt,o.aDaysShort,o.aDaysShortSt,o.aDaysNarrow,o.aDaysNarrowSt];for(var i=0;i<k.length;i++){var V=k[i];var n=p.findEntry(v,V);if(n.index!==-1){return{dayOfWeek:n.index,length:n.value.length};}}}},"c":{name:"dayNameInWeekStandalone",format:function(o,i,u,j){var k=u?i.getUTCDay():i.getDay();if(o.digits<4){return j.aDaysAbbrevSt[k];}else if(o.digits==4){return j.aDaysWideSt[k];}else if(o.digits==5){return j.aDaysNarrowSt[k];}else{return j.aDaysShortSt[k];}},parse:function(v,P,o,j){var k=[o.aDaysWide,o.aDaysWideSt,o.aDaysAbbrev,o.aDaysAbbrevSt,o.aDaysShort,o.aDaysShortSt,o.aDaysNarrow,o.aDaysNarrowSt];for(var i=0;i<k.length;i++){var V=k[i];var n=p.findEntry(v,V);if(n.index!==-1){return{day:n.index,length:n.value.length};}}}},"u":{name:"dayNumberOfWeek",format:function(o,i,u,j){var k=u?i.getUTCDay():i.getDay();return j._adaptDayOfWeek(k);},parse:function(v,P,o,i){var s=p.findNumbers(v,P.digits);return{dayNumberOfWeek:parseInt(s,10),length:s.length};}},"a":{name:"amPmMarker",format:function(o,i,u,j){var k=u?i.getUTCDayPeriod():i.getDayPeriod();return j.aDayPeriods[k];},parse:function(v,P,o,i){var j;var k;var A=o.aDayPeriods[0],s=o.aDayPeriods[1];var n=/[aApP](?:\.)?[mM](?:\.)?/;var M=v.match(n);var V=(M&&M.index===0);if(V){v=M[0].replace(/\./g,"").toLowerCase()+v.substring(M[0].length);A=A.toLowerCase();s=s.toLowerCase();}if(v.indexOf(A)===0){j=false;k=(V?M[0].length:A.length);}else if(v.indexOf(s)===0){j=true;k=(V?M[0].length:s.length);}return{pm:j,length:k};}},"H":{name:"hour0_23",format:function(o,i,u,j){var H=u?i.getUTCHours():i.getHours();return String(H).padStart(o.digits,"0");},parse:function(v,P,o,i){var V;var s=p.findNumbers(v,Math.max(P.digits,2));var H=parseInt(s,10);V=p.checkValid(P.type,s==="",o);if(i.strict&&H>23){V=false;}return{hour:H,length:s.length,valid:V};}},"k":{name:"hour1_24",format:function(o,i,u,j){var H=u?i.getUTCHours():i.getHours();var s=(H===0?"24":String(H));return s.padStart(o.digits,"0");},parse:function(v,P,o,i){var V;var s=p.findNumbers(v,Math.max(P.digits,2));var H=parseInt(s,10);V=p.checkValid(P.type,s==="",o);if(H==24){H=0;}if(i.strict&&H>23){V=false;}return{hour:H,length:s.length,valid:V};}},"K":{name:"hour0_11",format:function(o,i,u,j){var H=u?i.getUTCHours():i.getHours();var s=String(H>11?H-12:H);return s.padStart(o.digits,"0");},parse:function(v,P,o,i){var V;var s=p.findNumbers(v,Math.max(P.digits,2));var H=parseInt(s,10);V=p.checkValid(P.type,s==="",o);if(i.strict&&H>11){V=false;}return{hour:H,length:s.length,valid:V};}},"h":{name:"hour1_12",format:function(o,i,u,j){var H=u?i.getUTCHours():i.getHours();var s;if(H>12){s=String(H-12);}else if(H==0){s="12";}else{s=String(H);}return s.padStart(o.digits,"0");},parse:function(v,P,o,i){var j=i.dateValue.pm;var s=p.findNumbers(v,Math.max(P.digits,2));var H=parseInt(s,10);var V=p.checkValid(P.type,s==="",o);if(H==12){H=0;j=(j===undefined)?true:j;}if(i.strict&&H>11){V=false;}return{hour:H,length:s.length,pm:j,valid:V};}},"m":{name:"minute",format:function(o,i,u,j){var M=u?i.getUTCMinutes():i.getMinutes();return String(M).padStart(o.digits,"0");},parse:function(v,P,o,i){var V;var s=p.findNumbers(v,Math.max(P.digits,2));var M=parseInt(s,10);V=p.checkValid(P.type,s==="",o);if(i.strict&&M>59){V=false;}return{length:s.length,minute:M,valid:V};}},"s":{name:"second",format:function(o,i,u,j){var s=u?i.getUTCSeconds():i.getSeconds();return String(s).padStart(o.digits,"0");},parse:function(v,P,o,i){var V;var s=p.findNumbers(v,Math.max(P.digits,2));var S=parseInt(s,10);V=p.checkValid(P.type,s==="",o);if(i.strict&&S>59){V=false;}return{length:s.length,second:S,valid:V};}},"S":{name:"fractionalsecond",format:function(o,i,u,j){var M=u?i.getUTCMilliseconds():i.getMilliseconds();var s=String(M);var k=s.padStart(3,"0");k=k.substr(0,o.digits);k=k.padEnd(o.digits,"0");return k;},parse:function(v,P,o,i){var s=p.findNumbers(v,P.digits);var j=s.length;s=s.substr(0,3);s=s.padEnd(3,"0");var M=parseInt(s,10);return{length:j,millisecond:M};}},"z":{name:"timezoneGeneral",format:function(o,i,u,j){if(o.digits>3&&i.getTimezoneLong()){return i.getTimezoneLong();}else if(i.getTimezoneShort()){return i.getTimezoneShort();}var t="GMT";var T=Math.abs(i.getTimezoneOffset());var P=i.getTimezoneOffset()>0;var H=Math.floor(T/60);var M=T%60;if(!u&&T!=0){t+=(P?"-":"+");t+=String(H).padStart(2,"0");t+=":";t+=String(M).padStart(2,"0");}else{t+="Z";}return t;},parse:function(v,P,o,i){var j=0;var t;var T=v.substring(0,3);if(T==="GMT"||T==="UTC"){j=3;}else if(v.substring(0,2)==="UT"){j=2;}else if(v.charAt(0)=="Z"){j=1;t=0;}else{return{error:"cannot be parsed correcly by sap.ui.core.format.DateFormat: The given timezone is not supported!"};}if(v.charAt(0)!="Z"){var k=p.parseTZ(v.substr(j),true);j+=k.length;t=k.tzDiff;}return{length:j,tzDiff:t};}},"Z":{name:"timezoneRFC822",format:function(o,i,u,j){var t=Math.abs(i.getTimezoneOffset());var P=i.getTimezoneOffset()>0;var H=Math.floor(t/60);var M=t%60;var T="";if(!u&&t!=0){T+=(P?"-":"+");T+=String(H).padStart(2,"0");T+=String(M).padStart(2,"0");}return T;},parse:function(v,P,o,i){return p.parseTZ(v,false);}},"X":{name:"timezoneISO8601",format:function(o,i,u,j){var t=Math.abs(i.getTimezoneOffset());var P=i.getTimezoneOffset()>0;var H=Math.floor(t/60);var M=t%60;var T="";if(!u&&t!=0){T+=(P?"-":"+");T+=String(H).padStart(2,"0");T+=":";T+=String(M).padStart(2,"0");}else{T+="Z";}return T;},parse:function(v,P,o,i){if(v.charAt(0)=="Z"){return{length:1,tzDiff:0};}else{return p.parseTZ(v,true);}}}};D.prototype._format=function(j,u){if(this.oFormatOptions.relative){var R=this.formatRelative(j,u,this.oFormatOptions.relativeRange);if(R){return R;}}var s=this.oFormatOptions.calendarType;var o=U.getInstance(j,s);var B=[],P,k,S;for(var i=0;i<this.aFormatArray.length;i++){P=this.aFormatArray[i];S=P.symbol||"";B.push(this.oSymbols[S].format(P,o,u,this));}k=B.join("");if(sap.ui.getCore().getConfiguration().getOriginInfo()){k=new String(k);k.originInfo={source:"Common Locale Data Repository",locale:this.oLocale.toString(),style:this.oFormatOptions.style,pattern:this.oFormatOptions.pattern};}return k;};D.prototype.format=function(j,u){if(u===undefined){u=this.oFormatOptions.UTC;}if(Array.isArray(j)){if(!this.oFormatOptions.interval){b.error("Non-interval DateFormat can't format more than one date instance.");return"";}if(j.length!==2){b.error("Interval DateFormat can only format with 2 date instances but "+j.length+" is given.");return"";}var v=j.every(function(J){return J&&!isNaN(J.getTime());});if(!v){b.error("At least one date instance which is passed to the interval DateFormat isn't valid.");return"";}return this._formatInterval(j,u);}else{if(!j||isNaN(j.getTime())){b.error("The given date instance isn't valid.");return"";}if(this.oFormatOptions.interval){b.error("Interval DateFormat expects an array with two dates for the first argument but only one date is given.");return"";}return this._format(j,u);}};D.prototype._formatInterval=function(j,u){var s=this.oFormatOptions.calendarType;var o=U.getInstance(j[0],s);var t=U.getInstance(j[1],s);var k;var P;var S;var B=[];var n;var v=this._getGreatestDiffField([o,t],u);if(!v){return this._format(j[0],u);}if(this.oFormatOptions.format){n=this.oLocaleData.getCustomIntervalPattern(this.oFormatOptions.format,v,s);}else{n=this.oLocaleData.getCombinedIntervalPattern(this.oFormatOptions.pattern,s);}this.aFormatArray=this.parseCldrDatePattern(n);k=o;for(var i=0;i<this.aFormatArray.length;i++){P=this.aFormatArray[i];S=P.symbol||"";if(P.repeat){k=t;}B.push(this.oSymbols[S].format(P,k,u,this));}return B.join("");};var F={FullYear:"Year",Quarter:"Quarter",Month:"Month",Week:"Week",Date:"Day",DayPeriod:"DayPeriod",Hours:"Hour",Minutes:"Minute",Seconds:"Second"};D.prototype._getGreatestDiffField=function(i,u){var j=false,k={};this.aIntervalCompareFields.forEach(function(s){var G="get"+(u?"UTC":""),M=G+s,n=F[s],v=i[0][M].apply(i[0]),t=i[1][M].apply(i[1]);if(!d(v,t)){j=true;k[n]=true;}});if(j){return k;}return null;};D.prototype._parse=function(v,j,u,s){var I=0,P,S,R;var o={valid:true};var k={formatArray:j,dateValue:o,strict:s};for(var i=0;i<j.length;i++){S=v.substr(I);P=j[i];k.index=i;R=this.oSymbols[P.symbol||""].parse(S,P,this,k)||{};o=q.extend(o,R);if(R.valid===false){break;}I+=R.length||0;}o.index=I;if(o.pm){o.hour+=12;}if(o.dayNumberOfWeek===undefined&&o.dayOfWeek!==undefined){o.dayNumberOfWeek=this._adaptDayOfWeek(o.dayOfWeek);}if(o.quarter!==undefined&&o.month===undefined&&o.day===undefined){o.month=3*o.quarter;o.day=1;}return o;};D.prototype._parseInterval=function(v,s,u,S){var j,R,o;this.intervalPatterns.some(function(P){var k=this.parseCldrDatePattern(P);R=undefined;for(var i=0;i<k.length;i++){if(k[i].repeat){R=i;break;}}if(R===undefined){o=this._parse(v,k,u,S);if(o.index===0||o.index<v.length){o.valid=false;}if(o.valid===false){return;}j=[o,o];return true;}else{j=[];o=this._parse(v,k.slice(0,R),u,S);if(o.valid===false){return;}j.push(o);var n=o.index;o=this._parse(v.substring(n),k.slice(R),u,S);if(o.index===0||o.index+n<v.length){o.valid=false;}if(o.valid===false){return;}j.push(o);return true;}}.bind(this));return j;};var g=function(o,s,u,S){var i,y=typeof o.year==="number"?o.year:1970;if(o.valid){if(u||o.tzDiff!==undefined){i=U.getInstance(new Date(0),s);i.setUTCEra(o.era||U.getCurrentEra(s));i.setUTCFullYear(y);i.setUTCMonth(o.month||0);i.setUTCDate(o.day||1);i.setUTCHours(o.hour||0);i.setUTCMinutes(o.minute||0);i.setUTCSeconds(o.second||0);i.setUTCMilliseconds(o.millisecond||0);if(S&&(o.day||1)!==i.getUTCDate()){o.valid=false;i=undefined;}else{if(o.tzDiff){i.setUTCMinutes((o.minute||0)+o.tzDiff);}if(o.week!==undefined&&(o.month===undefined||o.day===undefined)){i.setUTCWeek({year:o.weekYear||o.year,week:o.week});if(o.dayNumberOfWeek!==undefined){i.setUTCDate(i.getUTCDate()+o.dayNumberOfWeek-1);}}}}else{i=U.getInstance(new Date(1970,0,1,0,0,0),s);i.setEra(o.era||U.getCurrentEra(s));i.setFullYear(y);i.setMonth(o.month||0);i.setDate(o.day||1);i.setHours(o.hour||0);i.setMinutes(o.minute||0);i.setSeconds(o.second||0);i.setMilliseconds(o.millisecond||0);if(S&&(o.day||1)!==i.getDate()){o.valid=false;i=undefined;}else if(o.week!==undefined&&(o.month===undefined||o.day===undefined)){i.setWeek({year:o.weekYear||o.year,week:o.week});if(o.dayNumberOfWeek!==undefined){i.setDate(i.getDate()+o.dayNumberOfWeek-1);}}}if(o.valid){i=i.getJSDate();return i;}}return null;};function m(o,i){if(o===i){return o;}var M={};Object.keys(o).forEach(function(k){M[k]=o[k];});Object.keys(i).forEach(function(k){if(!M.hasOwnProperty(k)){M[k]=i[k];}});return M;}D.prototype.parse=function(v,u,s){v=q.trim(v);var o;var j=this.oFormatOptions.calendarType;if(u===undefined){u=this.oFormatOptions.UTC;}if(s===undefined){s=this.oFormatOptions.strictParsing;}if(!this.oFormatOptions.interval){var J=this.parseRelative(v,u);if(J){return J;}o=this._parse(v,this.aFormatArray,u,s);if(o.index===0||o.index<v.length){o.valid=false;}J=g(o,j,u,s);if(J){return J;}}else{var k=this._parseInterval(v,j,u,s);var n,t;if(k&&k.length==2){var w=m(k[0],k[1]);var x=m(k[1],k[0]);n=g(w,j,u,s);t=g(x,j,u,s);if(n&&t){return[n,t];}}}if(!this.bIsFallback){var y;q.each(this.aFallbackFormats,function(i,z){y=z.parse(v,u,s);if(Array.isArray(y)){return!(y[0]&&y[1]);}else{return!y;}});return y;}if(!this.oFormatOptions.interval){return null;}else{return[null,null];}};D.prototype.parseCldrDatePattern=function(P){if(c[P]){return c[P];}var j=[],i,Q=false,o=null,s="",n="",A={},I=false;for(i=0;i<P.length;i++){var k=P.charAt(i),N,t,u;if(Q){if(k=="'"){t=P.charAt(i-1);u=P.charAt(i-2);N=P.charAt(i+1);if(t=="'"&&u!="'"){Q=false;}else if(N=="'"){i+=1;}else{Q=false;continue;}}if(s=="text"){o.value+=k;}else{o={type:"text",value:k};j.push(o);s="text";}}else{if(k=="'"){Q=true;}else if(this.oSymbols[k]){n=this.oSymbols[k].name;if(s==n){o.digits++;}else{o={type:n,symbol:k,digits:1};j.push(o);s=n;if(!I){if(A[n]){o.repeat=true;I=true;}else{A[n]=true;}}}}else{if(s=="text"){o.value+=k;}else{o={type:"text",value:k};j.push(o);s="text";}}}}c[P]=j;return j;};D.prototype.parseRelative=function(v,u){var P,E,j,R,V;if(!v){return null;}P=this.oLocaleData.getRelativePatterns(this.aRelativeParseScales,this.oFormatOptions.relativeStyle);for(var i=0;i<P.length;i++){E=P[i];j=new RegExp("^\\s*"+E.pattern.replace(/\{0\}/,"(\\d+)")+"\\s*$","i");R=j.exec(v);if(R){if(E.value!==undefined){return k(E.value,E.scale);}else{V=parseInt(R[1],10);return k(V*E.sign,E.scale);}}}function k(n,s){var t,T=new Date(),J;if(u){t=T.getTime();}else{t=Date.UTC(T.getFullYear(),T.getMonth(),T.getDate(),T.getHours(),T.getMinutes(),T.getSeconds(),T.getMilliseconds());}J=new Date(t);switch(s){case"second":J.setUTCSeconds(J.getUTCSeconds()+n);break;case"minute":J.setUTCMinutes(J.getUTCMinutes()+n);break;case"hour":J.setUTCHours(J.getUTCHours()+n);break;case"day":J.setUTCDate(J.getUTCDate()+n);break;case"week":J.setUTCDate(J.getUTCDate()+n*7);break;case"month":J.setUTCMonth(J.getUTCMonth()+n);break;case"quarter":J.setUTCMonth(J.getUTCMonth()+n*3);break;case"year":J.setUTCFullYear(J.getUTCFullYear()+n);break;}if(u){return J;}else{return new Date(J.getUTCFullYear(),J.getUTCMonth(),J.getUTCDate(),J.getUTCHours(),J.getUTCMinutes(),J.getUTCSeconds(),J.getUTCMilliseconds());}}};D.prototype.formatRelative=function(j,u,R){var t=new Date(),o,s=this.oFormatOptions.relativeScale||"day",i,P,k;k=(j.getTime()-t.getTime())/1000;if(this.oFormatOptions.relativeScale=="auto"){s=this._getScale(k,this.aRelativeScales);}if(!R){R=this._mRanges[s];}if(s=="year"||s=="month"||s=="day"){t=new Date(Date.UTC(t.getFullYear(),t.getMonth(),t.getDate()));o=new Date(0);if(u){o.setUTCFullYear(j.getUTCFullYear(),j.getUTCMonth(),j.getUTCDate());}else{o.setUTCFullYear(j.getFullYear(),j.getMonth(),j.getDate());}j=o;}i=this._getDifference(s,[t,j]);if(this.oFormatOptions.relativeScale!="auto"&&(i<R[0]||i>R[1])){return null;}P=this.oLocaleData.getRelativePattern(s,i,k>0,this.oFormatOptions.relativeStyle);return f(P,[Math.abs(i)]);};D.prototype._mRanges={second:[-60,60],minute:[-60,60],hour:[-24,24],day:[-6,6],week:[-4,4],month:[-12,12],year:[-10,10]};D.prototype._mScales={second:1,minute:60,hour:3600,day:86400,week:604800,month:2592000,quarter:7776000,year:31536000};D.prototype._getScale=function(j,s){var S,t;j=Math.abs(j);for(var i=0;i<s.length;i++){t=s[i];if(j>=this._mScales[t]){S=t;break;}}if(!S){S=s[s.length-1];}return S;};function h(o,s){var j=["FullYear","Month","Date","Hours","Minutes","Seconds","Milliseconds"],M;for(var i=s;i<j.length;i++){M="set"+j[s];o[M].apply(o,[0]);}}var r={year:function(o,t){return t.getFullYear()-o.getFullYear();},month:function(o,t){return t.getMonth()-o.getMonth()+(this.year(o,t)*12);},week:function(o,t,i){var j=i._adaptDayOfWeek(o.getDay());var T=i._adaptDayOfWeek(t.getDay());h(o,3);h(t,3);return(t.getTime()-o.getTime()-(T-j)*i._mScales.day*1000)/(i._mScales.week*1000);},day:function(o,t,i){h(o,3);h(t,3);return(t.getTime()-o.getTime())/(i._mScales.day*1000);},hour:function(o,t,i){h(o,4);h(t,4);return(t.getTime()-o.getTime())/(i._mScales.hour*1000);},minute:function(o,t,i){h(o,5);h(t,5);return(t.getTime()-o.getTime())/(i._mScales.minute*1000);},second:function(o,t,i){h(o,6);h(t,6);return(t.getTime()-o.getTime())/(i._mScales.second*1000);}};D.prototype._adaptDayOfWeek=function(i){var j=a.getInstance(sap.ui.getCore().getConfiguration().getFormatSettings().getFormatLocale()).getFirstDayOfWeek();var k=i-(j-1);if(k<=0){k+=7;}return k;};D.prototype._getDifference=function(s,i){var o=i[0];var t=i[1];return Math.round(r[s](o,t,this));};D.prototype.getAllowedCharacters=function(j){if(this.oFormatOptions.relative){return"";}var A="";var n=false;var k=false;var P;for(var i=0;i<j.length;i++){P=j[i];switch(P.type){case"text":if(A.indexOf(P.value)<0){A+=P.value;}break;case"day":case"year":case"weekYear":case"dayNumberOfWeek":case"weekInYear":case"hour0_23":case"hour1_24":case"hour0_11":case"hour1_12":case"minute":case"second":case"fractionalsecond":if(!n){A+="0123456789";n=true;}break;case"month":case"monthStandalone":if(P.digits<3){if(!n){A+="0123456789";n=true;}}else{k=true;}break;default:k=true;break;}}if(k){A="";}return A;};return D;},true);
