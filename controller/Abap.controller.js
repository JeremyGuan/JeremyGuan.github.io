sap.ui.define([
	'jquery.sap.global',
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	'sap/ui/model/Filter',
],function(jQuery,Controller,JSONModel,Filter){
	
	"use strict";
	return Controller.extend("jeremy.controller.Abap",{
		
		oData : new JSONModel(
				"content.json"			
				),
		
		
		onInit : function() {	
			this.getView().setModel(this.oData,"abap");		
		},
	
				
		
		onPressGoToMaster : function(oEvent) {
			var oItem = oEvent.getSource();
			var aData = Array();
			var sPath = oItem.getBindingContext("abap").getPath().substr(1);
			
			aData = sPath.split("/");
			
			var oTitle = new JSONModel( {
				"title" : oItem.getProperty("title")
			} );
			
			console.log(oItem.getProperty("title"));
//			
//			console.log("333" + aData[0]);
			
//			console.log("33333333:" + oItem.getBindingContext("abap").getModel().getData().master);
//			
//			console.log(oItem.getBindingContext("abap").getModel().getData().master[0]);
//			console.log(this.oData);
//			console.log (this.oData.getData(oItem.getBindingContext("abap").getPath().substr(1)) );	
			
			console.log('this.oData.getData()'+'.'+aData[0]+'['+aData[1]+']');
			
			var oCatalogModel = new JSONModel( eval('this.oData.getData()'+'.'+aData[0]+'['+aData[1]+']'));
			this.getView().setModel(oCatalogModel,"item");
			
			this.getView().setModel(oTitle,"title");
			
			this.getSplitAppObj().toMaster(this.createId("master2"));
		},
	

		getSplitAppObj : function() {
			var result = this.byId("SplitAppABAP");
			if (!result) {
				Log.info("SplitApp object can't be found");
			}
			return result;
		},
	
		onPressMasterBack : function() {
			this.getSplitAppObj().backMaster();
		},
	
		onListItemPress : function(oEvent) {
			var sToPageId = oEvent.getParameter("listItem").getCustomData()[0].getValue();

			this.getSplitAppObj().toDetail(this.createId(sToPageId));
		},
	
	})
	
})