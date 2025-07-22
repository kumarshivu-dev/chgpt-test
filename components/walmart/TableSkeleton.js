import {
  Box,
  FormControl,
  Grid,
  Paper,
  Skeleton,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";

const Item = styled(Paper)(() => ({
  backgroundColor: "transparent",
  boxShadow: "none",
}));
export default function TableSkeleton() {
  return (
    <Grid
      item
      xs={12}
      sx={{
        backgroundColor: "#ffead0",
        padding: "0px 19px 16px 19px",
        borderRadius: "8px 8px 0 0",
      }}
    >
      <Item>
        <Grid>
          <Item>
            <Box p={4}>
              <Grid
                container
                justifyContent="space-betwe en"
                alignItems="center-1"
              >
                <Typography variant="h3">
                  <Skeleton sx={{ width: "100px" }} />
                </Typography>
              </Grid>
              <Grid container>
                <Grid item xs={6} textAlign="left">
                  <FormControl>
                    <Skeleton sx={{ width: "100px" }} />
                  </FormControl>
                </Grid>
                <Grid item xs={6} textAlign="right">
                  <FormControl>
                    <Skeleton sx={{ width: "100px" }} />
                  </FormControl>
                </Grid>
              </Grid>
            </Box>
          </Item>
        </Grid>

        <Grid
          className="search-wrapper"
          sx={{ background: "#fff", border: "none", padding: "20px" }}
        >
          <Item>
            <Skeleton sx={{ width: "200px", height: "70px" }} />
          </Item>
        </Grid>
        <Grid className="table-wrapper" sx={{ border: "none !important" }}>
          <Item
            className="product-table"
            sx={{ background: "#fff", border: "none", padding: "20px" }}
          >
            <Grid container mb={1}>
              <Grid item xs={1}>
                <Item>
                  <Skeleton sx={{ width: "80%", height: "70px" }} />
                </Item>
              </Grid>
              <Grid item xs={11}>
                <Item>
                  <Skeleton sx={{ height: "70px" }} />
                </Item>
              </Grid>
            </Grid>

            <Grid container mb={1}>
              <Grid item xs={1}>
                <Item>
                  <Skeleton sx={{ width: "80%", height: "70px" }} />
                </Item>
              </Grid>
              <Grid item xs={11}>
                <Item>
                  <Skeleton sx={{ height: "70px" }} />
                </Item>
              </Grid>
            </Grid>

            <Grid container mb={1}>
              <Grid item xs={1}>
                <Item>
                  <Skeleton sx={{ width: "80%", height: "70px" }} />
                </Item>
              </Grid>
              <Grid item xs={11}>
                <Item>
                  <Skeleton sx={{ height: "70px" }} />
                </Item>
              </Grid>
            </Grid>

            <Grid container mb={1}>
              <Grid item xs={1}>
                <Item>
                  <Skeleton sx={{ width: "80%", height: "70px" }} />
                </Item>
              </Grid>
              <Grid item xs={11}>
                <Item>
                  <Skeleton sx={{ height: "70px" }} />
                </Item>
              </Grid>
            </Grid>

            <Grid container mb={1}>
              <Grid item xs={1}>
                <Item>
                  <Skeleton sx={{ width: "80%", height: "70px" }} />
                </Item>
              </Grid>
              <Grid item xs={11}>
                <Item>
                  <Skeleton sx={{ height: "70px" }} />
                </Item>
              </Grid>
            </Grid>

            <Grid container mb={1}>
              <Grid item xs={1}>
                <Item>
                  <Skeleton sx={{ width: "80%", height: "70px" }} />
                </Item>
              </Grid>
              <Grid item xs={11}>
                <Item>
                  <Skeleton sx={{ height: "70px" }} />
                </Item>
              </Grid>
            </Grid>

            <Grid container mb={1}>
              <Grid item xs={1}>
                <Item>
                  <Skeleton sx={{ width: "80%", height: "70px" }} />
                </Item>
              </Grid>
              <Grid item xs={11}>
                <Item>
                  <Skeleton sx={{ height: "70px" }} />
                </Item>
              </Grid>
            </Grid>
          </Item>
        </Grid>
      </Item>
    </Grid>
  );
}
