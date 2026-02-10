import React, { useEffect, useMemo } from "react";
import { ObjectsList, useSnackbar } from "@eyeseetea/d2-ui-components";
import { useDhis2Audits } from "./useDhis2Audits";
import { usePaginationTextModifier } from "./usePaginationTextModifier";
import { GetAuditsUseCase } from "$/domain/usecases/GetAuditsUseCase";
import { GetAllUsersUseCase } from "$/domain/usecases/GetAllUsersUseCase";
import { AuditsFiltersComponent } from "$/webapp/components/dhis2-audits/AuditsFiltersComponent";
import styled from "styled-components";
import { Maybe } from "$/utils/ts-utils";

type Dhis2AuditsProps = {
    getAudits: GetAuditsUseCase;
    getAllUsers: GetAllUsersUseCase;
    excludedProgramId: Maybe<string>;
};

export const Dhis2Audits: React.FC<Dhis2AuditsProps> = React.memo(
    ({ getAudits, getAllUsers, excludedProgramId }) => {
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
            onStartDateChange,
            onEndDateChange,
            onUsernameChange,
            onDataTypeChange,
            onExcludeScriptLogsChange,
        } = useDhis2Audits(getAudits, getAllUsers, excludedProgramId);

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
                    selectedUsername={selectedUsername}
                    selectedDataType={selectedDataType}
                    excludeScriptLogs={excludeScriptLogs}
                    onStartDateChange={onStartDateChange}
                    onEndDateChange={onEndDateChange}
                    onUsernameChange={onUsernameChange}
                    onDataTypeChange={onDataTypeChange}
                    onExcludeScriptLogsChange={onExcludeScriptLogsChange}
                />
            ),
            [
                startDate,
                endDate,
                users,
                selectedUsername,
                selectedDataType,
                excludeScriptLogs,
                onStartDateChange,
                onEndDateChange,
                onUsernameChange,
                onDataTypeChange,
                onExcludeScriptLogsChange,
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
