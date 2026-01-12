import React, { useMemo } from "react";
import { Tabs, Tab, Paper } from "@material-ui/core";
import styled from "styled-components";
import i18n from "@eyeseetea/feedback-component/locales";

export type ViewKey = "dhis2" | "d2logger";

interface ViewsSelectorProps {
    currentViewKey: ViewKey;
    onChange(view: ViewKey): void;
    showLabels?: boolean;
}

export const AuditSelector: React.FC<ViewsSelectorProps> = React.memo(props => {
    const { onChange, currentViewKey, showLabels } = props;

    const setCurrentTab = React.useCallback(
        (_event: React.ChangeEvent<{}>, newTabIndex: number) => {
            const newViewKey = newTabIndex === 0 ? "dhis2" : "d2logger";
            onChange(newViewKey);
        },
        [onChange]
    );

    const tabIndex = useMemo(() => (currentViewKey === "dhis2" ? 0 : 1), [currentViewKey]);

    return (
        <StyledPaper>
            <Tabs
                value={tabIndex}
                onChange={setCurrentTab}
                indicatorColor="primary"
                textColor="primary"
            >
                <StyledTab
                    label={showLabels ? i18n.t("Dhis2") : undefined}
                    aria-label={i18n.t("Dhis2")}
                    key="dhis2"
                    //icon={<Dhis2Icon />}
                    title={i18n.t("Dhis2")}
                />
                <StyledTab
                    label={showLabels ? i18n.t("D2Logger") : undefined}
                    aria-label={i18n.t("D2Logger")}
                    key="d2logger"
                    //icon={<Dhis2Icon />}
                    title={i18n.t("D2Logger")}
                />
            </Tabs>
        </StyledPaper>
    );
});

const StyledPaper = styled(Paper)`
    margin-left: auto;
`;

const StyledTab = styled(Tab)`
    min-width: 50px;
`;
