import { UserRepository } from "$/domain/repositories/UserRepository";
import { AuditD2Repository } from "./data/repositories/AuditD2Repository";
import { UserD2Repository } from "./data/repositories/UserD2Repository";
import { OrgUnitD2Repository } from "./data/repositories/OrgUnitD2Repository";
import { AuditRepository } from "./domain/repositories/AuditRepository";
import { OrgUnitRepository } from "./domain/repositories/OrgUnitRepository";
import { GetAuditsUseCase } from "./domain/usecases/GetAuditsUseCase";
import { GetCurrentUserUseCase } from "./domain/usecases/GetCurrentUserUseCase";
import { GetAllUsersUseCase } from "./domain/usecases/GetAllUsersUseCase";
import { GetOrgUnitsUseCase } from "./domain/usecases/GetOrgUnitsUseCase";
import { D2Api } from "./types/d2-api";
import { Maybe } from "$/utils/ts-utils";
import { D2LoggerAuditsConfig } from "$/types/D2LoggerAuditsConfig";

export type CompositionRoot = ReturnType<typeof getWebappCompositionRoot>;

type Repositories = {
    userRepository: UserRepository;
    auditRepository: AuditRepository;
    orgUnitRepository: OrgUnitRepository;
};

/**
 * Returns the composition root for the webapp.
 * This is used to access the repositories and use cases for the webapp.
 * @param api - The D2Api instance.
 * @returns The composition root for the webapp.
 */
export function getWebappCompositionRoot(api: D2Api) {
    const repositories = getRepositories(api);

    const orgUnitId = import.meta.env.VITE_D2LOGGER_ORG_UNIT;
    const programId = import.meta.env.VITE_D2LOGGER_PROGRAM;

    return {
        users: {
            getCurrent: new GetCurrentUserUseCase(repositories.userRepository),
            getAll: new GetAllUsersUseCase(repositories.userRepository),
        },
        audits: {
            getAll: new GetAuditsUseCase(repositories.auditRepository, repositories.userRepository),
            getD2LoggerAuditsConfig: (): Maybe<D2LoggerAuditsConfig> => {
                return orgUnitId && programId
                    ? { baseUrl: api.baseUrl, orgUnitId, programId }
                    : undefined;
            },
        },
        orgUnits: {
            get: new GetOrgUnitsUseCase(
                repositories.orgUnitRepository,
                repositories.userRepository
            ),
        },
    };
}

function getRepositories(api: D2Api): Repositories {
    return {
        userRepository: new UserD2Repository(api),
        auditRepository: new AuditD2Repository(api),
        orgUnitRepository: new OrgUnitD2Repository(api),
    };
}
