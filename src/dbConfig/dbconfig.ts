import mongoose from "mongoose";

export async function connect() {
  console.log({ reached: "connect" });
  try {
    if (mongoose.connections[0].readyState) {
      // Already connected
      console.log({ connected: mongoose.connections });
      return;
    }
    await mongoose.connect(process.env.MONGO_URL!);
    console.log({ MONGO_URL: process.env.MONGO_URL! });
    const connection = mongoose.connection;
    console.log("MongoDB connected successfully", connection);

    // connection.on("error", (err) => {
    //   console.log(
    //     "MongoDB connected error. Please make sure mondoDB is running. " + err
    //   );
    //   process.exit();
    // });
  } catch (error) {
    console.log("MongoDB connection error", error);
    throw error;
  }
}
