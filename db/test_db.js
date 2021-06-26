/* 测试使用mongoose操作MongoDB数据 */

const mongoose = require('mongoose')
const md5 = require('blueimp-md5')  // md5加密函数

// 1. 链接数据库
mongoose.connect('mongodb://localhost:27017/cici',{useNewUrlParser:true,useUnifiedTopology:true})

// 2. 获取连接对象
const connection = mongoose.connection

// 3. 绑定连接完成的监听（用来提示连接成功）

connection.on('connected',function(){
    console.log("cici的数据库连接成功,yeah~~~");
})

// 4.指定表的规则
const userSchema = mongoose.Schema({
    username: {type:String,required:true},
    password: {type:String,required:true},
    type: {type:String,required:true},
    header: {type:String}
})

// 5. 定义Model 与集合对应，可以操作集合,该方法返回一个构造函数
const UserModel = mongoose.model('bossUser',userSchema)

/** 通过Model或其实例对数据库数据进行CRUD操作 */
function testSave(){
    const userModel = new UserModel({username:'jerry',password: md5('789'),type:'老板'})
    userModel.save((err,user)=>{
        if(err){
            console.log("添加数据失败");
            return
        }
        console.log("添加数据成功");
    })
}

// testSave()

function testFind(){
    // find 查询多个：得到的是包含所有文档对象的数组，如果没有匹配的，返回[]
    UserModel.find()
    .exec(function(err,users){
        console.log('find',err,users);
    })

    // findOne 查询一个：得到的是匹配的文档对象，如果没有匹配返回null
    UserModel
    .findOne({_id:'60d5d283190ecc0c7814e3d0'})
    .exec(function(err,user){
        console.log("findOne",err,user);
    })
}

// testFind()

function testDelete(){
    /* deleteOne  { n: 1, ok: 1, deletedCount: 1 } 返回一个对象
      ok为1代表成操作成功  n：代表删除的数量 
    */
    UserModel
    .deleteOne({username:'tom'})
    .exec(function(err,user){
        console.log("remove",err,user);
    })
}

// testDelete()