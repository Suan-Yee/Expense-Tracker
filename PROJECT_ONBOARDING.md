# Developer Onboarding Guide

This guide is for a developer joining the project for the first time. It explains what the application does, how data moves through it, which files own each responsibility, and the fastest order in which to learn the codebase.

## 1. Project in one minute

This is a MERN personal-finance application. A signed-in user can:

- record income, expenses, savings, and recurring transactions;
- filter, sort, paginate, edit, delete, and export transactions;
- see dashboard and analytics summaries;
- define monthly category budgets and compare them with actual spending;
- create savings goals, deposit into them, and withdraw from them;
- manage a profile, password, account, and light/dark theme.

The repository contains two applications:

```text
MERN-fullstack/
|-- new_client/    React 19 + TypeScript + Vite frontend
|-- server/        Express 5 + TypeScript + MongoDB/Mongoose backend
`-- PROJECT_ONBOARDING.md
```

The main frontend pattern is:

```text
TanStack route -> page/container -> feature component -> Zustand store
    -> service -> shared Axios client -> Express route -> auth middleware
    -> controller -> Mongoose model -> MongoDB
```

API responses return a common shape:

```ts
{
  success: boolean;
  data?: T;
  message?: string;
  errorMessage?: string;
}
```

## 2. Run the project locally

Prerequisites: Node.js, npm, and either a local MongoDB instance or a MongoDB connection string.

Backend environment (`server/.env`):

```env
MONGODBURI=mongodb://localhost:27017/expense-tracker
JWT_SECRET=replace-with-a-long-random-secret
PORT=5000
HOST=localhost
NODE_ENV=development
CLIENT_URLS=http://localhost:3000,http://localhost:5173
```

Frontend environment (`new_client/.env`, optional):

```env
VITE_PORT=3000
VITE_API_BASE_URL=http://localhost:5000/api
VITE_API_PROXY_TARGET=http://localhost:5000
```

Open two terminals:

```powershell
cd server
npm install
npm run dev
```

```powershell
cd new_client
npm install
npm run dev
```

Then open the URL printed by Vite, normally `http://localhost:3000` in this project. The server defaults to `http://localhost:5000`.

Useful checks:

```powershell
cd new_client
npm run lint
npm run build
```

There is currently no automated test command in either `package.json`. For backend TypeScript checking, use `npx tsc --noEmit` from `server/`.

## 3. Learn the project quickly

Follow this order instead of reading every file alphabetically.

### First 30 minutes: understand the application shell

1. Read `new_client/src/main.tsx`: mounts React and initializes the theme store.
2. Read `new_client/src/App.tsx`: creates the TanStack Router.
3. Read `new_client/src/routes/__root.tsx`: shared layout, page title, profile loading, background, navigation, and route outlet.
4. Read `new_client/src/routes/index.tsx` and one protected route such as `routes/expenses.tsx`: these show redirects and route-level authentication.
5. Read `new_client/src/services/api.ts`: every frontend API request passes through this Axios instance.
6. Read `server/src/index.ts`: database startup, middleware order, route prefixes, 404 handling, and global error handling.

### Next 60 minutes: trace one complete feature

Expenses are the best first feature because other features depend on them. Read these files in order:

```text
routes/expenses.tsx
  -> pages/ExpensesPage.tsx
  -> components/Expenses/*
  -> store/expenseStore.ts
  -> services/expenseService.ts
  -> server/src/routes/expenseRoutes.ts
  -> server/src/controllers/expenseController.ts
  -> server/src/models/Expense.ts
```

Watch a request in the browser Network tab while adding an expense. Then put a breakpoint or temporary log in the store action and controller. This makes the architecture concrete very quickly.

### Next two hours: learn the cross-feature relationships

Read budgets, goals, and analytics after expenses:

- Budgets calculate `spent`, `remaining`, and `percentage` from expense records.
- Goal deposits and withdrawals can create expense records.
- Dashboard and analytics aggregate expense records.
- Deleting an account removes the user and their expenses, budgets, and goals.

Finally, read `components/Common`, `components/ui`, `hooks`, and `utils` before creating new UI. A reusable solution may already exist.

## 4. Frontend architecture

### Routes and application shell

TanStack Router uses file-based routes under `new_client/src/routes`. `routeTree.gen.ts` is generated; do not edit it manually.

| URL | Route file | Page/component | Purpose |
|---|---|---|---|
| `/` | `routes/index.tsx` | redirect only | Sends authenticated users to dashboard and others to login |
| `/login` | `routes/login.tsx` | `LoginPage` -> `LoginForm` | Authenticate and store JWT |
| `/signup` | `routes/signup.tsx` | `SignupPage` -> `SignupForm` | Create an account |
| `/dashboard` | `routes/dashboard.tsx` | `DashboardPage` -> `Dashboard` | Financial overview |
| `/expenses` | `routes/expenses.tsx` | `ExpensesPage` | Transaction management and export |
| `/analytics` | `routes/analytics.tsx` | `AnalyticsPage` -> `AnalyticsView` | Charts, KPIs, and summary tables |
| `/budgets` | `routes/budgets.tsx` | `BudgetsPage` | Monthly category limits |
| `/goal` | `routes/goal.tsx` | `GoalPage` | Savings goals and deposits/withdrawals |
| `/profile` | `routes/profile.tsx` | `ProfilePage` -> `ProfileView` | User details and account actions |
| `/settings` | `routes/settings.tsx` | `SettingsPage` | Theme and session settings |

Protected route files read `useAuthStore.getState().isAuthenticated` in `beforeLoad`. The root layout displays `Navigation` only when authenticated and loads the profile when a token exists but user data has not yet been loaded.

### Pages, components, stores, and services

- **Routes** decide whether a URL is allowed and choose its page.
- **Pages** coordinate feature components and local UI state such as open panels and selected records.
- **Components** render UI and emit user actions. Some feature components access their feature store directly.
- **Zustand stores** own shared client state, loading/error state, and async feature actions.
- **Services** translate store operations into HTTP calls. They should not own UI state.
- **Types** define request, response, entity, filter, and store shapes.

When adding a new backend-backed feature, follow that separation. Do not call Axios directly from a page or visual component unless there is a strong reason.

### State stores and important functions

| Store | State owned | Important actions |
|---|---|---|
| `authStore.ts` | user, token, auth/loading/error flags | `login`, `signup`, `getProfile`, `updateProfile`, `changePassword`, `deleteAccount`, `logout` |
| `expenseStore.ts` | transactions, filters, client pagination | CRUD actions, `getAllExpenses`, `generateRecurring`, `setFilters`, page setters |
| `analyticsStore.ts` | dashboard stats, trends, category/month data, period filters | `fetchDashboard`, `setFilters`, `setSelectedYear` |
| `budgetStore.ts` | budgets and selected month/year | CRUD actions, `fetchBudgets`, `setFilters` |
| `goalStore.ts` | goals and request status | CRUD actions and `fetchGoals` |
| `themeStore.ts` | light/dark theme | `toggleTheme`, `setTheme`; also persists and applies the root `dark` class |

`expenseStore` and `budgetStore` use request sequence counters so a slow older filter request cannot overwrite newer results.

### Feature component structure

#### Expenses

- `ExpensesPage`: feature coordinator; owns drawer, delete dialog, export dialog, editing selection, and client-side page slicing.
- `FiltersBar`: modifies category, text, date, and sort filters through `expenseStore`.
- `TransactionsTable`: displays records and reports edit/delete/sort actions upward.
- `Pagination`: reads and updates pagination in `expenseStore`.
- `TransactionPanel`: add/edit form; calls store create/update actions.
- `ExportModal`: exports the currently loaded expense array to CSV or PDF entirely in the browser.
- `CustomSelect`, `CustomDatePicker`, `DateRangePicker`: feature-level input controls.

#### Dashboard and analytics

- `Dashboard`: combines analytics, expenses, and budgets for the overview screen.
- `AnalyticsView`: fetches analytics and composes the analytics screen.
- `AnalyticsHeader`: screen heading.
- `AnalyticsKPIs`: summary values.
- `AnalyticsCharts`: Recharts visualizations; also responds to theme changes.
- `AnalyticsTables`: tabular category/month details.
- `PeriodFilterBar`: reusable analytics period selector backed by `analyticsStore`.

`analyticsStore.fetchDashboard` runs four requests in parallel: dashboard stats, trends, category totals, and monthly totals.

#### Budgets

- `BudgetsPage`: month navigation, add/edit state, delete confirmation, and list composition.
- `BudgetSummary`: totals across visible budgets.
- `BudgetCard`: one category's usage, progress, status, edit, and delete controls.
- `BudgetForm`: create/edit panel connected to `budgetStore`.

Budget progress is not stored in MongoDB. The backend calculates it from matching expense transactions each time budgets are fetched or changed.

#### Goals

- `GoalPage`: filtering, modal state, deletion, and deposit/withdraw coordination.
- `GoalSummary`: totals and completion overview.
- `GoalRoadmap`: renders goals and exposes edit/delete/deposit actions.
- `GoalFormModal`: creates or edits goal metadata.
- `DepositModal`: handles both deposit and withdrawal modes.
- `GoalLoader`: feature-specific loading skeleton.

A goal deposit creates a `saving` transaction by default; a withdrawal creates an `income` transaction. The user can disable this with `recordInExpense`.

#### Authentication and profile

- `AuthFormField`: shared label/wrapper for authentication inputs.
- `LoginForm` and `SignupForm`: validation, store calls, and navigation.
- `ProfileView`: profile editor and entry point to password/account dialogs.
- `PasswordModal`: changes the password through `authStore`.
- `DeleteAccountModal`: confirms permanent account deletion.

Important: successful sign-up sets the returned user in the store but does not save the returned JWT or mark the session authenticated. The expected flow is sign up, then log in.

## 5. Reusable frontend code

Check these before building a new component.

### Application-level reusable components

| Component | Reuse it for |
|---|---|
| `Common/ActionConfirmModal` | Destructive or important confirmation actions; supports danger/default variants and loading state |
| `Common/KPICard` | Currency KPI tiles with several color themes and optional comparison text |
| `Common/Loader` | Standard loading message |
| `Common/GlobalError` | Error message with optional retry action |
| `Common/PeriodFilterBar` | Dashboard/analytics date-range selection |
| `Common/Navigation` | Authenticated desktop/mobile navigation and user/theme controls |
| `Common/AnimatedBackground` | Global visual background; mounted once in the root layout |
| `Auth/AuthFormField` | Consistent auth form label and input layout |

### UI primitives

`new_client/src/components/ui` contains reusable styled primitives based mainly on Radix UI:

- `button`, `badge`, `card`, `input`, and `label`;
- `dialog` and `popover` building blocks;
- `select` primitives;
- `calendar` based on React Day Picker.

These use `lib/utils.ts` function `cn(...)`, which combines conditional class names and resolves conflicting Tailwind classes.

Some feature screens still use custom HTML/Tailwind controls. When extending an existing screen, follow its current visual system; when creating shared UI, prefer the primitives above.

### Reusable hooks and utilities

| File/function | Responsibility |
|---|---|
| `hooks/useModalAccessibility.ts` | Focus management, focus trapping, Escape handling, and returning focus after a modal closes |
| `hooks/useClickOutside.ts` | Calls a handler when a pointer event occurs outside a referenced element |
| `utils/formatUtils.ts` / `formatCurrency` | Consistent USD currency formatting |
| `utils/dateUtils.ts` / `parseDateForUI` | Safely converts stored date values for controls |
| `utils/dateUtils.ts` / `formatDate` | Consistent date-fns formatting |
| `utils/dateUtils.ts` / `getMonths`, `getYears` | Builds option lists for selectors |
| `constants/categories.ts` | Shared category lists, labels, and visual colors |

Use `useModalAccessibility` for any new custom modal or drawer that is not already using Radix Dialog.

## 6. Backend architecture

### Request lifecycle

`server/src/index.ts` performs these steps in order:

1. loads `.env`;
2. starts the MongoDB connection;
3. installs CORS and JSON parsing;
4. mounts feature routers below `/api`;
5. returns a JSON 404 for unknown endpoints;
6. passes errors to `errorHandler`;
7. starts the HTTP server.

Every protected endpoint uses `requireAuth`. It expects `Authorization: Bearer <token>`, verifies the JWT, and attaches `req.userId`. Controllers must scope reads and writes to that user.

`asyncHandler` converts rejected async controller promises into Express errors. `AppError` represents expected HTTP errors. `sendSuccess` keeps successful response formatting consistent. The global `errorHandler` normalizes application, Mongoose, duplicate-key, casting, and JWT errors.

### API map

All paths below are relative to `/api`.

| Method and path | Controller | Purpose |
|---|---|---|
| `POST /auth/signup` | `authController.signup` | Validate input, hash password, create user, return user and JWT |
| `POST /auth/login` | `authController.login` | Verify credentials and return user and JWT |
| `GET /profile` | `profileController.getProfile` | Return current user without password |
| `PUT /profile` | `profileController.updateProfile` | Update name/email/profile image |
| `PUT /profile/password` | `profileController.changePassword` | Verify current password and store a new hash |
| `DELETE /profile` | `profileController.deleteAccount` | Remove user and related feature data |
| `GET /expenses` | `expenseController.getAllExpenses` | User-scoped filtering, search, date range, and sorting |
| `GET /expenses/:id` | `expenseController.getExpenseById` | Return one owned transaction |
| `POST /expenses` | `expenseController.createExpense` | Validate and create a transaction or recurring template |
| `PUT /expenses/:id` | `expenseController.updateExpense` | Validate ownership and update fields/recurrence |
| `DELETE /expenses/:id` | `expenseController.deleteExpense` | Delete an owned transaction |
| `POST /expenses/generate-recurring` | `expenseController.generateRecurring` | Generate every missed occurrence and advance template due dates |
| `GET /analytics/category` | `analyticsController.getExpenseByCategories` | Category totals for a period |
| `GET /analytics/monthly` | `analyticsController.getMonthlyTotal` | Monthly income/expense/saving totals |
| `GET /analytics/dashboard` | `analyticsController.getDashboardStatus` | Dashboard KPIs and comparisons |
| `GET /analytics/trends` | `analyticsController.getSpendingTrends` | Time-series spending data |
| `GET /budgets` | `budgetController.getBudgets` | Month budgets enriched with calculated progress |
| `POST /budgets` | `budgetController.createBudget` | Create one category budget for a month |
| `PUT /budgets/:id` | `budgetController.updateBudget` | Update a budget limit |
| `DELETE /budgets/:id` | `budgetController.deleteBudget` | Delete an owned budget |
| `GET /goals` | `goalController.getGoals` | List owned goals newest first |
| `POST /goals` | `goalController.createGoal` | Create a goal and optionally record initial savings |
| `PUT /goals/:id` | `goalController.updateGoal` | Edit, deposit, or withdraw; optionally record a transaction |
| `DELETE /goals/:id` | `goalController.deleteGoal` | Delete an owned goal |

### Data models and relationships

```text
User
 |-- has many Expense records
 |-- has many Budget records
 `-- has many Goal records

Expense data -> analytics aggregations
Expense data -> budget spent/progress calculations
Goal deposit/withdrawal -> optional new Expense record
```

- `User`: name, unique lowercase email, hashed password, optional profile image.
- `Expense`: amount, transaction type, category, description, date, tags, recurrence metadata, and owner.
- `Budget`: owner, category, zero-based month, year, and limit. A compound unique index allows only one budget per user/category/month/year.
- `Goal`: owner, title, target/current amounts, optional deadline, category, display color, and notes.

The client and server each define related TypeScript types. If an API entity changes, search both `new_client/src/types` and `server/src/types/index.ts` and update both sides.

## 7. Important behaviors and common traps

- **JWT persistence:** the token key is `EXPENSE_TOKEN` in local storage. The Axios request interceptor adds it; a 401 response removes it and redirects to login.
- **Authentication is checked client-side and server-side:** route guards improve UX, but `requireAuth` is the actual security boundary.
- **Recurring generation has a side effect on reads:** `expenseStore.getAllExpenses()` first calls the recurring generation endpoint silently, then fetches transactions.
- **Pagination is client-side:** the server returns the filtered list, `ExpensesPage` slices it, and `Pagination` changes the slice. Do not assume API pagination currently exists.
- **Expense filters trigger requests immediately:** `setFilters` resets page 1 and calls `getAllExpenses`.
- **Months are zero-based:** budgets use `0` for January through `11` for December.
- **Budget progress is computed:** changing or deleting expenses can change budget progress without changing the budget document.
- **Analytics uses MongoDB aggregation:** date-range behavior is centralized in `analyticsController.getDateRangeFromQuery`; update it carefully when adding a new period option.
- **Generated router file:** never manually edit `new_client/src/routeTree.gen.ts`.
- **Error payload consistency:** frontend stores mostly expect `errorMessage`. Keep backend errors on the common response shape when adding endpoints.
- **Theme initialization is an import side effect:** `main.tsx` imports `themeStore` before rendering so the root theme class is applied immediately.
- **No test suite yet:** make small changes, run lint/build/type checks, and manually exercise related features. Adding tests around controllers and stores would be high-value work.

## 8. How to add or change a feature

For a new backend-backed feature, use this checklist:

1. Define or update the Mongoose model and server types.
2. Write controller logic with input validation and user ownership checks.
3. Add protected Express routes and mount the router in `server/src/index.ts` if it is new.
4. Add/update frontend types.
5. Add service functions using the shared `api` client.
6. Add Zustand state and actions if multiple components share the data.
7. Build feature components from existing common components and UI primitives.
8. Add the page and route, including `beforeLoad` protection when required.
9. Verify loading, empty, error, success, and unauthorized states.
10. Run frontend lint/build and backend TypeScript checking.

For a small UI-only change, start at the page/component and reuse existing hooks, formatting utilities, category constants, and UI primitives.

## 9. Suggested first tasks for a new developer

Good low-risk tasks that teach the architecture:

1. Add an empty-state or error-state improvement to one feature using `GlobalError` or a shared pattern.
2. Add a new period option end-to-end: `PeriodFilterBar`, analytics types/service, and `getDateRangeFromQuery`.
3. Add controller tests for expense validation and ownership checks.
4. Consolidate repeated category arrays in forms with `constants/categories.ts`.
5. Add a root README that links to this guide and provides the two-terminal startup commands.

Avoid beginning with recurring generation, analytics aggregation, account deletion, or goal-to-expense synchronization. Those paths change multiple records or features and are better tackled after tracing the full request flow.

## 10. Quick debugging map

| Symptom | Start here |
|---|---|
| Redirected to login | `services/api.ts`, local storage token, `authStore.ts`, `requireAuth` |
| Page URL does not work | matching file under `routes`, generated route tree, route `beforeLoad` |
| Button changes nothing | component handler -> relevant Zustand action -> browser Network tab |
| Request URL is wrong | feature service and `VITE_API_BASE_URL` |
| API returns 401 | Axios Authorization header, `JWT_SECRET`, token age, `requireAuth` |
| API returns validation error | relevant controller, then Mongoose schema |
| Budget amount looks wrong | `budgetController.calculateSpent`, expense category/type/date/month |
| Dashboard/chart looks wrong | analytics filters, analytics service params, aggregation controller |
| Duplicate recurring rows | `generateRecurring`, source `nextDueDate`, repeated app fetches |
| Dark mode styling is wrong | `themeStore`, root `dark` class, component `dark:` Tailwind classes |
| Modal keyboard behavior is wrong | `useModalAccessibility` or Radix Dialog usage |

The most useful mental model is: **routes protect and select pages; pages coordinate; components render; stores manage client state; services speak HTTP; controllers enforce business rules; models persist data.**
