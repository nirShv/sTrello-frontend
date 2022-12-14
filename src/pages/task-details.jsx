
import { useEffect, useState, useRef } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { TaskDetailsCoverModal } from "../cmps/task-details-cover-modal"
import { useFormRegister } from '../hooks/useFormRegister'
import { useDispatch } from "react-redux"
import { updateTask, removeTask, resizeLabel } from '../store/board.actions'
import { TaskMember } from "../cmps/task-members"
import { TaskLabel } from "../cmps/task-label"
import { TaskDetailsMembersModal } from "../cmps/task-details-members-modal"
import { HiUser } from 'react-icons/hi'
import { BsTagFill, BsCheck2Square, BsClock } from 'react-icons/bs'
import { HiArchive } from 'react-icons/hi'
import { FaWindowMaximize } from 'react-icons/fa'
import { GrTextAlignFull, GrAdd} from 'react-icons/gr'
import { ImAttachment } from 'react-icons/im'
import { IoIosArrowDown } from 'react-icons/io'
import { AbilityCreator } from "../cmps/ability-creator"
import { TaskDetailsLabelModal } from "../cmps/task-details-labels-modal"
import { useSelector } from "react-redux"
import { AttachmentModal } from "../cmps/attachment-modal"
import moment from 'moment'
import { TaskDetailsAttachments } from "../cmps/task-details-sections/task-details-attachments"
import { AttachmentNameEditModal } from "../cmps/task-details-modals/attachment-name-edit-modal"
import { DatePicker } from '../cmps/date-picker'
import { DatePickerModal } from "../cmps/date-picker-modal"
import { ChecklistModal } from "../cmps/checklist-modal"
import { TaskChecklist } from "../cmps/task-checklist"
import { DetailsActivities } from "../cmps/task-details-activities"
import { utilService } from "../services/util.service"
import { ChatApp } from "../cmps/chat-app"
import { socketService, SOCKET_EVENT_TASK_UPDATE } from "../services/socket.service"
import { Loader } from "../cmps/loader"

export const TaskDetails = ({ boardId, groupId, taskId, taskFromProps, groupTitle, closeModal }) => {

    const imgJson = useSelector(state => state.boardModule.imgJson)
    

    const params = useParams()
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const refInput = useRef(null)
    const refDesc = useRef(null)
    const refLabelModal = useRef(null)

    const [bgColor, setBgColor] = useState(null)
    const [showModal, setShowModal] = useState(null)
    const [currentBoardId, setBoardId] = useState(null)
    const [currentGroupId, setGroupId] = useState(null)
    const [currentGroupTitle, setGroupTitle] = useState(null)
    const [isMemberModal, setIsMemberModal] = useState(null)
    const [isEditTitle, setEditTitle] = useState(null)
    const [isEditDescription, setEditDescription] = useState(null)
    const [isLabelModal, setIsLabelModal] = useState(null)
    const [isAttachmentModal, setIsAttachmentModal] = useState(false)
    const [isEditAttachName, setIsEditAttachName] = useState(false)
    const [labelModalPos, setLabelModalPos] = useState(null)
    const [isChecklistModal, setIsChecklistModal] = useState(false)
    const [checklistModalPos, setChecklistModalPos] = useState(null)

    const [attachModalPos, setAttachModalPos] = useState(null)
    const [editAttachNameModalPos, setEditAttachNameModalPos] = useState(null)
    const [isDatePickerOpen, setIsDatePickerOpen] = useState(null)
    const [attachmentToEdit, setAttachmentToEdit] = useState(null)


    useEffect(() => {

        if (!boardId) return
        setBoardId(boardId)
        if (!groupId) return
        setGroupId(groupId)
        if (!taskId) return
        setGroupTitle(groupTitle)
        setTask(taskFromProps)

        if (task?.style?.bg.color) setBgColor(task.style.bg.color)

    }, [])

    useEffect(() => {
        setIsAttachmentModal(false)
        if (imgJson) onSetAttachment(false)
    }, [imgJson])

    const handleClickOutside = (e) => {
        if (e) e.preventDefault()
        if (!refInput.current) return
        if (!refInput.current.contains(e.target)) {
            setEditTitle(false)
            setEditDescription(false)
        }
    }
    const handleClickOutsideLabelModal = (e) => {
        if (e) e.preventDefault()
        if (!refLabelModal.current) return
        if (!refLabelModal.current.contains(e.target)) {
            toggleLabelsModal()
        }
    }

    const getTime = (imgJson) => {
        return moment(imgJson.addedAt).fromNow()
    }

    const onUpdateTask = (taskForUpdate, activity) => {
        if (!taskForUpdate) return
        dispatch(updateTask(currentBoardId, currentGroupId, taskForUpdate, activity))
    }

    const [register, setTask, task] = useFormRegister({}, onUpdateTask)


    const onBack = () => {
        closeModal()
    }

    const toggleEditTitle = () => {
        setEditTitle(!isEditTitle)
    }
    const toggleEditDescription = () => {
        setEditDescription(!isEditDescription)
    }
    const closeEditDescription = () => {
        setEditDescription(false)
    }

    const onShowModal = () => {
        setShowModal(!showModal)
    }

    const toggleMembersModal = () => {
        setIsMemberModal(!isMemberModal)
    }

    const toggleChecklistModal = (ev) => {
        if (ev) ev.preventDefault()
        if (!isChecklistModal) {
            const grandadEl = ev.currentTarget.parentNode.parentNode

            const pos = {
                top: grandadEl.offsetTop,
                left: grandadEl.offsetLeft + 426
            }
            setChecklistModalPos(pos)
            setIsChecklistModal(true)
        } else {
            setIsChecklistModal(false)
        }
    }

    const toggleEditAttachNameModal = (ev, attachmentId) => {
        setAttachmentToEdit(attachmentId)

        if (!isEditAttachName) {
            const parentEl = ev.currentTarget.parentNode
            const position = parentEl.getBoundingClientRect()

            const style = {
                top: ev.target.offsetTop - 300,
                left: ev.target.offsetLeft
            }
            let pos = {
                position: position,
                style: style
            }

            setEditAttachNameModalPos(pos)
            setIsEditAttachName(!isEditAttachName)
        } else {
            setIsEditAttachName(false)
        }

    }

    const toggleLabelsModal = (ev) => {
        if (ev) ev.stopPropagation()
        setIsLabelModal(!isLabelModal)
        if (!isLabelModal && isLabelModal !== null) {
            const parentEl = ev.currentTarget.parentNode
            const position = parentEl.getBoundingClientRect()

            const grandFatherEl = parentEl.parentNode
            console.log('grandFatherEl:', grandFatherEl)
            const style = {
                top: grandFatherEl.offsetTop,
                left: grandFatherEl.offsetLeft + (730 - 304)
            }
            let pos = {
                position: position,
                style: style
            }

            setLabelModalPos(pos)
            setIsLabelModal(true)

        } else {
            setIsLabelModal(false)
        }
    }

    const toggleAttachmentModal = (ev) => {

        if (!isAttachmentModal) {
            const grandParentEl = ev.currentTarget.parentNode.parentNode
            const position = grandParentEl.getBoundingClientRect()

            const style = {
                top: grandParentEl.offsetTop - 100,
                left: grandParentEl.offsetLeft + (730 - 304)
            }
            let pos = {
                position: position,
                style: style
            }

            setAttachModalPos(pos)
            setIsAttachmentModal(!isAttachmentModal)
        } else {
            setIsAttachmentModal(false)
        }
    }

    const onSetColor = (newColor) => {
        if (!task.style) task.style = { bg: { color: newColor } }
        task.style.bg.color = newColor
        task.style.bg.imgUrl = null
        setBgColor(newColor)
        onUpdateTask(task)
    }

    const onSetImg = (imgUrl) => {
        if (!task.style) task.style = { bg: { imgUrl } }
        task.style.bg.imgUrl = imgUrl
        task.style.bg.color = null
        setBgColor(null)
        onUpdateTask(task)
    }

    const onRemoveCover = () => {
        delete task.style
        setShowModal(false)
    }

    const onSetMember = ( addOrRemove, memberId, fullname ) => {
        const activity = {
            task: {
                id: task.id,
                title: task.title
            }
        }
        if (!addOrRemove) {
            activity.txt = `added ${fullname} to`
            if (!task.memberIds) task.memberIds = [memberId]
            else task.memberIds.push(memberId)
            if (!task.watcedMemberIds) task.watcedMemberIds = [memberId]
            else task.watcedMemberIds.push(memberId)
        } else {
            activity.txt = `remove ${fullname} from`

            const idx = task.memberIds.findIndex(member => member === memberId)
            task.memberIds.splice(idx, 1)
            const watchIdx = task.watcedMemberIds.findIndex(watcedMember => watcedMember === memberId)
            task.watcedMemberIds.splice(watchIdx, 1)
        }

        onUpdateTask(task, activity)
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

    const onSetAttachment = (addOrRemove, attachId /*, taskToAttach, boardId, groupId*/) => {
        if (!addOrRemove) {
            if (!task.attachments) task.attachments = [(imgJson)]
            else task.attachments.unshift((imgJson))
        } else {
            const idx = task.attachments.findIndex(img => img.id === attachId)
            task.attachments.splice(idx, 1)
        }
        onUpdateTask(task)
    }

    const onRemoveTask = () => {
        dispatch(removeTask(currentBoardId, currentGroupId, task))
    }

    const onSaveTask = async (ev) => {
        ev.preventDefault()
        dispatch(updateTask(currentBoardId, currentGroupId, task))
    }

    const clickedOnModal = (ev) => {
        ev.stopPropagation()
    }

    const onOpenLabelsModal = () => {
        dispatch(resizeLabel(false))
    }

    const onCompleteDueDate = () => {
        task.dueDate.isDone = !task.dueDate.isDone
        const dueDateAction = task.dueDate.isDone ? 'complete' : 'incomplete'
        const activity = {
            txt: `marked the due date on ${task.title} ${dueDateAction}`,
            task: {
                id: task.id,
                title: ""
            }
        }
        onUpdateTask(task, activity)
    }

    const onToggleDatePicker = () => {
        setIsDatePickerOpen(!isDatePickerOpen)
    }

    if (!task) return <Loader />

    return (
        <section className="task-details-main" >
            <div className="black-screen" onClick={onBack}>

                <section className="task-details-container" onClick={clickedOnModal}>

                    {task?.style && (task.style.bg.imgUrl !== null || task.style.bg.color !== null) &&
                        <section className="task-cover" style={{ backgroundColor: task.style.bg.color }} >
                            <button onClick={onBack} className="btn close"></button>
                            {task?.style?.bg?.imgUrl && <div className="img-cover" style={{ backgroundImage: `url(${task.style.bg.imgUrl})` }} ></div>}
                            <div onClick={onShowModal} className="btn cover">
                                <span className="bts-icon"><FaWindowMaximize /></span>
                                <span className="btn-cover-txt">Cover</span>
                            </div>
                        </section>}
                    {showModal && <TaskDetailsCoverModal onSetColor={onSetColor} onSetImg={onSetImg} onShowModal={onShowModal} onRemoveCover={onRemoveCover} attachments={task.attachments} />}

                    <div className="task-main-container">
                        {!(task?.style && (task.style.bg.imgUrl !== null || task.style.bg.color !== null)) &&
                            <button onClick={onBack} className="btn close"></button>}
                        <div className="title-container">
                            <span className="task-title-icon"><FaWindowMaximize /></span>
                            <section className="title-input">
                                {!isEditTitle && <div className="static-input" onClick={toggleEditTitle} >{task.title}</div>}
                                {isEditTitle && <form className="task-details-form" onSubmit={onSaveTask}>
                                    <input className="title-text-area" {...register('title', 'text')} value={task.title} ref={refInput} />
                                </form>}
                                <div className="group-title-in-task">in list {currentGroupTitle}</div>
                            </section>
                        </div> {/*title-container*/}

                        <div className="task-main-middle-container">

                            <div className="task-main-container-left">

                                <section className="tags">

                                    {task?.memberIds && <section className="members">
                                        <div className="tag-title">Members</div>
                                        <div className="select-members">
                                            <TaskMember memberIds={task.memberIds} />
                                            <div onClick={toggleMembersModal} className="plus-icon"><GrAdd /></div>
                                        </div>
                                    </section>}
                                    {isMemberModal && <TaskDetailsMembersModal memberIds={task.memberIds} onSetMember={onSetMember} toggleMembersModal={toggleMembersModal} />}

                                    {task?.labelIds && <section className="labels">
                                        <div className="tag-title">Labels</div>
                                        <div className="select-labels">
                                            <div className="label-container" onClick={onOpenLabelsModal}>
                                                <TaskLabel labelIds={task.labelIds} />
                                            </div>
                                            <div onClick={toggleLabelsModal} className="plus-icon">
                                                <GrAdd />
                                            </div>
                                        </div>
                                    </section>}

                                    {/* LABEL MODAL */}
                                    <section ref={refLabelModal}>
                                        {isLabelModal && <TaskDetailsLabelModal labelIds={task.labelIds} onSetLabel={onSetLabel} toggleLabelsModal={toggleLabelsModal} labelModalPos={labelModalPos} />}
                                    </section>

                                </section>{/*tags*/}

                                {task?.dueDate && <section className="due-date">
                                    <div className="tag-title">Due date</div>
                                    <div className="due-date-container">
                                        <div className={"due-date-checkbox " + (task.dueDate.isDone ? "is-done" : "")} onClick={onCompleteDueDate}></div>
                                        <div className={"due-date-content " + (task.dueDate.isDone ? "is-done" : "")} onClick={onToggleDatePicker}>
                                            <div className="due-date-time">{utilService.formatDate(task.dueDate)}</div>
                                            {!task.dueDate.isDone && <div className={"due-date-tag " + utilService.getDueDateTag(task.dueDate.date)}></div>}
                                            {task.dueDate.isDone && <div className="due-date-tag is-done">complete</div>}
                                            <div className="due-date-dropdwon-icon"><IoIosArrowDown /></div>
                                        </div>
                                    </div>
                                    <label htmlFor=""></label>
                                </section>}

                                <section className={`description-container ${isEditDescription ? 'edit-status' : ''}`}>
                                    <div className="description-main-content">
                                        <div className="description-icon"><GrTextAlignFull /></div>
                                        <div className="description-title">Description</div>
                                        {!isEditDescription && task.desc && <button className="btn-edit-description" onClick={toggleEditDescription}>Edit</button>}
                                    </div>
                                    {!isEditDescription && !task.desc && <div className="description-placeholder" onClick={toggleEditDescription} >Add a more detailed description...</div>}
                                    {!isEditDescription && task.desc && <div className="static-description" onClick={toggleEditDescription}>{task.desc}</div>}
                                    <div className="description-edit-container">
                                        {isEditDescription && <textarea className="description-textarea" placeholder="Add a more detailed description..." {...register('desc', 'text')} value={task.desc} ref={refInput} />}
                                        {isEditDescription && <button className="btn-desc save" onClick={toggleEditDescription}>Save</button>}
                                        {isEditDescription && <button className="btn-desc close" onClick={toggleEditDescription}>Cancel</button>}
                                    </div>
                                </section>

                                {taskFromProps?.attachments && taskFromProps?.attachments?.length > 0 && <section className="attachment">
                                    <div className="attachment-title">
                                        <span className="icon"><ImAttachment /></span>
                                        <span className="section-title">Attachment</span>
                                    </div>
                                    <div className="attachment-body-and-btn">
                                        {taskFromProps?.attachments.map(attachment => {
                                            return <div className="attachment-body" key={attachment.id}>
                                                <img className="img-attached" src={`${attachment.url}`} />
                                                <div className="attachment-details">
                                                    <span className="url-name">{attachment.urlName}{attachment.fileFormat ? `.${attachment.fileFormat}` : ''}</span>
                                                    <div className="add-time-and-btns">
                                                        <span className="Added-at">Added {getTime(attachment)}</span>
                                                        <span>-</span>
                                                        <span key={`${attachment.id}-dBtn`} className="btn-delete-attachment" onClick={() => onSetAttachment(true, attachment.id)} title={'Delete attachment for ever'}>Delete</span>
                                                        <span>-</span>
                                                        <span key={`${attachment.id}-eBtn`} className="btn-delete-attachment" onClick={(ev) => toggleEditAttachNameModal(ev, attachment.id)} title={'Edit attachment name'}>Edit</span>
                                                    </div>
                                                </div>
                                            </div>
                                        })}
                                        {isEditAttachName && <AttachmentNameEditModal toggleEditAttachNameModal={toggleEditAttachNameModal} attachmentId={attachmentToEdit} task={taskFromProps} onUpdateTask={onUpdateTask} editAttachNameModalPos={editAttachNameModalPos} />}
                                        <button className="btn attachment" onClick={toggleAttachmentModal}>
                                            <span className="ability">Add an attachment</span>
                                        </button>
                                    </div>
                                </section>}
                                {isAttachmentModal && <AttachmentModal toggleAttachmentModal={toggleAttachmentModal} attachModalPos={attachModalPos} />}

                                {/* CHECKLISTS */}
                                {taskFromProps?.checklists?.length > 0 && <TaskChecklist
                                    checklists={taskFromProps.checklists}
                                    board={currentBoardId}
                                    group={currentGroupId}
                                    task={taskFromProps}
                                />}

                                {/* ACTIVITIES  */}

                                <DetailsActivities
                                    task={taskFromProps} onUpdateTask={onUpdateTask}
                                    groupId={currentGroupId} />
                            </div>

                            <div className="task-main-container-right">
                                <span className="add-to-card">Add to card</span>
                                <AbilityCreator callBackF={toggleMembersModal} iconCmp={HiUser} name={'Members'} />
                                <button className="btn abilities" onClick={toggleLabelsModal}>
                                    <span className="icon"><BsTagFill /></span>
                                    <span className="ability">Labels</span>
                                </button>
                                {isDatePickerOpen && <DatePickerModal onToggleDatePicker={onToggleDatePicker} task={task} onUpdateTask={onUpdateTask} />}
                                <button className="btn abilities" onClick={toggleChecklistModal}>
                                    <span className="icon"><BsCheck2Square /></span>
                                    <span className="ability">Checklist</span>
                                </button>
                                {isChecklistModal && <ChecklistModal toggleChecklistModal={toggleChecklistModal} pos={checklistModalPos} boardId={currentBoardId} groupId={currentGroupId} task={task} />}
                                <button className="btn abilities" onClick={onToggleDatePicker}>
                                    <span className="icon"><BsClock /></span>
                                    <span className="ability">Dates</span>
                                </button>
                                <button className="btn abilities" onClick={toggleAttachmentModal}>
                                    <span className="icon attach"><ImAttachment /></span>
                                    <span className="ability">Attachment</span>
                                </button>
                                {!(task?.style && (task.style.bg.imgUrl !== null || task.style.bg.color !== null)) &&
                                    <button className="btn abilities" onClick={onShowModal}>
                                        <span className="icon"><FaWindowMaximize /> </span>
                                        <span className="ability">Cover</span>
                                    </button>}
                                <button className="btn abilities" onClick={onRemoveTask}>
                                    <span className="icon"><HiArchive /> </span>
                                    <span className="ability">Delete</span>
                                </button>
                            </div>


                        </div>
                    </div>

                </section>
            </div >
        </section >
    )
}

