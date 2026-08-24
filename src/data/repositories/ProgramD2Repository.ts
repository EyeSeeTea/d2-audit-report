import { Program } from "$/domain/entities/Program";
import { ProgramRepository } from "$/domain/repositories/ProgramRepository";
import { D2Api } from "$/types/d2-api";
import { apiToFuture, FutureData } from "$/data/api-futures";
import { InmemoryCache } from "$/data/common/InmemoryCache";

export class ProgramD2Repository implements ProgramRepository {
    private cache = new InmemoryCache();

    constructor(private api: D2Api) {}

    public getAll(): FutureData<Program[]> {
        return this.cache.getOrFuture("programs", () =>
            apiToFuture(
                this.api.models.programs.get({
                    fields: { id: true, displayName: true },
                    paging: false,
                    order: "displayName:asc",
                })
            ).map(response =>
                response.objects.map(d2Program => ({
                    id: d2Program.id,
                    name: d2Program.displayName,
                }))
            )
        );
    }
}
