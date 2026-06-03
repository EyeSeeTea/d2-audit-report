import React from "react";
import { Audits } from "$/webapp/components/audits/Audits";
import styled from "styled-components";

export const AuditsPage: React.FC = React.memo(() => {
    return (
        <Container>
            <Audits />
        </Container>
    );
});

const Container = styled.div`
    padding: 20px;
`;
