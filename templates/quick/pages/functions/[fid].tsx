
import React from 'react';
import * as refer from '@cocos/refer';
import { getModuleData, getProject, findTrait } from '../../src/Data';
import { useRouter } from 'next/router';
import '../styles/Material.css';

function errorPage(message: string) {
    return (<div>
        {message}
    </div>);
}

const FunctionPage = () => {
    const router = useRouter();
    const { fid, module: moduleId, namespaces } = router.query;

    let functionTrait: refer.FunctionTrait;
    try {
        functionTrait = findTrait<refer.FunctionTrait>('function', fid as string, moduleId as string, namespaces as string);
    } catch (error) {
        return errorPage(error.toString());
    }

    return (
        <div className="container">

            <h3>
                {`${functionTrait.entity.name}(${functionTrait.parameters.map((param) => param.name).join(', ')})`}
            </h3>

            <div>
                {functionTrait.tags?.__untagged__}
            </div>

            {(!functionTrait.typeParameters || functionTrait.typeParameters.length === 0) ? (<div></div>) : (
                <div className="function-type-parameters">
                    <h4>Type Parameters</h4>
                    <ul>{functionTrait.typeParameters.map((typeParam) => <li>
                        <h5> { `${typeParam.name}` } </h5>
                    </li>)}</ul>
                </div>
            )}

            <h4 className="section-heading">Parameters</h4>
            <ul className="function-parameters">{functionTrait.parameters.map((param) => <li>
                <h5> { `${param.name}` } </h5>
                <div>
                    {param.tags?.param}
                </div>
            </li>)}</ul>

            <h4>Returns</h4>
            {functionTrait.tags?.returns}
        </div>
    );
};

export default FunctionPage;