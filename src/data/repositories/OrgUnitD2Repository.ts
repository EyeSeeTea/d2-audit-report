import { OrgUnitsPage } from "$/domain/entities/OrgUnit";
import { OrgUnitRepository } from "$/domain/repositories/OrgUnitRepository";
import { D2Api } from "$/types/d2-api";
import { FutureData, apiToFuture } from "$/data/api-futures";
import { Future } from "$/domain/entities/generic/Future";

const PAGE_SIZE = 50;
const orgUnitFields = { id: true, name: true } as const;

export class OrgUnitD2Repository implements OrgUnitRepository {
    constructor(private api: D2Api) {}

    public get(query: string, userOrgUnitIds: string[], page: number): FutureData<OrgUnitsPage> {
        if (userOrgUnitIds.length === 0) {
            return Future.success({ orgUnits: [], hasMore: false });
        }

        const [firstId, ...rest] = userOrgUnitIds;
        if (!firstId) return Future.success({ orgUnits: [], hasMore: false });

        if (rest.length === 0) {
            return this.getSingleScope(query, firstId, page);
        } else {
            return this.getMultiScope(query, userOrgUnitIds, page);
        }
    }

    private getSingleScope(query: string, userOrgUnitId: string, page: number): FutureData<OrgUnitsPage> {
        const filter: Record<string, object> = { path: { like: `/${userOrgUnitId}` } };
        if (query) filter["name"] = { ilike: query };

        return apiToFuture(
            this.api.models.organisationUnits.get({
                fields: orgUnitFields,
                filter,
                page,
                pageSize: PAGE_SIZE,
                order: "name:asc",
            })
        ).map(response => ({
            orgUnits: response.objects,
            hasMore: response.pager.page < response.pager.pageCount,
        }));
    }

    // For multiple user org units: OR path filters server-side, name filter client-side
    // (DHIS2 filter API can't mix OR and AND in a single request)
    private getMultiScope(
        query: string,
        userOrgUnitIds: string[],
        page: number
    ): FutureData<OrgUnitsPage> {
        const pathFilter = userOrgUnitIds.map(id => ({ like: `/${id}` }));

        return apiToFuture(
            this.api.models.organisationUnits.get({
                fields: orgUnitFields,
                filter: { path: pathFilter },
                rootJunction: "OR",
                page,
                pageSize: PAGE_SIZE,
                order: "name:asc",
            })
        ).map(response => {
            let orgUnits = response.objects;
            if (query) {
                const q = query.toLowerCase();
                orgUnits = orgUnits.filter(ou => ou.name.toLowerCase().includes(q));
            }
            return {
                orgUnits,
                hasMore: response.pager.page < response.pager.pageCount,
            };
        });
    }
}
