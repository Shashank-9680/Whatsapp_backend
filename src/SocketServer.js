let onlineUsers = [];

export default function (socket, io) {
  // user joins or opens the application
  socket.on("join", (user) => {
    socket.join(user);
    // add joined user to online users
    if (!onlineUsers.some((u) => u.userId === user)) {
      onlineUsers.push({ userId: user, socketId: socket.id });
      // send online users to frontend
      io.emit("get-online-users", onlineUsers);
    }
  });
  // socket disconnect
  socket.on("disconnect", () => {
    onlineUsers = onlineUsers.filter((user) => user.socketId !== socket.id);
    io.emit("get-online-users", onlineUsers);
    console.log("user is diconnected");
  });

  // join a conversation room
  socket.on("join conversation", (conversation) => {
    socket.join(conversation);
    console.log("user has joinded has conversation", conversation);
  });
  //send and recieve message
  socket.on("send message", (message) => {
    let conversation = message.conversation;

    console.log(conversation);
    if (!conversation.users) return;
    conversation.users.forEach((user) => {
      if (user._id === message.sender._id) return;
      socket.in(user._id).emit("receive message", message);
    });
  });
  socket.on("typing", (conversation) => {
    console.log("typing....");
    socket.in(conversation).emit("typing", conversation);
  });
  socket.on("stop typing", (conversation) => {
    console.log("stop typing.....");
    socket.in(conversation).emit("stop typing");
  });
}
