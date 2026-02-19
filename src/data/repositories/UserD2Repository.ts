import { User } from "$/domain/entities/User";
import { UserRepository } from "$/domain/repositories/UserRepository";
import { D2Api, MetadataPick } from "$/types/d2-api";
import { apiToFuture, FutureData } from "$/data/api-futures";

export class UserD2Repository implements UserRepository {
    constructor(private api: D2Api) {}

    public getCurrent(): FutureData<User> {
        return apiToFuture(
            this.api.currentUser.get({
                fields: userFieldsWithOrgUnits,
            })
        ).map(d2User => this.buildUser(d2User));
    }

    public getAll(): FutureData<User[]> {
        return apiToFuture(
            this.api.models.users.get({
                fields: userFieldsBase,
                paging: false,
                order: "displayName:asc",
            })
        ).map(response =>
            response.objects.map(d2User => this.buildUser({ ...d2User, organisationUnits: [] }))
        );
    }

    private buildUser(d2User: D2User) {
        return new User({
            id: d2User.id,
            name: d2User.displayName,
            userGroups: d2User.userGroups,
            orgUnits: d2User.organisationUnits || [],
            ...d2User.userCredentials,
        });
    }
}

const userFieldsBase = {
    id: true,
    displayName: true,
    userGroups: { id: true, name: true },
    userCredentials: {
        username: true,
        userRoles: { id: true, name: true, authorities: true },
    },
} as const;

const userFieldsWithOrgUnits = {
    ...userFieldsBase,
    organisationUnits: { id: true, name: true },
} as const;

type D2User = MetadataPick<{ users: { fields: typeof userFieldsWithOrgUnits } }>["users"][number];
