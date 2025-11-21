import React from "react";
import { useAppContext } from "$/webapp/contexts/app-context";
import { AuditsTableContent } from "./AuditsTableContent";

export const AuditsTable: React.FC = React.memo(() => {
    const { compositionRoot } = useAppContext();

    return (
        <AuditsTableContent
            getAudits={compositionRoot.audits.getAll}
            getAllUsers={compositionRoot.users.getAll}
        />
    );
});
