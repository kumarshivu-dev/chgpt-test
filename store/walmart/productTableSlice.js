import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  //ProductTable component
  tableData: [],
  filterTableData: [],
  searchTerm: "",
  sortOption: "",
  filterValue: "",
  productSelected: [],
  totalProductCount: 0,
  pageChangeData: [],

  //Product Keywords Modal
  tags: [],
  modalData: {
    sku: "",
    id: "",
    brand: "",
    productName: "",
    desc: "",
    keywords: [],
    featureBulletOne: "",
  },
  check: false,

  //Generation Page
  content: false,
  seo: false,
  seoKeywords: [],
  resultsData: [],
  filterResultsData: [],
};

const productTableSlice = createSlice({
  name: "productTable",
  initialState,
  reducers: {
    setTableData: (state, action) => {
      state.tableData = action.payload;
    },
    setFilterTableData: (state, action) => {
      state.filterTableData = action.payload;
    },

    setTotalProductCount: (state, action) => {
      state.totalProductCount = action.payload;
    },
    setPageChangeData: (state, action) => {
      state.tableData = action.payload;
    },
    setSearchTerm: (state, action) => {
      state.searchTerm = action.payload; // Change action name to setTableData
    },
    setSortOption: (state, action) => {
      state.sortOption = action.payload;
    },
    setModalData: (state, action) => {
      state.modalData.sku = action.payload.sku;
      state.modalData.id = action.payload.id;
      state.modalData.brand = action.payload.brand;
      state.modalData.productName = action.payload.productName;
      state.modalData.desc = action.payload.desc;
      state.modalData.keywords = action.payload.keywords;
      state.modalData.featureBulletOne = action.payload.featureBulletOne;
    },
    setFilterValue: (state, action) => {
      state.filterValue = action.payload;
    },
    setTags: (state, action) => {
      state.tags = action.payload;
    },
    setProductSelected: (state, action) => {
      state.productSelected = action.payload;
    },
    setCheck: (state, action) => {
      state.check = action.payload;
    },
    setKeywordTable: (state, action) => {
      state.tableData = state.tableData.map((item) => {
        const { gtin } = item;
        if (action.payload.check || gtin === action.payload.id) {
          const newKeywordsSet = new Set([
            ...item.keywords,
            ...action.payload.keywords,
          ]);
          item.keywords = [...newKeywordsSet];
        }
        return item;
      });
    },

    setKeywordFilterSortTable: (state, action) => {
      state.filterTableData = state.filterTableData.map((item) => {
        const { gtin } = item;
        if (action.payload.check || gtin === action.payload.id) {
          const newKeywordsSet = new Set([
            ...item.keywords,
            ...action.payload.keywords,
          ]);
          item.keywords = [...newKeywordsSet];
        }
        return item;
      });
    },
    setDeleteKeyFromTable: (state, action) => {
      const { rowId, keywordToDelete } = action.payload;

      state.tableData = state.tableData.map((item) => {
        if (item.gtin === rowId) {
          if (Array.isArray(item.keywords)) {
            item.keywords = item.keywords.filter((keyword) => {
              return (
                keyword.trim().toLowerCase() !==
                keywordToDelete.trim().toLowerCase()
              );
            });
          }
        }
        return item;
      });
    },
    setResultsData: (state, action) => {
      state.resultsData = action.payload;
    },
    setFilterResultsData: (state, action) => {
      state.filterResultsData = action.payload;
    },
    setDescriptionTable: (state, action) => {
      const { rowId, description } = action.payload;
      state.resultsData = state.resultsData.map((item) => {
        const { gtin } = item;
        if (rowId == gtin) {
          item.description = description;
        }
        return item;
      });
    },

    setDescriptionFilterTable: (state, action) => {
      const { rowId, description } = action.payload;
      state.filterResultsData = state.filterResultsData.map((item) => {
        const { gtin } = item;
        if (rowId == gtin) {
          item.description = description;
        }
        return item;
      });
    },

    setFeaturesTable: (state, action) => {
      const { rowId, product_bullets } = action.payload;
      state.resultsData = state.resultsData.map((item) => {
        const { gtin } = item;
        if (rowId == gtin) {
          const updated_bullets = product_bullets.filter(
            (bullet) => bullet.trim() !== ""
          );
          item.product_bullets = updated_bullets;
        }
        return item;
      });
    },

    setFeaturesFilterTable: (state, action) => {
      const { rowId, product_bullets } = action.payload;
      state.filterResultsData = state.filterResultsData.map((item) => {
        const { gtin } = item;
        if (rowId == gtin) {
          const updated_bullets = product_bullets.filter(
            (bullet) => bullet.trim() !== ""
          );
          item.product_bullets = updated_bullets;
        }
        return item;
      });
    },

    setSeo: (state, action) => {
      state.seo = action.payload;
    },
    setContent: (state, action) => {
      state.content = action.payload;
    },
    setSeoKeywords: (state, action) => {
      state.seoKeywords = action.payload;
    },
  },
});

export const {
  setTableData,
  setFilterTableData,
  updateTableData,
  setSearchTerm,
  setSortOption,
  setModalData,
  setFilterValue,
  setTags,
  setProductSelected,
  setKeywordTable,
  setTotalProductCount,
  setContent,
  setSeo,
  setSeoKeywords,
  setResultsData,
  setCheck,
  setPageChangeData,
  setDeleteKeyFromTable,
  setFeaturesTable,
  setDescriptionTable,
  setKeywordFilterSortTable,
  setFilterResultsData,
  setDescriptionFilterTable,
  setFeaturesFilterTable,
} = productTableSlice.actions;
export default productTableSlice.reducer;
