import { Audit, AuditProps } from "./Audit";
import { NamedRef, Ref } from "./Ref";

export type DataValueAuditProps = AuditProps & {
    period: Ref;
    organisationUnit: NamedRef;
    attributeOptionCombo: NamedRef;
    categoryOptionCombo: NamedRef;
    dataElement: NamedRef;
};

export class DataValueAudit extends Audit {
    public readonly period: Ref;
    public readonly organisationUnit: NamedRef;
    public readonly attributeOptionCombo: NamedRef;
    public readonly categoryOptionCombo: NamedRef;
    public readonly dataElement: NamedRef;

    constructor(props: DataValueAuditProps) {
        super(props);
        this.period = props.period;
        this.organisationUnit = props.organisationUnit;
        this.attributeOptionCombo = props.attributeOptionCombo;
        this.categoryOptionCombo = props.categoryOptionCombo;
        this.dataElement = props.dataElement;
    }
}
