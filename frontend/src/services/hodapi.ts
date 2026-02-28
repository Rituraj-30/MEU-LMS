import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const hodApi = createApi({
  reducerPath: "hodApi",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_APP_HOD_BASE_URL,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("token")?.replace(/"/g, "");
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  // "Teachers" tag add kiya hai taaki list auto-refresh ho
  tagTypes: ["Subjects", "Courses", "Teachers", "Semesters"],

  endpoints: (builder) => ({
    getAllSubjects: builder.query({
      query: () => "/getAllSubjects",
      providesTags: ["Subjects"],
    }),
    createSubject: builder.mutation({
      query: (newSubject) => ({
        url: "/createSubject",
        method: "POST",
        body: newSubject,
      }),
      invalidatesTags: ["Subjects"],
    }),
    editSubject: builder.mutation({
      query: ({ id, ...updateData }) => ({
        url: `/editSubject/${id}`,
        method: "PUT",
        body: updateData,
      }),
      invalidatesTags: ["Subjects"],
    }),
    createCourse: builder.mutation({
      query: (newCourse) => ({
        url: "/createCourse",
        method: "POST",
        body: newCourse,
      }),
      invalidatesTags: ["Courses"],
    }),
    getDepartmentCourses: builder.query({
      query: () => "/getDepartmentCourses",
      providesTags: ["Courses"],
    }),
    createStudent: builder.mutation({
      query: (newStudent) => ({
        url: "/createStudent",
        method: "POST",
        body: newStudent,
      }),
      invalidatesTags: ["Courses"],
    }),
    getStudentsByCourse: builder.query({
      query: (courseName) => `/getStudentsByCourse?courseName=${courseName}`,
      providesTags: ["Courses"],
    }),

    // --- NEW TEACHER ENDPOINTS ---
    getAllTeachers: builder.query({
      query: () => "/getAllTeachers",
      providesTags: ["Teachers"],
    }),
    createTeacher: builder.mutation({
      query: (newTeacher) => ({
        url: "/createTeacher",
        method: "POST",
        body: newTeacher,
      }),
      invalidatesTags: ["Teachers"],
    }),
    createSemesterGroup: builder.mutation({
      query: (data) => ({
        url: "/createSemesterGroup",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Semesters"], 
    }),
  getAllSemesterGroups: builder.query({
      query: () => "/getAllSemesterGroups",
      providesTags: ["Semesters"],
    }),
   
createSchedule: builder.mutation({
  query: (data) => ({
    url: "/createSchedule",
    method: "POST",
    body: data,
  }),
  invalidatesTags: ["Semesters"], // Refresh karne ke liye
}),

  
    
    
  }),
});

export const {
  useGetAllSubjectsQuery,
  useCreateSubjectMutation,
  useGetDepartmentCoursesQuery,
  useCreateCourseMutation,
  useEditSubjectMutation,
  useCreateStudentMutation,
  useGetStudentsByCourseQuery,
  useGetAllTeachersQuery,
  useCreateTeacherMutation,
  useCreateSemesterGroupMutation, 
  useCreateScheduleMutation,
  useGetAllSemesterGroupsQuery,


} = hodApi;
