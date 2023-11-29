import { getAll } from "@vercel/edge-config";
import { NextConfig } from "next";

export default async function Page() {
  const config: NextConfig = await getAll();
  console.log("\nPage:");
  console.log(config);
  console.log("**************");
}
