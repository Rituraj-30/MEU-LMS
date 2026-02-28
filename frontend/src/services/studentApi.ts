import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const studentApi = createApi({
  reducerPath: 'studentApi',
  baseQuery: fetchBaseQuery({ 
    baseUrl: import.meta.env.VITE_APP_STUDENT_BASE_URL,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('token'); 
      if (token) headers.set('authorization', `Bearer ${token}`);
      return headers;
    },
  }),
  tagTypes: ['Subjects', 'Schedule', "Assignments", "Tests"],
  
  endpoints: (builder) => ({

    getStudentSubjects: builder.query<any, void>({
      query: () => ({ url: '/lms-subjects', method: 'GET' }),
      providesTags: ['Subjects'],
    }),

    getStudentSchedule: builder.query<any, void>({
      query: () => ({ url: '/studentSchedule', method: 'GET' }),
      providesTags: ['Schedule'],
    }),

    getStudentAttendance: builder.query<any, void>({
      query: () => ({ url: '/studentAttendance', method: 'GET' }),
    }),

    getStudentAssignments: builder.query<any, void>({
      query: () => ({ url: '/getStudentAssignments', method: 'GET' }),
      providesTags: ['Assignments'],
    }),
    
    submitAssignment: builder.mutation<any, { assignmentId: string; file: File }>({
      query: ({ assignmentId, file }) => {
        const formData = new FormData();
        formData.append("assignmentId", assignmentId);
        formData.append("submissionFile", file);
        return {
          url: '/submitAssignment', 
          method: 'POST',
          body: formData,
        };
      },
      invalidatesTags: ['Assignments'], 
    }),

    getStudentTests: builder.query<any, void>({
      query: () => ({ url: '/getStudentTests', method: 'GET' }),
      providesTags: ['Tests'],
    }),

    joinTest: builder.mutation<any, string>({
      query: (testId) => ({
        url: `/joinTest/${testId}`,
        method: 'GET', 
      }),
    }),

    submitTest: builder.mutation<any, { testId: string; answers: any }>({
      query: (body) => ({
        url: '/submitTest',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Tests'], 
    }),

  }),
});

export const { 
  useGetStudentSubjectsQuery, 
  useGetStudentScheduleQuery,
  useGetStudentAttendanceQuery,
  useGetStudentAssignmentsQuery,
  useSubmitAssignmentMutation,
  useGetStudentTestsQuery,
  useJoinTestMutation,    
  useSubmitTestMutation   
} = studentApi;