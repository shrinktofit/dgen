
import * as refer from '@cocos/refer';

const project: refer.Project = {
    name: 'Cocos Creator 3D',
    modules: [{
        kind: 'module',
        url: 'cc',
        members: [
            {
                kind: 'function',
                name: 'add',
                typeParameters: [],
                parameters: [{
                    kind: 'parameter',
                    name: 'lhs',
                    tags: {
                        param: 'Left operand',
                    },
                }, {
                    kind: 'parameter',
                    name: 'rhs',
                    tags: {
                        param: 'Right operand',
                    },
                }],
                tags: {
                    __untagged__: 'Add two number.',
                    'returns': 'The sum.',
                },
            },
            {
                kind: 'class',
                name: 'Node',
                members: [
                    {kind: 'method', name: 'getComponent', parameters: [], tags: { '__untagged__': 'Get (the first) component.' }},
                    {kind: 'method', name: 'getComponents', parameters: [], tags: { '__untagged__': 'Get all components.' }},
                    {kind: 'method', name: 'addComponent', parameters: [], tags: { '__untagged__': 'Add a component.' }},
                    {kind: 'property', name: 'name', tags: { '__untagged__': 'Node name.' } },
                ],
                tags: {
                    __untagged__: 'Scene graph',
                    description: `
    The basic unit of a scene graph, it:
    * contains references to parent or children node,
    * maintains one or more components and
    * has transformation in 3D space.
    `
                },
            },
            {
                kind: 'class',
                name: 'Pool',
                members: [{
                    kind: 'method',
                    name: 'alloc',
                    parameters: [], 
                    tags: { __untagged__: 'Allocate a resource.' }
                }, {
                    kind: 'method',
                    name: 'free',
                    parameters: [], 
                    tags: { __untagged__: 'Free a resource.' }
                }],
                typeParameters: [{ kind: 'type-parameter', name: 'T'}, { kind: 'type-parameter', name: 'U'}],
            },
            {
                kind: 'enum',
                name: 'PixelFormat',
                enumerators: [{
                    name: 'RGB8',
                    tags: { __untagged__: 'The pixel has 3 channel: R, G, B. Every channel is a 8 bits integer', }
                }, {
                    name: 'RGBA8',
                    tags: { __untagged__: 'The pixel has 4 channel: R, G, B, A. Every channel is a 8 bits integer', }
                }, {
                    name: 'RGBA32F',
                    tags: { __untagged__: 'The pixel has 4 channel: R, G, B, A. Every channel is a 32 bits IEEE floating number', }
                }],
                tags: {
                    '__untagged__': 'Describes the format of a pixel.'
                },
            }
        ],
    }],
    globals: {
        kind: 'globals',
        members: [],
    },
};

export function getModuleData(id: string) {
    return project.modules.find((m) => m.url === id);
}

export function getProject() {
    return project;
}

export function findTrait<Trait> (traitKind: 'function' | 'class' | 'enum', id: string, moduleId: string, namespaces: string): Trait {
    const project = getProject();

    let targetNamespace: undefined | refer.NamespaceTrait | refer.Module = project.modules.find((m) => m.url === moduleId);
    if (targetNamespace && namespaces) {
        const nss = (namespaces as string).split('.');
        for (const ns of nss) {
            const entity = targetNamespace.entities.find((e) => e.name === ns);
            if (!entity) {
                throw new Error(`Has no namespace ${ns}`);
            } else {
                const namespaceTrait = entity.traits.find((trait) => trait.traitKind === 'namespace');
                if (!namespaceTrait) {
                    throw new Error(`${ns} is not a namespace`);
                } else {
                    targetNamespace = namespaceTrait as refer.NamespaceTrait;
                }
            }
        }
    }

    const entities = targetNamespace ? targetNamespace.entities : project.globals.entities;
    const entity = entities.find((entity) => entity.name === id);
    if (!entity) {
        throw new Error(`Has no ${id} in current namespace/module/global, ${entities.map((e) => e.name)}`);
    }
    
    let trait = entity.traits.find((trait) => trait.traitKind === traitKind) as Trait | undefined;
    if (!trait) {
        throw new Error(`${id} is not a ${traitKind}`);
    }

    return trait;
}

export function getDescription(documentable: refer.Documentable) {
    return documentable.tags?.description ?? documentable.tags?.__untagged__ ?? '';
}

export function uniqueFindEntity(path: string, moduleId?: string) {
    const project = getProject();

    let root: refer.Globals | refer.Module | undefined;
    if (moduleId === undefined) {
        root = project.globals;
    } else {
        root = project.modules.find((m) => m.url === moduleId);
        if (!root) {
            throw new Error(`No such module: "${moduleId}"`);
        }
    }

    const segments = path.split('/');
    let currentNamespace:
        | refer.Globals
        | refer.Module
        | refer.NamespaceTrait
        | refer.ClassTrait
        | refer.EnumTrait
        | refer.VariableTrait
        = root;
    const nodeStack: Array<refer.Globals | refer.Module | refer.ClassTrait | refer.EnumTrait> = [];
    segments.forEach((segment, index) => {
        switch (currentNamespace.kind) {
            case 'globals':
            case 'module':
            case 'namespace':
                currentNamespace.members.find((member) => member.name === segment);
                break;
            case 'class':
                currentNamespace.members.find((member) => member.name === segment);
            case 'enum':
                break;
            case 'variable':
                break;
        }
    });
}