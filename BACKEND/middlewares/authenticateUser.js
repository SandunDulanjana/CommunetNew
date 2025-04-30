import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

// Middleware to authenticate any user with a valid JWT token
export const authenticateUser = (req, res, next) => {
    const authHeader = req.header("Authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Unauthorized: Invalid token format" });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
        return res.status(401).json({ message: "Unauthorized: No token provided" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Attach decoded user info to the request object
        console.log("Authenticated User:", req.user); // Optional: Debugging
        next();
    } catch (err) {
        console.error("JWT Verification Error:", err.message); // Optional: Debugging
        res.status(401).json({ message: "Unauthorized: Invalid or expired token" });
    }
};

// Middleware to authorize only a specific user (e.g., the poll creator)
export const authorizePollCreator = (req, res, next) => {
    const POLL_CREATOR_ID = process.env.POLL_CREATOR_ID?.trim(); // Prevent issues with whitespace

    console.log("Checking Authorization for User:", req.user?.id); // Optional: Debugging
    console.log("Required Creator ID:", POLL_CREATOR_ID); // Optional: Debugging

    if (!req.user || req.user.id !== POLL_CREATOR_ID) {
        return res.status(403).json({ message: "Unauthorized: Only the designated user can create polls." });
    }

    next();
};
