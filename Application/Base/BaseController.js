//  jQuery.sap.require("sap.ui.core.util.Export");
//  jQuery.sap.require("sap.ui.core.util.ExportTypeCSV");
sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/m/MessageToast",
	'sap/ui/model/Sorter',
	'sap/ui/model/Filter',
	'sap/viz/ui5/controls/VizFrame',
], function (Controller, MessageToast, Sorter, Filter, VizFrame) {
	"use strict";
	return Controller.extend("Efatura.Application.Base.BaseController", {

		onSeacrh: function (sQuery, tableid, key) {
			var allFilters = [];
			if (sQuery && sQuery.length > 0) {
				key.forEach(function (row) {
					allFilters.push(new Filter(row, sap.ui.model.FilterOperator.Contains, sQuery.toLocaleUpperCase()));
				});
				var finalFilter = new sap.ui.model.Filter({
					filters: allFilters,
					add: false
				});
			}
			var list = this.byId(tableid) ? this.byId(tableid) : sap.ui.getCore().byId(tableid);
			var binding = list.getBinding("items");
			binding.filter(finalFilter, "Application");
		},
		createViewSettingsDialog: function (sDialogFragmentName, tableid, colid) {
			this.tableid = tableid;
			var oDialog = this._mViewSettingsDialogs[sDialogFragmentName];
			if (!oDialog) {
				oDialog = sap.ui.xmlfragment(sDialogFragmentName, this);
				this._mViewSettingsDialogs[sDialogFragmentName] = oDialog;
				var rows = this.getTablePath(tableid, colid);
				if (sDialogFragmentName === "Efatura.Resources.Fragments.SortDialog") {
					rows.forEach(function (row) {
						oDialog.addSortItem(new sap.m.ViewSettingsItem({
							key: row.property,
							text: row.label
						}));
					});
				} else if (sDialogFragmentName === "Efatura.Resources.Fragments.GroupDialog") {
					rows.forEach(function (row) {
						oDialog.addGroupItem(new sap.m.ViewSettingsItem({
							key: row.property,
							text: row.label
						}));
					});
				} else {
					rows.forEach(function (row) {
						oDialog.addFilterItem(new sap.m.ViewSettingsFilterItem({
							key: row.property,
							text: row.label
						}));
					});
				}
			}
			return oDialog;
		},
		handleFilterDialogConfirm: function (oEvent) {
			var oTable = this.byId(this.tableid),
				mParams = oEvent.getParameters(),
				oBinding = oTable.getBinding("items"),
				aFilters = [];
			mParams.filterItems.forEach(function (oItem) {
				var aSplit = oItem.getKey().split("___"),
					sPath = aSplit[0],
					sOperator = aSplit[1],
					sValue1 = aSplit[2],
					sValue2 = aSplit[3],
					oFilter = new Filter(sPath, sOperator, sValue1, sValue2);
				aFilters.push(oFilter);
			});
			oBinding.filter(aFilters);
			oTable.getInfoToolbar().setVisible(aFilters.length > 0);
			oTable.getInfoToolbar().getContent()[0].setText(mParams.filterString);

		},
		getTablePath: function (tableid, colid) {
			var rows = [];
			var cells = this.getView().byId(colid).getCells();
			var colums = this.getView().byId(tableid).getColumns();
			for (var i = 0; i < cells.length; i++) {
				var item = {};
				var part = cells[i].getBindingInfo("text") || cells[i].getBindingInfo("selectedKey") || cells[i].getBindingInfo("value") || cells[
					i].getBindingInfo("number");
				if (part) {
					item = {
						label: colums[i].getHeader().getText(),
						property: part ? part.parts[0].path : ""
					};
					if (colums[i].getHeader().data().key === "date") {
						item.type = "date";
						item.format = "dd mm yyyy";
					}
					rows.push(item);
				}

			}
			return rows;
		},
		setFilterItem: function (evt) {
			var key = evt.getParameter("parentFilterItem").getKey();
			var sid = evt.getParameter("parentFilterItem").getId();
			var item = sap.ui.getCore().byId(sid);
			var table = this.getView().byId(this.tableid);
			var model = oModel.getProperty(table.getBinding("items").getPath());

			var filterItem = new Set(model.map(function (x) {
				return x[key];
			}));
			if (item.getItems().length !== filterItem.size)
				item.removeAllItems();
			if (item.getItems().length === 0) {
				filterItem.forEach(function (row) {
					item.addItem(new sap.m.ViewSettingsItem({
						key: key + "___EQ___" + row,
						text: typeof (row) === "object" ? this.formatter.dateformatText(row) : row
					}));
				}, this);
			}

		},
		handleGroupDialogConfirm: function (oEvent) {
			var oTable = this.byId(this.tableid),
				mParams = oEvent.getParameters(),
				oBinding = oTable.getBinding("items"),
				sPath,
				bDescending,
				vGroup,
				aGroups = [];
			if (mParams.groupItem) {
				sPath = mParams.groupItem.getKey();
				bDescending = mParams.groupDescending;
				vGroup = function (oContext) {
					var name = oContext.getProperty(sPath);
					return {
						key: name,
						text: name
					};
				};
				aGroups.push(new Sorter(sPath, bDescending, vGroup));
				oBinding.sort(aGroups);
			} else
				oBinding.sort([]);
		},
		handleSortDialogConfirm: function (oEvent) {
			var oTable = this.byId(this.tableid),
				mParams = oEvent.getParameters(),
				oBinding = oTable.getBinding("items"),
				sPath,
				bDescending,
				aSorters = [];
			sPath = mParams.sortItem.getKey();
			bDescending = mParams.sortDescending;
			aSorters.push(new Sorter(sPath, bDescending));
			oBinding.sort(aSorters);
		},
		onExport: function (model, tableid, colid, fileName) {
			var oTable = this.getView().byId(tableid);
			var aColumns = this.getColumns(oTable);
			this.onModifyCells(aColumns);
			var oExport = new sap.ui.core.util.Export({
				exportType: new sap.ui.core.util.ExportTypeCSV({
					separatorChar: ";",
					charset: "utf-8",
				}),
				models: this.getOwnerComponent().getModel("mainModel"),
				rows: {
					path: model,
				},
				columns: aColumns
			});

			oExport.saveFile(fileName).always(function () {
				this.destroy();
			});
		},
		onModifyCells: function (columns) {
			var _this = this;
			columns.forEach(function (column) {
				var content = column.template.content;
				switch (content.path) {
					case "Edat":
					case "Mdate":
						content.formatter = function (value) {
							if (value && value.toString().trim()) {
								return _this.formatter.dateformatText(value);
							}
						};
						break;
				}
			}, _this);
		},
		getColumns: function (oTable) {
			var aColumns = oTable.getColumns();
			var aItems = oTable.getItems();
			var aTemplate = [];
			var aItem = null;
			var Binding = null;

			for (var i = 0; i < aColumns.length; i++) {
				aTemplate.push({
					name: aColumns[i].getHeader().getText(),
					template: {
						content: {
							path: null
						}
					}
				});
			}

			for (i = 0; i < aItems.length; i++) {
				if (aItems[i].getMetadata().getName() === "sap.m.ColumnListItem") {
					aItem = aItems[i];
					break;
				}
			}

			if (aItem) {
				for (i = 0; i < aColumns.length; i++) {
					Binding = aItem.getCells()[i].getBinding("number") || aItem.getCells()[i].getBinding("text") || aItem.getCells()[i].getBinding(
						"value") || aItem.getCells()[i].getBinding(
							"selectedKey");
					if (Binding) {
						aTemplate[i].template.content.path = Binding.getPath();
					}
				}
			}

			return aTemplate;
		},
	});
});