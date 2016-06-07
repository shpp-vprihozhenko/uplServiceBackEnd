/**
 * FilesController
 *
 * @description :: Server-side logic for managing files
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

  index: function (req,res){

    var path = req.get("host");
    console.log("path", path);

    res.writeHead(200, {'content-type': 'text/html'});
    res.end(
      '<form action="http://'+path+'files/upload" enctype="multipart/form-data" method="post">'+
      '<input type="text" name="username"><br>'+
      '<input type="file" name="anyfile" multiple="multiple"><br>'+
      '<input type="submit" value="Upload">'+
      '</form>'
    )
  },

  upload: function (req, res) {
    var dir = require('path').resolve(sails.config.appPath)+"/assets/images";

    console.log("req body on upload", req.body);
    var username = req.body.username;
    console.log("username", username);

    function saveFileData(fd, filename) {

      Files.create({username: username, filename: filename, fd: fd})
        .exec(function(error, user) {
        console.log("creating results", error, user);
        if (error) {
          res.send(500, {error: "DB Error"});
        } else {
          res.send(200);
        }
      });

    }

    req.file('anyfile').upload({
      dirname: dir
    }, function (err, files) {
      if (err)
        return res.serverError(err);

      //res.redirect("back");
      //res.send(200);

      console.log("Saving file data", req.body.username, files[0].fd, files[0].filename);
      saveFileData(files[0].fd, files[0].filename);
    });
  },

  download: function (req, res) {
    var SkipperDisk = require('skipper-disk');
    var fileAdapter = SkipperDisk(/* optional opts */);
    var dir = require('path').resolve(sails.config.appPath)+"/assets/images/";

    // Stream the file down
    var fd = req.param('fd');
    console.log("fd", fd, "full", dir+fd);

    fileAdapter.read(dir+fd)
      .on('error', function (err) {
        return res.serverError(err);
      })
      .pipe(res);
  }

};

