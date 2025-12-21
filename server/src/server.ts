import app from "./app.ts";
import { config } from "dotenv";

config();

const PORT = process.env.PORT || 5000;

if (!PORT) {
  throw new Error("❌ PORT is not defined in environment variables");
}

app.listen(Number(PORT), "0.0.0.0", () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
