// load the things we need
var mongoose = require('mongoose');


// define the schema for our user model
var PrePack = mongoose.Schema({
  PackSeqNo: String,
  PackLineNo: String,
  PackSKU: String,
  PackEANOrUPC: String,
  PackDesc: String,
  NoOfInnerPackUnits: String,
  NoOfUnitsPerInnerPack: String,
  NoOfCartons: String,
  GWPerInnerPack: String,
  NWPerInnerPack: String,
  InnerPackWeightUOM: String,
  PackStyleNo: String
});

var ColorSize = mongoose.Schema({
  PackSeqNo: String,
  LineNo: String,
  SKU: String,
  UPCorEAN: String,
  Color: String,
  Size: String,
  PackingRatio: String,
  Quantity: String
});

var Attribute = mongoose.Schema({
  AttributeSeqNo: String,
  AttributeLabel: String,
  AttributeDataType: String,
  AttributeCode: String,
  AttributeValue: String
});

var Item = mongoose.Schema({
  ItemSeq: String,
  ItemNo: String,
  ItemDesc: String,
  ItemQty: String,
  ItemQtyUOM: String,
  ItemBuyerOrderNo: String,
  ItemLiFungFactoryCode: String,
  ItemFactoryNameInEnglish: String,
  ItemLongDesc: String,
  ItemCountryOfOriginCode: String,
  ItemCountryOfOrigin: String,
  ItemProductionCountryCode: String,
  ItemProductionCountry: String,
  ItemEANNo: String,
  ItemHSCode: String,
  ItemHS: String,
  ItemLabel: String,
  ItemUnitPrice: String,
  ItemSupplierNo: String,
  RetailPrice: String,
  ItemUnitPriceTotal: String,
  Attributes: [Attribute],
  ColorSizes: [ColorSize]
});

var ItemBreakDown = mongoose.Schema({
  ItemSeq: String,
  SeqNo: String,
  Material: String,
  Gender: String,
  FiberContent: String,
  FiberContent: String,
  MerchandiseType: String,
  HTS: String,
  QuotaCategory: String,
  DutyRate: String,
  QuantityRatio: String,
  CurrencyCode: String,
  Price: String,
  Reference: String,
  Remark: String
});

var Shipment = mongoose.Schema({
  ShipmentNo: String,
  ShipmentRef: String,
  ShipmentShipModeCode: String,
  ShipmentShipMode: String,
  ShipmentBuyerOrderNo: String,
  ShipmentDeliveryDate: String,
  ShipmentPortOfDischargeCode: String,
  ShipmentPortOfDischarge: String,
  ShipmentFinalDestinationCode: String,
  ShipmentFinalDestination: String,
  ShipmentPortOfLoadingCode: String,
  ShipmentPortOfLoading: String,
  DistributionCentreCode: String,
  DistributionCentre: String,
  DistributionCentreAddress1: String,
  DistributionCentreAddress2: String,
  DistributionCentreAddress3: String,
  DistributionCentreAddress4: String,
  ShipToAddress: String,
  PrePacks: [PrePack],
  Items: [Item]
});

var ePM_VerContent = mongoose.Schema({
  xml: String,
  PMNo: String,
  ePMVerNo: String,
  VerDate: String,
  VerTime: String,
  VendorId: String,
  VendorName: String,
  BuyerName: String,
  Division: String,
  Department: String,
  Agent: String,
  CurrencyCode: String,
  Currency: String,
  ConditionsOfSalesCode: String,
  ConditionsOfSalesDesc: String,
  DestinationCode: String,
  Destination: String,
  PMShippingMark: String,
  PMBottomRemark: String,
  ShipmentUpdateNo: String,
  ShipmentUpStringDate: String,
  ShipmentUpdateTime: String,
  BuyerDept: String,
  POXMLVerNo: String,
  Attributes: [Attribute],
  Shipments: [Shipment],
  ItemBreakdowns: [ItemBreakDown]
});
// create the model for users and expose it to our app
exports.PrePack = mongoose.model('PrePack', PrePack);
exports.ColorSize = mongoose.model('ColorSize', ColorSize);
exports.Attribute = mongoose.model('Attribute', Attribute);
exports.Item = mongoose.model('Item', Item);
exports.ItemBreakDown = mongoose.model('ItemBreakDown', ItemBreakDown);
exports.Shipment = mongoose.model('Shipment', Shipment);
exports.ePM_VerContent = mongoose.model('ePM_VerContent', ePM_VerContent);
