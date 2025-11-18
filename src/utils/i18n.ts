import { getModuleForNamespace } from "./i18n-typed";

type I18nModule = ReturnType<typeof getModuleForNamespace>;

const i18nModule: I18nModule = getModuleForNamespace("d2-audit-report");
export default i18nModule;
