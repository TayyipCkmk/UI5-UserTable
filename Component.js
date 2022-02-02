// jQuery.sap.require("Efatura.Router");

sap.ui.define(["sap/ui/core/UIComponent"], function (UIComponent) {
  "use strict";
  return UIComponent.extend("ui5Tutorial.Component", {
    metadata: {
      rootView: "ui5Tutorial.App",
      routing: {
        config: {
          routerClass: "sap.m.routing.Router",
          controlId: "rootControl",
          controlAggregation: "pages",
          viewType: "XML",
          clearTarget: true,
        },
        routes: [
          {
            name: "JsonTable",
            viewPath: "ui5Tutorial.Application.JsonTable.Views",
            pattern: "",
            view: "JsonTable",
            viewLevel: 0,
            transition: "show",
          },
        ],
      },
    },
    init: function () {
      sap.ui.core.UIComponent.prototype.init.apply(this, arguments);
      this.getRouter().initialize();
    },
  });
});
