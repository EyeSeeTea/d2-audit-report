import { UserRepository } from "$/domain/repositories/UserRepository";
import { AuditD2Repository } from "./data/repositories/AuditD2Repository";
import { UserD2Repository } from "./data/repositories/UserD2Repository";
import { AuditRepository } from "./domain/repositories/AuditRepository";
import { GetAuditsUseCase } from "./domain/usecases/GetAuditsUseCase";
import { GetCurrentUserUseCase } from "./domain/usecases/GetCurrentUserUseCase";
import { D2Api } from "./types/d2-api";

export type CompositionRoot = ReturnType<typeof getCompositionRoot>;

type Repositories = {
    userRepository: UserRepository;
    auditRepository: AuditRepository;
};

function getCompositionRoot(repositories: Repositories) {
    return {
        users: {
            getCurrent: new GetCurrentUserUseCase(repositories),
        },
        audits: {
            getAll: new GetAuditsUseCase(repositories.auditRepository),
        },
    };
}

export function getWebappCompositionRoot(api: D2Api) {
    const repositories: Repositories = {
        userRepository: new UserD2Repository(api),
        auditRepository: new AuditD2Repository(api),
    };

    return getCompositionRoot(repositories);
}
