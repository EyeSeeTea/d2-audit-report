import { FutureData } from "$/data/api-futures";
import { Dataset } from "$/domain/entities/Dataset";
import { DatasetRepository } from "$/domain/repositories/DatasetRepository";

export class GetDatasetsUseCase {
    constructor(private datasetRepository: DatasetRepository) {}

    public execute(): FutureData<Dataset[]> {
        return this.datasetRepository.getAll();
    }
}
