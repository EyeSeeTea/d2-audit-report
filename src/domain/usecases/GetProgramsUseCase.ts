import { FutureData } from "$/data/api-futures";
import { Program } from "$/domain/entities/Program";
import { ProgramRepository } from "$/domain/repositories/ProgramRepository";

export class GetProgramsUseCase {
    constructor(private programRepository: ProgramRepository) {}

    public execute(): FutureData<Program[]> {
        return this.programRepository.getAll();
    }
}
