import { main } from "./run.js";

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
