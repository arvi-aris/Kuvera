 const MongoClient = require('mongodb').MongoClient;
 const url = "mongodb://arv:arvi7878@ds163679.mlab.com:63679/kuvera";
 const mfURL = 'http://www.portal.amfiindia.com/DownloadNAVHistoryReport_Po.aspx?mf=53&tp=1&frmdt=01-Apr-2015&todt=07-Aug-2017';
 var mongoServer = {
 	connect : function(callback){
 		MongoClient.connect(url, function(err, db) {
			   if (err) throw err;
			   mongoServer.mfDB = db;
			   mongoServer.mfDB.collection("mfdetails").count()
				   .then(function(count){
				     if(count === 0){
				     	 mongoServer.populateDB().then(function(){
				         	callback(mongoServer.mfDB);
				       	 }).
				       catch(function(){
				         	callback(mongoServer.mfDB);

				       })
				     }else{
				         callback(mongoServer.mfDB);
				     }
   				});
 		})
	 },
	 populateDB : function(){
	 	 return new Promise(
		    function(resolve,reject){
		        var options = {
		        host: mfURL,
		        method: 'GET'
		      };
		      var data = "";
		      var dataArr = [];
		      var req = http.get(mfURL, function(res) {
		        console.log('STATUS: ' + res.statusCode);
		        console.log('HEADERS: ' + JSON.stringify(res.headers));
		        res.setEncoding('utf8');
		        res.on('data', function (chunk) {
		       data += chunk;
		        });
		        res.on('end', () => {
		         dataArr = data.split('\r\n');
		         parseInfo(dataArr,resolve);
		        });
		      });

		      req.on('error', function(e) {
		        console.log('problem with request: ' + e.message);
		        reject();
		      });
	 })
	},
	parseInfo : function(dataArr,resolve){
		  let queryArr = []
		for( let i=0;i<dataArr.length;i++){
			let docArr = dataArr[i].split(';');
			let docObj = {
				'schemeCode' : docArr[0],
				'schemeName' : docArr[1],
				'nav' : docArr[2],
				'rp' : docArr[3],
				'sp' : docArr[4],
				'date' : docArr[5]
			};
		  queryArr.push(docObj)
		}
		//console.log(queryArr)
		  mongoServer.mfDB.collection("mfdetails").insertMany(queryArr)
		  .then(function(){
		    resolve();
		  })
		}
}
 
module.exports = mongoServer;