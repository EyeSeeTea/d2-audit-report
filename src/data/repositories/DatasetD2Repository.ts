import { Dataset } from "$/domain/entities/Dataset";
import { DatasetRepository } from "$/domain/repositories/DatasetRepository";
import { D2Api } from "$/types/d2-api";
import { apiToFuture, FutureData } from "$/data/api-futures";
import { InmemoryCache } from "$/data/common/InmemoryCache";

export class DatasetD2Repository implements DatasetRepository {
    private cache = new InmemoryCache();

    constructor(private api: D2Api) {}

    public getAll(): FutureData<Dataset[]> {
        return this.cache.getOrFuture("datasets", () =>
            apiToFuture(
                this.api.models.dataSets.get({
                    fields: { id: true, displayName: true },
                    paging: false,
                    order: "displayName:asc",
                })
            ).map(response =>
                response.objects.map(d2Dataset => ({ id: d2Dataset.id, name: d2Dataset.displayName }))
            )
        );
    }
}
