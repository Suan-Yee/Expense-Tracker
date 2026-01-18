import CategoryBreakdown from './components/dashboard/CategoryBreakdown'
import MonthlyComparison from './components/dashboard/MonthlyComparison'

// Example data for testing components
const mockLastMonthTransactions = [
  { id: 1, type: 'expense', category: 'rent', amount: -1200, date: '2024-01-03', description: 'Monthly rent' },
  { id: 2, type: 'expense', category: 'groceries', amount: -180, date: '2024-01-06', description: 'Groceries' },
  { id: 3, type: 'expense', category: 'groceries', amount: -240, date: '2024-01-13', description: 'Groceries' },
  { id: 4, type: 'expense', category: 'utilities', amount: -165, date: '2024-01-14', description: 'Electricity' },
  { id: 5, type: 'expense', category: 'transport', amount: -95, date: '2024-01-16', description: 'Fuel' },
  { id: 6, type: 'expense', category: 'dining', amount: -120, date: '2024-01-18', description: 'Dining out' },
  { id: 7, type: 'expense', category: 'entertainment', amount: -75, date: '2024-01-21', description: 'Movies' },
  { id: 8, type: 'expense', category: 'health', amount: -40, date: '2024-01-25', description: 'Pharmacy' },
  { id: 9, type: 'income', category: 'salary', amount: 5000, date: '2024-01-01', description: 'Monthly salary' },
]

const mockCurrentMonthTransactions = [
  { id: 101, type: 'expense', category: 'rent', amount: -1250, date: '2024-02-03', description: 'Monthly rent' },
  { id: 102, type: 'expense', category: 'groceries', amount: -160, date: '2024-02-05', description: 'Groceries' },
  { id: 103, type: 'expense', category: 'groceries', amount: -210, date: '2024-02-12', description: 'Groceries' },
  { id: 104, type: 'expense', category: 'utilities', amount: -140, date: '2024-02-14', description: 'Electricity' },
  { id: 105, type: 'expense', category: 'transport', amount: -60, date: '2024-02-15', description: 'Transit' },
  { id: 106, type: 'expense', category: 'dining', amount: -145, date: '2024-02-18', description: 'Dining out' },
  { id: 107, type: 'expense', category: 'entertainment', amount: -30, date: '2024-02-19', description: 'Streaming' },
  { id: 108, type: 'expense', category: 'other', amount: -55, date: '2024-02-22', description: 'Misc' },
  { id: 109, type: 'income', category: 'salary', amount: 5000, date: '2024-02-01', description: 'Monthly salary' },
]

const mockTransactions = [...mockLastMonthTransactions, ...mockCurrentMonthTransactions]

function App() {
  return (
    <div className="app">
      <h1 className='bg-red-500'>Expense Tracker</h1>
      <div className="grid gap-6 p-6">
        <MonthlyComparison
          currentMonthTransactions={mockCurrentMonthTransactions}
          lastMonthTransactions={mockLastMonthTransactions}
        />
        <CategoryBreakdown transactions={mockTransactions} />
      </div>
    </div>
  )
}

export default App
