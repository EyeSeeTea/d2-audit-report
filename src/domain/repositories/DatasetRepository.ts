import { FutureData } from "$/data/api-futures";
import { Dataset } from "$/domain/entities/Dataset";

export interface DatasetRepository {
    getAll(): FutureData<Dataset[]>;
}
