export const routes = [
  {
    name: "Overview",
    href: "/dashboard",
    scope: {
      create: ["admin"],
      read: ["admin", "teacher", "student"],
      update: ["admin"],
      delete: ["admin"]
    }
  },
  {
    name: "Jadwal Mengajar",
    href: "/dashboard/teaching-schedule",
    scope: {
      create: ["admin"],
      read: ["admin", "teacher"],
      update: ["admin", "teacher"],
      delete: ["admin"]
    }
  },
  {
    name: "Jadwal Mata Pelajaran",
    href: "/dashboard/subjects-schedule",
    scope: {
      create: ["admin"],
      read: ["admin", "teacher", "student"],
      update: ["admin", "teacher"],
      delete: ["admin"]
    }
  },
  {
    name: "Mata Pelajaran",
    href: "/dashboard/subjects",
    scope: {
      create: ["admin"],
      read: ["admin", "teacher", "student"],
      update: ["admin"],
      delete: ["admin"]
    }
  },
  {
    name: "Guru",
    href: "/dashboard/teacher",
    scope: {
      create: ["admin"],
      read: ["admin", "teacher", "student"],
      update: ["admin"],
      delete: ["admin"]
    }
  },
  {
    name: "Siswa",
    href: "/dashboard/student",
    scope: {
      create: ["admin"],
      read: ["admin, teacher", "student"],
      update: ["admin"],
      delete: ["admin"]
    }
  },
  {
    name: "Kelas",
    href: "/dashboard/class-page",
    scope: {
      create: ["admin"],
      read: ["admin", "teacher", "student"],
      update: ["admin"],
      delete: ["admin"]
    }
  },
  {
    name: "User",
    href: "/dashboard/user",
    scope: {
      create: ["admin"],
      read: ["admin"],
      update: ["admin"],
      delete: ["admin"]
    }
  }
];