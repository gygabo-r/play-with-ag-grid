import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { AgGridReact } from 'ag-grid-react'; // the AG Grid React Component

import 'ag-grid-community/styles/ag-grid.css'; // Core grid CSS, always needed
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { getRows, Row } from '../data/dataRow.ts';
import { columDefintions } from '../data/columDefintions.ts';

const MyGrid: React.FC = () => {
    const gridRef = useRef<AgGridReact>(); // Optional - for accessing Grid's API
    const [rowData, setRowData] = useState<Row[]>([]); // Set rowData to Array of Objects, one Object per Row

    const defaultColDef = useMemo(
        () => ({
            sortable: true,
        }),
        []
    );

    useEffect(() => {
        setRowData(getRows());
    }, []);

    const buttonListener = useCallback(() => {
        gridRef.current?.api.deselectAll();
    }, []);

    return (
        <div>
            <button onClick={buttonListener}>Push Me</button>
            <div className="ag-theme-alpine" style={{ width: '95vw', height: '90vh' }}>
                <AgGridReact
                    // @ts-ignore
                    ref={gridRef} // Ref for accessing Grid's API
                    rowData={rowData} // Row Data for Rows
                    columnDefs={columDefintions} // Column Defs for Columns
                    defaultColDef={defaultColDef} // Default Column Properties
                    animateRows={false} // Optional - set to 'true' to have rows animate when sorted
                    // onCellClicked={cellClickedListener} // Optional - registering for Grid Event
                />
            </div>
        </div>
    );
};

export default MyGrid;
