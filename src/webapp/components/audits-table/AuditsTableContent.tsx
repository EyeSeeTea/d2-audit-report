import React, { useEffect, useMemo } from "react";
import { ObjectsList, useSnackbar } from "@eyeseetea/d2-ui-components";
import { useAudits } from "./useAudits";
import { usePaginationTextModifier } from "./usePaginationTextModifier";
import { GetAuditsUseCase } from "$/domain/usecases/GetAuditsUseCase";
import { GetAllUsersUseCase } from "$/domain/usecases/GetAllUsersUseCase";
import { AuditsFiltersComponent } from "$/webapp/components/audits-table/AuditsFiltersComponent";
import styled from "styled-components";

type AuditsTableContentProps = {
    getAudits: GetAuditsUseCase;
    getAllUsers: GetAllUsersUseCase;
};

export const AuditsTableContent: React.FC<AuditsTableContentProps> = React.memo(
    ({ getAudits, getAllUsers }) => {
        const snackbar = useSnackbar();
        const {
            objectsListProps,
            error,
            startDate,
            endDate,
            selectedUsername,
            selectedDataType,
            users,
            onStartDateChange,
            onEndDateChange,
            onUsernameChange,
            onDataTypeChange,
        } = useAudits(getAudits, getAllUsers);

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
                    onStartDateChange={onStartDateChange}
                    onEndDateChange={onEndDateChange}
                    onUsernameChange={onUsernameChange}
                    onDataTypeChange={onDataTypeChange}
                />
            ),
            [
                startDate,
                endDate,
                users,
                selectedUsername,
                selectedDataType,
                onStartDateChange,
                onEndDateChange,
                onUsernameChange,
                onDataTypeChange,
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
