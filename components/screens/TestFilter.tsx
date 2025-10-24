import React, { useState } from 'react'

export default function TestFilter() {
  const [filter, setFilter] = useState('All')
  const [items] = useState([
    { id: 1, name: 'Item 1', category: 'A' },
    { id: 2, name: 'Item 2', category: 'B' },
    { id: 3, name: 'Item 3', category: 'A' },
  ])

  const filtered = items.filter(item => filter === 'All' || item.category === filter)

  return (
    <div className="p-8">
      <h1 className="text-2xl mb-4">Filter Test</h1>
      
      <select 
        value={filter} 
        onChange={e => {
          console.log('Filter changed to:', e.target.value)
          setFilter(e.target.value)
        }}
        className="border p-2 mb-4"
      >
        <option value="All">All</option>
        <option value="A">Category A</option>
        <option value="B">Category B</option>
      </select>

      <div className="space-y-2">
        {filtered.map(item => (
          <div key={item.id} className="border p-2">
            {item.name} - {item.category}
          </div>
        ))}
      </div>

      <div className="mt-4 text-sm">
        Showing {filtered.length} of {items.length} items
      </div>
    </div>
  )
}
