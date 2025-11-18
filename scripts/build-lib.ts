import * as fs from "fs";
import * as path from "path";

// Paths
const distPath = path.join(__dirname, "..", "dist");
const libSourcePath = path.join(__dirname, "..", "src", "lib", "index.ts");
const libDistPath = path.join(distPath, "lib");
const dtsFilePath = path.join(distPath, "index.d.ts");

function validateDistFolder(): void {
    if (!fs.existsSync(distPath)) {
        fs.mkdirSync(distPath, { recursive: true });
        console.log("'dist' directory created.");
    }
}

function generateIndexDeclarationFile(): void {
    // Read the source index.ts to get the exports
    if (!fs.existsSync(libSourcePath)) {
        console.error(`Source file not found: ${libSourcePath}`);
        process.exit(1);
    }

    const sourceContent = fs.readFileSync(libSourcePath, "utf8");

    // Transform the exports: change paths from "./X" to "./lib/X"
    // This preserves the exact export structure from src/lib/index.ts
    const transformedContent = sourceContent
        .split("\n")
        .map(line => {
            // Match export statements with relative paths
            return line.replace(/from\s+["']\.\/([^"']+)["']/g, 'from "./lib/$1"');
        })
        .join("\n");

    // Check if lib/ directory exists with .d.ts files
    if (!fs.existsSync(libDistPath)) {
        console.error(`lib directory not found in dist: ${libDistPath}`);
        console.error("Make sure to run 'tsc -p tsconfig.lib.json' before this script.");
        process.exit(1);
    }

    const dtsFiles = fs.readdirSync(libDistPath).filter(file => file.endsWith(".d.ts"));
    if (dtsFiles.length === 0) {
        console.error("No .d.ts files found in dist/lib/");
        console.error("Make sure to run 'tsc -p tsconfig.lib.json' before this script.");
        process.exit(1);
    }

    fs.writeFileSync(dtsFilePath, transformedContent);
    console.log("✓ Generated index.d.ts from src/lib/index.ts");
}

function removeInternalTypes(): void {
    // Remove all directories and files that are not in lib/
    // This keeps dist/ clean for yarn link and repository inspection
    const libDir = path.join(distPath, "lib");
    const allowedFiles = ["index.d.ts", "index.es.js", "index.cjs.js", "package.json"];

    if (!fs.existsSync(distPath)) {
        return;
    }

    const entries = fs.readdirSync(distPath, { withFileTypes: true });
    for (const entry of entries) {
        const entryPath = path.join(distPath, entry.name);

        // Skip lib/ directory and allowed files
        if (entry.name === "lib" || allowedFiles.includes(entry.name)) {
            continue;
        }

        // Remove everything else
        if (entry.isDirectory()) {
            fs.rmSync(entryPath, { recursive: true, force: true });
        } else if (entry.isFile()) {
            fs.unlinkSync(entryPath);
        }
    }
}

function getLibDeclarationFiles(): string[] {
    // Automatically detect all .d.ts and .d.ts.map files in dist/lib/
    const files: string[] = [];

    if (!fs.existsSync(libDistPath)) {
        return files;
    }

    const entries = fs.readdirSync(libDistPath, { withFileTypes: true });
    for (const entry of entries) {
        if (entry.isFile() && (entry.name.endsWith(".d.ts") || entry.name.endsWith(".d.ts.map"))) {
            files.push(`lib/${entry.name}`);
        }
    }

    return files.sort();
}

function createLibraryPackageJson(): void {
    const packageJsonPath = path.join(__dirname, "..", "package.json");
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));

    // Automatically get all declaration files from dist/lib/
    const libDeclarationFiles = getLibDeclarationFiles();

    const libPackageJson = {
        name: "@eyeseetea/d2-audit-report",
        version: packageJson.version,
        description: "D2 Audit Report Table Component",
        license: packageJson.license,
        author: packageJson.author,
        repository: packageJson.repository,
        homepage: packageJson.homepage,
        main: "./index.cjs.js",
        module: "./index.es.js",
        types: "./index.d.ts",
        exports: {
            ".": {
                import: "./index.es.js",
                require: "./index.cjs.js",
                types: "./index.d.ts",
            },
        },
        files: ["index.es.js", "index.cjs.js", "index.d.ts", ...libDeclarationFiles],
        peerDependencies: packageJson.peerDependencies,
        peerDependenciesMeta: packageJson.peerDependenciesMeta,
    };

    const distPackageJsonPath = path.join(distPath, "package.json");
    fs.writeFileSync(distPackageJsonPath, JSON.stringify(libPackageJson, null, 2) + "\n");
    console.log("✓ Generated package.json for library in dist/");
    console.log(`  Included ${libDeclarationFiles.length} declaration file(s) from lib/`);
}

function start(): void {
    validateDistFolder();
    generateIndexDeclarationFile();
    // Remove all types/files that are not in lib/ (keeps dist/ clean for yarn link and repo inspection)
    removeInternalTypes();
    createLibraryPackageJson();
}

start();
