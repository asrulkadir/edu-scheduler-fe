export const routes = [
  {
    name: 'Overview',
    href: '/dashboard',
    scope: {
      create: ['ADMIN, SUPERADMIN'],
      read: ['ADMIN', 'TEACHER', 'STUDENT', 'SUPERADMIN'],
      update: ['ADMIN', 'SUPERADMIN'],
      delete: ['ADMIN', 'SUPERADMIN'],
    },
  },
  {
    name: 'Jadwal Mengajar',
    href: '/dashboard/teaching-schedule',
    scope: {
      create: ['ADMIN', 'SUPERADMIN'],
      read: ['ADMIN', 'TEACHER', 'STUDENT', 'SUPERADMIN'],
      update: ['ADMIN', 'TEACHER', 'SUPERADMIN'],
      delete: ['ADMIN', 'SUPERADMIN'],
    },
  },
  {
    name: 'Jadwal Mata Pelajaran',
    href: '/dashboard/subjects-schedule',
    scope: {
      create: ['ADMIN', 'SUPERADMIN'],
      read: ['ADMIN', 'TEACHER', 'STUDENT', 'SUPERADMIN'],
      update: ['ADMIN', 'TEACHER', 'SUPERADMIN'],
      delete: ['ADMIN', 'SUPERADMIN'],
    },
  },
  {
    name: 'Mata Pelajaran',
    href: '/dashboard/subjects',
    scope: {
      create: ['ADMIN', 'SUPERADMIN'],
      read: ['ADMIN', 'TEACHER', 'STUDENT', 'SUPERADMIN'],
      update: ['ADMIN', 'SUPERADMIN'],
      delete: ['ADMIN', 'SUPERADMIN'],
    },
  },
  {
    name: 'Guru',
    href: '/dashboard/teacher',
    scope: {
      create: ['ADMIN', 'SUPERADMIN'],
      read: ['ADMIN', 'TEACHER', 'STUDENT', 'SUPERADMIN'],
      update: ['ADMIN', 'SUPERADMIN'],
      delete: ['ADMIN', 'SUPERADMIN'],
    },
  },
  {
    name: 'Siswa',
    href: '/dashboard/student',
    scope: {
      create: ['ADMIN', 'SUPERADMIN'],
      read: ['ADMIN', 'TEACHER', 'STUDENT', 'SUPERADMIN'],
      update: ['ADMIN', 'SUPERADMIN'],
      delete: ['ADMIN', 'SUPERADMIN'],
    },
  },
  {
    name: 'Kelas',
    href: '/dashboard/class-page',
    scope: {
      create: ['ADMIN', 'SUPERADMIN'],
      read: ['ADMIN', 'TEACHER', 'STUDENT', 'SUPERADMIN'],
      update: ['ADMIN', 'SUPERADMIN'],
      delete: ['ADMIN', 'SUPERADMIN'],
    },
  },
  {
    name: 'User',
    href: '/dashboard/user',
    scope: {
      create: ['ADMIN', 'SUPERADMIN'],
      read: ['ADMIN', 'SUPERADMIN'],
      update: ['ADMIN', 'SUPERADMIN'],
      delete: ['ADMIN', 'SUPERADMIN'],
    },
  },
];
