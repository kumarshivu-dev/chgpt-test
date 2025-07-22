import {
  Box,
  Grid,
  Paper,
  Typography,
  Snackbar,
  Alert,
  AlertTitle,
  FormControl,
  Select,
  MenuItem,
  Link,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import "../../app/walmart-style.css";
import MUIDataTable from "mui-datatables";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import { useEffect, useState, memo } from "react";
import { useRouter } from "next/router";
import axios from "axios";
const axiosRetry = require("axios-retry");
import { useSelector, useDispatch } from "react-redux";
import { getSession, useSession, signOut } from "next-auth/react";
import {
  setTableData,
  setModalData,
  setFilterValue,
  setProductSelected,
  setFilterTableData,
  setResultsData,
} from "../../store/walmart/productTableSlice";
import ProductKeywordModal from "./ProductKeywordModal";
import TableSkeleton from "./TableSkeleton";
import Image from "next/image";
import { POST_AUTH_LOGIN, GET_ITEM_LIST } from "../../utils/apiEndpoints";

const Item = styled(Paper)(() => ({
  backgroundColor: "transparent",
  boxShadow: "none",
}));

const ProductTable = memo(
  ({
    isReadOnly,
    onRowSelectionChange,
    resultsPage,
    user,
    email,
    monthlyLimit,
  }) => {
    const router = useRouter();
    const { data: session, status, update } = useSession();
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [checkRowSelected, setCheckRowSelected] = useState([]);
    const [rowDataSelected, setRowDataSelected] = useState([]);
    const [rowDataPerPage, setRowDataPerPage] = useState(10);
    const [pageChange, setPageChange] = useState(0);
    const [loading, setLoading] = useState(true);
    const [limitError, setLimitError] = useState("");
    const [LimitErrorsnackbarOpen, setLimitErrorsnackbarOpen] = useState(false);
    const [monthSnackbar, setMonthSnackbar] = useState(false);

    const dispatch = useDispatch();
    const productTableData = useSelector((state) => state.productTable);
    const intialTableData = productTableData.tableData;

    async function authenticateAndFetchItemList() {
      try {
        if (!email) {
          console.error("Name or email is undefined in session.user");
          return;
        }

        const config = {
          headers: {
            Authorization: user.id_token,
          },
        };

        const authResponse = await axios.post(
          process.env.NEXT_PUBLIC_WALMART_BASE_URL + POST_AUTH_LOGIN,
          {
            email: email,
          },
          config
        );
        console.log("Authentication Response :", authResponse.data);
      } catch (error) {
        console.error("Error In auth in walmart:", error.message);
      }
    }
    axiosRetry(axios, {
      retries: 3,
      retryDelay: axiosRetry.exponentialDelay,
      shouldResetTimeout: true,
    });

    async function fetchItemList() {
      try {
        const config = {
          headers: {
            Authorization: user.id_token,
          },
        };
        const response = await axios.post(
          process.env.NEXT_PUBLIC_WALMART_BASE_URL + GET_ITEM_LIST,
          {
            email: email,
          },
          config
        );

        console.log("itemList Res: ", response);

        const newItemList = response?.data?.itemList || [];

        dispatch(setFilterTableData(newItemList));
        dispatch(setTableData(newItemList));
      } catch (error) {
        console.error("Error while fetching ItemList results:", error);

        if (error?.response?.status === 404) {
          setLimitError(error?.response?.data?.message);
          setLimitErrorsnackbarOpen(true);
          return;
        }
        setLimitError("Network connection failed. Please refresh the page.");
        setLimitErrorsnackbarOpen(true);
      } finally {
        setLoading(false);
      }
    }

    useEffect(() => {
      if (resultsPage) {
        if (productTableData.resultsData.length === 0) {
          setLoading(true);
        } else {
          setLoading(false);
        }
      }
      if (!resultsPage && intialTableData.length !== 0) {
        setLoading(false);
      }
      authenticateAndFetchItemList();
      if (
        productTableData.filterValue !== "selected" &&
        productTableData.filterValue !== "unselected" &&
        !resultsPage &&
        intialTableData.length === 0
      ) {
        fetchItemList();
      }
    }, [productTableData.resultsData]);

    const columns = [
      {
        name: "sku",
        label: "SKU",
        options: {
          sort: true,
        },
      },
      {
        name: "gtin",
        label: "ID",
        options: {
          sort: true,
        },
      },
      {
        name: "brand",
        label: "Brand",
        options: {
          sort: true,
        },
      },
      {
        name: "productName",
        label: "Name",
        options: {
          sort: true,
        },
      },
      {
        name: "keywords",
        label: "Add Keywords",
        options: {
          sort: false,
          customBodyRender: (value) => {
            if (
              value.length === 0 ||
              value === "" ||
              value === null ||
              value === undefined
            ) {
              return <AddIcon fontSize="small" color="primary" />;
            } else if (Array.isArray(value)) {
              const keywordString = value.join(", ");
              return keywordString;
            } else {
              return value;
            }
          },
        },
      },
      {
        name: "description",
        label: "Description",
        options: {
          sort: false,
          customBodyRender: (value) => {
            if (value === "" || value === null || value === undefined) {
              return "--";
            }
            return value;
          },
        },
      },
      {
        name: "product_bullets",
        label: "Key Feature",
        options: {
          sort: false,
          customBodyRender: (value) => {
            if (
              value.length === 0 ||
              value === "" ||
              value === null ||
              value === undefined
            ) {
              return "--";
            }
            return value;
          },
        },
      },

      {
        name: "",
        className: "pencilIconTD",
        options: {
          sort: false,
          customBodyRender: (value) => {
            if (value === "" || value === null || value === undefined) {
              return <EditIcon className="pencilIcon" />;
            }
            return value;
          },
        },
      },
    ];

    const options = {
      download: false,
      sort: true,
      search: true,
      print: false,
      viewColumns: false,

      searchPlaceholder: "Search By SKU, ID, Brand, Name",
      searchAlwaysOpen: true,

      selectableRowsHeader: true,

      rowsPerPage: rowDataPerPage,
      rowsPerPageOptions: [10, 20, 50, 100],
      page: pageChange,
      jumpToPage: true,
      onChangePage(currentPage) {
        setPageChange(currentPage);
      },
      onChangeRowsPerPage(numberOfRows) {
        setRowDataPerPage(numberOfRows);
      },

      selectableRows: "multiple",
      selectToolbarPlacement: "none",
      onRowSelectionChange: (currentRowsSelected, allRowsSelected) => {
        setRowDataSelected(allRowsSelected.map((item) => item.dataIndex));
        setCheckRowSelected(allRowsSelected.map((item) => item.dataIndex));
        dispatch(
          setProductSelected(allRowsSelected.map((item) => item.dataIndex))
        );
        onRowSelectionChange(allRowsSelected);
        console.log("allRowdata: ", allRowsSelected);
      },
      rowsSelected: checkRowSelected,
      isRowSelectable: (dataIndex, selectedRows) => {
        if (monthlyLimit <= 0) {
          return false;
        }
        if (!resultsPage) {
          const rowData = intialTableData[dataIndex];
          return Boolean(rowData && rowData.productName && rowData.brand);
        }

        return true;
      },
      onRowClick: (rowData, rowMeta) => {
        dispatch(
          setModalData({
            sku: rowData[0],
            id: rowData[1],
            brand: rowData[2],
            productName: rowData[3],
            desc: rowData[5],
            keywords: rowData[4],
            featureBulletOne: rowData[6],
          })
        );
        if (monthlyLimit <= 0) {
          setMonthSnackbar(true);
          return;
        } else if (rowData[3] && rowData[2]) {
          handleOpenEditModal();
        } else {
          setLimitError(
            "Brand and Product Name are required attributes for the product to be selectable."
          );
          setLimitErrorsnackbarOpen(true);
        }
      },
    };

    const handleSelectFiltered = (value) => {
      dispatch(setFilterValue(value));

      if (!resultsPage) {
        if (value === "selected") {
          const selectedData = productTableData.filterTableData.filter(
            (_, index) => rowDataSelected.includes(index)
          );
          dispatch(setTableData(selectedData));
          const arr = [];
          for (let i = 0; i < rowDataSelected.length; i++) {
            arr.push(i);
          }
          setCheckRowSelected(arr);
        } else if (value === "unselected") {
          const unselectedData = productTableData.filterTableData.filter(
            (_, index) => !rowDataSelected.includes(index)
          );
          setCheckRowSelected([]);
          dispatch(setTableData(unselectedData));
        } else {
          setCheckRowSelected(rowDataSelected);
          dispatch(setTableData(productTableData.filterTableData));
        }
      } else {
        const selectedData = productTableData.filterResultsData.filter(
          (_, index) => rowDataSelected.includes(index)
        );
        const unselectedData = productTableData.filterResultsData.filter(
          (_, index) => !rowDataSelected.includes(index)
        );
        if (value === "selected") {
          dispatch(setResultsData(selectedData));
          const arr = [];
          for (let i = 0; i < rowDataSelected.length; i++) {
            arr.push(i);
          }
          setCheckRowSelected(arr);
        } else if (value === "unselected") {
          setCheckRowSelected([]);
          dispatch(setResultsData(unselectedData));
        } else {
          setCheckRowSelected(rowDataSelected);
          dispatch(setResultsData(productTableData.filterResultsData));
        }
      }
    };

    const handleOpenEditModal = () => setIsEditModalOpen(true);
    const handleCloseEditModal = () => setIsEditModalOpen(false);
    const handleSnackbarClose = () => {
      setLimitErrorsnackbarOpen(false);
      setMonthSnackbar(false);
    };

    return (
      <>
        {loading && (
          <div
            style={{
              position: "fixed",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
            }}
          >
            <Image
              src="/walmart/loaderOverskeleton.gif"
              width={150}
              height={150}
              alt="loading..."
            ></Image>
          </div>
        )}
        {loading ? (
          <TableSkeleton />
        ) : (
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
                      <Typography variant="h3">Products</Typography>
                    </Grid>
                    <Grid container>
                      {/* //fitler */}
                      <Grid item xs={6} textAlign="left">
                        <FormControl>
                          <Select
                            className="select-product"
                            value={productTableData.filterValue}
                            onChange={(e) =>
                              handleSelectFiltered(e.target.value)
                            }
                            displayEmpty
                          >
                            <MenuItem value="">Filter</MenuItem>
                            <MenuItem value="allselect">All Products</MenuItem>
                            <MenuItem value="selected">
                              Selected Products
                            </MenuItem>
                            <MenuItem value="unselected">
                              Unselected Products
                            </MenuItem>
                          </Select>
                        </FormControl>
                      </Grid>
                    </Grid>
                  </Box>
                </Item>
              </Grid>

              <Grid className="table-wrapper">
                <Item>
                  <MUIDataTable
                    className="product-table"
                    data={
                      resultsPage
                        ? productTableData.resultsData
                        : intialTableData
                    }
                    columns={columns}
                    options={{
                      ...options,
                    }}
                  />
                </Item>
              </Grid>
            </Item>
          </Grid>
        )}
        <Box>
          <ProductKeywordModal
            isOpen={isEditModalOpen}
            onClose={handleCloseEditModal}
            readOnly={isReadOnly}
          />
        </Box>
        <Snackbar
          anchorOrigin={{
            vertical: "top",
            horizontal: "center",
          }}
          open={LimitErrorsnackbarOpen}
          autoHideDuration={10000}
          onClose={handleSnackbarClose}
        >
          <Alert severity="error" onClose={handleSnackbarClose}>
            <AlertTitle>Error</AlertTitle>
            {limitError}
          </Alert>
        </Snackbar>

        <Snackbar
          anchorOrigin={{
            vertical: "top",
            horizontal: "center",
          }}
          open={monthSnackbar}
          autoHideDuration={null}
          onClose={handleSnackbarClose}
        >
          <Alert severity="error" onClose={handleSnackbarClose}>
            <AlertTitle>
              "You have reached your monthly limit. Please Visit the{" "}
              <Link style={{ color: "red" }} href="/walmart/pricing">
                pricing page
              </Link>{" "}
              to upgrade your plan."
            </AlertTitle>
          </Alert>
        </Snackbar>
      </>
    );
  }
);

export default ProductTable;
ProductTable.displayName = "SomeButton";

export async function getServerSideProps(context) {
  const session = await getSession(context);
  if (!session) {
    return {
      props: {},
    };
  }
  return {
    props: { user: session.user },
  };
}
