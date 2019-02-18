sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageToast"
],function(Controller,JSONModel,MessageToast){
	"use strict";
	return Controller.extend("jeremy.controller.Footer",{
		
//		oAboutUs : new JSONModel({
//			name : "Jeremy",
//			email : "silence-23@hotmail.com"
//		}),

		oAboutUs : new JSONModel({
			pages: [
				{
					pageId: "aboutUs",
					title: "Information",
					titleUrl: "https://github.com/JeremyGuan/SAPLink-plugins",
					icon: "sap-icon://add-employee",
					src : "./img/cat.png",
					groups: [
						{
							elements: [
								{
									label: "Name",
									value: "Jeremy"
								},
								{
									label: "Email",
									value: "silence-23@hotmail.com",
									elementType: sap.m.QuickViewGroupElementType.email
								},
								{
									label: "QQ",
									value: "3328897918"
								}
							]
						}
					]
				}
			]
		}),
		
		oWeChat : new JSONModel({
			"IMG" : [
				{
					"src" : "./img/wechatcode.jpg"
				}
			]
		}),
	
		onInit : function(){

		},
				
		handleOneLinkPress: function(oEvent){
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo("abap");
		},

		createPopover: function(viewName) {
			if (this._oQuickView) {
				this._oQuickView.destroy();
			}

			this._oQuickView = sap.ui.xmlfragment(viewName, this);
			this.getView().addDependent(this._oQuickView);
		},		
		
		
		openQuickView : function(oEvent,oModel){
			this.createPopover("jeremy.view.QuickView");
			this._oQuickView.setModel(oModel);
			var oButton = oEvent.getSource();
			jQuery.sap.delayedCall(0,this,function(){
				this._oQuickView.openBy(oButton);
			})
		},
				
		handleHomeAboutUs: function(oEvent){
			this.openQuickView(oEvent, this.oAboutUs);			
		},
		
		openPopoverView : function(oEvent,oModel){
//			if(!this._oPopover){
//				this._oPopover = sap.ui.xmlfragment("jeremy.view.Popover",this);
//				this.getView().addDependent(this._oPopover);
//				this._oPopover.bindElement
//			}
			
			this.createPopover("jeremy.view.PopoverView");
			this._oQuickView.setModel(oModel);
			var oButton = oEvent.getSource();
			this._oQuickView.bindElement("/IMG/0");
			jQuery.sap.delayedCall(0,this,function(){
				this._oQuickView.openBy(oButton);
			})				
		},
		
		handleHomeWeChat : function(oEvent){
			this.openPopoverView(oEvent, this.oWeChat);	
		},
		
		handleHomeHome : function(oEvent){
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo("overview");			
		}
		
		
		
	})
})