import React, { useEffect, useMemo } from "react";
import { ObjectsList, useSnackbar } from "@eyeseetea/d2-ui-components";
import { useAudits } from "./useAudits";
import { GetAuditsUseCase } from "$/domain/usecases/GetAuditsUseCase";
import { AuditsFiltersComponent } from "$/webapp/components/audits-table/AuditsFiltersComponent";

type AuditsTableContentProps = {
    getAudits: GetAuditsUseCase;
};

export const AuditsTableContent: React.FC<AuditsTableContentProps> = React.memo(({ getAudits }) => {
    const snackbar = useSnackbar();
    const { objectsListProps, error, startDate, endDate, onStartDateChange, onEndDateChange } =
        useAudits(getAudits);

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
                onStartDateChange={onStartDateChange}
                onEndDateChange={onEndDateChange}
            />
        ),
        [startDate, endDate, onStartDateChange, onEndDateChange]
    );

    return (
        <ObjectsList {...objectsListProps} onChangeSearch={undefined}>
            {filterComponents}
        </ObjectsList>
    );
});
