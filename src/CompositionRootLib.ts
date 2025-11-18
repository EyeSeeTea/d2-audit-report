import { AuditD2Repository } from "./data/repositories/AuditD2Repository";
import { AuditRepository } from "./domain/repositories/AuditRepository";
import { GetAuditsUseCase } from "./domain/usecases/GetAuditsUseCase";
import { D2Api } from "./types/d2-api";

export type CompositionRootLib = ReturnType<typeof getLibCompositionRoot>;

type Repositories = {
    auditRepository: AuditRepository;
};

export function getLibCompositionRoot(baseUrl: string) {
    const api = new D2Api({ baseUrl: baseUrl });

    const repositories = getRepositories(api);

    return {
        audits: {
            getAll: new GetAuditsUseCase(repositories.auditRepository),
        },
    };
}

function getRepositories(api: D2Api): Repositories {
    return {
        auditRepository: new AuditD2Repository(api),
    };
}
