export const routes = [
  {
    name: "Overview",
    href: "/dashboard",
    scope: {
      create: ["ADMIN"],
      read: ["ADMIN", "TEACHER", "STUDENT"],
      update: ["ADMIN"],
      delete: ["ADMIN"]
    }
  },
  {
    name: "Jadwal Mengajar",
    href: "/dashboard/teaching-schedule",
    scope: {
      create: ["ADMIN"],
      read: ["ADMIN", "TEACHER"],
      update: ["ADMIN", "TEACHER"],
      delete: ["ADMIN"]
    }
  },
  {
    name: "Jadwal Mata Pelajaran",
    href: "/dashboard/subjects-schedule",
    scope: {
      create: ["ADMIN"],
      read: ["ADMIN", "TEACHER", "STUDENT"],
      update: ["ADMIN", "TEACHER"],
      delete: ["ADMIN"]
    }
  },
  {
    name: "Mata Pelajaran",
    href: "/dashboard/subjects",
    scope: {
      create: ["ADMIN"],
      read: ["ADMIN", "TEACHER", "STUDENT"],
      update: ["ADMIN"],
      delete: ["ADMIN"]
    }
  },
  {
    name: "Guru",
    href: "/dashboard/teacher",
    scope: {
      create: ["ADMIN"],
      read: ["ADMIN", "TEACHER", "STUDENT"],
      update: ["ADMIN"],
      delete: ["ADMIN"]
    }
  },
  {
    name: "Siswa",
    href: "/dashboard/student",
    scope: {
      create: ["ADMIN"],
      read: ["ADMIN", "TEACHER", "STUDENT"],
      update: ["ADMIN"],
      delete: ["ADMIN"]
    }
  },
  {
    name: "Kelas",
    href: "/dashboard/class-page",
    scope: {
      create: ["ADMIN"],
      read: ["ADMIN", "TEACHER", "STUDENT"],
      update: ["ADMIN"],
      delete: ["ADMIN"]
    }
  },
  {
    name: "User",
    href: "/dashboard/user",
    scope: {
      create: ["ADMIN"],
      read: ["ADMIN"],
      update: ["ADMIN"],
      delete: ["ADMIN"]
    }
  }
];