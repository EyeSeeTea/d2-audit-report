import { createMuiTheme, FormControl, InputLabel, MuiThemeProvider } from "@material-ui/core";
import cyan from "@material-ui/core/colors/cyan";
import React from "react";

export type DropdownItem<Value extends string = string> = { value: Value; text: string };

export interface DropdownFormProps {
    className?: string;
    label: string;
    disabled?: boolean;
    children: React.ReactNode;
}

export const DropdownForm: React.FC<DropdownFormProps> = React.memo(props => {
    const { className, label, children, disabled } = props;
    const materialTheme = getMaterialTheme();

    return (
        <MuiThemeProvider theme={materialTheme}>
            <FormControl className={className} disabled={disabled}>
                <InputLabel>{label}</InputLabel>
                {children}
            </FormControl>
        </MuiThemeProvider>
    );
});

const getMaterialTheme = () =>
    createMuiTheme({
        overrides: {
            MuiFormLabel: {
                root: {
                    color: "#aaaaaa",
                    "&$focused": {
                        color: "#aaaaaa",
                    },
                    top: "-9px !important",
                    marginLeft: 10,
                },
            },
            MuiInput: {
                root: {
                    marginLeft: 10,
                },
                formControl: {
                    minWidth: 200,
                    maxWidth: 200,
                    marginTop: "8px !important",
                },
                input: {
                    color: "#565656",
                },
                underline: {
                    "&&&&:hover:before": {
                        borderBottom: `1px solid #bdbdbd`,
                    },
                    "&:hover:not($disabled):before": {
                        borderBottom: `1px solid #aaaaaa`,
                    },
                    "&:after": {
                        borderBottom: `2px solid ${cyan["500"]}`,
                    },
                    "&:before": {
                        borderBottom: `1px solid #bdbdbd`,
                    },
                },
            },
        },
    });
