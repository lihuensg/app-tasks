import { useForm } from 'react-hook-form'
import { useTasks } from '../context/TasksContext'
import { useNavigate, useParams } from 'react-router-dom'
import { useEffect } from 'react'


function TaskFormPage() {
  const { register, handleSubmit, setValue } = useForm()
  const { createTasks, getTask, updateTask } = useTasks()
  const navigate = useNavigate()
  const params = useParams()

  useEffect(() => {
    async function loadTask() {
      if (params.id) {
        const task = await getTask(params.id)
        setValue('title', task.title)
        setValue('description', task.description)
      }
    }
    loadTask();
  }, [])

  const onSubmit = handleSubmit((data) => {
    if (params.id) {
      updateTask(params.id, data)
    } else {
      createTasks(data)
    }
    navigate('/tasks')
  })

  return (
    <div className='bg-zinc-800 max-w-md w-full p-10 rounded-md my-2'>
      <form onSubmit={onSubmit}>
        <input type="text" placeholder="Title"
          {...register('title')}
          className='w-full bg-zinc-700 text-white px-4 py-2 rounded-md my-2'
          autoFocus
        />
        <textarea rows="3" placeholder="Description"
          {...register('description')}
          className='w-full bg-zinc-700 text-white px-4 py-2 rounded-md'
        ></textarea>
        <button>
          Save
        </button>
      </form>
    </div>
  )
}

export default TaskFormPage