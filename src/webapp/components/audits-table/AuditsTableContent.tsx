import React from "react";
import { ObjectsList } from "@eyeseetea/d2-ui-components";
import { useAudits } from "./useAudits";
import { GetAuditsUseCase } from "$/domain/usecases/GetAuditsUseCase";

type AuditsTableContentProps = {
    getAudits: GetAuditsUseCase;
};

export const AuditsTableContent: React.FC<AuditsTableContentProps> = React.memo(({ getAudits }) => {
    const objectsListProps = useAudits(getAudits);

    return <ObjectsList {...objectsListProps} />;
});
