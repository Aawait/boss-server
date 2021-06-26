
const mongoose = require('mongoose')

// 1. 链接数据库
 mongoose.connect('mongodb://localhost:27017/cici',{useUnifiedTopology:true,useNewUrlParser:true})

 // 获取连接对象
 const connection = mongoose.connection

// 2. 监听数据库连接
  connection.once('open',function(){
    console.log("cici的数据库连接成功yeah~~~");
})

/* 定义出对应特定集合的Model并暴露*/

// 定义出schema 描述文档结构
 const userSchema = mongoose.Schema({
     username: {type:String,required:true},
     password: {type:String,required:true},
     type: {type:String,required:true},
     header: {type:String}, // 头像
     post: {type:String} ,  // 职位
     info: {type:String} ,  // 个人或职位简介
     company: {type:String},  // 公司名称
     salary:{type:String}    // 月薪
 })

 // 4. 定义Model 与集合对应，可以操作集合
 const UserModel =  mongoose.model('bossusers',userSchema)

 exports.UserModel = UserModel