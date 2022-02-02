sap.ui.define(
  [
    'sap/ui/core/mvc/Controller',
    'sap/m/MessageToast',
    'sap/ui/thirdparty/jquery',
    'sap/ui/model/json/JSONModel',
    'sap/ui/core/Fragment',
    './Formatter'
  ],
  function (Controller, MessageToast, jquery, JSONModel, Fragment, Formatter) {
    'use strict'
    return Controller.extend(
      'ui5Tutorial.Application.JsonTable.Controller.JsonTable',
      {
        onInit: function () {
          this.getView().setModel(oModel)
          var myHeaders = new Headers()
          myHeaders.append(
            'Cookie',
            '__cfduid=deb8e5acdb4da306c158964a5333f68fb1616595319'
          )

          var requestOptions = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow'
          }

          fetch('https://jsonplaceholder.typicode.com/users', requestOptions)
            .then(response => response.text())
            .then(result => {
              var parsedList = JSON.parse(result)

              oModel.setProperty('/tableList', parsedList)
              console.log(parsedList)
            })
            .catch(error => console.log('error', error))
        },
        _getDialog: function () {
          if (!this._oDialog) {
            this._oDialog = sap.ui.xmlfragment(
              'ui5Tutorial.Application.JsonDialog.Views.JsonDialog',
              this
            )
            this.getView().addDependent(this._oDialog)
          }
          return this._oDialog
        },
        onOpenDialog: function (oEvent) {
          var sPath = oEvent.oSource.getBindingContext().sPath
          var detailBody = oModel.getProperty(sPath)
          // var detailId = this.getView().byId("detail");
          // debugger
          oModel.setProperty('/detailItem', detailBody)
          console.log(oModel.getProperty(sPath))
          this._getDialog().open()
        },
        onCloseDialog: function () {
          this._getDialog().close()
        },

        onOpenCompany: function (oEvent) {
          var sPath = oEvent.oSource.getBindingContext().sPath
          var detailBody = oModel.getProperty(sPath)
          oModel.setProperty('/detailItem', detailBody)
          var oView = this.getView()

          if (!this.pDialog) {
            this.pDialog = Fragment.load({
              id: oView.getId(),
              name:
                'ui5Tutorial.Application.JsonDialog.Views.JsonDialogCompany',
              controller: this
            }).then(function (oDialog) {
              oView.addDependent(oDialog)
              return oDialog
            })
          }
          this.pDialog.then(function (oDialog) {
            oDialog.open()
          })
        },
        onCloseCompany: function () {
          this.byId('companyDialog').close()
        },

        onOpenTodos: function (oEvent) {
          var sPath = oEvent.oSource.getBindingContext().sPath
          var detailBody = oModel.getProperty(sPath)
          oModel.setProperty('/todoDetails', detailBody)
          console.log(detailBody.id)
          this.getView().setModel(oModel)
          var myHeaders = new Headers()
          myHeaders.append(
            'Cookie',
            '__cfduid=deb8e5acdb4da306c158964a5333f68fb1616595319'
          )

          var requestOptions = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow'
          }

          fetch(
            `https://jsonplaceholder.typicode.com/todos?userId=${detailBody.id}`,
            requestOptions
          )
            .then(response => response.text())
            .then(result => {
              var parsedList = JSON.parse(result)

              oModel.setProperty('/tableTodos', parsedList)
              console.log(parsedList)
            })
            .catch(error => console.log('error', error))

          var oView = this.getView()

          if (!this.todoDialog) {
            this.todoDialog = sap.ui.xmlfragment(
              'ui5Tutorial.Application.JsonDialog.Views.JsonDialogTodo',
              this
            )
            this.getView().addDependent(this.todoDialog)
            // this.pDialog = Fragment.load({
            //   id: oView.getId(),
            //   name: "ui5Tutorial.Application.JsonDialog.Views.JsonDialogTodo",
            //   controller: this
            // }).then(function (oDialog) {
            //   oView.addDependent(oDialog);
            //   return oDialog;
            // });
          }
          this.todoDialog.open()
          //this.todoDialog.then(function (oDialog) {
          //  oDialog.open();
          // });
        },
        onCloseTodo: function () {
          this.todoDialog.close()
        },
        completed: function (sStatus) {
          if (sStatus == true) {
            return "Success";
          } else if (sStatus == false) {
            return "Error";
          }
        }
      }
    )
  }
)
