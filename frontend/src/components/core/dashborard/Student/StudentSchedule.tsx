import Timetable from '../../../comman/Timetable';
import { useGetStudentScheduleQuery } from '../../../../services/studentApi';

export const StudentSchedule = () => {
  const { data, isLoading } = useGetStudentScheduleQuery();
  return <Timetable data={data?.data} isLoading={isLoading} role="Student" />;
};