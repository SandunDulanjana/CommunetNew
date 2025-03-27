import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const authenticateUser = (req, res, next) => {
    const token = req.header("Authorization")?.split(" ")[1];

    if (!token) {
        return res.status(401).json({ message: "Unauthorized: No token provided" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Attach user data to the request
        console.log("Authenticated User:", req.user); // Debugging
        next();
    } catch (err) {
        res.status(401).json({ message: "Unauthorized: Invalid token" });
    }
};

// Middleware to check if the user is the designated poll creator
export const authorizePollCreator = (req, res, next) => {
    const POLL_CREATOR_ID = process.env.POLL_CREATOR_ID?.trim(); // Trim in case of spaces

    console.log("Checking Authorization for User:", req.user?.id); // Debugging
    console.log("Required Creator ID:", POLL_CREATOR_ID); // Debugging

    if (!req.user || req.user.id !== POLL_CREATOR_ID) {
        return res.status(403).json({ message: "Unauthorized: Only the designated user can create polls." });
    }

    next();
};
