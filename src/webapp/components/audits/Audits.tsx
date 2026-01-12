import React from "react";
import { useAppContext } from "$/webapp/contexts/app-context";
import { AuditsContent } from "$/webapp/components/audits-content/AuditsContent";
import i18n from "$/utils/i18n";

export const Audits: React.FC = React.memo(() => {
    const { compositionRoot } = useAppContext();

    return (
        <AuditsContent
            getAudits={compositionRoot.audits.getAll}
            getAllUsers={compositionRoot.users.getAll}
            d2LoggerAuditsConfig={compositionRoot.audits.getD2LoggerAuditsConfig()}
            title={i18n.t("Audit")}
        />
    );
});
