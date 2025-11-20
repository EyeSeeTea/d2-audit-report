import React from "react";
import styled from "styled-components";
import i18n from "$/utils/i18n";
import { DatePicker } from "@eyeseetea/d2-ui-components";
import { Moment } from "moment";

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
        (dateM: Moment | null) => {
            const date = dateM?.toDate() || null;
            onStartDateChange(date);
        },
        [onStartDateChange]
    );

    const handleEndDateChange = React.useCallback(
        (dateM: Moment | null) => {
            const date = dateM?.toDate() || null;
            onEndDateChange(date);
        },
        [onEndDateChange]
    );

    return (
        <PickersContainer>
            <DatePickerContainer>
                <DatePicker
                    label={i18n.t("Start Date")}
                    value={startDate || null}
                    onChange={handleStartDateChange}
                />
            </DatePickerContainer>
            <DatePickerContainer>
                <DatePicker
                    label={i18n.t("End Date")}
                    value={endDate || null}
                    onChange={handleEndDateChange}
                />
            </DatePickerContainer>
        </PickersContainer>
    );
};

const PickersContainer = styled.div`
    display: flex;
    column-gap: 10px;
    margin-bottom: 8px;
    margin-left: 16px;
`;

const DatePickerContainer = styled.div`
    margin-top: -10px;
`;
