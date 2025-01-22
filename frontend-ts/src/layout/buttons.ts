interface Option {
  label: string;
  path: string;
  icon?: string;
  role?: string[];
  loginRequired?: boolean;
}

interface Button {
  label: string;
  path?: string;
  icon: string;
  type: "button" | "menu";
  options?: Option[];
  role?: string[];
  loginRequired?: boolean;
}

export const buttons: Button[] = [
  {
    label: "Home",
    path: "/",
    icon: "https://img.icons8.com/3d-fluency/94/home.png",
    type: "button",
    loginRequired: false,
  },
  {
    label: "Admin",
    icon: "https://img.icons8.com/3d-fluency/94/user-shield.png",
    type: "menu",
    loginRequired: true,
    role: ["admin"],
    options: [
      {
        label: "User Master",
        path: "/admin/users",
        loginRequired: true,
        icon: "https://img.icons8.com/3d-fluency/94/manager--v1.png",
      },
      {
        label: "Academic Info",
        path: "/admin/academic",
        loginRequired: true,
        icon: "https://img.icons8.com/3d-fluency/94/physics.png",
      },

      {
        label: "Books",
        path: "/admin/books",
        icon: "https://img.icons8.com/3d-fluency/94/books.png",
        loginRequired: true,
      },
      {
        label: "Online Exams",
        path: "/admin/exams/online",
        loginRequired: true,
        icon: "https://img.icons8.com/3d-fluency/94/domain.png",
      },
      {
        label: "Offline Exams",
        path: "/admin/exams/offline",
        loginRequired: true,
        icon: "https://img.icons8.com/3d-fluency/94/document.png",
      },
    ],
  },
  {
    label: "Data",
    type: "menu",
    icon: "https://img.icons8.com/fluency/48/database--v1.png",
    loginRequired: true,
    role: ["admin"],
    options: [
      {
        label: "JEE Data",
        path: "/admin/jee-data",
        loginRequired: true,
        icon: "https://img.icons8.com/3d-fluency/50/statistics.png",
      },
      {
        label: "Batch",
        path: "/admin/batch",
        loginRequired: true,
        icon: "https://img.icons8.com/3d-fluency/94/layers.png",
      },
      {
        label: "Lectures",
        path: "/admin/lectures",
        loginRequired: true,
        icon: "https://img.icons8.com/3d-fluency/94/teacher-giving-lecture-in-classroom.png",
      },
    ],
  },
  {
    label: "Lectures",
    path: "/lectures",
    icon: "https://img.icons8.com/3d-fluency/94/teacher-giving-lecture-in-classroom.png",
    type: "button",
    loginRequired: false,
    role: ["admin", "student"],
  },
  {
    label: "Batch",
    path: "/batch",
    icon: "https://img.icons8.com/3d-fluency/94/layers.png",
    type: "button",
    loginRequired: true,
    role: ["admin"],
  },
  // {
  //   label: "Books",
  //   path: "/books",
  //   icon: "https://img.icons8.com/3d-fluency/94/books.png",
  //   type: "button",
  //   loginRequired: true,
  //   role: ["admin", "student"],
  // },
  {
    label: "Exams",
    icon: "https://img.icons8.com/3d-fluency/94/documents.png",
    type: "menu",
    role: ["admin"],
    loginRequired: true,
    options: [
      {
        label: "Online Exam",
        path: "/exams/online",
        icon: "https://img.icons8.com/3d-fluency/94/domain.png",
      },
      {
        label: "offline Exam",
        path: "/exams/offline",
        icon: "https://img.icons8.com/3d-fluency/94/document.png",
      },
    ],
  },
  {
    label: "JEE Main",
    icon: "https://img.icons8.com/3d-fluency/94/signing-a-document.png",
    type: "menu",
    role: ["admin"],
    loginRequired: false,
    options: [
      {
        label: "JEE City Info",
        path: "/automation/jeemain/cityinfo",
        icon: "https://img.icons8.com/3d-fluency/94/city.png",
        loginRequired: false,
      },
      {
        label: "JEE Admit Card",
        path: "/automation/jeemain/admitcard",
        icon: "https://img.icons8.com/3d-fluency/94/pdf.png",
        loginRequired: false,
      },
    ],
  },
  {
    label: "Analysis",
    icon: "https://img.icons8.com/3d-fluency/50/statistics.png",
    path: "",
    role: ["admin"],
    loginRequired: false,
    type: "menu",
    options: [
      {
        label: "JEE Main",
        path: "/analysis/jeemain",
        icon: "https://img.icons8.com/3d-fluency/50/chart.png",
        loginRequired: false,
      },
      {
        label: "JEE Advanced",
        path: "/analysis/jeeadvanced",
        icon: "https://img.icons8.com/3d-fluency/50/pie-chart.png",
        loginRequired: false,
      },
    ],
  },
  // {
  //   label: "Question Bank",
  //   path: "/question-bank",
  //   icon: "https://img.icons8.com/3d-fluency/50/help.png",
  //   loginRequired: true,
  //   role: ["admin"],
  //   type: "button",
  // },
  // {
  //   label: "Doubts",
  //   path: "/doubts",
  //   icon: "https://img.icons8.com/3d-fluency/94/view-more.png",
  //   loginRequired: true,
  //   role: ["admin", "student"],
  //   type: "button",
  // },
  // {
  //   label: "Chat",
  //   path: "/chat",
  //   icon: "https://img.icons8.com/isometric/50/chat.png",
  //   loginRequired: true,
  //   role: ["admin"],
  //   type: "button",
  // },
];
