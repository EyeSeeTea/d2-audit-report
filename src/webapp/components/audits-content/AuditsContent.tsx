import React, { useState } from "react";
import Typography from "@material-ui/core/Typography";
import { Dhis2Audits } from "$/webapp/components/dhis2-audits/Dhis2Audits";
import { d2LoggerAudits as D2LoggerAudits } from "$/webapp/components/d2logger-audits/d2LoggerAudits";
import { GetAllUsersUseCase } from "$/domain/usecases/GetAllUsersUseCase";
import { GetAuditsUseCase } from "$/domain/usecases/GetAuditsUseCase";
import { AuditSelector, ViewKey } from "$/webapp/components/audit-selector/AuditSelector";
import { Maybe } from "$/utils/ts-utils";
import { D2LoggerAuditsConfig } from "$/types/D2LoggerAuditsConfig";
import styled from "styled-components";

type AuditsContentProps = {
    getAudits: GetAuditsUseCase;
    getAllUsers: GetAllUsersUseCase;
    d2LoggerAuditsConfig: Maybe<D2LoggerAuditsConfig>;
    title?: string;
};

export const AuditsContent: React.FC<AuditsContentProps> = React.memo(
    ({ getAudits, getAllUsers, d2LoggerAuditsConfig, title }) => {
        const [currentViewKey, setCurrentViewKey] = useState<ViewKey>("dhis2");

        return d2LoggerAuditsConfig ? (
            <>
                <HeaderContainer>
                    <Title variant="h5" gutterBottom>
                        {title || "\u00A0"}
                    </Title>
                    <AuditSelector
                        showLabels={true}
                        currentViewKey={currentViewKey}
                        onChange={setCurrentViewKey}
                    />
                </HeaderContainer>
                <Container>
                    {currentViewKey === "dhis2" ? (
                        <Dhis2Audits getAudits={getAudits} getAllUsers={getAllUsers} />
                    ) : (
                        <D2LoggerAudits
                            baseUrl={d2LoggerAuditsConfig.baseUrl}
                            orgUnitId={d2LoggerAuditsConfig.orgUnitId}
                            programId={d2LoggerAuditsConfig.programId}
                        />
                    )}
                </Container>
            </>
        ) : (
            <>
                {title && (
                    <Title variant="h5" gutterBottom>
                        {title}
                    </Title>
                )}
                <Dhis2Audits getAudits={getAudits} getAllUsers={getAllUsers} />
            </>
        );
    }
);

const HeaderContainer = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 16px;
    margin-bottom: 16px;
    min-height: 40px;
`;

const Title = styled(Typography)`
    display: inline-block;
    font-weight: 300;
    margin: 0;
    flex: 1;
    min-width: 0;
    visibility: ${props => (props.children === "\u00A0" ? "hidden" : "visible")};
`;

const Container = styled.div`
    height: 80vh;
`;
