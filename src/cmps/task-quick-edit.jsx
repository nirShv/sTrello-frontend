
import { FaWindowMaximize } from 'react-icons/fa'
import { BsTagFill } from 'react-icons/bs'
import { HiUser } from 'react-icons/hi'
import { HiArchive } from 'react-icons/hi'
import { TaskLabel } from './task-label.jsx'
import { useState, useRef, useEffect } from 'react'
import { TaskMember } from './task-members.jsx'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { updateTask, removeTask } from '../store/board.actions'
import { TaskDetailsLabelModal } from './task-details-labels-modal.jsx'

export const TaskQuickEdit = ({ task, pos, toggaleQuickEdit, boardId, groupId }) => {

  const [title, setTaskTitle] = useState(task.title)
  const [labelModal, setLabelModal] = useState(false)
  const [currentBoardId, setBoardId] = useState(null)
  const [currentGroupId, setGroupId] = useState(null)
  const [labelModalPos, setLabelModalPos] = useState(null)
  const [windowWidth, setWidth] = useState(window.innerWidth)
  const [windowHeight, setHeight] = useState(window.innerHeight)

  const refLabelModal = useRef(null)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  useEffect(() => {
    document.addEventListener("click", handleClickOutside, true)

    return (
      () => {
        document.removeEventListener("click", handleClickOutside, false)
      }
    )
  }, [])

  useEffect(() => {

    if (!boardId) return
    setBoardId(boardId)
    if (!groupId) return
    setGroupId(groupId)

  }, [])

  const handleClickOutside = (e) => {
    if (!refLabelModal.current) return
    if (!refLabelModal.current.contains(e.target)) {
      setLabelModal(false)
    }
  }

  const handleChange = (ev) => {
    setTaskTitle(ev.target.value)
  }

  const onEditTaskTitle = (ev) => {
    ev.preventDefault()
    const taskToSave = {
      ...task
    }
    taskToSave.title = title
    onUpdateTask(taskToSave)
    toggaleQuickEdit()
  }

  const toggleLabelModal = (ev) => {
    if (ev) ev.stopPropagation()
    if (!labelModal && labelModal !== null) {

      const parentEl = ev.currentTarget.parentNode
      const position = parentEl.getBoundingClientRect()

      const style = {
        top: ev.target.offsetTop,
        left: ev.target.offsetLeft
      }
      let pos = {
        position: position,
        style: style
      }
      setLabelModalPos(pos)
      setLabelModal(true)
    } else {
      setLabelModal(false)
    }
  }

  const onEditClick = (ev) => {
    ev.stopPropagation()
  }

  const onRemoveTask = () => {
    dispatch(removeTask(currentBoardId, currentGroupId, task))
    navigate(`/board/${currentBoardId}`)
  }

  const onUpdateTask = (task) => {
    dispatch(updateTask(currentBoardId, currentGroupId, task))
  }

  const onSetLabel = (ev, addOrRemove, labelId) => {
    ev.stopPropagation()
    if (!addOrRemove) {
      if (!task.labelIds) task.labelIds = [labelId]
      else task.labelIds.push(labelId)
    } else {
      const idx = task.labelIds.findIndex(label => label === labelId)
      task.labelIds.splice(idx, 1)
    }
    onUpdateTask(task)
  }


  return <section className="task-quick-edit" onClick={onEditClick} style={{ ...pos.style }}>
    <div className='left-col' style={{ width: pos.position.width }}>
      {task.style?.bg?.imgUrl && <div className='task-cover' style={{ backgroundImage: `url(${task.style.bg.imgUrl})`, height: "180px", backgroundSize: "cover", width: `${pos.width}px` }}></div>}
      {task.style?.bg?.color && <div className='task-cover' style={{ background: `${task.style.bg.color}`, height: "32px", width: `${pos.width}px` }}></div>}
      <div className='input-side'>
        <section className='labels'>
          {task?.labelIds && <TaskLabel labelIds={task.labelIds} />}
        </section>
        <form onSubmit={onEditTaskTitle}>
          <input type="text" value={title} onChange={handleChange} />
        </form>
        {task.memberIds && <TaskMember memberIds={task.memberIds} />}
      </div>
      <button className='btn-add' onClick={onEditTaskTitle}>Save</button>
    </div>
    <ul className="quick-edit-actions">
      <li onClick={() => { toggaleQuickEdit(undefined, true) }}><FaWindowMaximize /> Open card</li>
      <li onClick={toggleLabelModal}><BsTagFill /> Edit labels</li>
      {labelModal && <section ref={refLabelModal}>

        {/* started changing here */}
        <TaskDetailsLabelModal labelIds={task.labelIds} onSetLabel={onSetLabel} toggleLabelsModal={toggleLabelModal} labelModalPos={labelModalPos} />
      </section>}
      <li><HiUser /> Change members</li>
      <li><FaWindowMaximize /> Change Cover</li>
      <li onClick={onRemoveTask}><HiArchive /> Archive</li>
    </ul>
  </section>

}