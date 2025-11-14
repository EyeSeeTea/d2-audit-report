import React from "react";
import { ObjectsList } from "@eyeseetea/d2-ui-components";
import { useAudits } from "./useAudits";

export const AuditsTable: React.FC = React.memo(() => {
    const objectsListProps = useAudits();

    return <ObjectsList {...objectsListProps} />;
});
