sap.ui.define([
  "Efatura/Application/Base/BaseController",
  "Efatura/Resources/Formatter/Formatter",
  ], function (BaseController,formatter) {
  "use strict";
  var that = "";
  return BaseController.extend(
    "Efatura.Application.IrsaliyeList.Controller.IrsaliyeList",
    {
      BaseController: BaseController,
      formatter : formatter,
      onInit: function () {
        this._mViewSettingsDialogs = {};
        this.getView().setModel(oModel);
        that = this;
        var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
        oRouter.getRoute("IrsaliyeList").attachPatternMatched(this.getIrsaliyeList, this);
      },
      getIrsaliyeList: function () {
        var settings = {
          url:
            "http://DTYPRD.DETAY.local:8000/sap/bc/srt/rfc/sap/zsvc01/100/z001/z001b",
          method: "POST",
          timeout: 0,
          headers: {
            IVBELN: "11111111111",
            "Content-Type": "text/xml",
            Authorization: "Basic cDExNzg6cHJkMDAx",
          },
          data:
            '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:urn="urn:sap-com:document:sap:rfc:functions">\n<soapenv:Header/>\n<soapenv:Body>\n<urn:ZP0589_FG01_01>\n<I_VBELN>1111111111</I_VBELN>\n</urn:ZP0589_FG01_01>\n</soapenv:Body>\n</soapenv:Envelope> ',
        };

        $.ajax(settings).done(function (response) {
          let jsonData = that.xml2json(response.documentElement);
          oModel.setProperty(
            "/IrsaliyeListModel",
            jsonData["soap-env:Body"]["n0:ZP0589_FG01_01Response"]["EX_TABLE"]
              .item
          );
        });
      },
      xml2json: function (xml) {
        try {
          var obj = {};
          if (xml.children.length > 0) {
            for (var i = 0; i < xml.children.length; i++) {
              var item = xml.children.item(i);
              var nodeName = item.nodeName;

              if (typeof obj[nodeName] == "undefined") {
                obj[nodeName] = this.xml2json(item);
              } else {
                if (typeof obj[nodeName].push == "undefined") {
                  var old = obj[nodeName];

                  obj[nodeName] = [];
                  obj[nodeName].push(old);
                }
                obj[nodeName].push(this.xml2json(item));
              }
            }
          } else {
            obj = xml.textContent;
          }
          return obj;
        } catch (e) {
          console.log(e.message);
        }
      },
      onFilter: function (oEvent) {
        var sQuery = oEvent.getSource().getValue();
        this.onSeacrh(sQuery, "irsaliyeListTable_id", [
          "KIMLIK_NO",
          "HESAP_TIPI",
          "POSTA_KUTUSU",
          "ISIM",
          "TIP",
        ]);
      },
      handleButtonPressed: function (oEvent) {
        var param = oEvent.getSource().data("param");
        this.createViewSettingsDialog("Efatura.Resources.Fragments." + param, "irsaliyeListTable_id", "irsaliyeListTableCol_id").open();
      },
      onExcellExpot: function () {
        this.onExport("/IrsaliyeListModel", "irsaliyeListTable_id", "irsaliyeListTableCol_id", "Eğitim Listesi " + this.formatter.dateformatText(new Date()));
      },
    }
  );
});
