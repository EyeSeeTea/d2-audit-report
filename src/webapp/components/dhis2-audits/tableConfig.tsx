import { Audit } from "$/domain/entities/Audit";
import i18n from "$/utils/i18n";
import { TableColumn, TableConfig } from "@eyeseetea/d2-ui-components";
import React from "react";
import styled from "styled-components";

const columns: TableColumn<Audit>[] = [
    {
        name: "created",
        text: i18n.t("Date"),
        sortable: false,
        getValue: row => (row.created ? row.created : "-"),
    },
    {
        name: "dataType",
        text: i18n.t("Data Type"),
        sortable: false,
        getValue: row => row.dataType || "-",
    },
    {
        name: "auditType",
        text: i18n.t("Type"),
        sortable: false,
    },

    {
        name: "value",
        text: i18n.t("Value"),
        sortable: false,
        getValue: row => row.value || "-",
    },
    {
        name: "modifiedBy",
        text: i18n.t("User"),
        sortable: false,
        getValue: row => row.modifiedBy || "-",
    },
    {
        name: "related",
        text: i18n.t("Related"),
        sortable: false,
        getValue: row => {
            if (!row.related) return "-";
            const lines = row.related
                .split("\n")
                .map((line: string) => line.trim())
                .filter((line: string) => line);

            return (
                <RelatedContainer>
                    {lines.map((line, index) => {
                        const colonIndex = line.indexOf(":");
                        if (colonIndex === -1) {
                            return (
                                <React.Fragment key={index}>
                                    {line}
                                    {index < lines.length - 1 && <br />}
                                </React.Fragment>
                            );
                        }
                        const label = line.substring(0, colonIndex + 1);
                        const value = line.substring(colonIndex + 1).trim();
                        return (
                            <React.Fragment key={index}>
                                <strong>{label}</strong> {value}
                                {index < lines.length - 1 && <br />}
                            </React.Fragment>
                        );
                    })}
                </RelatedContainer>
            );
        },
    },
];

const RelatedContainer = styled.div`
    white-space: pre-line;
    line-height: 1.6;
`;

export const tableConfig: TableConfig<Audit> = {
    columns,
    actions: [],
    paginationOptions: {
        pageSizeOptions: [10, 25, 50, 100],
        pageSizeInitialValue: 10,
        renderPosition: {
            bottom: false,
            top: true,
        },
    },
    initialSorting: {
        field: "created",
        order: "desc",
    },
};
