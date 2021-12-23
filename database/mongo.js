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

// var doc = {name : 'user1', password : 'psw1'};
// mongooseModel.create(doc, function(error){
//     if(error) {
//         console.log(error);
//     } else {
//         console.log('save ok');
//     }
//     // 关闭数据库链接
//     db.close();
// });
module.exports=mongooseModel;