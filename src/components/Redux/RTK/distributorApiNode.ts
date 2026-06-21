import { nodeApi } from "../nodeApi";

// Helper to map Mongoose _id to frontend id property recursively
function mapId(obj: any): any {
  if (!obj || typeof obj !== "object") return obj;
  
  if (Array.isArray(obj)) {
    return obj.map(mapId);
  }

  const mapped: any = { ...obj };
  if (mapped._id) {
    mapped.id = mapped._id.toString();
  }

  for (const key in mapped) {
    if (mapped[key] && typeof mapped[key] === "object") {
      mapped[key] = mapId(mapped[key]);
    }
  }

  return mapped;
}

export const distributorApiNode = nodeApi.injectEndpoints({
  endpoints: (builder) => ({
    // ---------------- Products ----------------
    getDistributorProducts: builder.query<any, { search?: string } | void>({
      query: (params) => {
        const searchVal = params?.search || "";
        return {
          url: `/products?limit=1000&search_query=${encodeURIComponent(searchVal)}`,
          method: "GET",
        };
      },
      transformResponse: (response: any) => {
        const rawData = response?.data?.data || [];
        return mapId(rawData);
      },
      providesTags: ["product"],
    }),

    getDistributorProductById: builder.query<any, string>({
      query: (id) => ({
        url: `/products/${id}`,
        method: "GET",
      }),
      transformResponse: (response: any) => {
        return mapId(response?.data);
      },
      providesTags: (result, error, id) => [{ type: "product", id }],
    }),

    createDistributorProduct: builder.mutation<any, any>({
      query: (data) => ({
        url: "/products",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["product", "dashboards"],
    }),

    updateDistributorProduct: builder.mutation<any, { id: string; data: any }>({
      query: ({ id, data }) => ({
        url: `/products/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => ["product", "dashboards", { type: "product", id }],
    }),

    deleteDistributorProduct: builder.mutation<any, string>({
      query: (id) => ({
        url: `/products/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["product", "dashboards"],
    }),

    addDistributorProductBatch: builder.mutation<any, { id: string; data: any }>({
      query: ({ id, data }) => ({
        url: `/products/${id}/batches`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => ["product", "dashboards", { type: "product", id }],
    }),

    // ---------------- Categories ----------------
    getDistributorCategories: builder.query<any, { company_name?: string; search_query?: string } | void>({
      query: (params) => {
        const company = params?.company_name || "";
        const search = params?.search_query || "";
        let url = `/categories?limit=1000`;
        if (company) {
          url += `&company_name=${encodeURIComponent(company)}`;
        }
        if (search) {
          url += `&search_query=${encodeURIComponent(search)}`;
        }
        return {
          url,
          method: "GET",
        };
      },
      transformResponse: (response: any) => {
        const rawData = response?.data?.data || [];
        return mapId(rawData);
      },
      providesTags: ["category"],
    }),

    createDistributorCategory: builder.mutation<any, any>({
      query: (data) => ({
        url: "/categories",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["category"],
    }),

    updateDistributorCategory: builder.mutation<any, { id: string; data: any }>({
      query: ({ id, data }) => ({
        url: `/categories/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["category"],
    }),

    deleteDistributorCategory: builder.mutation<any, string>({
      query: (id) => ({
        url: `/categories/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["category"],
    }),

    // ---------------- Units ----------------
    getDistributorUnits: builder.query<any, void>({
      query: () => ({
        url: "/units?limit=1000",
        method: "GET",
      }),
      transformResponse: (response: any) => {
        const rawData = response?.data?.data || [];
        return mapId(rawData);
      },
      providesTags: ["unit"],
    }),

    createDistributorUnit: builder.mutation<any, any>({
      query: (data) => ({
        url: "/units",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["unit"],
    }),

    updateDistributorUnit: builder.mutation<any, { id: string; data: any }>({
      query: ({ id, data }) => ({
        url: `/units/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["unit"],
    }),

    deleteDistributorUnit: builder.mutation<any, string>({
      query: (id) => ({
        url: `/units/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["unit"],
    }),

    // ---------------- Companies ----------------
    getDistributorCompanies: builder.query<any, void>({
      query: () => ({
        url: "/companies?limit=1000",
        method: "GET",
      }),
      transformResponse: (response: any) => {
        const rawData = response?.data?.data || [];
        return mapId(rawData);
      },
      providesTags: ["company"],
    }),

    createDistributorCompany: builder.mutation<any, any>({
      query: (data) => ({
        url: "/companies",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["company"],
    }),

    updateDistributorCompany: builder.mutation<any, { id: string; data: any }>({
      query: ({ id, data }) => ({
        url: `/companies/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["company"],
    }),

    deleteDistributorCompany: builder.mutation<any, string>({
      query: (id) => ({
        url: `/companies/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["company"],
    }),

    // ---------------- Delivery Men ----------------
    getDeliveryMen: builder.query<any, void>({
      query: () => ({
        url: "/delivery-men?limit=1000",
        method: "GET",
      }),
      transformResponse: (response: any) => {
        const rawData = response?.data?.data || [];
        return mapId(rawData);
      },
      providesTags: ["delivery-man"],
    }),

    createDeliveryMan: builder.mutation<any, any>({
      query: (data) => ({
        url: "/delivery-men",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["delivery-man"],
    }),

    updateDeliveryMan: builder.mutation<any, { id: string; data: any }>({
      query: ({ id, data }) => ({
        url: `/delivery-men/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["delivery-man"],
    }),

    deleteDeliveryMan: builder.mutation<any, string>({
      query: (id) => ({
        url: `/delivery-men/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["delivery-man"],
    }),

    // ---------------- Areas ----------------
    getAreas: builder.query<any, { search?: string } | void>({
      query: (params) => {
        const searchVal = params?.search || "";
        return {
          url: `/areas?limit=1000&search_query=${encodeURIComponent(searchVal)}`,
          method: "GET",
        };
      },
      transformResponse: (response: any) => {
        const rawData = response?.data?.data || [];
        return mapId(rawData);
      },
      providesTags: ["area"],
    }),

    createArea: builder.mutation<any, any>({
      query: (data) => ({
        url: "/areas",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["area"],
    }),

    updateArea: builder.mutation<any, { id: string; data: any }>({
      query: ({ id, data }) => ({
        url: `/areas/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => ["area", { type: "area", id }],
    }),

    deleteArea: builder.mutation<any, string>({
      query: (id) => ({
        url: `/areas/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["area"],
    }),

    // ---------------- Loading Sheets ----------------
    getLoadingSheets: builder.query<any, void>({
      query: () => ({
        url: "/loading-sheets?limit=1000",
        method: "GET",
      }),
      transformResponse: (response: any) => {
        const rawData = response?.data?.data || [];
        return mapId(rawData);
      },
      providesTags: ["loading-sheet"],
    }),

    getLoadingSheetById: builder.query<any, string>({
      query: (id) => ({
        url: `/loading-sheets/${id}`,
        method: "GET",
      }),
      transformResponse: (response: any) => {
        return mapId(response?.data);
      },
      providesTags: (result, error, id) => [{ type: "loading-sheet", id }],
    }),

    createLoadingSheet: builder.mutation<any, any>({
      query: (data) => ({
        url: "/loading-sheets",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["loading-sheet", "product", "dashboards"], // also invalidates products because it might deduct stock
    }),

    updateLoadingSheet: builder.mutation<any, { id: string; data: any }>({
      query: ({ id, data }) => ({
        url: `/loading-sheets/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => ["loading-sheet", { type: "loading-sheet", id }],
    }),

    deleteLoadingSheet: builder.mutation<any, string>({
      query: (id) => ({
        url: `/loading-sheets/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["loading-sheet"],
    }),

    // ---------------- Settlements ----------------
    getSettlements: builder.query<any, { start_date?: string; end_date?: string; search_query?: string } | void>({
      query: (params) => {
        let url = `/settlements?limit=1000`;
        if (params?.start_date) {
          url += `&start_date=${params.start_date}`;
        }
        if (params?.end_date) {
          url += `&end_date=${params.end_date}`;
        }
        if (params?.search_query) {
          url += `&search_query=${encodeURIComponent(params.search_query)}`;
        }
        return {
          url,
          method: "GET",
        };
      },
      transformResponse: (response: any) => {
        const rawData = response?.data?.data || [];
        const summary = response?.data?.summary || { totalSales: 0, totalProfit: 0, totalLoss: 0 };
        return {
          data: mapId(rawData),
          summary,
        };
      },
      providesTags: ["settlement"],
    }),

    getSettlementById: builder.query<any, string>({
      query: (id) => ({
        url: `/settlements/${id}`,
        method: "GET",
      }),
      transformResponse: (response: any) => {
        return mapId(response?.data);
      },
      providesTags: (result, error, id) => [{ type: "settlement", id }],
    }),

    createSettlement: builder.mutation<any, any>({
      query: (data) => ({
        url: "/settlements",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["settlement", "loading-sheet", "product", "damage", "dashboards"],
    }),

    // ---------------- Damage Records ----------------
    getDamageRecords: builder.query<any, { page?: number; limit?: number; search_query?: string; status?: string; source_type?: string; start_date?: string; end_date?: string } | void>({
      query: (params) => {
        let url = `/damage-records?page=${params?.page || 1}&limit=${params?.limit || 20}`;
        if (params?.search_query) url += `&search_query=${encodeURIComponent(params.search_query)}`;
        if (params?.status) url += `&status=${encodeURIComponent(params.status)}`;
        if (params?.source_type) url += `&source_type=${encodeURIComponent(params.source_type)}`;
        if (params?.start_date) url += `&start_date=${encodeURIComponent(params.start_date)}`;
        if (params?.end_date) url += `&end_date=${encodeURIComponent(params.end_date)}`;
        return {
          url,
          method: "GET",
        };
      },
      transformResponse: (response: any) => {
        const rawData = response?.data?.data || [];
        return {
          meta: response?.data?.meta || { page: 1, limit: 20, total: 0 },
          data: mapId(rawData),
        };
      },
      providesTags: ["damage"],
    }),

    getDamageStock: builder.query<any, { page?: number; limit?: number; search_query?: string } | void>({
      query: (params) => {
        let url = `/damage-records/stock?page=${params?.page || 1}&limit=${params?.limit || 20}`;
        if (params?.search_query) url += `&search_query=${encodeURIComponent(params.search_query)}`;
        return {
          url,
          method: "GET",
        };
      },
      transformResponse: (response: any) => {
        const rawData = response?.data?.data || [];
        return {
          meta: response?.data?.meta || { page: 1, limit: 20, total: 0 },
          data: mapId(rawData),
        };
      },
      providesTags: ["damage"],
    }),

    createDamageRecord: builder.mutation<any, any>({
      query: (data) => ({
        url: "/damage-records",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["damage", "product", "dashboards"],
    }),

    updateDamageRecordStatus: builder.mutation<any, { id: string; status: 'Approved' | 'Rejected' | 'Disposed' }>({
      query: ({ id, status }) => ({
        url: `/damage-records/${id}/status`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: ["damage", "product", "dashboards"],
    }),

    getDamageReports: builder.query<any, { start_date?: string; end_date?: string } | void>({
      query: (params) => {
        let url = `/damage-records/reports?`;
        if (params?.start_date) url += `&start_date=${encodeURIComponent(params.start_date)}`;
        if (params?.end_date) url += `&end_date=${encodeURIComponent(params.end_date)}`;
        return {
          url,
          method: "GET",
        };
      },
      transformResponse: (response: any) => {
        return mapId(response?.data || {});
      },
      providesTags: ["damage"],
    }),

    getDeliveryManStats: builder.query<any, string>({
      query: (id) => ({
        url: `/delivery-men/${id}/stats`,
        method: "GET",
      }),
      transformResponse: (response: any) => {
        return mapId(response?.data);
      },
      providesTags: (result, error, id) => [{ type: "delivery-man", id }, "loading-sheet", "settlement"],
    }),

    getDashboardSummary: builder.query<any, { start_date?: string; end_date?: string } | void>({
      query: (params) => {
        let url = "/statistics/dashboard-summary";
        const queryParts = [];
        if (params?.start_date) queryParts.push(`start_date=${params.start_date}`);
        if (params?.end_date) queryParts.push(`end_date=${params.end_date}`);
        if (queryParts.length > 0) {
          url += `?${queryParts.join("&")}`;
        }
        return {
          url,
          method: "GET",
        };
      },
      transformResponse: (response: any) => {
        return mapId(response?.data);
      },
      providesTags: ["dashboards"],
    }),

    getCurrentStockReport: builder.query<any, { company_name?: string; category_name?: string; search_query?: string } | void>({
      query: (params) => {
        let url = "/statistics/reports/current-stock?";
        if (params?.company_name) url += `&company_name=${encodeURIComponent(params.company_name)}`;
        if (params?.category_name) url += `&category_name=${encodeURIComponent(params.category_name)}`;
        if (params?.search_query) url += `&search_query=${encodeURIComponent(params.search_query)}`;
        return { url, method: "GET" };
      },
      transformResponse: (response: any) => mapId(response?.data || []),
      providesTags: ["product", "dashboards"],
    }),

    getProductSummaryReport: builder.query<any, { productId: string; start_date?: string; end_date?: string }>({
      query: (params) => {
        let url = `/statistics/reports/product-summary?productId=${params.productId}`;
        if (params.start_date) url += `&start_date=${params.start_date}`;
        if (params.end_date) url += `&end_date=${params.end_date}`;
        return { url, method: "GET" };
      },
      transformResponse: (response: any) => mapId(response?.data || {}),
      providesTags: ["product", "dashboards"],
    }),

    getDailySummaryReport: builder.query<any, { start_date?: string; end_date?: string } | void>({
      query: (params) => {
        let url = "/statistics/reports/daily-summary?";
        if (params?.start_date) url += `&start_date=${params.start_date}`;
        if (params?.end_date) url += `&end_date=${params.end_date}`;
        return { url, method: "GET" };
      },
      transformResponse: (response: any) => mapId(response?.data || []),
      providesTags: ["dashboards", "settlement"],
    }),

    getDailySaleReport: builder.query<any, { start_date?: string; end_date?: string; delivery_man_id?: string } | void>({
      query: (params) => {
        let url = "/statistics/reports/daily-sale?";
        if (params?.start_date) url += `&start_date=${params.start_date}`;
        if (params?.end_date) url += `&end_date=${params.end_date}`;
        if (params?.delivery_man_id) url += `&delivery_man_id=${params.delivery_man_id}`;
        return { url, method: "GET" };
      },
      transformResponse: (response: any) => mapId(response?.data || []),
      providesTags: ["dashboards", "settlement"],
    }),

    getDailySaleProductReport: builder.query<any, { start_date?: string; end_date?: string; product_id?: string } | void>({
      query: (params) => {
        let url = "/statistics/reports/daily-sale-products?";
        if (params?.start_date) url += `&start_date=${params.start_date}`;
        if (params?.end_date) url += `&end_date=${params.end_date}`;
        if (params?.product_id) url += `&product_id=${params.product_id}`;
        return { url, method: "GET" };
      },
      transformResponse: (response: any) => mapId(response?.data || []),
      providesTags: ["dashboards", "settlement", "product"],
    }),

    getDamageRecordsReport: builder.query<any, { start_date?: string; end_date?: string; status?: string } | void>({
      query: (params) => {
        let url = "/statistics/reports/damage-records?";
        if (params?.start_date) url += `&start_date=${params.start_date}`;
        if (params?.end_date) url += `&end_date=${params.end_date}`;
        if (params?.status) url += `&status=${params.status}`;
        return { url, method: "GET" };
      },
      transformResponse: (response: any) => mapId(response?.data || []),
      providesTags: ["dashboards", "damage"],
    }),
  }),
});

export const {
  useGetDistributorProductsQuery,
  useGetDistributorProductByIdQuery,
  useCreateDistributorProductMutation,
  useUpdateDistributorProductMutation,
  useDeleteDistributorProductMutation,
  useAddDistributorProductBatchMutation,

  useGetDistributorCategoriesQuery,
  useCreateDistributorCategoryMutation,
  useUpdateDistributorCategoryMutation,
  useDeleteDistributorCategoryMutation,

  useGetDistributorUnitsQuery,
  useCreateDistributorUnitMutation,
  useUpdateDistributorUnitMutation,
  useDeleteDistributorUnitMutation,

  useGetDistributorCompaniesQuery,
  useCreateDistributorCompanyMutation,
  useUpdateDistributorCompanyMutation,
  useDeleteDistributorCompanyMutation,

  useGetDeliveryMenQuery,
  useCreateDeliveryManMutation,
  useUpdateDeliveryManMutation,
  useDeleteDeliveryManMutation,

  useGetAreasQuery,
  useCreateAreaMutation,
  useUpdateAreaMutation,
  useDeleteAreaMutation,

  useGetLoadingSheetsQuery,
  useGetLoadingSheetByIdQuery,
  useCreateLoadingSheetMutation,
  useUpdateLoadingSheetMutation,
  useDeleteLoadingSheetMutation,

  useGetSettlementsQuery,
  useGetSettlementByIdQuery,
  useCreateSettlementMutation,

  useGetDamageRecordsQuery,
  useCreateDamageRecordMutation,
  useUpdateDamageRecordStatusMutation,
  useGetDamageStockQuery,
  useGetDamageReportsQuery,
  useGetDeliveryManStatsQuery,
  useGetDashboardSummaryQuery,

  useGetCurrentStockReportQuery,
  useGetProductSummaryReportQuery,
  useGetDailySummaryReportQuery,
  useGetDailySaleReportQuery,
  useGetDailySaleProductReportQuery,
  useGetDamageRecordsReportQuery,
} = distributorApiNode;
