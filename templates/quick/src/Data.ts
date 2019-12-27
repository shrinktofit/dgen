
import * as refer from '@cocos/refer';

const functionEntity: refer.Entity = {
    name: 'add',
    traits: [],
};
const functionTrait: refer.FunctionTrait = {
    traitKind: 'function',
    entity: functionEntity,
    typeParameters: [],
    parameters: [{
        name: 'lhs',
        tags: {
            param: 'Left operand',
        },
    }, {
        name: 'rhs',
        tags: {
            param: 'Right operand',
        },
    }],
    tags: {
        __untagged__: 'Add two number.',
        'returns': 'The sum.',
    },
};
functionEntity.traits.push(functionTrait);

const method1: refer.Method = {
    kind: 'method',
    name: 'getComponent()',
};

const classEntity: refer.Entity = {
    name: 'Node',
    traits: [],
};
const classTrait: refer.ClassTrait = {
    traitKind: 'class',
    entity: classEntity,
    members: [
        {kind: 'method', name: 'getComponent', tags: { '__untagged__': 'Get (the first) component.' }},
        {kind: 'method', name: 'getComponent', tags: { '__untagged__': 'Get all components.' }},
        {kind: 'method', name: 'addComponent', tags: { '__untagged__': 'Add a component.' }},
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
};
classEntity.traits.push(classTrait);

function decorate<T>(o: T, callback: (o: T) => void) {
    callback(o);
    return o;
};

const moduleData: refer.Module = {
    url: 'cc',
    entities: [
        functionEntity,
        classEntity,
        decorate<refer.Entity>({
            name: 'Pool',
            traits: [],
        }, (entity) => {
            entity.traits.push({
                traitKind: 'class',
                entity,
                members: [{
                    kind: 'method',
                    name: 'alloc',
                    tags: { __untagged__: 'Allocate a resource.' }
                }, {
                    kind: 'method',
                    name: 'free',
                    tags: { __untagged__: 'Free a resource.' }
                }],
                typeParameters: [{name: 'T'}, {name: 'U'}],
            });
        }),
        decorate<refer.Entity>({
            name: 'PixelFormat',
            traits: [],
        }, (entity) => {
            entity.traits.push({
                traitKind: 'enum',
                entity,
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
            });
        }),
    ],
};

const project: refer.Project = {
    name: 'Cocos Creator 3D',
    modules: [
        moduleData,
    ],
    globals: [],
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

    const entities = targetNamespace ? targetNamespace.entities : project.globals;
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