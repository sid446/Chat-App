import { ApiError } from "../utils/ApiError.js";

const users = {};
function handleLogin(socket,email){
    if(!email){
        console.error("No email received"); // Log the error for debugging
        throw new ApiError(400, "Email hasn't been received");
    }
    users[socket.id]=email
    console.log(`User logged in: ${email}`);
}

function handleSending(io,socket,recipient, content ){
    const recipientSocketId = Object.keys(users).find((key) => users[key] === recipient);
    if (recipientSocketId) {
        io.to(recipientSocketId).emit('receiveMessage', {
            from: users[socket.id],
            content,
        });
        console.log(`Message sent from ${users[socket.id]} to ${recipient}: ${content}`);
    } else {
        console.log(`User with email ${recipient} is not connected.`);
    }
}

function handleDisconnect(socket){
    console.log(`User disconnected: ${socket.id}`);
    delete users[socket.id]; // Remove user from users object

}

export {handleLogin,handleSending,handleDisconnect}