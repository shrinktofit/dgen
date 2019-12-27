
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
    return (<div>
        <table>
        {members.map((member) => <tr>
            <td> {member.name} </td>
            <td className="member-toc"> { member.tags?.__untagged__ }  </td>
        </tr>)}
        </table>
    </div>);
}

export default () => {
    const router = useRouter();
    const { id, module: moduleId, namespaces } = router.query;

    let enumTrait: refer.EnumTrait;
    try {
        enumTrait = findTrait<refer.EnumTrait>('enum', id as string, moduleId as string, namespaces as string);
    } catch (error) {
        return errorPage(error.toString());
    }
    
    return (
        <div className="container">
            <h3>
                {`${enumTrait.entity.name}`}
            </h3>

            <h4>
                Constants
            </h4>
            {simpleToc(enumTrait.enumerators.map((e) => ({ key: e.name, value: e.tags?.__untagged__ })))}
        </div>
    );
};