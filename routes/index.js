var express = require('express');
var router = express.Router();

const md5 = require('blueimp-md5')

const {UserModel} = require('../db/models')

/* boss直聘项目的路由 */

// 1.注册接口 post请求
router.post('/register',function(req,res){
  const {username,password,type} = req.body
  
  UserModel
  .findOne({username})
  .exec((err,user)=>{
    // 如果存在这个用户名，则返回注册失败
    if(user){
      res.send({code:0,message:'用户名已存在'})
    }else{
      // 不存在则注册
      new UserModel({username,type,password:md5(password)}).save(function(err,user){

           // 注册成功配置一条cookie
           res.cookie('userid',user._id,{maxAge:1000*60*60*24})
           const data  = {username,type,_id:user._id}
           res.send({code:1,data})
      })
   
    }
  })

})

// 2. 登录接口 post请求
router.post('/login',function(req,res){

  const filter = {password:0,__v:0}  // 查询时指定过滤属性

  const {username,password} = req.body
  UserModel
  .findOne({username,password:md5(password)},filter,function(err,user){

      if(!user){
        res.send({code:0,message:'用户名或密码错误'})
      }else{
        res.cookie('userid',user._id,{maxAge:1000*60*60*24})

        res.send({code:1,data:user})
      }
  })
})

// 3. 修改用户信息接口 post 请求
router.post('/update',function(req,res){
  const {userid} = req.cookies
  // 如果没有cookie 直接返回
  if(!userid){
    return res.send({code:0,message:'请先登录'})
  }

  // 有userid 进行查找
  UserModel.findByIdAndUpdate({_id:userid},req.body,function(err,oldUser){
  
    // 如果找不到这条userid，证明cookie被篡改
     if(!oldUser){
       res.clearCookie('userid')
        return res.send({code:0,message:'cookie无效请先登录'})
     }

     // 如果olduser存在，证明修改成功
     const {_id,username,type} = oldUser
     const data  = Object.assign(req.body,{_id,username,type})

     res.send({code:1,data})
  })
})

// 4. 根据cookie的userid获取用户信息
router.get('/user',function(req,res){
  const {userid} = req.cookies
  if(!userid){
    res.send({code:0,message:'请先登录'})
    return
  }

  const filter = {password:0,__v:0}  // 查询时指定过滤属性
  UserModel.findOne({_id:userid},filter,function(err,user){
     res.send({code:1,data:user})
  })
})
 
// 5. 获取指定类型的用户列表
router.get('/userlist',function(req,res){
  const filter = {password:0,__v:0}  // 查询时指定过滤属性
  const {type} = req.query
  UserModel.find({type},filter,function(err,users){
    res.send({code:1,data:users})
  })
})

module.exports = router;
