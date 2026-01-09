import app from "./app";
import { connectDB } from "./config/database";

const PORT = process.env.PORT || 5000; 

async function startServer() {
    try {
        await connectDB();               
        
        app.listen(PORT, () => {
            console.log(`Server running on http://localhost:${PORT}`);
        });
    } catch (err) {
        console.error("Failed to start server:", err);
        process.exit(1);
    }
}

startServer();