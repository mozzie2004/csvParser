import React from 'react';
import { Table } from 'react-bootstrap';

const TableData = ({ titles, data }) => {

    return (
        <Table variant='dark' className="mt-5" striped bordered hover>
            <thead>
                <tr>
                    <th>ID</th>
                    {
                        titles ? titles.map((item, i) => (<th key={i}>{item}</th>)) : ''
                    }
                    <th>Duplicate with</th>
                </tr>
            </thead>
            <tbody>
                {
                    data ? data.map((item, i) => {
                        const dubl = Math.min(...item.filter(ar => ar.dublicateIndex).map(it => it.dublicateIndex));
                        return (
                            <tr key={i + 1}>
                                <td>{i + 1}</td>
                                {
                                    item.map((el, j) => {
                                        const clazz = el.valid ? '' : 'bg-danger';
                                        return <td className={clazz} key={j}>{el.value}</td>
                                    })
                                }
                                <td>{isFinite(dubl) ? dubl : ''}</td>
                            </tr>
                        )
                    }) : null
                }
            </tbody>
        </Table>
    )
}

export default TableData;