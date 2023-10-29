import { ColDef } from 'ag-grid-community';
import { dates, products, Row, units } from './dataRow.ts';

export const columDefinitions: ColDef<Row>[] = [
    {
        headerName: 'Name',
        field: 'personName',
        resizable: true,
    },
    ...[...dates.values()].map(d => ({
        headerName: d.substring(0, 10),
        children: products.map(p => ({
            headerName: p.name,
            children: units.map(u => ({
                headerName: u.name,
                field: `${d.substring(0, 10)}_${p.id}_${u.id}`,
                width: 70,
                resizable: true,
                sortable: false,
            })),
        })),
    })),
];
