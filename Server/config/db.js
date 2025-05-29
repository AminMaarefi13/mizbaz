const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const dbUri = process.env.DATABASE;
    console.log("process.env.NODE_ENV");
    console.log("process.env.DATABASE");
    console.log(process.env.NODE_ENV);
    console.log(process.env.DATABASE);
    // const dbUri =
    //   process.env.NODE_ENV === "production"
    //     ? process.env.DATABASE
    //     : process.env.MONGODB_URI;

    await mongoose.connect(dbUri, {
      // useNewUrlParser: true,
      // useUnifiedTopology: true,
    });
    console.log("✅ MongoDB connected");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
