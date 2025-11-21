import { UserRepository } from "$/domain/repositories/UserRepository";
import { AuditD2Repository } from "./data/repositories/AuditD2Repository";
import { UserD2Repository } from "./data/repositories/UserD2Repository";
import { AuditRepository } from "./domain/repositories/AuditRepository";
import { GetAuditsUseCase } from "./domain/usecases/GetAuditsUseCase";
import { GetCurrentUserUseCase } from "./domain/usecases/GetCurrentUserUseCase";
import { GetAllUsersUseCase } from "./domain/usecases/GetAllUsersUseCase";
import { D2Api } from "./types/d2-api";

export type CompositionRoot = ReturnType<typeof getWebappCompositionRoot>;

type Repositories = {
    userRepository: UserRepository;
    auditRepository: AuditRepository;
};

/**
 * Returns the composition root for the webapp.
 * This is used to access the repositories and use cases for the webapp.
 * @param baseUrl - The base URL of the DHIS2 instance.
 * @returns The composition root for the webapp.
 */
export function getWebappCompositionRoot(api: D2Api) {
    const repositories = getRepositories(api);

    return {
        users: {
            getCurrent: new GetCurrentUserUseCase(repositories),
            getAll: new GetAllUsersUseCase(repositories),
        },
        audits: {
            getAll: new GetAuditsUseCase(repositories.auditRepository),
        },
    };
}

function getRepositories(api: D2Api): Repositories {
    return {
        userRepository: new UserD2Repository(api),
        auditRepository: new AuditD2Repository(api),
    };
}
