const express = require('express');
const path = require('path');
const app = express();
const PORT = 3000;
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