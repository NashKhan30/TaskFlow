# ⚡ TaskFlow — Modern Task & Productivity Manager

<div align="center">

![TaskFlow Banner](https://img.shields.io/badge/TaskFlow-Productivity_Redefined-8b5cf6?style=for-the-badge&logo=target)

A sleek, responsive, and high-performance task management application engineered with **React 19, TypeScript, Vite, Tailwind CSS v4, Redux Toolkit, TanStack Query, React Router v6 Data APIs, and Sonner**.

[Live Demo](https://taskflow.vercel.app) • [Report Bug](https://github.com/NashKhan30/TaskFlow/issues) • [Request Feature](https://github.com/NashKhan30/TaskFlow/issues)

</div>

---

## 🚀 Badges & Tech Stack

<div align="center">

![React](https://img.shields.io/badge/React_19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript_5.8-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite_6-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS_v4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Redux Toolkit](https://img.shields.io/badge/Redux_Toolkit-764ABC?style=for-the-badge&logo=redux&logoColor=white)
![TanStack Query](https://img.shields.io/badge/TanStack_Query-FF4154?style=for-the-badge&logo=react-query&logoColor=white)
![Sonner](https://img.shields.io/badge/Sonner-Toasts-000000?style=for-the-badge)
![React Router](https://img.shields.io/badge/React_Router_v6-CA4245?style=for-the-badge&logo=react-router&logoColor=white)

</div>

---

## 🌟 Key Features

### 📋 1. Complete Task CRUD Lifecycle
- **Create**: Add tasks with customized Title, Category, Due Date, and Priority.
- **Read**: Browse, search, filter by status, and sort by Priority, Date, or Alphabetical order.
- **Update**:
  - Instant checkbox toggle with smooth check animations.
  - **In-Place Editing Mode**: Edit title, category, due date, and priority directly on the task card with Save & Cancel controls.
- **Delete**: Remove individual tasks or batch-clear completed tasks with single-click actions.

### 🎨 2. Vibrant Multi-Color Design & Visual Hierarchy
- **Distinct Category Badges**:
  - 💼 **Work**: Electric Blue
  - 🌿 **Personal**: Neon Emerald
  - 📚 **Study**: Cosmic Purple
  - ❤️ **Health**: Vibrant Rose
  - 💰 **Finance**: Golden Amber
- **Left Priority Border Strips**:
  - 🔴 **Red Strip**: High Priority
  - 🟡 **Amber Strip**: Medium Priority
  - 🟢 **Green Strip**: Low Priority
- **4 Glowing Metric Cards**: Real-time counters with dynamic bottom accent glows for *Total Tasks*, *Completed*, *In Progress*, and *High Priority*.

### 🌗 3. Ultra-Smooth Light & Dark Mode
- Full system-wide theme engine with one-click instant toggle.
- Automatically persists theme preference in `localStorage`.
- Deep dark slate `#070b14` for high-focus night mode + Crisp light slate for bright daylight mode.

### 🍞 4. Next-Gen Toast Notifications (Powered by Sonner)
- Modern 3D fluid card-stack physics.
- Animated confirmation toasts for **Login, Account Creation, Task Add, Task Complete, Task Edit, and Delete**.
- Rich color styling synced directly with the active theme.

### 📱 5. 100% Mobile & Desktop Responsive
- **Mobile (< 640px)**:
  - Top header with hamburger menu and theme toggle.
  - Slide-out drawer with profile card, categories, and logout.
  - Thumb-friendly bottom floating navigation bar (`Tasks`, `Today`, `+ Add`, `Upcoming`, `Done`).
  - 2x2 metric cards grid and swipeable filter tabs.
- **Desktop (>= 1024px)**:
  - Sticky fixed left sidebar with category counters and bottom logout action.
  - 4-column metric cards grid and floating capsule creation bar.

### 🔐 6. Multi-User Authentication & Isolated Storage
- Client-side authentication with session persistence.
- RFC 5322 Email regex validation & strong password verification.
- **Isolated Workspace**: Each user gets private tasks scoped to their user ID (`taskflow_tasks_${userId}`).

---

## 🛠️ Architecture & Project Structure

```
TaskFlow/
├── public/                     # Static assets & favicon icons
├── src/
│   ├── api/                    # Centralized Axios instance & mock endpoints
│   │   ├── axiosInstance.ts    # Request token injection & 401 interceptors
│   │   ├── queryClient.ts      # TanStack Query client configuration
│   │   └── taskApi.ts          # Mock REST endpoints with optimistic updates
│   ├── components/             # Reusable UI components
│   │   ├── RouteErrorBoundary.tsx
│   │   ├── TaskForm.tsx        # Floating task creation bar with embedded controls
│   │   ├── TaskItem.tsx        # Task card with in-place edit mode
│   │   └── TaskList.tsx        # Task list wrapper
│   ├── context/                # React Context state management
│   │   ├── AuthContext.tsx     # User auth & profile management
│   │   ├── TaskContext.tsx     # Task state, CRUD, & user-scoped persistence
│   │   ├── ThemeContext.tsx    # Light & Dark theme state engine
│   │   └── ToastContext.tsx    # Sonner notification integration
│   ├── features/               # Redux Toolkit state slices
│   │   ├── authSlice.ts
│   │   ├── store.ts
│   │   └── taskSlice.ts
│   ├── hooks/                  # Custom React hooks
│   │   ├── useDebounce.ts      # 300ms search input debouncing
│   │   ├── useLocalStorage.ts  # Generic type-safe local storage hook
│   │   └── useTasksQuery.ts    # TanStack Query custom hook
│   ├── layouts/                # Route layout components
│   │   ├── AuthLayout.tsx      # Centered auth page container
│   │   └── MainLayout.tsx      # Sidebar + Mobile drawer + Bottom navigation
│   ├── pages/                  # Top-level route pages
│   │   ├── LoginPage.tsx
│   │   ├── RegisterPage.tsx
│   │   └── TasksPage.tsx       # Main dashboard & task manager
│   ├── routes/                 # React Router v6 Data API configuration
│   │   ├── ProtectedRoute.tsx
│   │   └── index.tsx
│   ├── types/                  # TypeScript interface definitions
│   │   ├── auth.ts
│   │   └── task.ts
│   ├── utils/                  # Regex validation helpers
│   │   └── validators.ts
│   ├── App.tsx                 # Root app provider tree
│   ├── index.css               # Tailwind CSS v4 directives & custom scrollbars
│   └── main.tsx                # React DOM entry point
├── package.json
├── tailwind.config.js
├── tsconfig.json
├── vercel.json                 # SPA routing rewrites for Vercel deployment
└── vite.config.ts              # Vite + Tailwind plugin configuration
```

---

## ⚡ Getting Started Locally

### Prerequisites
- **Node.js** (v18.0.0 or higher recommended)
- **npm** or **yarn** / **pnpm**

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/NashKhan30/TaskFlow.git
   cd TaskFlow
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```
   Open your browser and navigate to **`http://localhost:5173`**.

4. **Build for production:**
   ```bash
   npm run build
   ```

5. **Preview production build locally:**
   ```bash
   npm run preview
   ```

---

## 🌐 Deployment

### Deploy on Vercel (Instant)
1. Fork or push your code to GitHub.
2. Go to [Vercel](https://vercel.com/new) and import the repository.
3. Vercel will automatically detect Vite and the included `vercel.json` configuration.
4. Click **Deploy**!

### Deploy on Netlify
1. Run `npm run build` to generate the `dist/` directory.
2. Drag and drop `dist/` into [Netlify Drop](https://app.netlify.com/drop).

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!  
Feel free to check the [issues page](https://github.com/NashKhan30/TaskFlow/issues).

---

## 📄 License

This project is licensed under the **MIT License**.

<div align="center">

Made with ❤️ by [Nash Khan](https://github.com/NashKhan30)

</div>
