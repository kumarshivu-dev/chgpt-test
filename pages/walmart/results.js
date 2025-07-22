import { useState, useCallback, useEffect } from "react";
import Progress from "../../components/walmart/Progress";
import { Typography, Grid, Paper, Button, Box } from "@mui/material";
import { styled } from "@mui/material/styles";
import ArrowForwardOutlinedIcon from "@mui/icons-material/ArrowForwardOutlined";
import ProductTable from "../../components/walmart/ProductTable";
import Image from "next/image";
import { useRouter } from "next/router";
import { getSession } from "next-auth/react";
import axios from "axios";
import {
  setFilterResultsData,
  setResultsData,
} from "../../store/walmart/productTableSlice";
import { useDispatch, useSelector } from "react-redux";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: "transparent",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
  boxShadow: "none",
}));

function useResultsCustomState() {
  const [dataSelected, setDataSelected] = useState([]);

  const handleRowSelectionChange = useCallback((selectedRows) => {
    setDataSelected(selectedRows);
  }, []);

  return {
    dataSelected,
    handleRowSelectionChange,
  };
}

export default function ResultPage({ user, task_id }) {
  const dispatch = useDispatch();
  const router = useRouter();
  const { dataSelected, handleRowSelectionChange } = useResultsCustomState();

  const handleSync = () => {
    router.push({
      pathname: "/walmart/sync",
    });
  };

  async function getGenerationResults() {
    try {
      const config = {
        headers: {
          Authorization: user.id_token,
        },
      };
      const response = await axios.get(
        process.env.NEXT_PUBLIC_WALMART_BASE_URL + "/wal-generate-ai/result",
        {
          params: {
            task_id: task_id,
          },
          headers: config.headers
        }
      );

      if (response.status === 200) {
        console.log("response walmart :", response);
        dispatch(setResultsData(response?.data?.itemList));
        dispatch(setFilterResultsData(response?.data?.itemList));
      } else {
      }
    } catch (error) {
      console.error("Error while Generating Results", error);
    }
  }

  useEffect(() => {
    getGenerationResults();
  }, []);

  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        <Progress active={3} />
        {/* Enhancement Header */}
        <Grid
          container
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
          }}
          spacing={3}
        >
          <Grid item xs={12} sm={12} md={4} marginTop={2}>
            <Item>
              <Typography className="content" variant="h3">
                Product Enhancement Results
              </Typography>
              <Typography variant="p">
                Review and edit generated descriptions and features. Choose
                items to sync to Walmart.
              </Typography>
            </Item>
          </Grid>
          <Grid item xs={12} sm={12} md={4}>
            <Item
              sx={{
                display: "flex",
                justifyContent: { xs: "center", md: "flex-end" },
                alignItems: "center",
              }}
            >
              <Button
                style={{ borderRadius: "5px", color: "#FFFFFF" }}
                size="small"
                variant="contained"
                onClick={handleSync}
                disabled={dataSelected.length === 0}
                endIcon={<ArrowForwardOutlinedIcon />}
              >
                Sync
              </Button>
            </Item>
          </Grid>
          <ProductTable
            resultsPage={true}
            isReadOnly={false}
            onRowSelectionChange={handleRowSelectionChange}
            email={user.email}
          />

          <Grid item xs={12} sm={12} md={4}>
            <Item
              sx={{
                display: "flex",
                justifyContent: { xs: "center", md: "flex-end" },
                alignItems: "center",
              }}
            >
              <Typography
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginRight: "8px",
                }}
              >
                Sync to
              </Typography>
              <Image
                alt="img"
                src="/walmart/Walmart_logo.png"
                width="105"
                height="20"
                style={{ marginRight: "8px" }}
              />
              <Button
                style={{ borderRadius: "5px", color: "#FFFFFF" }}
                size="small"
                disabled={dataSelected.length === 0}
                variant="contained"
                onClick={handleSync}
              >
                Sync
              </Button>
            </Item>
          </Grid>
        </Grid>
      </Box>
    </>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession(context);
  if (!session) {
    return {
      props: {},
    };
  }
  const { user } = session;
  return {
    props: {
      task_id: context.query.task_id,
      user,
    },
  };
}
