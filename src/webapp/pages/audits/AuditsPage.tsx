import React from "react";
import { PageHeader } from "$/webapp/components/page-header/PageHeader";
import { AuditsTable } from "$/webapp/components/audits-table/AuditsTable";
import i18n from "$/utils/i18n";
import styled from "styled-components";

export const AuditsPage: React.FC = React.memo(() => {
    return (
        <Container>
            <PageHeader title={i18n.t("Audit")} />
            <AuditsTable />
        </Container>
    );
});

const Container = styled.div`
    padding: 20px;
`;
