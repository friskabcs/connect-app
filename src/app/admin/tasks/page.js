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

  useEffect(() => {
    const fetchTasks = async () => {
      let query = supabase.from('tasks').select('*').order('created_at', { ascending: false })
      if (filter === 'urgent') query = query.eq('urgent', true)

      const { data, error } = await query
      if (!error) {
        const withSelect = data.map(t => ({ ...t, selected: false }))
        setTasks(withSelect)
      }
    }

    fetchTasks()
  }, [filter])

  const handleAddTask = async (e) => {
    e.preventDefault()
    if (!title.trim()) return

    const { data, error } = await supabase.from('tasks').insert([
      { title, description: desc, urgent }
    ]).select()

    if (error) {
      console.error(error.message)
      return
    }

    setTasks([{ ...data[0], selected: false }, ...tasks])
    setTitle('')
    setDesc('')
    setUrgent(false)
    setModalOpen(false)
  }

  const handleDelete = async (id) => {
  const confirm = window.confirm('Are you sure you want to delete this task?')
  if (!confirm) return

  const { error } = await supabase.from('tasks').delete().eq('id', id)
  if (!error) {
    setTasks(tasks.filter(t => t.id !== id))
  } else {
    console.error('Delete error:', error)
  }
}


  const startEdit = (task) => {
    if (!task) return
    setEditingTask(task)
    setEditTitle(task.title)
    setEditDesc(task.description)
    setEditUrgent(task.urgent)
  }

  const handleEditSubmit = async (e) => {
    e.preventDefault()
    if (!editingTask) return

    const { data, error } = await supabase
      .from('tasks')
      .update({
        title: editTitle,
        description: editDesc,
        urgent: editUrgent
      })
      .eq('id', editingTask.id)
      .select()

    if (!error && data) {
      const updated = data[0]
      setTasks(tasks.map(t => t.id === updated.id ? { ...updated, selected: t.selected } : t))
      setEditingTask(null)
    } else {
      console.error(error?.message || 'Update error')
    }
  }

  const handleSelectAll = () => {
    const allSelected = tasks.every(task => task.selected)
    setTasks(tasks.map(t => ({ ...t, selected: !allSelected })))
  }

  const handleToggleSelect = (id) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, selected: !t.selected } : t))
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Tasks</h1>
      <div className="flex flex-col md:flex-row gap-6">
        {/* Left: Task List */}
        <div className="flex-1">
          <div className="bg-white rounded-xl shadow">
            <div className="flex gap-4 border-b px-4 pt-3">
              <button
                onClick={() => setFilter('all')}
                className={`pb-2 font-medium border-b-2 ${filter === 'all' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-blue-600'}`}
              >
                All
              </button>
              <button
                onClick={() => setFilter('urgent')}
                className={`pb-2 font-medium border-b-2 ${filter === 'urgent' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-blue-600'}`}
              >
                Urgent
              </button>
            </div>
            <ul className="divide-y">
              {tasks.map(task => (
                <li key={task.id} className="p-4 hover:bg-gray-50">
                  <label className="flex items-start gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      className="mt-1"
                      checked={task.selected || false}
                      onChange={() => handleToggleSelect(task.id)}
                    />
                    <div className="flex-1">
                      <div className="font-medium flex justify-between items-start">
                        <div>
                          {task.title}{' '}
                          {task.urgent && (
                            <span className="text-xs text-blue-500 border border-blue-100 bg-blue-50 px-2 py-0.5 rounded-full ml-2">
                              Urgent
                            </span>
                          )}
                        </div>
                        <div className="text-sm space-x-2">
                          <button
                            onClick={() => startEdit(task)}
                            className="text-blue-600 hover:underline"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(task.id)}
                            className="text-red-600 hover:underline"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                      {task.description && (
                        <div className="text-sm text-gray-500 mt-1">
                          {task.description}
                        </div>
                      )}
                    </div>
                  </label>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Right: Add + Select All */}
        <div className="space-y-3 min-w-[200px]">
          <button
            onClick={() => setModalOpen(true)}
            className="w-full flex gap-2 items-center px-4 py-2 rounded border shadow hover:bg-gray-100"
          >
            ➕ New Task
          </button>
          <button
            onClick={handleSelectAll}
            className="w-full flex gap-2 items-center px-4 py-2 rounded border shadow hover:bg-gray-100"
          >
            <CheckSquare size={16} /> Select all tasks
          </button>
        </div>
      </div>

      {/* Modal - Add Task */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <form
            onSubmit={handleAddTask}
            className="bg-white p-6 rounded-xl w-96 shadow space-y-4"
          >
            <h2 className="text-lg font-semibold">Add New Task</h2>
            <input
              className="w-full border px-3 py-2 rounded"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
            <textarea
              className="w-full border px-3 py-2 rounded"
              placeholder="Description"
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
            />
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={urgent}
                onChange={() => setUrgent(!urgent)}
              />
              Mark as urgent
            </label>
            <div className="flex justify-end gap-2">
              <button type="button" onClick={() => setModalOpen(false)}>
                Cancel
              </button>
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded"
              >
                Add
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Modal - Edit Task */}
      {editingTask && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <form
            onSubmit={handleEditSubmit}
            className="bg-white p-6 rounded-xl w-96 shadow space-y-4"
          >
            <h2 className="text-lg font-semibold">Edit Task</h2>
            <input
              className="w-full border px-3 py-2 rounded"
              placeholder="Title"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              required
            />
            <textarea
              className="w-full border px-3 py-2 rounded"
              placeholder="Description"
              value={editDesc}
              onChange={(e) => setEditDesc(e.target.value)}
            />
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={editUrgent}
                onChange={() => setEditUrgent(!editUrgent)}
              />
              Mark as urgent
            </label>
            <div className="flex justify-end gap-2">
              <button type="button" onClick={() => setEditingTask(null)}>
                Cancel
              </button>
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded"
              >
                Update
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}
