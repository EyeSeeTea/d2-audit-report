import React, { useEffect, useMemo } from "react";
import { ObjectsList, useSnackbar } from "@eyeseetea/d2-ui-components";
import { useAudits } from "./useAudits";
import { GetAuditsUseCase } from "$/domain/usecases/GetAuditsUseCase";
import { GetAllUsersUseCase } from "$/domain/usecases/GetAllUsersUseCase";
import { AuditsFiltersComponent } from "$/webapp/components/audits-table/AuditsFiltersComponent";

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
            users,
            onStartDateChange,
            onEndDateChange,
            onUsernameChange,
        } = useAudits(getAudits, getAllUsers);

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
                    onStartDateChange={onStartDateChange}
                    onEndDateChange={onEndDateChange}
                    onUsernameChange={onUsernameChange}
                />
            ),
            [
                startDate,
                endDate,
                users,
                selectedUsername,
                onStartDateChange,
                onEndDateChange,
                onUsernameChange,
            ]
        );

        return (
            <ObjectsList {...objectsListProps} onChangeSearch={undefined}>
                {filterComponents}
            </ObjectsList>
        );
    }
);
