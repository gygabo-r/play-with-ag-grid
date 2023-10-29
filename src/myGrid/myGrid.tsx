import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { AgGridReact } from 'ag-grid-react'; // the AG Grid React Component

import 'ag-grid-community/styles/ag-grid.css'; // Core grid CSS, always needed
import 'ag-grid-community/styles/ag-theme-alpine.css';

const MyGrid: React.FC = () => {
    const gridRef = useRef<AgGridReact>(); // Optional - for accessing Grid's API
    const [rowData, setRowData] = useState(); // Set rowData to Array of Objects, one Object per Row

    // Each Column Definition results in one Column.
    const [columnDefs] = useState([
        { field: 'make', filter: true },
        { field: 'model', filter: true },
        { field: 'price' },
    ]);

    const defaultColDef = useMemo(
        () => ({
            sortable: true,
        }),
        []
    );

    // const cellClickedListener = useCallback( event => {
    //     console.log('cellClicked', event);
    // }, []);

    // Example load data from server
    useEffect(() => {
        fetch('https://www.ag-grid.com/example-assets/row-data.json')
            .then(result => result.json())
            .then(rowData => setRowData(rowData));
    }, []);

    // Example using Grid's API
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
                    columnDefs={columnDefs} // Column Defs for Columns
                    defaultColDef={defaultColDef} // Default Column Properties
                    animateRows={false} // Optional - set to 'true' to have rows animate when sorted
                    // onCellClicked={cellClickedListener} // Optional - registering for Grid Event
                />
            </div>
        </div>
    );
};

export default MyGrid;
