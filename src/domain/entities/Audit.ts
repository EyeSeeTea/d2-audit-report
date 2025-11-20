import { NamedRef, Ref } from "./Ref";

export type AuditProps = {
    id: string;
    created: string;
    modifiedBy?: string;
    auditType: string;
    value?: string;
    dataType: string; // Campo fijo que viene de la SQL view (ej: "dataValue")
    period?: Ref;
    organisationUnit?: NamedRef;
    attributeOptionCombo?: NamedRef;
    categoryOptionCombo?: NamedRef;
    dataElement?: NamedRef;
};

export class Audit {
    public readonly id: string;
    public readonly created: string;
    public readonly modifiedBy?: string;
    public readonly auditType: string;
    public readonly value?: string;
    public readonly dataType: string;
    public readonly period?: Ref;
    public readonly organisationUnit?: NamedRef;
    public readonly attributeOptionCombo?: NamedRef;
    public readonly categoryOptionCombo?: NamedRef;
    public readonly dataElement?: NamedRef;

    constructor(props: AuditProps) {
        this.id = props.id;
        this.created = props.created;
        this.modifiedBy = props.modifiedBy;
        this.auditType = props.auditType;
        this.value = props.value;
        this.dataType = props.dataType;
        this.period = props.period;
        this.organisationUnit = props.organisationUnit;
        this.attributeOptionCombo = props.attributeOptionCombo;
        this.categoryOptionCombo = props.categoryOptionCombo;
        this.dataElement = props.dataElement;
    }
}
