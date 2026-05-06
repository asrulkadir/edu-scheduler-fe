'use client';

import { Empty, Select, Skeleton, Tag } from 'antd';
import {
  ClockCircleOutlined,
  BookOutlined,
  HomeOutlined,
  CalendarOutlined,
} from '@ant-design/icons';
import { useSubjectsSchedule } from '@/hooks/useSubjectsSchedule';
import { useTeacher } from '@/hooks/useTeacher';
import { useContext, useState } from 'react';
import {
  DAY_LABELS,
  TDay,
  TSubjectsSchedule,
} from '@/libs/types/subjectsSchedule';
import { UserContext } from '@/context/UserContext';
import { ERole } from '@/libs/utils/enum';
import dayjs from 'dayjs';

const DAY_ORDER: TDay[] = [
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday',
];

const DAY_COLORS: Record<TDay, string> = {
  monday: 'blue',
  tuesday: 'cyan',
  wednesday: 'green',
  thursday: 'orange',
  friday: 'purple',
  saturday: 'magenta',
  sunday: 'red',
};

const DAY_BG: Record<TDay, string> = {
  monday: '#EFF6FF',
  tuesday: '#ECFEFF',
  wednesday: '#F0FDF4',
  thursday: '#FFF7ED',
  friday: '#FAF5FF',
  saturday: '#FFF0F6',
  sunday: '#FFF1F0',
};

const DAY_BORDER: Record<TDay, string> = {
  monday: '#BFDBFE',
  tuesday: '#A5F3FC',
  wednesday: '#A7F3D0',
  thursday: '#FED7AA',
  friday: '#DDD6FE',
  saturday: '#F9A8D4',
  sunday: '#FCA5A5',
};

const TIME_FORMAT = 'HH:mm';

const Page = () => {
  const { user, academic } = useContext(UserContext);
  const isTeacher = user.role === ERole.TEACHER;
  const isAdmin = user.role === ERole.ADMIN || user.role === ERole.SUPERADMIN;

  const [selectedTeacherId, setSelectedTeacherId] = useState<
    string | undefined
  >(undefined);

  const { teachers, loadingTeachers } = useTeacher();

  // For admin/superadmin: fall back to first teacher if nothing selected yet
  const effectiveTeacherId =
    isAdmin && !selectedTeacherId && teachers && teachers.length > 0
      ? teachers[0].id
      : selectedTeacherId;

  const filterTeacherId = isTeacher ? user.teacherId : effectiveTeacherId;

  const { subjectsSchedule, loadingSubjectsSchedule } = useSubjectsSchedule(
    academic?.id,
  );

  const mySchedule: TSubjectsSchedule[] = filterTeacherId
    ? (subjectsSchedule?.filter((s) => s.teacher?.id === filterTeacherId) ?? [])
    : [];

  const scheduleByDay = DAY_ORDER.reduce(
    (acc, day) => {
      acc[day] = mySchedule.filter((s) => s.day === day);
      return acc;
    },
    {} as Record<TDay, TSubjectsSchedule[]>,
  );

  const daysWithSchedule = DAY_ORDER.filter((d) => scheduleByDay[d].length > 0);

  const selectedTeacher = isTeacher
    ? { name: user.name }
    : teachers?.find((t) => t.id === effectiveTeacherId);

  const isLoading = loadingSubjectsSchedule || (isAdmin && loadingTeachers);

  return (
    <>
      {/* Page header */}
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-800">
            Jadwal Mengajar
          </h1>
          {isTeacher ? (
            <p className="mt-1 text-sm text-gray-500">
              Jadwal mengajar Anda pada kalender akademik aktif
            </p>
          ) : (
            <p className="mt-1 text-sm text-gray-500">
              Lihat jadwal mengajar per guru
            </p>
          )}
        </div>

        {/* Teacher selector for admin/superadmin */}
        {isAdmin && (
          <Select
            className="w-64"
            placeholder="Pilih guru"
            loading={loadingTeachers}
            value={effectiveTeacherId}
            onChange={setSelectedTeacherId}
            options={teachers?.map((t) => ({ value: t.id, label: t.name }))}
            showSearch={{
              filterOption: (input, option) =>
                (option?.label as string)
                  ?.toLowerCase()
                  .includes(input.toLowerCase()),
            }}
          />
        )}
      </div>

      {/* Teacher info banner */}
      {!isLoading && selectedTeacher && mySchedule.length > 0 && (
        <div className="mb-6 flex flex-wrap items-center gap-3 rounded-2xl border border-blue-100 bg-blue-50 px-5 py-3">
          <CalendarOutlined className="text-blue-500" />
          <span className="font-semibold text-blue-800">
            {selectedTeacher.name}
          </span>
          <span className="text-sm text-blue-600">·</span>
          <span className="text-sm text-blue-600">
            {mySchedule.length} jadwal
          </span>
          {/* Day summary pills */}
          <div className="flex flex-wrap gap-1.5">
            {DAY_ORDER.map((day) => {
              const count = scheduleByDay[day].length;
              if (!count) return null;
              return (
                <Tag
                  key={day}
                  color={DAY_COLORS[day]}
                  className="rounded-full px-3 py-0.5 text-xs font-semibold"
                >
                  {DAY_LABELS[day]} · {count}
                </Tag>
              );
            })}
          </div>
        </div>
      )}

      {/* Content */}
      {isLoading ? (
        <div className="space-y-4">
          <Skeleton active />
          <Skeleton active />
        </div>
      ) : !academic?.id ? (
        <Empty description="Pilih kalender akademik terlebih dahulu" />
      ) : isTeacher && !user.teacherId ? (
        <Empty description="Akun Anda belum terhubung ke profil guru. Hubungi administrator." />
      ) : isAdmin && !effectiveTeacherId ? (
        <Empty description="Pilih guru untuk melihat jadwalnya" />
      ) : mySchedule.length === 0 ? (
        <Empty
          description={
            isTeacher
              ? 'Anda belum memiliki jadwal mengajar'
              : `${selectedTeacher?.name ?? 'Guru'} belum memiliki jadwal mengajar`
          }
        />
      ) : (
        <div className="space-y-8">
          {daysWithSchedule.map((day) => (
            <div key={day}>
              {/* Day header */}
              <div className="mb-3 flex items-center gap-3">
                <Tag
                  color={DAY_COLORS[day]}
                  className="rounded-full px-4 py-1 text-sm font-bold"
                >
                  {DAY_LABELS[day]}
                </Tag>
                <span className="text-sm text-gray-400">
                  {scheduleByDay[day].length} jadwal
                </span>
                <div className="h-px flex-1 bg-gray-100" />
              </div>

              {/* Schedule cards */}
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
                {scheduleByDay[day].map((item) => (
                  <div
                    key={item.id}
                    className="overflow-hidden rounded-2xl border p-4 transition-all hover:-translate-y-0.5 hover:shadow-md"
                    style={{
                      background: DAY_BG[day],
                      borderColor: DAY_BORDER[day],
                    }}
                  >
                    {/* Time */}
                    <div className="mb-3 flex items-center gap-2">
                      <ClockCircleOutlined className="text-gray-400" />
                      <span className="font-mono text-sm font-bold text-gray-700">
                        {dayjs(item.startTime).format(TIME_FORMAT)}
                        {' – '}
                        {dayjs(item.endTime).format(TIME_FORMAT)}
                      </span>
                    </div>

                    {/* Subject */}
                    <div className="mb-1.5 flex items-center gap-2">
                      <BookOutlined className="shrink-0 text-blue-400" />
                      <span className="font-semibold text-gray-800">
                        {item.subject?.name}
                      </span>
                    </div>

                    {/* Class */}
                    <div className="flex items-center gap-2">
                      <HomeOutlined className="shrink-0 text-gray-400" />
                      <span className="text-sm text-gray-600">
                        {item.class?.name}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default Page;
