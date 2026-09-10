import { UserRepository } from "$/domain/repositories/UserRepository";
import { AuditD2Repository } from "./data/repositories/AuditD2Repository";
import { UserD2Repository } from "./data/repositories/UserD2Repository";
import { OrgUnitD2Repository } from "./data/repositories/OrgUnitD2Repository";
import { DatasetD2Repository } from "./data/repositories/DatasetD2Repository";
import { ProgramD2Repository } from "./data/repositories/ProgramD2Repository";
import { AuditRepository } from "./domain/repositories/AuditRepository";
import { OrgUnitRepository } from "./domain/repositories/OrgUnitRepository";
import { DatasetRepository } from "./domain/repositories/DatasetRepository";
import { ProgramRepository } from "./domain/repositories/ProgramRepository";
import { GetAuditsUseCase } from "./domain/usecases/GetAuditsUseCase";
import { GetCurrentUserUseCase } from "./domain/usecases/GetCurrentUserUseCase";
import { GetAllUsersUseCase } from "./domain/usecases/GetAllUsersUseCase";
import { GetOrgUnitsUseCase } from "./domain/usecases/GetOrgUnitsUseCase";
import { GetDatasetsUseCase } from "./domain/usecases/GetDatasetsUseCase";
import { GetProgramsUseCase } from "./domain/usecases/GetProgramsUseCase";
import { D2Api } from "./types/d2-api";
import { Maybe } from "$/utils/ts-utils";
import { D2LoggerAuditsConfig } from "$/types/D2LoggerAuditsConfig";

export type CompositionRoot = ReturnType<typeof getWebappCompositionRoot>;

type Repositories = {
    userRepository: UserRepository;
    auditRepository: AuditRepository;
    orgUnitRepository: OrgUnitRepository;
    datasetRepository: DatasetRepository;
    programRepository: ProgramRepository;
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
        datasets: {
            getAll: new GetDatasetsUseCase(repositories.datasetRepository),
        },
        programs: {
            getAll: new GetProgramsUseCase(repositories.programRepository),
        },
    };
}

function getRepositories(api: D2Api): Repositories {
    return {
        userRepository: new UserD2Repository(api),
        auditRepository: new AuditD2Repository(api),
        orgUnitRepository: new OrgUnitD2Repository(api),
        datasetRepository: new DatasetD2Repository(api),
        programRepository: new ProgramD2Repository(api),
    };
}
