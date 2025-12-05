import nextConfig from "eslint-config-next";

const eslintConfig = [
  ...nextConfig,
  {
    ignores: [
      "coverage/**",
      "playwright-report/**",
      "cypress/reports/**",
      "test-results/**",
      "public/**",
      "**/*.min.js",
      "**/*.map"
    ],
  },
];

export default eslintConfig;
