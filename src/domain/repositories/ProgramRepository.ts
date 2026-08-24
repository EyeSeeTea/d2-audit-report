import { FutureData } from "$/data/api-futures";
import { Program } from "$/domain/entities/Program";

export interface ProgramRepository {
    getAll(): FutureData<Program[]>;
}
