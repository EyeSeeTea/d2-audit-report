export type AuditProps = {
    id: string;
    created: string;
    modifiedBy?: string;
    auditType: string;
    value?: string;
    dataType: string; // Campo fijo que viene de la SQL view (ej: "dataValue")
    related?: string; // Campo unificado con period, organisationUnit, dataElement, etc.
};

export class Audit {
    public readonly id: string;
    public readonly created: string;
    public readonly modifiedBy?: string;
    public readonly auditType: string;
    public readonly value?: string;
    public readonly dataType: string;
    public readonly related?: string;

    constructor(props: AuditProps) {
        this.id = props.id;
        this.created = props.created;
        this.modifiedBy = props.modifiedBy;
        this.auditType = props.auditType;
        this.value = props.value;
        this.dataType = props.dataType;
        this.related = props.related;
    }
}
