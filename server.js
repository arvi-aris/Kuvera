const express = require('express');
const path = require('path');
const app = express();
const PORT = 3000;
const request = require('request');
const http = require('http');
const mfURL = 'http://www.portal.amfiindia.com/DownloadNAVHistoryReport_Po.aspx?mf=53&tp=1&frmdt=01-Apr-2015&todt=07-Aug-2017';
const async = require('async');
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

app.listen(PORT,function(){
    console.log("Server listening at port : 3000");
});

app.get('/',function(req,res){
  res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'));
});

app.post('/submitQuery',function(req,res){
  res.send(req.body);
  res.end();
});

// var MongoClient = require('mongodb').MongoClient;
// var url = "mongodb://arv:arvi7878@ds163679.mlab.com:63679/kuvera";
// var mfDB;
// MongoClient.connect(url, function(err, db) {
//   if (err) throw err;
//   mfDB = db;
//   mfDB.collection("mfdetails").count()
//   .then(function(res){
//     console.log(res)
//     if(res === 0){
//       console.log("Here")
//       populateDB().then(function(){
//         query();
//       }).
//       catch(function(){

//       })
//     }else{
//               query();
//     }
//   });



  	
// 	// 	'schemeName' : 'Axis Long Term Equity Fund - Direct Plan - Growth Option',
// 	// 	'date' : '07-Aug-2017'

// 	// });

// 	// let NAVonToday = getNAVForDate({
// 	// 	'schemeName' : 'Axis Long Term Equity Fund - Direct Plan - Growth Option',
// 	// 	'date' : '07-Aug-2017'

// 	// });

// 	// let returnAmount = getReturnAmount(NAVonInvestedDate,NAVonToday,10000);

// 	// console.log(returnAmount);
// });


// function query(){
//   var queryfromUser = [{
//       'schemeName' : 'Axis Long Term Equity Fund - Direct Plan - Growth Option',
//       'date': '13-May-2016',
//       'amount' : 10000
//     },{
//       'schemeName' : 'Axis Banking & PSU Debt Fund - Direct Plan - Growth Option',
//       'date': '13-May-2016',
//       'amount' : 10000
//     },{
//       'schemeName' : 'Axis Long Term Equity Fund - Direct Plan - Growth Option',
//       'date': '13-May-2016',
//             'amount' : 10000
//     }];

//     let dbQuery = getDBQueryArray(queryfromUser);
//  //   console.log(dbQuery);
//   getReturnAmount(dbQuery,getRetAmtForSpecificQuery,print);
// }

// function print(arr){
// 	console.log(arr)
// }

function getDBQueryArray(queryfromUser){
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


// function getReturnAmount(NAVonInvestedDate,NAVonToday,investedAmount){
// 	return (investedAmount/NAVonInvestedDate) * NAVonToday;
// }

function getReturnAmount(queryArr,callback,print){
	var doneCounter = 0,
        results = [];
   // queryArr.forEach(function (item) {
      //console.log(item)
    	// var investedAmount = item.amount;
    	// delete item.amount;
     //    callback(item, investedAmount, function (res) {
     //        doneCounter += 1;
     //        results.push(res);
     //        if (doneCounter === queryArr.length) {
     //            print(results);
     //        }
     //    });

    async.eachSeries(queryArr, function (query, next){ 
      let investedAmount = query.amount;
      delete query.amount;
      getRetAmtForSpecificQuery(query,investedAmount,function(result) { 
        results.push(result); 
        next()    
      })
    }, function(result) {
      let totalAmt = 0;
      for(i=0;i<results.length;i++){
        totalAmt += results[i];
      }
      console.log(totalAmt);
    }); 	
}






function getRetAmtForSpecificQuery(queryObject,investedAmount,callback){
  console.log(queryObject)
	  mfDB.collection("mfdetails").find(queryObject).toArray()
	  .then(function(result){
	  	let NAVonInvestedDate = result[0].nav;
	  	let NAVonToday = result[1].nav;
	  	callback((investedAmount / NAVonInvestedDate) * NAVonToday);
	  })
    .catch(function(err){
   //   console.log(err);
    });
};





function parseInfo(dataArr,resolve){
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
  mfDB.collection("mfdetails").insertMany(queryArr)
  .then(function(){
    resolve();
  })
}


function populateDB(){
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
}