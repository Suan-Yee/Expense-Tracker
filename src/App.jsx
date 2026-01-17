import { useState } from 'react'
import Dashboard from './pages/Dashboard'
import BudgetPieChart from './components/dashboard/BudgetPieChart'
import CategoryBreakdown from './components/dashboard/CategoryBreakdown'

// Mock transactions data for testing
const mockTransactions = [
  { id: 1, type: 'expenses', category: 'rent', amount: 1200, date: '2024-01-15', description: 'Monthly rent' },
  { id: 2, type: 'expenses', category: 'groceries', amount: 350, date: '2024-01-16', description: 'Weekly groceries' },
  { id: 3, type: 'expenses', category: 'utilities', amount: 150, date: '2024-01-17', description: 'Electricity bill' },
  { id: 4, type: 'expenses', category: 'transport', amount: 120, date: '2024-01-18', description: 'Gas and parking' },
  { id: 5, type: 'expenses', category: 'dining', amount: 85, date: '2024-01-19', description: 'Restaurant dinner' },
  { id: 6, type: 'expenses', category: 'entertainment', amount: 45, date: '2024-01-20', description: 'Movie tickets' },
  { id: 7, type: 'expenses', category: 'groceries', amount: 280, date: '2024-01-21', description: 'Grocery shopping' },
  { id: 8, type: 'expenses', category: 'health', amount: 200, date: '2024-01-22', description: 'Doctor visit' },
  { id: 9, type: 'expenses', category: 'transport', amount: 95, date: '2024-01-23', description: 'Uber rides' },
  { id: 10, type: 'expenses', category: 'dining', amount: 120, date: '2024-01-24', description: 'Lunch meetings' },
  { id: 11, type: 'expenses', category: 'entertainment', amount: 60, date: '2024-01-25', description: 'Concert tickets' },
  { id: 12, type: 'expenses', category: 'other', amount: 75, date: '2024-01-26', description: 'Miscellaneous' },
  { id: 13, type: 'income', category: 'salary', amount: 5000, date: '2024-01-01', description: 'Monthly salary' },
  { id: 14, type: 'income', category: 'freelance', amount: 800, date: '2024-01-10', description: 'Freelance work' },
];

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="app">
      <h1 className='bg-red-500'>Expense Tracker</h1>
      {/* <BudgetPieChart /> */}
      <CategoryBreakdown transactions={mockTransactions} />
    </div>
  )
}

export default App
