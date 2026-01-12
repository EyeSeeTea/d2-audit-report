import React, { useMemo, useState } from "react";
import styled from "styled-components";
import i18n from "$/utils/i18n";
import { DatePicker } from "@eyeseetea/d2-ui-components";
import { Moment } from "moment";
import { TextField } from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { User } from "$/domain/entities/User";
import { Dropdown } from "$/webapp/components/dropdown/Dropdown";
import { DropdownItem } from "$/webapp/components/dropdown/GenericDropdown";

interface AuditsFiltersComponentProps {
    startDate: Date | null | undefined;
    endDate: Date | null | undefined;
    users: User[];
    selectedUsername: string | null;
    selectedDataType: string | undefined;
    onStartDateChange: (date: Date | null) => void;
    onEndDateChange: (date: Date | null) => void;
    onUsernameChange: (username: string | null) => void;
    onDataTypeChange: (dataType: string | undefined) => void;
}

const dataTypeOptions: DropdownItem[] = [
    { value: "dataValue", text: "Data Value" },
    { value: "trackedEntityDataValue", text: "Tracked Entity Data Value" },
    { value: "trackedEntityAttributeValue", text: "Tracked Entity Attribute Value" },
    { value: "trackedEntityInstance", text: "Tracked Entity Instance" },
];

export const AuditsFiltersComponent: React.FC<AuditsFiltersComponentProps> = ({
    startDate,
    endDate,
    users,
    selectedUsername,
    selectedDataType,
    onStartDateChange,
    onEndDateChange,
    onUsernameChange,
    onDataTypeChange,
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

    const [inputValue, setInputValue] = useState<string>("");

    const selectedUser = useMemo(() => {
        if (!selectedUsername) return null;
        return users.find(user => user.username === selectedUsername) || null;
    }, [selectedUsername, users]);

    const handleUsernameChange = React.useCallback(
        (_event: React.ChangeEvent<{}>, value: User | null) => {
            onUsernameChange(value?.username || null);
        },
        [onUsernameChange]
    );

    const handleInputChange = React.useCallback(
        (_event: React.ChangeEvent<{}>, newInputValue: string) => {
            setInputValue(newInputValue);
        },
        []
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
            <DropdownContainer>
                <Dropdown
                    label={i18n.t("Data Type")}
                    items={dataTypeOptions}
                    value={selectedDataType}
                    onChange={onDataTypeChange}
                />
            </DropdownContainer>
            <AutocompleteContainer>
                <Autocomplete
                    id="user-autocomplete"
                    options={users}
                    getOptionLabel={(option: User) => `${option.name} (${option.username})`}
                    value={selectedUser}
                    inputValue={inputValue}
                    onInputChange={handleInputChange}
                    onChange={handleUsernameChange}
                    style={{ width: 300 }}
                    renderInput={(params: any) => {
                        return <TextField {...params} label={i18n.t("User")} variant="standard" />;
                    }}
                />
            </AutocompleteContainer>
        </PickersContainer>
    );
};

const PickersContainer = styled.div`
    display: flex;
    column-gap: 10px;
    margin-bottom: 8px;
    margin-left: 16px;
    flex-wrap: wrap;
    align-items: flex-start;
`;

const DatePickerContainer = styled.div`
    margin-top: -10px;
`;

const AutocompleteContainer = styled.div`
    min-width: 300px;
    max-width: 300px;
    margin-top: 6px;
    flex-shrink: 0;

    .MuiInputLabel-root.MuiInputLabel-shrink {
        color: #0000004d;
    }
`;

const DropdownContainer = styled.div`
    margin-top: 14px;
`;
