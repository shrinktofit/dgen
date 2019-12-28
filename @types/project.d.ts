declare module "@cocos/refer" {
    export interface Project {
        name: string;
        modules: Module[];
        globals: Globals;
    }

    interface ENode<T extends string> {
        kind: T,
    }

    export interface Tag {

    }

    export interface Documentable {
        tags?: Record<string, string>;
    }

    export interface Module extends ENode<'module'> {
        url: string;
        members: NamespaceMember[];
    }

    export interface NamespaceTrait extends ENode<'namespace'>, Documentable, Nameable {
        members: NamespaceMember[];
    }

    export interface Globals extends ENode<'globals'> {
        members: NamespaceMember[];
    }

    export type NamespaceMember =
        | NamespaceTrait
        | VariableTrait
        | ClassTrait
        | InterfaceTrait
        | FunctionTrait
        | EnumTrait
        ;

    export interface Nameable {
        name: string;
    }

    interface VariableTrait extends ENode<'variable'>, Documentable, Nameable {

    }

    export interface ClassTrait extends ENode<'class'>, Documentable, Nameable {
        typeParameters?: TypeParameter[];
        members: Array<Method | Property | Accessor>;
        extends?: Array<Type>;
        implements?: Array<Type>;
    }

    export interface Method extends ENode<'method'>, Documentable, Nameable {
        name: string;
        typeParameters?: TypeParameter[];
        parameters: Parameter[];
        type?: Type;
    }

    export interface Property extends ENode<'property'>, Documentable, Nameable {
        name: string;
    }

    export interface Accessor extends ENode<'accessor'>, Documentable, Nameable {
        name: string;
    }

    export interface InterfaceTrait extends ENode<'interface'>, Documentable, Nameable {
    }

    export interface FunctionTrait extends ENode<'function'>, Documentable, Nameable {
        typeParameters?: TypeParameter[];
        parameters: Parameter[];
        type?: Type;
    }

    export interface EnumTrait extends ENode<'enum'>, Documentable, Nameable {
        enumerators: Array<{ } & Nameable & Documentable>;
    }

    export interface Parameter extends ENode<'parameter'>, Documentable, Nameable {
        type?: Type;
    }

    export interface TypeParameter extends ENode<'type-parameter'>, Documentable, Nameable {
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