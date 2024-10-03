import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const fileManagementApi = createApi({
  reducerPath: "fileManagementApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `http://${process.env.REACT_APP_SERVER_URL}`,
  }),

  endpoints: (builder) => ({
    getCSVFiles: builder.query({
      query: (params) => ({
        url: `csvfile/?skip=${params.skip}&limit=${params.limit}`,
      }),
    }),
    getCSVFileById: builder.query({
      query: (id: number) => `csvfile/${id}`,  
    }),
    uploadCSVFile: builder.mutation({
      query: ({ file, fileName }: { file: File; fileName: string }) => {
        const formData = new FormData();
        formData.append('file', file);
        
        return {
          url: `/csvfile/?file_name=${fileName}`, 
          method: 'POST',
          body: formData,
          };
      },
    }),
    joinCSVWithAPI: builder.mutation({
      query: ({ fileId, api_address, new_file_name, column1, column2 }: {
        fileId: number;
        api_address: string;
        new_file_name: string;
        column1: string;
        column2: string;
      }) => ({
        url: `csvfile/${fileId}/join/?api_address=${encodeURIComponent(api_address)}&new_file_name=${new_file_name}&column1=${column1}&column2=${column2}`,
        method: 'POST',
        headers: {
          accept: 'application/json',
        },
      }),
    }),
  }),
});

export const {
  useGetCSVFilesQuery,
  useUploadCSVFileMutation,
  useGetCSVFileByIdQuery,
  useJoinCSVWithAPIMutation,
} = fileManagementApi;
