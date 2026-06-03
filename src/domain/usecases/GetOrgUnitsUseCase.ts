import { FutureData } from "$/data/api-futures";
import { OrgUnitsPage } from "$/domain/entities/OrgUnit";
import { OrgUnitRepository } from "$/domain/repositories/OrgUnitRepository";
import { UserRepository } from "$/domain/repositories/UserRepository";

export class GetOrgUnitsUseCase {
    constructor(
        private orgUnitRepository: OrgUnitRepository,
        private userRepository: UserRepository
    ) {}

    public execute(query: string, page = 1): FutureData<OrgUnitsPage> {
        return this.userRepository.getCurrent().flatMap(user => {
            const userOrgUnitIds = user.orgUnits.map(ou => ou.id);
            return this.orgUnitRepository.get(query, userOrgUnitIds, page);
        });
    }
}
