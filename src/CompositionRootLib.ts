import { UserD2Repository } from "$/data/repositories/UserD2Repository";
import { UserRepository } from "$/domain/repositories/UserRepository";
import { GetAllUsersUseCase } from "$/domain/usecases/GetAllUsersUseCase";
import { AuditD2Repository } from "./data/repositories/AuditD2Repository";
import { AuditRepository } from "./domain/repositories/AuditRepository";
import { OrgUnitD2Repository } from "./data/repositories/OrgUnitD2Repository";
import { OrgUnitRepository } from "./domain/repositories/OrgUnitRepository";
import { DatasetD2Repository } from "./data/repositories/DatasetD2Repository";
import { DatasetRepository } from "./domain/repositories/DatasetRepository";
import { ProgramD2Repository } from "./data/repositories/ProgramD2Repository";
import { ProgramRepository } from "./domain/repositories/ProgramRepository";
import { GetAuditsUseCase } from "./domain/usecases/GetAuditsUseCase";
import { GetOrgUnitsUseCase } from "./domain/usecases/GetOrgUnitsUseCase";
import { GetDatasetsUseCase } from "./domain/usecases/GetDatasetsUseCase";
import { GetProgramsUseCase } from "./domain/usecases/GetProgramsUseCase";
import { D2Api } from "./types/d2-api";

export type CompositionRootLib = ReturnType<typeof getLibCompositionRoot>;

type Repositories = {
    userRepository: UserRepository;
    auditRepository: AuditRepository;
    orgUnitRepository: OrgUnitRepository;
    datasetRepository: DatasetRepository;
    programRepository: ProgramRepository;
};

/**
 * Returns the composition root for the library.
 * This is used to access the repositories and use cases for the library.
 * @param baseUrl - The base URL of the DHIS2 instance.
 * @returns The composition root for the library.
 */
export function getLibCompositionRoot(baseUrl: string) {
    const api = new D2Api({ baseUrl: baseUrl });

    const repositories = getRepositories(api);

    return {
        users: {
            getAll: new GetAllUsersUseCase(repositories.userRepository),
        },
        audits: {
            getAll: new GetAuditsUseCase(repositories.auditRepository, repositories.userRepository),
        },
        orgUnits: {
            search: new GetOrgUnitsUseCase(
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
