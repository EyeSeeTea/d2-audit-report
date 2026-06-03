import { FutureData } from "$/data/api-futures";
import { User } from "$/domain/entities/User";
import { UserRepository } from "$/domain/repositories/UserRepository";

export class GetAllUsersUseCase {
    constructor(private userRepository: UserRepository) {}

    public execute(): FutureData<User[]> {
        return this.userRepository.getAll();
    }
}
