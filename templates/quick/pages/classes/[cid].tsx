
import React from 'react';
import * as refer from '@cocos/refer';
import { getModuleData, getProject, findTrait, getDescription } from '../../src/Data';
import { useRouter } from 'next/router';
import '../styles/Material.css';
import { isOptionalOrEmptyArray } from '../../src/Utils';
import { simpleToc } from '../../src/SimpleToc';
import DescriptionText from '../../src/DescriptionText';

function errorPage(message: string) {
    return (<div>
        {message}
    </div>);
}

function memberToc(members: refer.Class['members']) {
    return simpleToc(members.map((member) => ({ key: member.name, value: member.tags?.__untagged__ })));
}

export default () => {
    const router = useRouter();
    const { cid, module: moduleId, namespaces } = router.query;

    let classTrait: refer.Class;
    try {
        classTrait = findTrait<refer.Class>('class', cid as string, moduleId as string, namespaces as string);
    } catch (error) {
        return errorPage(error.toString());
    }
    
    return (
        <div className="container">
            <h3>
                {`${classTrait.parent.name}`} {
                    classTrait.typeParameters === undefined ?
                        null :
                        `<${classTrait.typeParameters.map((p) => p.name).join(', ')}>`
                }
            </h3>

            <DescriptionText source={getDescription(classTrait)} />

            {isOptionalOrEmptyArray(classTrait.typeParameters) ? (<div></div>) :
                (<div className="function-type-parameters">
                    <h4>Type Parameters</h4>
                    <ul>{classTrait.typeParameters.map((typeParam) => <li>
                        <h5> { `${typeParam.name}` } </h5>
                    </li>)}</ul>
                </div>)
            }

            {(() => {
                const properties = classTrait.members.filter((member) => member.kind === 'property');
                return isOptionalOrEmptyArray(properties) ? (<div></div>) : (<div>
                        <h4> Properties </h4>
                        { memberToc(properties) }
                </div>);
            })()}

            {(() => {
                const methods = classTrait.members.filter((member) => member.kind === 'method');
                return isOptionalOrEmptyArray(methods) ? (<div></div>) : (<div>
                    <h4> Methods </h4>
                    { memberToc(methods) }
            </div>);
            })()}
        </div>
    );
};