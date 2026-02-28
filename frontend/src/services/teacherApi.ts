// services/teacherApi.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const teacherApi = createApi({
  reducerPath: 'teacherApi',
  baseQuery: fetchBaseQuery({ 
    baseUrl: import.meta.env.VITE_APP_TEACHER_BASE_URL,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('token'); 
      if (token) headers.set('authorization', `Bearer ${token}`);
      return headers;
    },
  }),
  tagTypes: ['Assignments', "Attendance","Tests"], // Tags for automatic re-fetching
  endpoints: (builder) => ({
    getTeacherSubjects: builder.query<any, void>({
      query: () => ({
        url: '/getTeacherSubjects',
        method: 'GET', 
      }),
    }),
    
    getTeacherSchedule: builder.query<any, void>({
      query: () => ({
        url: '/getTeacherSchedule',
        method: 'GET',
      }),
    }),

    getStudentsForAttendance: builder.query<any, string | undefined>({
      query: (groupId) => ({
        url: `/getStudentsForAttendance/${groupId}`,
        method: 'GET',
      }),
    }),

    submitAttendance: builder.mutation<any, any>({
      query: (attendanceData) => ({
        url: '/submitAttendance',
        method: 'POST',
        body: attendanceData,
      }),
      invalidatesTags: ['Attendance'],
    }),

    getExistingAttendance: builder.query({
      query: ({ scheduleId, date }) => ({
        url: `/get-existing-attendance`,
        method: 'GET',
        params: { scheduleId, date },
      }),
      // invalidatesTags: ['Attendance'],
      providesTags: ['Attendance'],
    }),

    createAssignment: builder.mutation<any, any>({
      query: (assignmentData) => ({
        url: '/createAssignment', // Match your router.post path
        method: 'POST',
        body: assignmentData,
      }),
      // Assignment create hone ke baad agar aapki koi list hai toh usse refresh karne ke liye
      invalidatesTags: ['Assignments'], 
    }),

    createTest: builder.mutation<any, any>({
      query: (testData) => ({
        url: '/createTest', // Backend route se match karna chahiye
        method: 'POST',
        body: testData,
      }),
      // Jab test create ho jaye, toh 'Tests' tag wale queries ko refresh karo
      invalidatesTags: ['Tests'], 
    }),
  }),
});

// Hooks export karo
export const { 
  useGetTeacherSubjectsQuery, 
  useGetTeacherScheduleQuery,
  useGetStudentsForAttendanceQuery, 
  useSubmitAttendanceMutation,
  useGetExistingAttendanceQuery,
  useCreateAssignmentMutation,
  useCreateTestMutation // Naya hook export ho gaya!
} = teacherApi;