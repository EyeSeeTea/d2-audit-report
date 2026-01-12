import { CaptureAppIframe, StylesOptions } from "$/webapp/components/capture-app/CaptureAppIframe";
import React from "react";

type Dhis2AuditsProps = {
    baseUrl: string;
    orgUnitId: string;
    programId: string;
};

export const d2LoggerAudits: React.FC<Dhis2AuditsProps> = React.memo(
    ({ baseUrl, orgUnitId, programId }) => {
        return (
            <CaptureAppIframe
                onQueryStateChange={() => {}}
                stylesOptions={stylesOptions}
                reloadKey={0}
                height="100%"
                src={`${baseUrl}/dhis-web-capture/index.html#/?programId=${programId}&orgUnitId=${orgUnitId}`}
            />
        );
    }
);

const stylesOptions: StylesOptions = {
    programOrgUnitSelectors: false,
    newButton: false,
    buttonShowAllEvents: true,
    commentsBox: true,
};
