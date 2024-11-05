import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";

async function handleLogin(socket, email) {
    const user = await User.findOne({ email });

    if (user) {
        // If the user is already online, clear the previous socketId
        if (user.socketId) {
            const previousSocket = user.socketId;
            console.log(`Clearing previous socketId: ${previousSocket}`);
            // Optionally, you could emit a message to the previous socket before clearing it
            // io.to(previousSocket).emit('forceLogout', 'You have been logged in from another device.');
        }

        // Update the user's information
        socket.name = user.name;
        socket.email = user.email;
        user.socketId = socket.id;  // Set the new socketId
        user.online = true;          // Mark the user as online
        console.log(`User logged in: ${user.email}, Socket ID: ${socket.id}`);
        await user.save();
    } else {
        throw new ApiError(404, "User not found");
    }
}

async function handleSending(io, socket, recipient, content) {
    const user = await User.findOne({ email: recipient });
    if (!user) {
        throw new ApiError(404, "User not found");
    }

    const recipientSocketId = user.socketId;
    console.log(recipientSocketId)
    if (recipientSocketId) {
        io.to(recipientSocketId).emit('receiveMessage', {
            from: socket.email, // Ensure this uses the current user's email
            content,
        });
        console.log(`Message sent from ${socket.email} to ${recipient}: ${content}`);
    } else {
        console.log(`User with email ${recipient} is not connected.`);
    }
}

async function handleDisconnect(socket) {
    console.log(`User disconnected: ${socket.id}`);
    const user = await User.findOne({ socketId: socket.id });
    if (user) {
        user.socketId = null;  // Clear the Socket ID
        user.online = false;    // Mark user as offline
        await user.save();
        console.log(`User ${user.email} is now offline.`);
    }
}

export { handleLogin, handleSending, handleDisconnect };
