import React, { useState } from "react";
import { Dhis2Audits } from "$/webapp/components/dhis2-audits/Dhis2Audits";
import { d2LoggerAudits as D2LoggerAudits } from "$/webapp/components/d2logger-audits/d2LoggerAudits";
import { GetAllUsersUseCase } from "$/domain/usecases/GetAllUsersUseCase";
import { GetAuditsUseCase } from "$/domain/usecases/GetAuditsUseCase";
import { GetOrgUnitsUseCase } from "$/domain/usecases/GetOrgUnitsUseCase";
import { GetDatasetsUseCase } from "$/domain/usecases/GetDatasetsUseCase";
import { GetProgramsUseCase } from "$/domain/usecases/GetProgramsUseCase";
import { ViewKey } from "$/webapp/components/audit-selector/AuditSelector";
import { Maybe } from "$/utils/ts-utils";
import { D2LoggerAuditsConfig } from "$/types/D2LoggerAuditsConfig";
import styled from "styled-components";
import { Header } from "$/webapp/components/header/Header";

type AuditsContentProps = {
    getAudits: GetAuditsUseCase;
    getAllUsers: GetAllUsersUseCase;
    getOrgUnits: GetOrgUnitsUseCase;
    getDatasets: GetDatasetsUseCase;
    getPrograms: GetProgramsUseCase;
    d2LoggerAuditsConfig: Maybe<D2LoggerAuditsConfig>;
    title?: string;
    d2LoggerTabTitle?: string;
    dhis2TabTitle?: string;
    showBackButton?: boolean;
    onBackClick?: () => void;
    hasGutterBottom?: boolean;
};

export const AuditsContent: React.FC<AuditsContentProps> = React.memo(
    ({
        getAudits,
        getAllUsers,
        getOrgUnits,
        getDatasets,
        getPrograms,
        d2LoggerAuditsConfig,
        title,
        d2LoggerTabTitle,
        dhis2TabTitle,
        showBackButton = false,
        onBackClick,
        hasGutterBottom = false,
    }) => {
        const [currentViewKey, setCurrentViewKey] = useState<ViewKey>("d2logger");

        return d2LoggerAuditsConfig ? (
            <>
                <Header
                    currentViewKey={currentViewKey}
                    onChangeView={setCurrentViewKey}
                    title={title}
                    d2LoggerTabTitle={d2LoggerTabTitle}
                    dhis2TabTitle={dhis2TabTitle}
                    showBackButton={showBackButton}
                    onBackClick={onBackClick}
                    hasGutterBottom={hasGutterBottom}
                    hasD2LoggerAudits
                />

                <Container>
                    {currentViewKey === "dhis2" ? (
                        <Dhis2Audits
                            getAudits={getAudits}
                            getAllUsers={getAllUsers}
                            getOrgUnits={getOrgUnits}
                            getDatasets={getDatasets}
                            getPrograms={getPrograms}
                            excludedProgramId={d2LoggerAuditsConfig.programId}
                        />
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
                <Header
                    currentViewKey={currentViewKey}
                    onChangeView={setCurrentViewKey}
                    title={title}
                    showBackButton={showBackButton}
                    onBackClick={onBackClick}
                    hasD2LoggerAudits={false}
                    hasGutterBottom={hasGutterBottom}
                />
                <Dhis2Audits
                    getAudits={getAudits}
                    getAllUsers={getAllUsers}
                    getOrgUnits={getOrgUnits}
                    getDatasets={getDatasets}
                    getPrograms={getPrograms}
                    excludedProgramId={undefined}
                />
            </>
        );
    }
);

const Container = styled.div`
    height: 80vh;
`;
