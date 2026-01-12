import React from "react";
import { Dhis2AuditsList } from "$/webapp/components/dhis2-audits/Dhis2AuditsList";
import { GetAllUsersUseCase } from "$/domain/usecases/GetAllUsersUseCase";
import { GetAuditsUseCase } from "$/domain/usecases/GetAuditsUseCase";

type AuditsContentProps = {
    getAudits: GetAuditsUseCase;
    getAllUsers: GetAllUsersUseCase;
};

export const AuditsContent: React.FC<AuditsContentProps> = React.memo(
    ({ getAudits, getAllUsers }) => {
        return <Dhis2AuditsList getAudits={getAudits} getAllUsers={getAllUsers} />;
    }
);
