import { handleProcessSessionRoute } from "../api/routes/09_hermes_api_route_handlers";

async function main(): Promise<void> {
  const requestBody = {
    inputs: [
      {
        source: "user_input",
        author: "john",
        timestamp: new Date().toISOString(),
        content: "Frank approved the irrigation change for Veg. Update the policy to flush on Sunday.",
        tags: ["approval", "policy", "veg"],
      },
      {
        source: "user_input",
        author: "john",
        timestamp: new Date().toISOString(),
        content: "Task: check dehumidifier filter in Flower Room 2.",
        tags: ["task", "maintenance"],
      },
      {
        source: "user_input",
        author: "john",
        timestamp: new Date().toISOString(),
        content: "Maybe the dry room humidity target should be reduced to 54 percent.",
        tags: ["environment", "dry_room"],
      },
    ],
  };

  const result = await handleProcessSessionRoute(requestBody);

  console.log(JSON.stringify(result, null, 2));
}

main().catch((error) => {
  console.error("Hermes test harness failed:");
  console.error(error);
  process.exit(1);
});
