'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { CheckSquare } from 'lucide-react'

export default function TasksPage() {
  const [tasks, setTasks] = useState([])
  const [filter, setFilter] = useState('all')

  const [modalOpen, setModalOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [desc, setDesc] = useState('')
  const [urgent, setUrgent] = useState(false)

  const [editingTask, setEditingTask] = useState(null)
  const [editTitle, setEditTitle] = useState('')
  const [editDesc, setEditDesc] = useState('')
  const [editUrgent, setEditUrgent] = useState(false)

  const fetchTasks = async () => {
    let query = supabase.from('tasks').select('*').order('created_at', { ascending: false })

    if (filter === 'urgent') {
      query = query.eq('urgent', true)
    } else if (filter === 'done') {
      query = query.eq('status', 'done')
    }

    const { data, error } = await query
    if (!error) {
      const withSelect = data.map(t => ({ ...t, selected: false }))
      setTasks(withSelect)
    } else {
      console.error('Gagal fetch tasks:', error)
    }
  }

  useEffect(() => {
    fetchTasks()
  }, [filter])

  const handleAddTask = async (e) => {
    e.preventDefault()
    if (!title.trim()) return

    const { error } = await supabase.from('tasks').insert([
      { title, description: desc, urgent, status: 'pending' }
    ])

    if (!error) {
      setTitle('')
      setDesc('')
      setUrgent(false)
      setModalOpen(false)
      fetchTasks() 
    }
  }

  const handleDelete = async (id) => {
    const confirm = window.confirm('Are you sure you want to delete this task?')
    if (!confirm) return

    const { error } = await supabase.from('tasks').delete().eq('id', id)
    if (!error) {
      fetchTasks()
      alert('Task deleted successfully.')
    } else {
      console.error('Delete error:', error)
      alert('Failed to delete task.')
    }
  }

  const startEdit = (task) => {
    setEditingTask(task)
    setEditTitle(task.title)
    setEditDesc(task.description)
    setEditUrgent(task.urgent)
  }

  const handleEditSubmit = async (e) => {
    e.preventDefault()
    if (!editingTask) return

    const { error } = await supabase
      .from('tasks')
      .update({
        title: editTitle,
        description: editDesc,
        urgent: editUrgent
      })
      .eq('id', editingTask.id)

    if (!error) {
      setEditingTask(null)
      fetchTasks()
    } else {
      console.error('Update error:', error)
    }
  }

  const handleToggleDone = async (id, currentStatus) => {
    const newStatus = currentStatus === 'done' ? 'pending' : 'done'

    const { error } = await supabase
      .from('tasks')
      .update({ status: newStatus })
      .eq('id', id)

    if (!error) {
      fetchTasks()
    }
  }

  const handleSelectAll = async () => {
    const notDoneTasks = tasks.filter(t => t.status !== 'done')
    if (notDoneTasks.length === 0) return

    const ids = notDoneTasks.map(t => t.id)

    const { error } = await supabase
      .from('tasks')
      .update({ status: 'done' })
      .in('id', ids)

    if (!error) {
      fetchTasks()
    }
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Tasks</h1>

      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-1">
          <div className="bg-white rounded-xl shadow">
            <div className="flex gap-4 border-b px-4 pt-3">
              {['all', 'urgent', 'done'].map((key) => (
                <button
                  key={key}
                  onClick={() => setFilter(key)}
                  className={`pb-2 font-medium border-b-2 ${
                    filter === key
                      ? key === 'done'
                        ? 'border-green-600 text-green-600'
                        : 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-blue-600'
                  }`}
                >
                  {key === 'all' ? 'All' : key.charAt(0).toUpperCase() + key.slice(1)}
                </button>
              ))}
            </div>

            <ul className="divide-y">
              {tasks.map(task => (
                <li key={task.id} className="p-4 hover:bg-gray-50">
                  <label className="flex items-start gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      className="mt-1"
                      checked={task.status === 'done'}
                      onChange={() => handleToggleDone(task.id, task.status)}
                    />
                    <div className="flex-1">
                      <div className="font-medium flex justify-between items-start">
                        <div>
                          <span className={task.status === 'done' ? 'line-through text-gray-400' : ''}>
                            {task.title}
                          </span>
                          {task.urgent && (
                            <span className="text-xs text-blue-500 border border-blue-100 bg-blue-50 px-2 py-0.5 rounded-full ml-2">
                              Urgent
                            </span>
                          )}
                        </div>
                        <div className="text-sm space-x-2">
                          <button onClick={() => startEdit(task)} className="text-blue-600 hover:underline">Edit</button>
                          <button onClick={() => handleDelete(task.id)} className="text-red-600 hover:underline">Delete</button>
                        </div>
                      </div>
                      {task.description && <div className="text-sm text-gray-500 mt-1">{task.description}</div>}
                    </div>
                  </label>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="space-y-3 min-w-[200px]">
          <button onClick={() => setModalOpen(true)} className="w-full flex gap-2 items-center px-4 py-2 rounded border shadow hover:bg-gray-100">
            ➕ New Task
          </button>
          <button onClick={handleSelectAll} className="w-full flex gap-2 items-center px-4 py-2 rounded border shadow hover:bg-gray-100">
            <CheckSquare size={16} /> Mark all as done
          </button>
        </div>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <form onSubmit={handleAddTask} className="bg-white p-6 rounded-xl w-96 shadow space-y-4">
            <h2 className="text-lg font-semibold">Add New Task</h2>
            <input className="w-full border px-3 py-2 rounded" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
            <textarea className="w-full border px-3 py-2 rounded" placeholder="Description" value={desc} onChange={(e) => setDesc(e.target.value)} />
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={urgent} onChange={() => setUrgent(!urgent)} /> Mark as urgent
            </label>
            <div className="flex justify-end gap-2">
              <button type="button" onClick={() => setModalOpen(false)}>Cancel</button>
              <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Add</button>
            </div>
          </form>
        </div>
      )}

      {editingTask && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <form onSubmit={handleEditSubmit} className="bg-white p-6 rounded-xl w-96 shadow space-y-4">
            <h2 className="text-lg font-semibold">Edit Task</h2>
            <input className="w-full border px-3 py-2 rounded" placeholder="Title" value={editTitle} onChange={(e) => setEditTitle(e.target.value)} required />
            <textarea className="w-full border px-3 py-2 rounded" placeholder="Description" value={editDesc} onChange={(e) => setEditDesc(e.target.value)} />
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={editUrgent} onChange={() => setEditUrgent(!editUrgent)} /> Mark as urgent
            </label>
            <div className="flex justify-end gap-2">
              <button type="button" onClick={() => setEditingTask(null)}>Cancel</button>
              <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Update</button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}
