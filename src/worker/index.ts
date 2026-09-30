import { Hono } from "hono";
import { streamBrief } from "./brief";

const app = new Hono<{ Bindings: Env }>();

app.get("/api/", (c) => c.json({ name: "Cloudflare" }));

// Body is the Idea as a JSON string, as useObject's submit() sends it.
app.post("/api/brief", async (c) => {
  const idea = await c.req.json<string>();
  return streamBrief(idea, c.env.AI_GATEWAY_API_KEY);
});

export default app;
