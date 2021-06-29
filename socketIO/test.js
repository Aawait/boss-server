
module.exports = function(server){
  
  // 先产生一个io对象
  const io = require('socket.io')(server)

  // 监事客户端与客户端的连接
  io.on('connection',function(socket){
    console.log("有一个客户端连接上了服务器");

    // 绑定监听，接收客户端的消息
    socket.on('sendMsg',function(data){
       console.log("接收到了客户端的消息",data);

       data.name = data.name.toUpperCase()

       // 服务器向浏览器发送消息
      //  socket.emit('receiveMsg',data)
       io.emit('receiveMsg',data)
       console.log("服务器向客户端发送消息",data);
    })
  })

}