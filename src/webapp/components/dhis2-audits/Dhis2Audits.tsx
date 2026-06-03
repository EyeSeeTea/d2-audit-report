import React, { useEffect, useMemo } from "react";
import { ObjectsList, useSnackbar } from "@eyeseetea/d2-ui-components";
import { useDhis2Audits } from "./useDhis2Audits";
import { usePaginationTextModifier } from "./usePaginationTextModifier";
import { GetAuditsUseCase } from "$/domain/usecases/GetAuditsUseCase";
import { GetAllUsersUseCase } from "$/domain/usecases/GetAllUsersUseCase";
import { GetOrgUnitsUseCase } from "$/domain/usecases/GetOrgUnitsUseCase";
import { AuditsFiltersComponent } from "$/webapp/components/dhis2-audits/AuditsFiltersComponent";
import styled from "styled-components";
import { Maybe } from "$/utils/ts-utils";

type Dhis2AuditsProps = {
    getAudits: GetAuditsUseCase;
    getAllUsers: GetAllUsersUseCase;
    getOrgUnits: GetOrgUnitsUseCase;
    excludedProgramId: Maybe<string>;
};

export const Dhis2Audits: React.FC<Dhis2AuditsProps> = React.memo(
    ({ getAudits, getAllUsers, getOrgUnits, excludedProgramId }) => {
        const snackbar = useSnackbar();
        const {
            objectsListProps,
            error,
            startDate,
            endDate,
            selectedUsername,
            selectedDataType,
            excludeScriptLogs,
            users,
            orgUnits,
            isLoadingOrgUnits,
            selectedOrgUnit,
            includeOrgUnitDescendants,
            onStartDateChange,
            onEndDateChange,
            onUsernameChange,
            onDataTypeChange,
            onExcludeScriptLogsChange,
            onOrgUnitChange,
            onOrgUnitSearch,
            onOrgUnitsScrollEnd,
            onIncludeOrgUnitDescendantsChange,
        } = useDhis2Audits(getAudits, getAllUsers, getOrgUnits, excludedProgramId);

        const containerRef = usePaginationTextModifier(
            objectsListProps.pagination,
            objectsListProps.isLoading
        );

        useEffect(() => {
            if (error) {
                snackbar.error(error);
            }
        }, [error, snackbar]);

        const filterComponents = useMemo(
            () => (
                <AuditsFiltersComponent
                    startDate={startDate}
                    endDate={endDate}
                    users={users}
                    orgUnits={orgUnits}
                    isLoadingOrgUnits={isLoadingOrgUnits}
                    selectedUsername={selectedUsername}
                    selectedDataType={selectedDataType}
                    selectedOrgUnit={selectedOrgUnit}
                    includeOrgUnitDescendants={includeOrgUnitDescendants}
                    excludeScriptLogs={excludeScriptLogs}
                    onStartDateChange={onStartDateChange}
                    onEndDateChange={onEndDateChange}
                    onUsernameChange={onUsernameChange}
                    onDataTypeChange={onDataTypeChange}
                    onExcludeScriptLogsChange={onExcludeScriptLogsChange}
                    onOrgUnitChange={onOrgUnitChange}
                    onOrgUnitSearch={onOrgUnitSearch}
                    onOrgUnitsScrollEnd={onOrgUnitsScrollEnd}
                    onIncludeOrgUnitDescendantsChange={onIncludeOrgUnitDescendantsChange}
                />
            ),
            [
                startDate,
                endDate,
                users,
                orgUnits,
                isLoadingOrgUnits,
                selectedUsername,
                selectedDataType,
                selectedOrgUnit,
                includeOrgUnitDescendants,
                excludeScriptLogs,
                onStartDateChange,
                onEndDateChange,
                onUsernameChange,
                onDataTypeChange,
                onExcludeScriptLogsChange,
                onOrgUnitChange,
                onOrgUnitSearch,
                onOrgUnitsScrollEnd,
                onIncludeOrgUnitDescendantsChange,
            ]
        );

        return (
            <Container ref={containerRef}>
                <ObjectsList {...objectsListProps} onChangeSearch={undefined}>
                    {filterComponents}
                </ObjectsList>
            </Container>
        );
    }
);

const Container = styled.div`
    position: relative;
`;
