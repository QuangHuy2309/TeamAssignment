import React, {Component} from 'react';
import "./HistoryTable.css";

export default function HistoryTable(props) {
    return (
        <div>
            <table className="tableHistory">
                <tr>
                    <th className="title-table">
                        Date
                    </th>
                    <th className="title-table">
                        Assigned to
                    </th>
                    <th className="title-table">
                        Assigned by
                    </th>
                    <th className="title-table">
                        Returned Date
                    </th>
                    <th></th>
                </tr>
                <tr>
                    {/*<td className="row-table"></td>*/}
                    {/*<td className="row-table"></td>*/}
                    {/*<td className="row-table"></td>*/}
                    {/*<td className="row-table"></td>*/}
                </tr>
            </table>
        </div>
    );
}


