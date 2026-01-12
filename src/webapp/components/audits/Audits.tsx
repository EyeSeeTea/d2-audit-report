import React from "react";
import { useAppContext } from "$/webapp/contexts/app-context";
import { AuditsContent } from "$/webapp/components/audits-content/AuditsContent";

export const Audits: React.FC = React.memo(() => {
    const { compositionRoot } = useAppContext();

    return (
        <AuditsContent
            getAudits={compositionRoot.audits.getAll}
            getAllUsers={compositionRoot.users.getAll}
        />
    );
});
