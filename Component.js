// jQuery.sap.require("Efatura.Router");

sap.ui.define(["sap/ui/core/UIComponent"], function (UIComponent) {
  "use strict";
  return UIComponent.extend("Efatura.Component", {
    metadata: {
      rootView: "Efatura.App",
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
            name: "IrsaliyeList",
            viewPath: "Efatura.Application.IrsaliyeList.Views",
            pattern: "",
            view: "IrsaliyeList",
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
