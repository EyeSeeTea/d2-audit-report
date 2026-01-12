import React from "react";
import { PageHeader } from "$/webapp/components/page-header/PageHeader";
import { Audits } from "$/webapp/components/audits/Audits";
import i18n from "$/utils/i18n";
import styled from "styled-components";

export const AuditsPage: React.FC = React.memo(() => {
    return (
        <Container>
            <PageHeader title={i18n.t("Audit")} />
            <Audits />
        </Container>
    );
});

const Container = styled.div`
    padding: 20px;
`;
