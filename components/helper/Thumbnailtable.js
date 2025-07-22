import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material'
import React from 'react'
import Paper from '@mui/material/Paper';

const Thumbnailtable = ({firstTenRows}) => {
    return (
        <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell sx={{ fontSize: '3px', padding: 0, textAlign: 'left', borderRight: '1px solid rgba(224, 224, 224, 1)' }}></TableCell>
                        {firstTenRows[0]?.slice(0).map((column, index) => (
                            <TableCell key={index} sx={{ fontSize: '3px', textAlign: 'left', borderRight: '1px solid rgba(224, 224, 224, 1)', padding: 0 }} align="left">
                                {column}
                            </TableCell>
                        ))}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {firstTenRows.slice(1, 4).map((row, rowIndex) => (
                        <TableRow key={rowIndex}>
                            <TableCell sx={{ minWidth: '3px', padding: 0, fontSize: '3px', textAlign: 'left', borderRight: '1px solid rgba(224, 224, 224, 1)', fontWeight: 'bold' }}>{rowIndex + 1}</TableCell>
                            {row.slice(0).map((value, colIndex) => (
                                <TableCell key={colIndex} sx={{ minWidth: '3px', padding: 0, fontSize: '3px', textAlign: 'left', borderRight: '1px solid rgba(224, 224, 224, 1)', fontWeight: rowIndex === 0 && colIndex >= 0 ? 'bold' : 'normal' }}>{value}</TableCell>
                            ))}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    )
}

export default Thumbnailtable