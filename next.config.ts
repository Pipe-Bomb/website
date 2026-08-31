import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	/* config options here */
	allowedDevOrigins: ["127.0.0.1"],
	output: "export",
	images: {
		unoptimized: true,
	},
};

export default nextConfig;
