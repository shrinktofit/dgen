
import React from 'react';
import * as refer from '@cocos/refer';
import { getModuleData, getProject, findTrait } from '../../src/Data';
import { useRouter } from 'next/router';
import '../styles/Material.css';
import ReactMarkdown from 'react-markdown';
import { isOptionalOrEmptyArray } from '../../src/Utils';
import { simpleToc } from '../../src/SimpleToc';

function errorPage(message: string) {
    return (<div>
        {message}
    </div>);
}

function memberToc(members: refer.ClassTrait['members']) {
    return simpleToc(members.map((member) => ({ key: member.name, value: member.tags?.__untagged__ })));
}

export default () => {
    const router = useRouter();
    const { cid, module: moduleId, namespaces } = router.query;

    let classTrait: refer.ClassTrait;
    try {
        classTrait = findTrait<refer.ClassTrait>('class', cid as string, moduleId as string, namespaces as string);
    } catch (error) {
        return errorPage(error.toString());
    }
    
    return (
        <div className="container">
            <h3>
                {`${classTrait.entity.name}`} {
                    classTrait.typeParameters === undefined ?
                        null :
                        `<${classTrait.typeParameters.map((p) => p.name).join(', ')}>`
                }
            </h3>

            <div>
                <ReactMarkdown source={classTrait.tags?.description ?? classTrait.tags?.__untagged__ ?? ''} />
            </div>

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