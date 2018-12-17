sap.ui.define([
   "sap/ui/core/mvc/Controller",
   "sap/m/MessageToast",
   "sap/ui/model/json/JSONModel"
], function (Controller, MessageToast, JSONModel) {
   "use strict";
   return Controller.extend("sap.ui.demo.walkthrough.controller.App", {
      onInit: function() {
      	var oData = {
      		recipient:{
      			name: "JeremyGuan"
      		}
      	};
      	var oModel = new JSONModel(oData);
      	this.getView().setModel(oModel);
      },

      onShowHello : function () {
         // show a native JavaScript alert
         MessageToast.show("Hello World");
      }
   });
});