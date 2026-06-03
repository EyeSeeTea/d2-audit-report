# d2-audit-report

DHIS2 application for viewing audit reports. Can be used as a standalone application or as a reusable NPM library component.

## Setup

```
$ nvm use # uses node version in .nvmrc
$ yarn install
```

## Build

### Build Application

Build a production distributable DHIS2 zip file:

```
$ yarn build
```

### Build Library

Build the library for NPM distribution:

```bash
$ yarn build:lib
```

This generates:

-   `dist/index.es.js` - ES modules bundle
-   `dist/index.cjs.js` - CommonJS bundle
-   `dist/index.d.ts` - TypeScript declarations
-   `dist/package.json` - Library package.json with name `@eyeseetea/d2-audit-report`

## Development

### Running the Application

Copy `.env` to `.env.local` and configure DHIS2 instance to use. Then start the development server:

```
$ yarn start
```

Now in your browser, go to `http://localhost:8081`.

### Using the Library in Development (yarn link)

To use this library in another project during development:

1. **Build the library** (in this repository):

```bash
$ yarn build:lib
```

2. **In this repository**, navigate to `dist/` and create a global link:

```bash
$ cd dist
$ yarn link
```

3. **In your consuming project**, link to this package:

```bash
$ yarn link "@eyeseetea/d2-audit-report"
```

4. **Rebuild the library** (in this repository) whenever you make changes:

```bash
$ yarn build:lib
```

5. **To unlink** (in your consuming project):

```bash
$ yarn unlink "@eyeseetea/d2-audit-report"
```

## Publishing the Library

To publish the library to NPM, use the automated release script:

```bash
$ yarn release
```

This script will:

1. Build the library (`yarn build:lib`)
2. Publish to NPM from the `dist/` directory with the version from `package.json`
3. Create a git tag (`v<version>`) and push it to the repository

**Note**:

-   The version is read from the root `package.json`
-   Beta versions (containing "beta" in the version) will be published with the `beta` tag
-   Make sure you're logged in to NPM (`npm login`) before running the script
-   The `dist/package.json` has the correct name (`@eyeseetea/d2-audit-report`) and configuration for publishing

### Manual Publishing (Alternative)

If you prefer to publish manually:

1. Build the library:

```bash
$ yarn build:lib
```

2. Navigate to the `dist` directory:

```bash
$ cd dist
```

3. Publish to NPM:

```bash
$ npm publish --access public
```

## Using the Library

### Installation

```bash
$ yarn add @eyeseetea/d2-audit-report
```

### Usage

**Basic usage (DHIS2 audits only):**

```tsx
import { Audits } from "@eyeseetea/d2-audit-report";

function MyComponent() {
    return <Audits title="Audit Report" baseUrl="https://play.dhis2.org/dev" />;
}
```

**With D2Logger audits enabled:**

```tsx
import { Audits } from "@eyeseetea/d2-audit-report";

function MyComponent() {
    return (
        <Audits
            title="Audit Report"
            baseUrl="https://play.dhis2.org/dev"
            d2LoggerAuditsConfig={{
                orgUnitId: "orgUnitIdExample",
                programId: "programIdExample",
            }}
            showBackButton={true}
            d2LoggerTabTitle="Logs"
            dhis2TabTitle="Audits"
        />
    );
}
```

### Props

-   **`baseUrl`** (string, required): The base URL of the DHIS2 instance to fetch audit data from.
-   **`title`** (string, optional): Title to display above the audit table.
-   **`d2LoggerTabTitle`** (string, optional): Title to display in d2Logger tab.
-   **`dhis2TabTitle`** (string, optional): Title to display in dhis2 tab.
-   **`showBackButton`** (boolean, optional, default: false): Whether to show the back button in the header.
-   **`onBackClick`** (function, optional): Callback executed when clicking the back button. If `showBackButton=true` and `onBackClick` is not provided, the library will fallback to `window.history.back()`.
-   **`d2LoggerAuditsConfig`** (object, optional): Configuration object to enable D2Logger audits. If not provided, only DHIS2 audits will be displayed. The object should contain:
    -   **`orgUnitId`** (string, required): Organization unit ID for D2Logger audits.
    -   **`programId`** (string, required): Program ID for D2Logger audits.
    -   **`baseUrl`** (string, required): Base URL for D2Logger API (automatically set from the `baseUrl` prop).

**Note**: If `d2LoggerAuditsConfig` is not provided, the component will only display DHIS2 audits. To view both DHIS2 and D2Logger audits, you must provide the `d2LoggerAuditsConfig` object.

### Example with Dialog

```tsx
import { Audits } from "@eyeseetea/d2-audit-report";
import { Dialog } from "@dhis2/ui";

function MyComponent() {
    const [showAudits, setShowAudits] = React.useState(false);

    return (
        <>
            <button onClick={() => setShowAudits(true)}>View Audits</button>
            <Dialog open={showAudits} onClose={() => setShowAudits(false)}>
                <Audits
                    title={i18n.t("Notifications")}
                    baseUrl={"urlExample"}
                    d2LoggerAuditsConfig={{
                        orgUnitId: "orgUnitIdExample",
                        programId: "programIdExample",
                    }}
                />
            </Dialog>
        </>
    );
}
```

## Tests

```
$ yarn test
```

## Some development tips

### Clean architecture folder structure

-   `src/domain`: Domain layer of the app (entities, use cases, repository definitions)
-   `src/data`: Data of the app (repository implementations)
-   `src/webapp/pages`: Main React components.
-   `src/webapp/components`: React components.
-   `src/utils`: Misc utilities.
-   `i18n/`: Contains literal translations (gettext format)
-   `public/`: General non-React webapp resources.

## Data structures

-   `Future.ts`: Async values, similar to promises, but cancellables and with type-safe errors.
-   `Collection.ts`: Similar to Lodash, provides a wrapper over JS arrays.
-   `Obj.ts`: Similar to Lodash, provides a wrapper over JS objects.
-   `HashMap.ts`: Similar to ES6 map, but immutable.
-   `Struct.ts`: Base class for typical classes with attributes. Features: create, update.
-   `Either.ts`: Either a success value or an error.

## Docs

We use [TypeDoc](https://typedoc.org/example/):

```
$ yarn generate-docs
```

### i18n

Update i18n .po files from `i18n.t(...)` calls in the source code:

```
$ yarn localize
```

### Scripts

Check the example script, entry `"script-example"`in `package.json`->scripts and `src/scripts/example.ts`.

### Misc Notes

-   Requests to DHIS2 will be transparently proxied (see `vite.config.ts` -> `server.proxy`) from `http://localhost:8081/dhis2/xyz` to `${VITE_DHIS2_BASE_URL}/xyz`. This prevents CORS and cross-domain problems.

-   You can use `.env` variables within the React app: `const value = import.meta.env.NAME;`
