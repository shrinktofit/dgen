import React from 'react'
import * as refer from '@cocos/refer';
import { getModuleData } from '../../src/Data';
import { useRouter } from 'next/router';
import '../styles/Material.css';

const ModulePage = () => {
    const router = useRouter();
    const { mid } = router.query;

    const moduleData = getModuleData(mid as string);
    if (!moduleData) {
        return (<div>No such module {mid}</div>);
    }

    const functions: refer.FunctionTrait[] = [];
    const classes: refer.ClassTrait[] = [];
    const enums: refer.EnumTrait[] = [];

    for (const entity of moduleData.entities) {
        for (const trait of entity.traits) {
            if (trait.traitKind === 'function') {
                functions.push(trait);
            } else if (trait.traitKind === 'class') {
                classes.push(trait);
            } else if (trait.traitKind === 'enum') {
                enums.push(trait);
            }
        }
    }

    return (<div className="container">
        <h3> Module {`"${moduleData.url}"`} </h3>
        {(!classes || classes.length === 0) ? (<div></div>) : (
            <div>
                <h4>Classes</h4>
                <ul className="module-class-list">{classes.map((cls) => <li>
                    <a href={`/classes/${cls.entity.name}?module=${mid}`}>{ `${cls.entity.name}` }</a>
                </li>)}</ul>
            </div>
        )}

        {(!enums || enums.length === 0) ? (<div></div>) : (
            <div>
                <h4>Enumerations</h4>
                <ul className="module-class-list">{enums.map((e) => <li>
                    <a href={`/enums/${e.entity.name}?module=${mid}`}>{ `${e.entity.name}` }</a>
                </li>)}</ul>
            </div>
        )}

        {(!functions || functions.length === 0) ? (<div></div>) : (
            <div>
                <h4>Functions</h4>
                <ul className="module-function-list">{functions.map((fx) => <li>
                    <a href={`/functions/${fx.entity.name}?module=${mid}`}>{ `${fx.entity.name}` }</a>
                </li>)}</ul>
            </div>
        )}
    </div>);
};

export default ModulePage;