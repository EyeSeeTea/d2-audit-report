import React, { useMemo } from "react";
import { getLibCompositionRoot } from "$/CompositionRootLib";
import { AuditsContent } from "$/webapp/components/audits-content/AuditsContent";

export type AuditsLibProps = {
    baseUrl: string;
};

export const AuditsLib: React.FC<AuditsLibProps> = React.memo(({ baseUrl }) => {
    const compositionRoot = useMemo(() => {
        return getLibCompositionRoot(baseUrl);
    }, [baseUrl]);

    return (
        <AuditsContent
            getAudits={compositionRoot.audits.getAll}
            getAllUsers={compositionRoot.users.getAll}
        />
    );
});
