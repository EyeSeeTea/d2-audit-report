import React, { useEffect } from "react";
import { ObjectsList, useSnackbar } from "@eyeseetea/d2-ui-components";
import { useAudits } from "./useAudits";
import { GetAuditsUseCase } from "$/domain/usecases/GetAuditsUseCase";

type AuditsTableContentProps = {
    getAudits: GetAuditsUseCase;
};

export const AuditsTableContent: React.FC<AuditsTableContentProps> = React.memo(({ getAudits }) => {
    const snackbar = useSnackbar();
    const { objectsListProps, error } = useAudits(getAudits);

    useEffect(() => {
        if (error) {
            snackbar.error(error);
        }
    }, [error, snackbar]);

    return <ObjectsList {...objectsListProps} />;
});
