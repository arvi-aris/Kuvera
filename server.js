const express = require('express');
const path = require('path');
const app = express();
const PORT = 3000;
const request = require('request');
const http = require('http');
const mfURL = 'http://www.portal.amfiindia.com/DownloadNAVHistoryReport_Po.aspx?mf=53&tp=1&frmdt=01-Apr-2015&todt=07-Aug-2017';
const async = require('async');
const db = require('./db.js');
var mfDB;
var bodyParser = require('body-parser')
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));
app.use(express.static(path.resolve(__dirname, 'client', 'dist')));app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});



db.connect(function(db){
  app.listen(PORT,function(){
    console.log("Server listening at port : 3000");
});

  mfDB = db;
});

app.get('/',function(req,res){
  res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'));
});

app.post('/submitQuery',function(req,res){
      //console.log(req.body)
      let dbQuery = getDBQueryArray(req.body);
      getReturnAmount(dbQuery,getRetAmtForSpecificQuery,res);
});


// function print(arr){
// 	console.log(arr)
// }

function getDBQueryArray(queryfromUser){
  //console.log(queryfromUser)
	queryfromUser.forEach(function(qObj){
		qObj['$or'] = [{
			'date' : qObj.date
		},{
			'date': '15-Jun-2017'
		}]
		delete qObj.date;
	});
	return queryfromUser;
}


function getReturnAmount(queryArr,callback,res){
	var doneCounter = 0,
        results = [];
    async.eachSeries(queryArr, function (query, next){ 
      getRetAmtForSpecificQuery(query,query.amount,function(result) { 
        console.log('result' + result)
        // if(!result){
        //   res.status('500');
        //   res.end();
        // }
        results.push(result); 
        next()    
      })
    }, function(result) {
      let totalAmt = 0;
      for(i=0;i<results.length;i++){
        totalAmt += results[i];
      }
    console.log(totalAmt)
res.set('Content-Type', 'text/html');
res.send({ tot :totalAmt});
    }); 	
}






function getRetAmtForSpecificQuery(queryObject,investedAmount,callback){
  delete queryObject.amount;
    console.log(queryObject)
	  mfDB.collection("mfdetails").find(queryObject).toArray()
	  .then(function(result){
      console.log(result)
      if(result.length == 0) {
        callback(0)
      }
	  	let NAVonInvestedDate = result[0].nav ? result[0].nav : 1;
	  	let NAVonToday = result[1].nav ? result[1].nav : 1;
	  	callback((investedAmount / NAVonInvestedDate) * NAVonToday);
	  })
    .catch(function(err){
   //   console.log(err);
    });
};








