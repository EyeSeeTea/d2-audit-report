export type AuditProps = {
    id: string;
    created: string;
    modifiedBy?: string;
    auditType: string;
    value?: string;
};

export class Audit {
    public readonly id: string;
    public readonly created: string;
    public readonly modifiedBy?: string;
    public readonly auditType: string;
    public readonly value?: string;

    constructor(props: AuditProps) {
        this.id = props.id;
        this.created = props.created;
        this.modifiedBy = props.modifiedBy;
        this.auditType = props.auditType;
        this.value = props.value;
    }
}
