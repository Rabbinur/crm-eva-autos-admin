import { buildQueryParams } from "@/lib/utils";
import { nodeApi } from "../nodeApi";

const dashboardApi = nodeApi.injectEndpoints({
  endpoints: (builder) => ({
    // ✅ Get all data
    getDashboardOverview: builder.query({
      query: (params = {}) => ({
        url: `/admin/orders/dashboard?${buildQueryParams(params)}`,
        method: "GET",
      }),
      providesTags: ["dashboards"],
    }),

    getDashboardPie: builder.query({
      query: (params = {}) => ({
        url: `/admin/orders/charts/pies?${buildQueryParams(params)}`,
        method: "GET",
      }),
      providesTags: ["dashboards"],
    }),

    getDashboardReveniue: builder.query({
      query: (params = {}) => ({
        url: `/admin/orders/revenue?${buildQueryParams(params)}`,
        method: "GET",
      }),
      providesTags: ["dashboards"],
    }),

    getDashboardChartCategory: builder.query({
      query: (params = {}) => ({
        url: `/admin/orders/charts/categorized?${buildQueryParams(params)}`,
        method: "GET",
      }),
      providesTags: ["dashboards"],
    }),

    getReportDataAnalysis: builder.query({
      query: (params = {}) => {
        const queryParams = new URLSearchParams()

        // ✅ Add only if exists

        if (params.start_date) queryParams.append("start_date", params.start_date)
        if (params.end_date) queryParams.append("end_date", params.end_date)
        if (params.user) queryParams.append("user", params.user)
        if (params.product_id) queryParams.append("product_id", params.product_id)
        if (params.category_id) queryParams.append("category_id", params.category_id)
        if (params.status) queryParams.append("status", params.status)
        if (params.sub_status) queryParams.append("sub_status", params.sub_status)
        if (params.order_type) queryParams.append("order_type", params.order_type)
        if (params.min_price) queryParams.append("min_price", params.min_price)
        if (params.max_price) queryParams.append("max_price", params.max_price)
        if (params.search_query) queryParams.append("search_query", params.search_query)

        return {
          url: `/admin/orders/reports?${queryParams.toString()}`,
          method: "GET",
        }
      },
      providesTags: ["dashboards"],
    }),
    getReportDataAnalysisXlsx: builder.query({
      query: (params = {}) => {
        const queryParams = new URLSearchParams()

        // ✅ Add only if exists

        if (params.start_date) queryParams.append("start_date", params.start_date)
        if (params.end_date) queryParams.append("end_date", params.end_date)
        if (params.user) queryParams.append("user", params.user)
        if (params.product_id) queryParams.append("product_id", params.product_id)
        if (params.category_id) queryParams.append("category_id", params.category_id)
        if (params.status) queryParams.append("status", params.status)
        if (params.sub_status) queryParams.append("sub_status", params.sub_status)
        if (params.order_type) queryParams.append("order_type", params.order_type)
        if (params.min_price) queryParams.append("min_price", params.min_price)
        if (params.max_price) queryParams.append("max_price", params.max_price)
        if (params.search_query) queryParams.append("search_query", params.search_query)

        return {
          url: `/admin/orders/reports/download/xlsx?${queryParams.toString()}`,
          method: "GET",
          responseHandler: (response) => response.blob(),
        }
      },
      providesTags: ["dashboards"],
    }),
    getReportDataAnalysisPdf: builder.query({
      query: (params = {}) => {
        const queryParams = new URLSearchParams()

        // ✅ Add only if exists

        if (params.start_date) queryParams.append("start_date", params.start_date)
        if (params.end_date) queryParams.append("end_date", params.end_date)
        if (params.user) queryParams.append("user", params.user)
        if (params.product_id) queryParams.append("product_id", params.product_id)
        if (params.category_id) queryParams.append("category_id", params.category_id)
        if (params.status) queryParams.append("status", params.status)
        if (params.sub_status) queryParams.append("sub_status", params.sub_status)
        if (params.order_type) queryParams.append("order_type", params.order_type)
        if (params.min_price) queryParams.append("min_price", params.min_price)
        if (params.max_price) queryParams.append("max_price", params.max_price)
        if (params.search_query) queryParams.append("search_query", params.search_query)

        return {
          url: `/admin/orders/reports/download/pdf?${queryParams.toString()}`,
          method: "GET",
          responseHandler: (response) => response.blob(),
        }
      },
      providesTags: ["dashboards"],
    }),
  }),
});

export const {
  useGetDashboardOverviewQuery,
  useGetDashboardPieQuery,
  useGetDashboardChartCategoryQuery,
  useGetDashboardReveniueQuery,
  useGetReportDataAnalysisQuery,
  useLazyGetReportDataAnalysisXlsxQuery,
  useLazyGetReportDataAnalysisPdfQuery
} = dashboardApi;
