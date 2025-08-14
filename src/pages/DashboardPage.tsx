export function DashboardPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
      <p className="mt-2 text-gray-600">Welcome to your Cliento CRM dashboard.</p>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Placeholder for stats cards */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-700">Active Clients</h3>
          <p className="mt-2 text-3xl font-bold text-gray-900">12</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-700">Open Projects</h3>
          <p className="mt-2 text-3xl font-bold text-gray-900">5</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-700">Overdue Invoices</h3>
          <p className="mt-2 text-3xl font-bold text-red-600">2</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-700">Revenue (Month)</h3>
          <p className="mt-2 text-3xl font-bold text-green-600">$8,450</p>
        </div>
      </div>
    </div>
  );
}
