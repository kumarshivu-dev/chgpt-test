import { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Alert, Box, Button, Grid, Typography } from '@mui/material';
import Image from 'next/image';

// import { getSession } from 'next-auth/react';
// import { useSearchParams } from 'next/navigation'



const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: theme.palette.common.black,
        color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 14,
    },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.action.hover,
    },
    // hide last border
    '&:last-child td, &:last-child th': {
        border: 0,
    },
}));


export default function ThankyouTemplate({ user }) {
    const router = useRouter();
    const { plan, amount, transaction, paynum } = router.query;

    console.log("aaa", transaction);
    const cleanedPlan = plan ? plan.replace(/%/g, '') : null;
    const cleanedAmount = amount ? amount.replace(/%/g, '') : null;
    const cleanedTransaction = transaction ? transaction.replace(/%/g, '') : null;
    const cleanedPaynum = paynum ? paynum.replace(/%/g, '') : null;
    console.log(cleanedPlan, cleanedAmount, cleanedTransaction, cleanedPaynum);



    return (
        <Box mt={5}>
            <Grid container spacing={2} justifyContent={"center"}>
                <Grid item xs={12} textAlign="center">
                    <Image src="/standalone-logo.png" width="204" height="34" alt='logo'></Image>
                </Grid>
                <Grid item xs={6}>
                    <Alert severity="success" sx={{ margin: "10px 0px 10px 0px" }}>Payment Success <br />Thank you, your payment of {cleanedAmount} has been processed. Your "{cleanedPlan}" subscription is active immediately. </Alert>
                    <TableContainer component={Paper}>
                        <Table aria-label="customized table">
                            <TableBody>
                                <StyledTableRow>
                                    <StyledTableCell align="left">Plan Name</StyledTableCell>
                                    <StyledTableCell align="right">{cleanedPlan ? cleanedPlan : ""}</StyledTableCell>
                                </StyledTableRow>
                                <StyledTableRow>
                                    <StyledTableCell align="left">Payment Amount</StyledTableCell>
                                    <StyledTableCell align="right">{cleanedAmount ? cleanedAmount : ""}</StyledTableCell>
                                </StyledTableRow>
                                <StyledTableRow>
                                    <StyledTableCell align="left">Transaction Id</StyledTableCell>
                                    <StyledTableCell align="right">{cleanedTransaction ? cleanedTransaction : ""}</StyledTableCell>
                                </StyledTableRow>
                                <StyledTableRow>
                                    <StyledTableCell align="left">Payment Number</StyledTableCell>
                                    <StyledTableCell align="right">{cleanedPaynum ? cleanedPaynum : ""}</StyledTableCell>
                                </StyledTableRow>
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <Typography my={4}>If you have any problems, please contact <Link href="mailto:finance@zorang.com">finance@zorang.com.</Link></Typography>
                    <Typography>
                        <Link href="/login/"><Button size={"small"}
                            variant="contained">Upload Products</Button></Link>
                    </Typography>
                </Grid>
            </Grid>
        </Box>

    );
}

// export async function getServerSideProps(context) {
//     const session = await getSession(context);
//     if (!session) {
//         return {
//             props: {}
//         }
//     }
//     const { user } = session;
//     return {
//         props: { user },
//     }
// }