import { useState, useEffect, useMemo, useRef } from "react";
import { useSelector } from "react-redux";
import {
  flexRender,
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
} from "@tanstack/react-table";
import {
  Box,
  Button,
  Checkbox,
  MenuItem,
  Select,
  TextField,
  TextareaAutosize,
  Typography,
  Modal,
  Tooltip,
} from "@mui/material";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import "./product.css";
import { requiredFields } from "../../helper/dashboard/productHelper";
import { useRouter } from "next/router";
import ComplianceResultModal from "./ComplianceResultModal";

// custom checkbox component
function IndeterminateCheckbox({
  indeterminate,
  isResultPage,
  className = "",
  ...rest
}) {
  if (!isResultPage) {
    const ref = useRef(null);
    useEffect(() => {
      if (typeof indeterminate === "boolean") {
        ref.current.indeterminate = !rest.checked && indeterminate;
      }
    }, [ref, indeterminate]);

    return isResultPage ? (
      <></>
    ) : (
      <Checkbox
        indeterminate={indeterminate}
        type="checkbox"
        ref={ref}
        className={className + " cursor-pointer"}
        {...rest}
        style={{
          textAlign: "center",
          margin: "0px 10px",
          borderRadius: "10px",
        }}
        sx={{
          "&:hover": {
            borderColor: "red",
          },
          "&:checked": {
            color: "#022149",
            borderColor: "red",
          },
        }}
      />
    );
  } else {
    return <></>;
  }
}

const ProductTable = ({
  tableData,
  setSelectedProduct,
  selectedProduct,
  editableRow,
  handleRowClick,
  isResultPage,
  setIsValidProduct,
  isSEO,
  isTaxonomy,
  isSampleData,
}) => {
  const router = useRouter();
  const userState = useSelector((state) => state?.user);
  const uploadState = useSelector((state) => state.uploadpage);
  const productReadinessState = useSelector((state) => state.productReadiness);
  const complianceStore = useSelector((state) => state.compliance);
  const complianceData = complianceStore?.data;

  let isFreeBasicFlag =
    userState?.userPlan?.startsWith("chgpt-basic") ||
    userState?.userPlan?.startsWith("chgpt-free");

  const [currentTableData, setCurrentTableData] = useState([]);
  const [rowSelection, setRowSelection] = useState({});
  const requiredFields = {
    product_id: "product_id",
    product_name: "product_name",
    brand: "brand",
  };

  const [modalOpen, setModalOpen] = useState(false);
  const [concern, setConcern] = useState(null);

  const handleOpenModal = (productId) => {
    const ncwarning = complianceData || [];
    const item = ncwarning.find((data) => data.id === productId);
    // If a matching item is found, set the concern and open the modal
    if (item) {
      setConcern({ ...item });
      setModalOpen(true);
    }
  };

  useEffect(() => {
    if (!isSampleData) {
      setRowSelection({});
      setSelectedProduct([]);
    }
  }, [isSampleData]);
  // Function to handle closing the modal
  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const onRowCheck = (flag, row, isSelected) => {
    if (flag !== "table") {
      row.getToggleSelectedHandler();
      row.getIsSelected();
      if (selectedProduct.length > 0) {
        if (
          selectedProduct.some((item) => {
            return item?.id === row?.original?.id;
          })
        ) {
          const newArray = selectedProduct.filter((value) => {
            if (row.original.id) {
              return value.id !== row.original.id;
            } else {
              return value.product_id !== row.original.product_id;
            }
          });
          setSelectedProduct(newArray);
        } else {
          setSelectedProduct([...selectedProduct, row.original]);
        }
      } else {
        setSelectedProduct([row.original]);
      }
    } else {
      if (!isSelected) {
        setSelectedProduct(tableData);
      } else {
        setSelectedProduct([]);
      }
    }
  };
  //To check every product has product id, product name and brand
  const hasValues = selectedProduct.every(
    (item) => item.product_id && item.product_name && item.brand
  );

  useEffect(() => {
    if (!isResultPage) {
      setIsValidProduct(!hasValues);
    }
  }, [isResultPage, hasValues]);
  //table column
  const productColumns = useMemo(() => [
    {
      id: "select",
      header: ({ table }) => (
        <IndeterminateCheckbox
          {...{
            checked: table.getIsAllRowsSelected(),
            indeterminate: table.getIsSomeRowsSelected(),
            isResultPage: isResultPage,
            onChange: table.getToggleAllRowsSelectedHandler(),
            onClick: () =>
              onRowCheck("table", "", table.getIsAllRowsSelected()),
          }}
        />
      ),
      cell: ({ row }) => {
        return (
          <IndeterminateCheckbox
            {...{
              checked: selectedProduct.some((item) => {
                return item?.id === row?.original?.id;
              }),
              disabled: !row.getCanSelect(),
              indeterminate: row.getIsSomeSelected(),
              isResultPage: isResultPage,
              onChange: row.getToggleSelectedHandler(),
              onClick: () => onRowCheck("row", row, row.getIsSelected()),
              className: row.index === 0 ? "product-step-2" : "",
            }}
          />
        );
      },
    },
    {
      header: () => (
        <span
          className="column-header"
          style={{
            marginRight: "30px",
          }}
        >
          Compliance
        </span>
      ),
      accessorKey: "compliance",
      cell: (props) => {
        // Retrieve complianceData from local storage

        const item = complianceData?.find(
          (item) => item?.id === props.row.original.id
        );
        // if compliance result is available, display the button
        if (item) {
          const showComplianceResult = (e) => {
            e.stopPropagation();
            handleOpenModal(props.row.original.id);
          };

          const isBrandVoiceCompliant =
            item?.brandVoiceResults?.brand_voice_compliant ?? true;
          const isComplianceCompliant =
            item?.complianceResults?.compliant ?? true;

          const isCompliant = isBrandVoiceCompliant && isComplianceCompliant;
          return (
            <Button
              variant="contained"
              onClick={showComplianceResult}
              style={{
                backgroundColor: isCompliant ? "green" : "red",
                color: "white",
              }}
            >
              {isCompliant ? "Compliant" : "Non-Compliant"}
            </Button>
          );
        }
        // if compliance result is not available, return "-"
        return "-";
      },
    },
    {
      header: () => (
        <span
          className="column-header"
          style={{
            marginRight: "30px",
          }}
        >
          SEO Compliant
        </span>
      ),
      accessorKey: "seo_compliant",
      cell: (props) => {
        if (
          productReadinessState?.data &&
          productReadinessState?.data?.product_readiness?.length > 0
        ) {
          const item = productReadinessState?.data?.product_readiness.find(
            (data) => data.product_id === props.row.original.id
          );
          if (item) {
            const seoCompliant = item.readiness_percentage.toFixed(2);
            return seoCompliant + "%";
          }
        }
        return "-";
      },
    },

    {
      header: () => (
        <span
          className="column-header"
          style={{
            marginRight: "30px",
          }}
        >
          Product ID
        </span>
      ),
      accessorKey: "product_id",
      cell: (props) => props.getValue(),
    },
    {
      header: <span className="column-header">Product Name</span>,
      accessorKey: "product_name",
      cell: (props) => props.getValue(),
    },
    {
      header: <span className="column-header">Brand</span>,
      accessorKey: "brand",
      cell: (props) => props.getValue(),
    },
    {
      header: <span className="column-header">Keywords</span>,
      accessorKey: "keywords",
      cell: (props) => props.getValue(),
    },
    {
      header: <span className="column-header">SEO Keywords</span>,
      accessorKey: "seo_keywords",
      cell: (props) => props.getValue(),
    },
    {
      header: <span className="column-header">Exclude Keywords</span>,
      accessorKey: "exclude_keywords",
      cell: (props) => props.getValue(),
    },
    {
      header: <span className="column-header">Product Description</span>,
      accessorKey: "product_description",
      cell: (props) => props.getValue(),
    },
    {
      header: <span className="column-header">Feature bullet 1</span>,
      accessorKey: "feature_bullet1",
      cell: (props) => props.getValue(),
    },
    {
      header: <span className="column-header">Feature Bullet 2</span>,
      accessorKey: "feature_bullet2",
      cell: (props) => props.getValue(),
    },
    {
      header: <span className="column-header">Feature Bullet 3</span>,
      accessorKey: "feature_bullet3",
      cell: (props) => props.getValue(),
    },
    {
      header: <span className="column-header">Feature Bullet 4</span>,
      accessorKey: "feature_bullet4",
      cell: (props) => props.getValue(),
    },
    {
      header: <span className="column-header">Feature Bullet 5</span>,
      accessorKey: "feature_bullet5",
      cell: (props) => props.getValue(),
    },
    {
      header: <span className="column-header">SEO Meta Title</span>,
      accessorKey: "seo_meta_title",
      cell: (props) => props.getValue(),
    },
    {
      header: <span className="column-header">SEO Meta Description</span>,
      accessorKey: "seo_meta_description",
      cell: (props) => props.getValue(),
    },
    {
      header: <span className="column-header">Taxonomy</span>,
      accessorKey: "Taxonomy",
      cell: (props) => props.getValue(),
    },
    {
      header: <span className="column-header">Status</span>,
      accessorKey: "status",
      cell: (props) => props.getValue(),
    },
    {
      header: <span className="column-header">Input Product Description</span>,
      accessorKey: "input_product_description",
      cell: (props) => props.getValue(),
    },
  ]);

  //table results column
  const resultColumns = useMemo(() => [
    {
      id: "select",
      header: ({ table }) => (
        <IndeterminateCheckbox
          {...{
            checked: table.getIsAllRowsSelected(),
            indeterminate: table.getIsSomeRowsSelected(),
            isResultPage: isResultPage,
            onChange: table.getToggleAllRowsSelectedHandler(),
            onClick: () =>
              onRowCheck("table", "", table.getIsAllRowsSelected()),
          }}
        />
      ),
      cell: ({ row }) => {
        return (
          <IndeterminateCheckbox
            {...{
              checked: selectedProduct.some((item) => {
                return (
                  item?.product_id === row?.original?.product_id &&
                  item?.product_name === row?.original?.product_name
                );
              }),
              disabled: !row.getCanSelect(),
              indeterminate: row.getIsSomeSelected(),
              isResultPage: isResultPage,
              onChange: row.getToggleSelectedHandler(),
              onClick: () => onRowCheck("row", row, row.getIsSelected()),
            }}
          />
        );
      },
    },
    {
      header: () => (
        <span
          className="column-header"
          style={{
            marginRight: "30px",
          }}
        >
          Product ID
        </span>
      ),
      accessorKey: "product_id",
      cell: (props) => props.getValue(),
    },
    {
      header: <span className="column-header">Product Name</span>,
      accessorKey: "product_name",
      cell: (props) => props.getValue(),
    },
    {
      header: <span className="column-header">Product Description</span>,
      accessorKey: "product_description",
      cell: (props) => props.getValue(),
    },
    {
      header: <span className="column-header">Feature bullet 1</span>,
      accessorKey: "feature_bullet1",
      cell: (props) => props.getValue(),
    },
    {
      header: <span className="column-header">Feature Bullet 2</span>,
      accessorKey: "feature_bullet2",
      cell: (props) => props.getValue(),
    },
    {
      header: <span className="column-header">Feature Bullet 3</span>,
      accessorKey: "feature_bullet3",
      cell: (props) => props.getValue(),
    },
    {
      header: <span className="column-header">Feature Bullet 4</span>,
      accessorKey: "feature_bullet4",
      cell: (props) => props.getValue(),
    },
    {
      header: <span className="column-header">Feature Bullet 5</span>,
      accessorKey: "feature_bullet5",
      cell: (props) => props.getValue(),
    },
    {
      header: <span className="column-header">SEO Meta Title</span>,
      accessorKey: "seo_meta_title",
      cell: (props) => (
        <Tooltip
          title={
            isFreeBasicFlag ? "Upgrade your plan to unlock this feature" : ""
          }
        >
          <span
            style={{
              filter: isFreeBasicFlag ? "blur(5px)" : "none",
              color: isFreeBasicFlag ? "grey" : "initial",
              userSelect: isFreeBasicFlag ? "none" : "auto",
            }}
          >
            {props.getValue() || "Upgrade your plan"}
          </span>
        </Tooltip>
      ),
    },
    {
      header: <span className="column-header">SEO Meta Description</span>,
      accessorKey: "seo_meta_description",
      cell: (props) => (
        <Tooltip
          title={
            isFreeBasicFlag ? "Upgrade your plan to unlock this feature" : ""
          }
        >
          <span
            style={{
              filter: isFreeBasicFlag ? "blur(5px)" : "none",
              color: isFreeBasicFlag ? "grey" : "initial",
              userSelect: isFreeBasicFlag ? "none" : "auto",
            }}
          >
            {props.getValue() ||
              "Upgrade your plan to unlock SEO Meta description"}
          </span>
        </Tooltip>
      ),
    },
    {
      header: <span className="column-header">Taxonomy</span>,
      accessorKey: "Taxonomy",
      cell: (props) => props.getValue(),
    },
    {
      header: <span className="column-header">Status</span>,
      accessorKey: "status",
      cell: (props) => props.getValue(),
    },
    {
      header: <span className="column-header">Input Brand</span>,
      accessorKey: "brand",
      cell: (props) => props.getValue(),
    },
    {
      header: <span className="column-header">Input Keywords</span>,
      accessorKey: "keywords",
      cell: (props) => props.getValue(),
    },
    {
      header: <span className="column-header">SEO Keywords</span>,
      accessorKey: "seo_keywords",
      cell: (props) => props.getValue(),
    },
    {
      header: <span className="column-header">Excluded Keywords</span>,
      accessorKey: "exclude_keywords",
      cell: (props) => props.getValue(),
    },
    {
      header: <span className="column-header">Input Product Description</span>,
      accessorKey: "input_product_description",
      cell: (props) => props.getValue(),
    },
  ]);

  const table = useReactTable({
    data:
      tableData?.length > currentTableData?.length
        ? tableData
        : currentTableData,
    columns: isResultPage ? resultColumns : productColumns,
    initialState: {},
    state: {
      rowSelection,
      columnVisibility: {
        // product_description: !isResultPage ? uploadState.seo : true,
        // seo_meta_title: isResultPage ? (isSEO ? isSEO : false) : false,
        seo_meta_title:
          isResultPage && isFreeBasicFlag
            ? true
            : isResultPage && !isFreeBasicFlag && isSEO
            ? true
            : false,
        seo_meta_description:
          isResultPage && isFreeBasicFlag
            ? true
            : isResultPage && !isFreeBasicFlag && isSEO
            ? true
            : false,

        // seo_meta_description: isResultPage ? (isfreeBasicFlag ? isSEO) : false : false,
        Taxonomy: isResultPage
          ? uploadState.premium
            ? isTaxonomy
            : false
          : false,
        status: isResultPage,
        input_product_description: isResultPage && uploadState.seo,
        // feature_bullet1: !isResultPage ? uploadState.seo : true,
        // feature_bullet2: !isResultPage ? uploadState.seo : true,
        // feature_bullet3: !isResultPage ? uploadState.seo : true,
        // feature_bullet4: !isResultPage ? uploadState.seo : true,
        // feature_bullet5: !isResultPage ? uploadState.seo : true,
      },
    },
    getCoreRowModel: getCoreRowModel(),
    onRowSelectionChange: setRowSelection,
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    setRowSelection: setRowSelection,
    enableRowSelection: true,
    debugTable: true,
    autoResetPageIndex: false,
  });

  const headerGroups = table.getHeaderGroups();

  return (
    <>
      <ComplianceResultModal
        open={modalOpen}
        onClose={handleCloseModal}
        concern={concern}
      />
      <Box className="product-table-container">
        <table className="product-table">
          <thead className="thead">
            {headerGroups.map((headerGroup) => {
              return (
                <tr key={headerGroup.id} className="thead-tr">
                  {headerGroup.headers.map((header) => {
                    return (
                      <th
                        key={header.id}
                        colSpan={4}
                        className="thead-tr-th"
                        title={header.id}
                      >
                        {header.isPlaceholder ? null : (
                          <>
                            {flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                          </>
                        )}
                      </th>
                    );
                  })}
                </tr>
              );
            })}
          </thead>
          <tbody className="tbody">
            {tableData?.length > 0 &&
              table.getRowModel().rows.map((row, index) => {
                const isRowSelected = row.getIsSelected();
                return (
                  <tr
                    key={row.id}
                    className="tbody-tr"
                    style={{
                      backgroundColor: isRowSelected ? "#F9F9FF" : null,
                    }}
                  >
                    {row.getVisibleCells().map((cells, cellIndex) => {
                      return (
                        <td
                          className="tbody-tr-td"
                          key={cells.id}
                          colSpan={4}
                          onClick={() => {
                            if (cells.column.id !== "select") {
                              handleRowClick(row, row.index);
                            }
                          }}
                          style={{
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            maxWidth: "400px",
                          }}
                        >
                          {flexRender(
                            cells.column.columnDef.cell,
                            cells.getContext()
                          )}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
          </tbody>
        </table>
      </Box>

      <Box
        // className="doc-table-pagination-container"
        sx={{
          display: "flex",
          alignItems: "center",
          // flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <Box
          sx={{
            display: "flex",
          }}
        >
          <Typography>Page</Typography>
          <Typography minWidth="45px">
            {tableData?.length > 0 ? (
              <b>
                {table.getState().pagination.pageIndex + 1} of{" "}
                {table.getPageCount()}
              </b>
            ) : (
              <b>0 of 0</b>
            )}
          </Typography>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Button
              variant="outlined"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              sx={{
                minHeight: 0,
                minWidth: 0,
                padding: "0 12px",
              }}
            >
              {"<"}
            </Button>
            <Button
              variant="outlined"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              sx={{
                minHeight: 0,
                minWidth: 0,
                padding: "0 12px",
                marginLeft: "5px",
              }}
            >
              {">"}
            </Button>
          </Box>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", marginLeft: "15px" }}>
          <Typography variant="text">Row per Page:</Typography>
          <Select
            className=""
            value={table.getState().pagination.pageSize}
            onChange={(e) => {
              table.setPageSize(Number(e.target.value));
            }}
            sx={{
              boxShadow: "none",
              ".MuiOutlinedInput-notchedOutline": { border: 0 },
              "&.MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline":
                {
                  border: 0,
                },
              "&.MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
                {
                  border: 0,
                },
            }}
          >
            {[10, 20, 30, 40, 50].map((pageSize) => (
              <MenuItem key={pageSize} value={pageSize}>
                {pageSize}
              </MenuItem>
            ))}
          </Select>
        </Box>
      </Box>
    </>
  );
};

export default ProductTable;
