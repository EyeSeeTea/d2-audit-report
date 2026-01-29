import React, { useMemo } from "react";
import { getLibCompositionRoot } from "$/CompositionRootLib";
import { AuditsContent } from "$/webapp/components/audits-content/AuditsContent";

type d2LoggerAuditsConfig = {
    orgUnitId: string;
    programId: string;
};

export type AuditsLibProps = {
    title: string;
    baseUrl: string;
    d2LoggerAuditsConfig?: d2LoggerAuditsConfig;
    d2LoggerTabTitle?: string;
    dhis2TabTitle?: string;
};

export const AuditsLib: React.FC<AuditsLibProps> = React.memo(
    ({ title, baseUrl, d2LoggerAuditsConfig, d2LoggerTabTitle, dhis2TabTitle }) => {
        const compositionRoot = useMemo(() => {
            return getLibCompositionRoot(baseUrl);
        }, [baseUrl]);

        return (
            <AuditsContent
                title={title}
                getAudits={compositionRoot.audits.getAll}
                getAllUsers={compositionRoot.users.getAll}
                d2LoggerAuditsConfig={
                    d2LoggerAuditsConfig ? { ...d2LoggerAuditsConfig, baseUrl } : undefined
                }
                d2LoggerTabTitle={d2LoggerTabTitle}
                dhis2TabTitle={dhis2TabTitle}
            />
        );
    }
);
