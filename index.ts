import app from "./server/http";
const port: Number = env("PORT", 3001);

if (env("NODE_ENV", "production") === "development") {
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}
