/// <reference types="vitest" />
import { UserConfig, defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import checker from "vite-plugin-checker";
import nodePolyfills from "vite-plugin-node-stdlib-browser";
import * as path from "path";

export default ({ mode }): UserConfig => {
    const isLibraryMode = mode === "library";

    if (isLibraryMode) {
        return getLibraryConfig();
    }

    const env = { ...process.env, ...loadEnv(mode, process.cwd()) };
    return getAppConfig(env);
};

/**
 * Configuration for building the NPM library
 * Generates ES modules and CommonJS files in library mode
 */
function getLibraryConfig(): UserConfig {
    return defineConfig({
        plugins: [nodePolyfills(), react()],
        build: {
            lib: {
                entry: path.resolve(__dirname, "src/lib/index.ts"),
                name: "D2AuditReportTable",
                formats: ["es", "cjs"],
                fileName: format => `index.${format === "es" ? "es" : "cjs"}.js`,
            },
            rollupOptions: {
                // Dependencies that should NOT be included in the bundle (peer dependencies)
                external: [
                    "react",
                    "react-dom",
                    "@dhis2/ui",
                    "@eyeseetea/d2-ui-components",
                    "@eyeseetea/d2-api",
                    "styled-components",
                ],
                output: {
                    // Global names for UMD (even though we don't use UMD, it's good practice)
                    globals: {
                        react: "React",
                        "react-dom": "ReactDOM",
                        "@dhis2/ui": "DHIS2UI",
                        "@eyeseetea/d2-ui-components": "D2UIComponents",
                        "@eyeseetea/d2-api": "D2API",
                        "styled-components": "styled",
                    },
                },
            },
        },
        resolve: {
            alias: {
                $: path.resolve(__dirname, "./src"),
            },
        },
    });
}

/**
 * Configuration for the web application (development and production modes)
 * Includes development plugins, testing, proxy for DHIS2, etc.
 */
function getAppConfig(env: Record<string, string>): UserConfig {
    const proxy = getProxy(env);

    return defineConfig({
        base: "", // Relative paths
        plugins: [
            nodePolyfills(),
            react(),
            checker({
                overlay: false,
                typescript: true,
                eslint: {
                    lintCommand: 'eslint "./src/**/*.{ts,tsx}"',
                    dev: { logLevel: ["warning"] },
                },
            }),
        ],
        test: {
            environment: "jsdom",
            include: ["**/*.spec.{ts,tsx}"],
            setupFiles: "./src/tests/setup.js",
            exclude: ["node_modules", "src/tests/playwright"],
            globals: true,
        },
        server: {
            port: parseInt(env.VITE_PORT),
            proxy: proxy,
        },
        resolve: {
            alias: {
                $: path.resolve(__dirname, "./src"),
            },
        },
    });
}

function getProxy(env: Record<string, string>) {
    const dhis2UrlVar = "VITE_DHIS2_BASE_URL";
    const dhis2AuthVar = "VITE_DHIS2_AUTH";
    const targetUrl = env[dhis2UrlVar];
    const auth = env[dhis2AuthVar];
    const isBuild = env.NODE_ENV === "production";

    if (isBuild) {
        return {};
    } else if (!targetUrl) {
        console.error(`Set ${dhis2UrlVar}`);
        process.exit(1);
    } else if (!auth) {
        console.error(`Set ${dhis2AuthVar}`);
        process.exit(1);
    } else {
        return {
            "/dhis2": {
                target: targetUrl,
                changeOrigin: true,
                auth: auth,
                rewrite: path => path.replace(/^\/dhis2/, ""),
            },
        };
    }
}
