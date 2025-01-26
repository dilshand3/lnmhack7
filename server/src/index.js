import { connectDB } from "./db/db.js";
import { app } from "./app.js";

const port = process.env.PORT || 2093 
connectDB()
.then(() => {
    app.listen(port,() => {
        console.log(`Server is running on port ${port}`)
    })
})
.catch((err) => {
    console.log(`MongoDB connection failed due to ${err}`)
})