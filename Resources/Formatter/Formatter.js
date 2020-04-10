sap.ui.define([
] , function () {
    "use strict";

    return {

        numberUnit : function (sValue) {
            if (!sValue) {
                return "";
            }
            return parseFloat(sValue).toFixed(2);
        },
        dateformatText: function (sValue) {
            var dateFormat = sap.ui.core.format.DateFormat.getDateInstance({
                pattern: "dd MM YYYY"
            });
            if (sValue) {
                if (typeof (sValue) == "object")
                    return dateFormat.format(sValue);
                else {
                    return dateFormat.format(new Date(sValue));
                }
            } else {
                return "";
            }
        },
        dateformat: function (sValue) {
            var dateFormat = sap.ui.core.format.DateFormat.getDateInstance({
                pattern: "yyyy-MM-ddT00:00:00"
            });
            if (sValue) {
                if (typeof (sValue) == "object")
                    return dateFormat.format(sValue);
                else {
                    return sValue;
                }
            } else {
                return "";
            }
        },
        timeFormatText: function (value) {
            if (value) {
                var time = new Date(value).toLocaleTimeString();
                var timeZone = new Date(value).getTimezoneOffset() / 60;
                var hour = parseInt(time.slice(0, 2)) + timeZone;
                time = "PT" + hour + "H" + time.slice(3, 5) + "M00S";
                return time;
            } else
                return "";
        },
        myTypeFormat:function(type){
            var router = {
                SE: "İşe Giriş Muayanesi",
                PE: "Periyodik Muayene",
                RE: "İşe Geri Dönüş Muayenesi",
                NE: "Normal Muayene",
                AE: "İş Kazası Muayenesi",
            };
            return router[type];
        }
    };

}
);