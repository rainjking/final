var mongoose=require('mongoose');
var db=mongoose.createConnection('mongodb://172.21.2.236:27017/190110910810');
db.on('error',function(error){
	console.log(error);
});

var mongooseSchema=new mongoose.Schema({
	username:{type:String},
	title:{type:String},
	content:{type:String}
});
var mongooseModel=db.model('blogs',mongooseSchema);
module.exports=mongooseModel;