
export interface Project {
    name: string;
    modules: Module[];
    globals: Entity[];
}

export interface Tag {

}

export interface Documentable {
    tags: Record<string, Tag>;
}

export interface Module {
    entities: Entity[];
}

export interface Entity extends Documentable {

}

export interface ClassTrait extends Documentable {

}

export interface InterfaceTrait extends Documentable {

}

export interface FunctionTrait extends Documentable {
    typeParameters: TypeParameter[];
    parameters: Parameter[];
    type?: Type;
}

export interface EnumTrait extends Documentable {

}

export interface NamespaceTrait extends Documentable {

}

export interface Property extends Documentable {

}

export interface Parameter extends Documentable {
    name: string;
    type?: Type;
}

export interface TypeParameter extends Documentable {
    name: string;
}

export type Type = ArrayType | TupleType | IntersectionType;

export interface ArrayType {
    element: Type;
}

export interface TupleType {
    elements: Type[];
}

export interface IntersectionType {
    left: Type;
    right: Type;
}

export const _ = 0;