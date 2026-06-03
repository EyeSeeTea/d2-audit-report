import { Future } from "$/domain/entities/generic/Future";
import { FutureData } from "$/data/api-futures";

export class InmemoryCache {
    private cache: Map<string, unknown> = new Map();

    getOrFuture<T>(cacheKey: string, getFuture: () => FutureData<T>): FutureData<T> {
        if (this.cache.has(cacheKey)) {
            return Future.success(this.cache.get(cacheKey) as T);
        }
        return getFuture().map(data => {
            this.cache.set(cacheKey, data);
            return data;
        });
    }

    clear(): void {
        this.cache.clear();
    }
}
