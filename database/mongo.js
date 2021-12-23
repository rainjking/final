var mongoose=require('mongoose');
var db=mongoose.createConnection('mongodb://172.21.2.236:27017/190110910810');
db.on('error',function(error){
	console.log(error);
});

var mongooseSchema=new mongoose.Schema({
	name:{type:String},
	password:{type:String}
});
mongooseSchema.methods.findByName=function(name,callback){
	return this.model('user').find({name:name},callback);
}
var mongooseModel=db.model('user',mongooseSchema);

module.exports=mongooseModel;