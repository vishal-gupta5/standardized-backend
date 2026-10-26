import "dotenv/config";
import app from "./src/app.js";
import connectDb from "./src/common/config/db.js";

const start = async () => {
  // Connect with database
  connectDb();
  app.listen(PORT, () => {
    console.log(
      `server is running at PORT ${PORT} in ${process.env.NODE_ENV} mode.`,
    );
  });
};

const PORT = process.env.PORT || 5000;

start().catch((error) => {
  console.log("Error: ", error);
  process.exit(1);
});
