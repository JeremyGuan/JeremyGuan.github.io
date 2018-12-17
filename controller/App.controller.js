sap.ui.define([
   "sap/ui/core/mvc/Controller"
], function (Controller, MessageToast) {
   "use strict";
   return Controller.extend("sap.ui.demo.walkthrough.controller.App", {
      onShowHello : function () {
         // show a native JavaScript alert
         MessageToast.show("Hello World");
      }
   });
});