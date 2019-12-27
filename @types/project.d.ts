
declare module "@cocos/refer" {
    export interface Project {
        name: string;
        modules: Module[];
        globals: Entity[];
    }

    export interface Tag {

    }

    export interface Documentable {
        tags?: Record<string, string>;
    }

    export interface Module {
        url: string;
        entities: Entity[];
    }

    export interface Entity extends Documentable {
        name?: string;
        traits: Array<ClassTrait | InterfaceTrait | FunctionTrait | EnumTrait | NamespaceTrait>;
    }

    interface EntityTrait extends Documentable {
        entity: Entity;
    }

    export interface ClassTrait extends EntityTrait {
        traitKind: 'class';
        typeParameters?: TypeParameter[];
        members: Array<Method | Property | Accessor>;
        extends?: Array<Type>;
        implements?: Array<Type>;
    }

    export interface Method extends Documentable {
        kind: 'method';
        name: string;
    }

    export interface Property extends Documentable {
        kind: 'property';
        name: string;
    }

    export interface Accessor extends Documentable {
        kind: 'accessor';
        name: string;
    }

    export interface InterfaceTrait extends EntityTrait {
        traitKind: 'interface';
    }

    export interface FunctionTrait extends EntityTrait {
        traitKind: 'function';
        typeParameters: TypeParameter[];
        parameters: Parameter[];
        type?: Type;
    }

    export interface EnumTrait extends EntityTrait {
        traitKind: 'enum';
        enumerators: Array<{
            name: string;
        } & Documentable>;
    }

    export interface NamespaceTrait extends EntityTrait {
        traitKind: 'namespace';
        entities: Entity[];
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
}