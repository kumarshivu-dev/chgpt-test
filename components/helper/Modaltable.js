import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material'
import React from 'react'
import Paper from '@mui/material/Paper';

const Modaltable = ({ firstTenRows }) => {
    return (


        <TableContainer component={Paper} sx={{ overflowX: "unset" }}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell sx={{ fontSize: '10px', padding: 0, textAlign: 'left', borderRight: '1px solid rgba(224, 224, 224, 1)' }}></TableCell>
                        {firstTenRows[0]?.map((column, index) => (
                            <TableCell key={index} sx={{ fontSize: '10px', textAlign: 'left', borderRight: '1px solid rgba(224, 224, 224, 1)', padding: 0 }} align="left">
                                {column}
                            </TableCell>
                        ))}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {firstTenRows.slice(1).map((row, rowIndex) => (
                        <TableRow key={rowIndex}>
                            <TableCell sx={{ minWidth: '50px', padding: 0, fontSize: '10px', textAlign: 'left', borderRight: '1px solid rgba(224, 224, 224, 1)', fontWeight: 'bold' }}>{rowIndex + 1}</TableCell>
                            {row.map((value, colIndex) => (
                                <TableCell key={colIndex} sx={{ minWidth: colIndex === 2 ? '400px' : colIndex === 0 ? '70px' : '100px', padding: 0, fontSize: '10px', textAlign: 'left', borderRight: '1px solid rgba(224, 224, 224, 1)', fontWeight: rowIndex === 0 && colIndex >= 0 ? 'bold' : 'normal', verticalAlign: 'top' }}>{value}</TableCell>
                            ))}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>



    )
}

export default Modaltable