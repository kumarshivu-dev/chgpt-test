import { Grid, Typography, TableContainer, Table, TableHead, TableBody, TableRow, TableCell, CircularProgress } from "@mui/material";
import axios from "axios";
import { getSession } from "next-auth/react";
import { useEffect, useState } from "react";
import "../../app/walmart-style.css";

const Feeds = ({ user }) => {
    // State variables for storing feed IDs and loader status
    const [ feedIds, setFeedIds ] = useState([]);
    const [ loader, setLoader ] = useState(true);

    // Effect hook to fetch feed history data when component mounts
    useEffect(()=> {
        axios.post(
            process.env.NEXT_PUBLIC_BASE_URL + "/feed-history",  // API endpoint for fetching feed history
            {
                "email": user.email
            },
            {
                headers: {
                    "Authorization": user.id_token  // Authorization header with user ID token
                }
            }
        ).then((res) => {
            setLoader(false);  // Set loader status to false when data is received
            setFeedIds(res.data.feed_ids);  // Set feed IDs retrieved from the API response
        })
    }, []) 

    return (
        <Grid className="feed-history">  {/* Container for feed history component */}
            <Typography variant="h3" className="feeds_title">  {/* Title for feed history */}
                History of Feed Ids
            </Typography>
            {feedIds.length !== 0 ?  //Conditional rendering based on feedIds and loader status
            (
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>
                                <Typography variant="h6">
                                    Feed Id
                                </Typography>
                            </TableCell>
                            <TableCell>
                                <Typography variant="h6">
                                    Timestamp
                                </Typography>
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {feedIds.map((feedId, index) => ( // Mapping over feedIds array to render each feed ID and timestamp
                        <TableRow key={index}>
                            <TableCell>
                                {feedId.feed_id}
                            </TableCell>
                            <TableCell>
                                {feedId.time}
                            </TableCell>
                        </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            )
            :
                loader === true ? 
                    (
                        <Grid className="feed-history-loader-div">
                            <CircularProgress />
                        </Grid>
                    )
                    :  //If loader status is false and feedIds array is empty, show message
                    (
                        <Typography className="no-feed-msg">No Feed IDs to Display</Typography>
                    )
            }
        </Grid>
    );
}

export default Feeds;

// Function to fetch server-side props (user session)
export async function getServerSideProps(context) {
    const session = await getSession(context);
    if (!session) {
        return {
          props: {}
        }
      }
    return {
      props: { user: session.user },
    };
}