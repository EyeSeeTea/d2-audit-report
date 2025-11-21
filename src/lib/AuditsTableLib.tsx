import React, { useMemo } from "react";
import { AuditsTableContent } from "$/webapp/components/audits-table/AuditsTableContent";
import { getLibCompositionRoot } from "$/CompositionRootLib";

export type AuditsTableLibrops = {
    baseUrl: string;
};

export const AuditsTableLib: React.FC<AuditsTableLibrops> = React.memo(({ baseUrl }) => {
    const compositionRoot = useMemo(() => {
        return getLibCompositionRoot(baseUrl);
    }, [baseUrl]);

    return (
        <AuditsTableContent
            getAudits={compositionRoot.audits.getAll}
            getAllUsers={compositionRoot.users.getAll}
        />
    );
});
