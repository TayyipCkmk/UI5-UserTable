sap.ui.define(function() {
	"use strict";

	var Formatter = {

		completed :  function (sStatus) {
				if (sStatus == true) {
					return "Success";
				} else if (sStatus == false) {
					return "Warning";
				} else if (sStatus === "Discontinued"){
					return "Error";
				} else {
					return "None";
				}
		}
	};

	return Formatter;

}, /* bExport= */ true);