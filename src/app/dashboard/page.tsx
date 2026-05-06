'use client';

import { useContext } from 'react';
import { Card, Col, Row, Spin, Tag, Typography } from 'antd';
import {
  UserOutlined,
  TeamOutlined,
  BookOutlined,
  HomeOutlined,
  CalendarOutlined,
  ScheduleOutlined,
} from '@ant-design/icons';
import { UserContext } from '@/context/UserContext';
import { useTeacher } from '@/hooks/useTeacher';
import { useStudents } from '@/hooks/useStudent';
import { useClass } from '@/hooks/useClass';
import { useSubjects } from '@/hooks/useSubjects';
import { useAcademicCalendars } from '@/hooks/useAcademicCalendar';
import { useSubjectsSchedule } from '@/hooks/useSubjectsSchedule';
import { DAY_LABELS, TDay } from '@/libs/types/subjectsSchedule';
import { ERole } from '@/libs/utils/enum';
import dayjs from 'dayjs';

const { Title, Text } = Typography;

const JS_DAY_TO_TDAY: Record<number, TDay> = {
  0: 'sunday',
  1: 'monday',
  2: 'tuesday',
  3: 'wednesday',
  4: 'thursday',
  5: 'friday',
  6: 'saturday',
};

const ROLE_LABEL: Record<string, string> = {
  ADMIN: 'Admin',
  SUPERADMIN: 'Super Admin',
  TEACHER: 'Guru',
  STUDENT: 'Siswa',
};

const StatCard = ({
  title,
  value,
  icon,
  loading,
  color,
}: {
  title: string;
  value: number;
  icon: React.ReactNode;
  loading: boolean;
  color: string;
}) => (
  <Card className="h-full shadow-sm" variant="borderless">
    <div className="flex items-center gap-4">
      <div
        className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-xl text-white"
        style={{ backgroundColor: color }}
      >
        {icon}
      </div>
      <div>
        <Text type="secondary" className="text-sm">
          {title}
        </Text>
        {loading ? (
          <Spin size="small" />
        ) : (
          <Title level={3} className="mt-0! mb-0!">
            {value}
          </Title>
        )}
      </div>
    </div>
  </Card>
);

const Page = () => {
  const { user, academic } = useContext(UserContext);
  const isAdmin = user.role === ERole.ADMIN || user.role === ERole.SUPERADMIN;

  const { teachers, loadingTeachers } = useTeacher();
  const { students, loadingStudents } = useStudents();
  const { classesData, loadingClass } = useClass();
  const { subjects, loadingSubjects } = useSubjects();
  const { academicCalendars, loadingAcademicCalendars } =
    useAcademicCalendars();
  const { subjectsSchedule, loadingSubjectsSchedule } = useSubjectsSchedule(
    academic?.id,
  );

  const todayKey = JS_DAY_TO_TDAY[dayjs().day()];
  const todaySchedule = (subjectsSchedule ?? []).filter(
    (s) => s.day === todayKey,
  );

  return (
    <div>
      <div className="mb-6">
        <Title level={2} className="mb-1!">
          Selamat datang, {user.name || user.username} 👋
        </Title>
        <Text type="secondary">
          {ROLE_LABEL[user.role] ?? user.role} &middot; Tahun Akademik:{' '}
          <strong>{academic?.name || '-'}</strong>
        </Text>
      </div>

      {isAdmin && (
        <>
          <Title level={4} className="mb-4!">
            Ringkasan Data
          </Title>
          <Row gutter={[16, 16]} className="mb-8">
            <Col xs={24} sm={12} lg={8}>
              <StatCard
                title="Total Guru"
                value={teachers?.length ?? 0}
                icon={<UserOutlined />}
                loading={loadingTeachers}
                color="#4f46e5"
              />
            </Col>
            <Col xs={24} sm={12} lg={8}>
              <StatCard
                title="Total Siswa"
                value={students?.length ?? 0}
                icon={<TeamOutlined />}
                loading={loadingStudents}
                color="#0891b2"
              />
            </Col>
            <Col xs={24} sm={12} lg={8}>
              <StatCard
                title="Total Kelas"
                value={classesData?.length ?? 0}
                icon={<HomeOutlined />}
                loading={loadingClass}
                color="#059669"
              />
            </Col>
            <Col xs={24} sm={12} lg={8}>
              <StatCard
                title="Total Mata Pelajaran"
                value={subjects?.length ?? 0}
                icon={<BookOutlined />}
                loading={loadingSubjects}
                color="#d97706"
              />
            </Col>
            <Col xs={24} sm={12} lg={8}>
              <StatCard
                title="Total Kalender Akademik"
                value={academicCalendars?.length ?? 0}
                icon={<CalendarOutlined />}
                loading={loadingAcademicCalendars}
                color="#dc2626"
              />
            </Col>
            <Col xs={24} sm={12} lg={8}>
              <StatCard
                title="Jadwal Hari Ini"
                value={todaySchedule.length}
                icon={<ScheduleOutlined />}
                loading={loadingSubjectsSchedule}
                color="#7c3aed"
              />
            </Col>
          </Row>
        </>
      )}

      <Title level={4} className="mb-4!">
        Jadwal Hari Ini &mdash; {DAY_LABELS[todayKey]}
      </Title>
      {loadingSubjectsSchedule ? (
        <Spin />
      ) : todaySchedule.length === 0 ? (
        <Card variant="borderless" className="shadow-sm">
          <Text type="secondary">Tidak ada jadwal untuk hari ini.</Text>
        </Card>
      ) : (
        <Row gutter={[16, 16]}>
          {todaySchedule.map((schedule) => (
            <Col xs={24} sm={12} xl={8} key={schedule.id}>
              <Card
                variant="borderless"
                className="h-full shadow-sm"
                title={
                  <span className="font-semibold">
                    {schedule.subject?.name}
                  </span>
                }
                extra={
                  <Tag color="blue">
                    {dayjs(schedule.startTime).format('HH:mm')} &ndash;{' '}
                    {dayjs(schedule.endTime).format('HH:mm')}
                  </Tag>
                }
              >
                <div className="flex flex-col gap-1 text-sm">
                  <Text>
                    <span className="text-gray-500">Kelas:</span>{' '}
                    {schedule.class?.name ?? '-'}
                  </Text>
                  <Text>
                    <span className="text-gray-500">Guru:</span>{' '}
                    {schedule.teacher?.name ?? '-'}
                  </Text>
                  <Text>
                    <span className="text-gray-500">Kalender:</span>{' '}
                    {schedule.academicCalendar?.name ?? '-'}
                  </Text>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
};

export default Page;
