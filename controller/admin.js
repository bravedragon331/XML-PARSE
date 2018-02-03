var UserModel = require('../model/user');
var ePM_VerContent = require('../model/ePM_VerContent').ePM_VerContent;
var bcrypt   = require('bcrypt-nodejs');
const path = require('path');
const fs = require('fs');
const epm_path = path.join(require('../config/xml').path);

exports.monitor = function(req, res){  
  fs.readdir(epm_path, (err, items) => {
		const files = [];
		for (var i=0; i<items.length; i++) {
			var file = epm_path + '/' + items[i];
      var stats = fs.statSync(file);
      if (stats.isFile()) {
      	var mtime = new Date(stats.mtime);
      	const date = mtime.getDate() + '/' + (mtime.getMonth() + 1 ) + '/' + mtime.getFullYear();
    		const time = mtime.toLocaleString('en-NZ', { hour: 'numeric', minute : 'numeric', hour12: true });
    		const modified_at = time + '  ' + date;
    		var created_time = new Date(stats.ctime);
      	const cdate = created_time.getDate() + '/' + (created_time.getMonth() + 1 ) + '/' + created_time.getFullYear();
    		const ctime = created_time.toLocaleString('en-NZ', { hour: 'numeric', minute : 'numeric', hour12: true });
    		const created_at = ctime + '  ' + cdate;

      	const item = {
      		'name': items[i],
      		'ctime': created_at,
      		'mtime': modified_at
      	}
      	files.push(item);
      }
    }
		res.render('monitor', {success: true, files: files});
	});
}

//Change Password
exports.changePassword = function(req, res){
  var oldPassword = req.body.oldPassword;
  var newPassword = req.body.newPassword;
  var userEmail = req.user.local.email;
  UserModel.find({"local.email":userEmail, "local.password":generateHash(oldPassword)}).exec(function(err, data){
      if(err || data[0] == null){
          console.log("Error in status update");
          res.json({ret:false});
      }else{
          UserModel.update({"local.email":userEmail}, {$set:{"local.password":generateHash(newPassword)}}, function(err, data){
              if(err)
                  res.json({ret:false, err:true});
              res.json({ret:true});
          })
      }
  })
}

function generateHash(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

exports.order = function(req, res){
    ePM_VerContent.find().select({'PMNo': 1, 'xml': 1, 'ePMVerNo': 1, 'VerDate': 1, 'POXMLVerNo': 1, '_id': 0}).exec(function(err, data){
        res.render('order', {data:data});
    })
}
exports.viewXML = function(req, res){
    var xmlName = req.params.xmlName;
    ePM_VerContent.find({xml: xmlName}).exec(function(err, data){
        if(err){
            res.render('error');
        }else{
            var detail = JSON.parse(JSON.stringify(data[0]));            
            var prePacks = detail.Shipments[0].PrePacks;
            var items = detail.Shipments[0].Items;
            
            delete detail.Attributes;
            delete detail.Shipments;
            delete detail.ItemBreakdowns;
            delete detail._id;
            delete detail.xml;
            delete detail.__v;
            
            res.render('detail', {detail: detail, prePacks: prePacks, items: items});
        }
    })
}
exports.color = function(req, res){
    var index = req.body.index;
    var pmno = req.body.pmno;
    ePM_VerContent.find({'PMNo': pmno}).exec(function(err, data){
        res.json(data[0].Shipments[0].Items[index].ColorSizes);
    })
}