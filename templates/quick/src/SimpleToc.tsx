import React from 'react';
import '../pages/styles/Material.css';

export function simpleToc(items: Array<{ key: any; value: any; }>) {
    return (<div>
        <table>
        {items.map((item) => <tr>
            <td> {item.key} </td>
            <td className="member-toc"> { item.value }  </td>
        </tr>)}
        </table>
    </div>);
}