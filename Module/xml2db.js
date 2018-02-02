var mongoose = require('mongoose');
var configDB = require('../config/db');
var chokidar = require('chokidar');
mongoose.connect(configDB.url);
var xml2json = require('./xml2json');

var model = require('../model/ePM_VerContent');
var ePM_VerContent = model.ePM_VerContent;
var PrePack = model.PrePack;
var ColorSize = model.ColorSize;
var Attribute = model.Attribute;
var Item = model.Item;
var ItemBreakDown = model.ItemBreakDown;
var Shipment = model.Shipment;

module.exports = function(path){  
  var watcher = chokidar.watch(path, {
    ignored: /[\/\\]\./, persistent: true
  });

  watcher
    .on('add', async function(path) {      
      var xmlData = await xml2json('./'+path);
      console.log(path);
      saveXML2DB(xmlData);
    })
}

function saveXML2DB(xmlData){
  xmlData = xmlData.DOC.ePM_VerContent[0];
  var o_epm = new ePM_VerContent;
  Object.keys(xmlData).forEach(function(key,index) {
    // key: the name of the object key
    // index: the ordinal position of the key within the object
    if(key == 'Attributes'){
      var attributes = xmlData[key];
      if(attributes != null && attributes != ''){        
        for(var j = 0; j < attributes[0].Attribute.length; j++){        
          var o_Attribute = new Attribute;
          Object.keys(attributes[0].Attribute[j]).forEach(function(key1, index1){          
            o_Attribute[key1] = attributes[0].Attribute[j][key1];          
          })
          o_epm['Attributes'].push(o_Attribute);
        }
      }else{
      }    
    }else if(key == 'Shipments'){
      var shipments = xmlData[key];      
      if(shipments != null && shipments != ''){
        for(var j = 0; j < shipments[0].Shipment.length; j++){        
          var o_Shipment = new Shipment;          
          Object.keys(shipments[0].Shipment[j]).forEach(function(key1, index1){          
            if(key1 == 'PrePacks'){
              o_Shipment[key1] = getPrePacks(shipments[0].Shipment[j][key1]);
            }else if(key1 == 'Items'){
              o_Shipment[key1] = getItems(shipments[0].Shipment[j][key1]);
            }else{
              o_Shipment[key1] = shipments[0].Shipment[j][key1];
            }          
          })
          o_epm['Shipments'].push(o_Shipment);
        }
      }else{

      }    
    }else if(key == 'ItemBreakdowns'){
      var itemBreakdowns = xmlData[key];
      if(itemBreakdowns != null && itemBreakdowns != ''){        
        for(var j = 0; j < itemBreakdowns[0].ItemBreakDown.length; j++){        
          var o_ItemBreakDown= new ItemBreakDown;
          Object.keys(itemBreakdowns[0].ItemBreakDown[j]).forEach(function(key1, index1){          
            o_ItemBreakDown[key1] = itemBreakdowns[0].ItemBreakDown[j][key1];          
          })
          o_epm['Attributes'].push(o_ItemBreakDown);
        }
      }else{
      }
    }else{
      o_epm[key] = xmlData[key];
    }
  });
  //console.log(o_epm);
  o_epm.save(function(err, data){
    if(err){
      console.log('Eror');
    }
    if(data){
      //console.log(data);
    }
  })
}

function getPrePacks(prePacks){
  var tmp = [];
  for(var i = 0; i < prePacks[0].PrePack.length && prePacks != ''; i++){    
    var o_PrePack = new PrePack;
    Object.keys(prePacks[0].PrePack[i]).forEach(function(key, index){      
      o_PrePack[key] = prePacks[0].PrePack[i][key];      
    });
    tmp.push(o_PrePack);
  }
  return tmp;
}

function getItems(items){
  var tmp = [];
  for(var i = 0; i < items[0].Item.length && items!=''; i++){    
    var o_Item = new Item;
    Object.keys(items[0].Item[i]).forEach(function(key, index){
      if(key == 'Attributes'){
        if(items[0].Item[i].Attributes != null && items[0].Item[i].Attributes != ''){
          var attributes = items[0].Item[i].Attributes;          
          for(var j = 0; j < attributes[0].Attribute.length; j++){
            var o_Attribute = new Attribute;
            Object.keys(attributes[0].Attribute[j]).forEach(function(key1, index1){          
              o_Attribute[key1] = attributes[0].Attribute[j][key1];
            })
            o_Item['Attributes'].push(o_Attribute);
          }
        }else{

        }        
      }else if(key == 'ColorSizes'){
        if(items[0].Item[i].ColorSizes != null && items[0].Item[i].ColorSizes != ''){
          var colorSizes = items[0].Item[i].ColorSizes;
          for(var j = 0; j < colorSizes[0].ColorSize.length; j++){        
            var o_ColorSize = new ColorSize;
            Object.keys(colorSizes[0].ColorSize[j]).forEach(function(key1, index1){          
              o_ColorSize[key1] = colorSizes[0].ColorSize[j][key1];            
            })
            o_Item['ColorSizes'].push(o_ColorSize);
          }
        }        
      }else{
        o_Item[key] = items[0].Item[i][key];      
      }      
    });
    tmp.push(o_Item);
  }  
  return tmp;
}