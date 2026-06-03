import { MenuItem, Select } from "@material-ui/core";
import React from "react";
import { DropdownForm } from "./GenericDropdown";
import { DropdownItem } from "./GenericDropdown";
import i18nModule from "$/utils/i18n";

export interface DropdownProps<Value extends string = string> {
    className?: string;
    items: DropdownItem[];
    onChange: (value: Value | undefined) => void;
    label?: string;
    value?: Value;
    hideEmpty?: boolean;
    disabled?: boolean;
    emptyLabel?: string;
}

interface SelectProps {
    className?: string;
    label?: string;
    children: React.ReactNode;
}

const SelectWrapper: React.FC<SelectProps> = React.memo(props => {
    const { className, label, children } = props;
    return label ? (
        <DropdownForm className={className} label={label}>
            {children}
        </DropdownForm>
    ) : (
        <div className={className}>{children}</div>
    );
});

export const Dropdown: React.FC<DropdownProps> = React.memo(props => {
    const { emptyLabel, items, value, onChange, label, hideEmpty, className, disabled } = props;

    const selectValue =
        value === undefined || !items.map(item => item.value).includes(value) ? "" : value;

    return (
        <SelectWrapper className={className} label={label}>
            <Select
                disabled={disabled}
                data-cy={label}
                value={selectValue}
                onChange={ev => onChange((ev.target.value as string) || undefined)}
                MenuProps={{
                    getContentAnchorEl: null,
                    anchorOrigin: { vertical: "bottom", horizontal: "left" },
                }}
            >
                {!hideEmpty && (
                    <MenuItem value={""}>{emptyLabel || i18nModule.t("<No value>")}</MenuItem>
                )}
                {items.map(item => (
                    <MenuItem key={item.value} value={item.value}>
                        {item.text}
                    </MenuItem>
                ))}
            </Select>
        </SelectWrapper>
    );
});
