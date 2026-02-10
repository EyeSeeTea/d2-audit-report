import React, { useMemo, useState } from "react";
import styled from "styled-components";
import i18n from "$/utils/i18n";
import { DatePicker } from "@eyeseetea/d2-ui-components";
import { Moment } from "moment";
import { TextField } from "@material-ui/core";
import Autocomplete, { AutocompleteRenderInputParams } from "@material-ui/lab/Autocomplete";
import { User } from "$/domain/entities/User";
import { Dropdown } from "$/webapp/components/dropdown/Dropdown";
import { DropdownItem } from "$/webapp/components/dropdown/GenericDropdown";
import { Maybe } from "$/utils/ts-utils";

interface AuditsFiltersComponentProps {
    startDate: Date | null | undefined;
    endDate: Date | null | undefined;
    users: User[];
    selectedUsername: Maybe<string>;
    selectedDataType: Maybe<string>;
    onStartDateChange: (date: Date | null) => void;
    onEndDateChange: (date: Date | null) => void;
    onUsernameChange: (username: Maybe<string>) => void;
    onDataTypeChange: (dataType: Maybe<string>) => void;
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
            onUsernameChange(value?.username || undefined);
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
                    renderInput={(params: AutocompleteRenderInputParams) => {
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
    margin-top: 14px;
    flex-shrink: 0;

    /* Force styles with higher specificity for library usage */
    && .MuiAutocomplete-root {
        height: 40px !important;
    }

    && .MuiFormControl-root {
        height: 40px !important;
    }

    && .MuiInputLabel-root {
        top: -9px !important;
        margin-left: 10px !important;
        color: #aaaaaa !important;

        &.MuiInputLabel-shrink {
            color: #0000004d !important;
        }

        &.Mui-focused {
            color: #aaaaaa !important;
        }
    }

    && .MuiInputBase-root {
        height: 40px !important;
        margin-top: 0 !important;
        margin-left: 10px !important;
    }

    && .MuiInputBase-input {
        height: 40px !important;
        padding-top: 0 !important;
        padding-bottom: 0 !important;
    }
`;

const DropdownContainer = styled.div`
    margin-top: 14px;
`;
