import React from "react";
import styled from "styled-components";
import i18n from "$/utils/i18n";
import { DatePicker } from "@material-ui/pickers";
import { DateTime } from "luxon";

interface AuditsFiltersComponentProps {
    startDate: Date | null | undefined;
    endDate: Date | null | undefined;
    onStartDateChange: (date: Date | null) => void;
    onEndDateChange: (date: Date | null) => void;
}

export const AuditsFiltersComponent: React.FC<AuditsFiltersComponentProps> = ({
    startDate,
    endDate,
    onStartDateChange,
    onEndDateChange,
}) => {
    const handleStartDateChange = React.useCallback(
        (date: DateTime | null) => {
            onStartDateChange(date ? date.toJSDate() : null);
        },
        [onStartDateChange]
    );

    const handleEndDateChange = React.useCallback(
        (date: DateTime | null) => {
            onEndDateChange(date ? date.toJSDate() : null);
        },
        [onEndDateChange]
    );

    const startDateValue = startDate ? DateTime.fromJSDate(startDate) : null;
    const endDateValue = endDate ? DateTime.fromJSDate(endDate) : null;

    return (
        <PickersContainer>
            <DatePicker
                format="yyyy-MM-dd"
                label={i18n.t("Start Date")}
                value={startDateValue}
                onChange={handleStartDateChange}
                clearable
            />
            <DatePicker
                format="yyyy-MM-dd"
                label={i18n.t("End Date")}
                value={endDateValue}
                onChange={handleEndDateChange}
                clearable
            />
        </PickersContainer>
    );
};

const PickersContainer = styled.div`
    display: flex;
    column-gap: 10px;
    margin-bottom: 8px;
    margin-left: 16px;
`;
