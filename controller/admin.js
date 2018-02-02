var UserModel = require('../model/user');
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
		res.render('index', {success: true, files: files});
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