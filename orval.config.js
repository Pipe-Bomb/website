import { defineConfig } from "orval";

export default defineConfig({
	pipebomb: {
		input: "../server/openapi/spec.json",
		output: {
			target: "./api",
			schemas: "./api/model",
			client: "react-query",
			formatter: "prettier",
			mode: "split",
			clean: true,
			override: {
				useDates: true,
				mutator: {
					path: "./src/lib/api-client.ts",
					name: "customFetch",
				},
			},
			indexFiles: true,
		},
	},
});
