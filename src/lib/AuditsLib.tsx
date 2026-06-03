import React, { useMemo } from "react";
import { getLibCompositionRoot } from "$/CompositionRootLib";
import { AuditsContent } from "$/webapp/components/audits-content/AuditsContent";
import OldMuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import { MuiThemeProvider } from "@material-ui/core/styles";
import muiThemeLegacy from "$/webapp/pages/app/themes/dhis2-legacy.theme";
import { muiTheme } from "$/webapp/pages/app/themes/dhis2.theme";

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
    showBackButton?: boolean;
    onBackClick?: () => void;
};

export const AuditsLib: React.FC<AuditsLibProps> = React.memo(
    ({
        title,
        baseUrl,
        d2LoggerAuditsConfig,
        d2LoggerTabTitle,
        dhis2TabTitle,
        showBackButton,
        onBackClick,
    }) => {
        const compositionRoot = useMemo(() => {
            return getLibCompositionRoot(baseUrl);
        }, [baseUrl]);

        return (
            <MuiThemeProvider theme={muiTheme}>
                <OldMuiThemeProvider muiTheme={muiThemeLegacy}>
                    <AuditsContent
                        title={title}
                        getAudits={compositionRoot.audits.getAll}
                        getAllUsers={compositionRoot.users.getAll}
                        getOrgUnits={compositionRoot.orgUnits.search}
                        d2LoggerAuditsConfig={
                            d2LoggerAuditsConfig ? { ...d2LoggerAuditsConfig, baseUrl } : undefined
                        }
                        d2LoggerTabTitle={d2LoggerTabTitle}
                        dhis2TabTitle={dhis2TabTitle}
                        showBackButton={showBackButton}
                        onBackClick={onBackClick}
                    />
                </OldMuiThemeProvider>
            </MuiThemeProvider>
        );
    }
);
