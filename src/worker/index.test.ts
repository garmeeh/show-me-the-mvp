import { describe, expect, it } from "vitest";
import app from "./index";

describe("API routing", () => {
  it("returns 404 for an unknown API route", async () => {
    const res = await app.request("/api/nope");

    expect(res.status).toBe(404);
  });

  it("returns 404 for a method the route does not handle", async () => {
    const res = await app.request("/api/", { method: "POST" });

    expect(res.status).toBe(404);
  });
});
