import { FutureData } from "$/data/api-futures";
import { OrgUnitsPage } from "$/domain/entities/OrgUnit";

export interface OrgUnitRepository {
    get(query: string, userOrgUnitIds: string[], page: number): FutureData<OrgUnitsPage>;
}
