import { describe, it, expect } from "vitest";
import api from "../axios";

describe("api axios instance", () => {
  it("should have the correct baseURL", () => {
    expect(api.defaults.baseURL).toBe(process.env.VITE_API_URL);
  });

  it("should have a timeout of 10000", () => {
    expect(api.defaults.timeout).toBe(10000);
  });

  it("should have the Content-Type header set to application/json", () => {
    expect(api.defaults.headers["Content-Type"]).toBe("application/json");
  });
});
