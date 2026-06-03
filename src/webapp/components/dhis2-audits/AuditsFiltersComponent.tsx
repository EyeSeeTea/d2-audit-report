import React, { useMemo, useState } from "react";
import styled from "styled-components";
import i18n from "$/utils/i18n";
import { DatePicker } from "@eyeseetea/d2-ui-components";
import { Moment } from "moment";
import { Checkbox, CircularProgress, FormControlLabel, TextField } from "@material-ui/core";
import Autocomplete, { AutocompleteRenderInputParams } from "@material-ui/lab/Autocomplete";
import { User } from "$/domain/entities/User";
import { OrgUnit } from "$/domain/entities/OrgUnit";
import { Dropdown } from "$/webapp/components/dropdown/Dropdown";
import { DropdownItem } from "$/webapp/components/dropdown/GenericDropdown";
import { Maybe } from "$/utils/ts-utils";

interface AuditsFiltersComponentProps {
    startDate: Date | null | undefined;
    endDate: Date | null | undefined;
    users: User[];
    orgUnits: OrgUnit[];
    isLoadingOrgUnits: boolean;
    selectedUsername: Maybe<string>;
    selectedDataType: Maybe<string>;
    selectedOrgUnit: OrgUnit | null;
    includeOrgUnitDescendants: boolean;
    excludeScriptLogs: boolean;
    onStartDateChange: (date: Date | null) => void;
    onEndDateChange: (date: Date | null) => void;
    onUsernameChange: (username: Maybe<string>) => void;
    onDataTypeChange: (dataType: Maybe<string>) => void;
    onExcludeScriptLogsChange: (value: boolean) => void;
    onOrgUnitChange: (orgUnit: OrgUnit | null) => void;
    onOrgUnitSearch: (query: string) => void;
    onOrgUnitsScrollEnd: () => void;
    onIncludeOrgUnitDescendantsChange: (value: boolean) => void;
}

const LOADING_SENTINEL: OrgUnit = { id: "__loading__", name: "" };

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
    const [orgUnitInputValue, setOrgUnitInputValue] = useState<string>("");

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

    const handleOrgUnitChange = React.useCallback(
        (_event: React.ChangeEvent<{}>, value: OrgUnit | null) => {
            onOrgUnitChange(value);
        },
        [onOrgUnitChange]
    );

    const handleOrgUnitInputChange = React.useCallback(
        (_event: React.ChangeEvent<{}>, newInputValue: string) => {
            setOrgUnitInputValue(newInputValue);
            onOrgUnitSearch(newInputValue);
        },
        [onOrgUnitSearch]
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
            <AutocompleteContainer>
                <Autocomplete
                    id="org-unit-autocomplete"
                    options={
                        isLoadingOrgUnits && orgUnits.length > 0
                            ? [...orgUnits, LOADING_SENTINEL]
                            : orgUnits
                    }
                    getOptionLabel={(option: OrgUnit) =>
                        option.id === LOADING_SENTINEL.id ? "" : option.name
                    }
                    getOptionDisabled={(option: OrgUnit) => option.id === LOADING_SENTINEL.id}
                    filterOptions={(options: OrgUnit[]) => options}
                    renderOption={(option: OrgUnit) =>
                        option.id === LOADING_SENTINEL.id ? (
                            <OrgUnitLoaderItem>
                                <CircularProgress size={18} />
                            </OrgUnitLoaderItem>
                        ) : (
                            <span>{option.name}</span>
                        )
                    }
                    value={selectedOrgUnit}
                    inputValue={orgUnitInputValue}
                    onInputChange={handleOrgUnitInputChange}
                    onChange={handleOrgUnitChange}
                    style={{ width: 300 }}
                    ListboxProps={{
                        onScroll: (event: React.UIEvent<HTMLUListElement>) => {
                            if (isLoadingOrgUnits) return;
                            const el = event.currentTarget;
                            if (el.scrollTop + el.clientHeight >= el.scrollHeight - 5) {
                                onOrgUnitsScrollEnd();
                            }
                        },
                    }}
                    renderInput={(params: AutocompleteRenderInputParams) => (
                        <TextField
                            {...params}
                            label={i18n.t("Organisation Unit")}
                            variant="standard"
                        />
                    )}
                />
            </AutocompleteContainer>
            <CheckboxContainer>
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={includeOrgUnitDescendants}
                            disabled={!selectedOrgUnit}
                            onChange={e =>
                                onIncludeOrgUnitDescendantsChange(Boolean(e.target.checked))
                            }
                            color="primary"
                        />
                    }
                    label={i18n.t("Include descendants")}
                />
            </CheckboxContainer>
            <CheckboxContainer>
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={excludeScriptLogs}
                            onChange={e => onExcludeScriptLogsChange(Boolean(e.target.checked))}
                            color="primary"
                        />
                    }
                    label={i18n.t("Exclude script logs")}
                />
            </CheckboxContainer>
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

const OrgUnitLoaderItem = styled.div`
    display: flex;
    justify-content: center;
    padding: 8px 0;
    width: 100%;
`;

const CheckboxContainer = styled.div`
    margin-top: 18px;
    margin-left: 16px;
    display: flex;
    align-items: center;
`;
