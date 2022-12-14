import { useState } from 'react'
import { Link } from 'react-router-dom'
import { GroupEdit } from './group-edit'
import { GroupPreview } from './group-preview'
import { useDispatch, useSelector } from "react-redux"
import { updateBoard } from '../store/board.actions'
import React, { useEffect, useRef } from 'react'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import { Loader } from './loader'


export const GroupList = () => {
    const board = useSelector(state => state.boardModule.board)
    // console.log('**board from GroupList:**', board)

    const [isAddingGroup, setIsAddingGroup] = useState(false)
    // const [currBoard, setCurrBoard] = useState(board)


    const taskRef = useRef()


    useEffect(() => {
    }, [board])

    const dispatch = useDispatch()

    const onAddingGroup = () => {
        setIsAddingGroup(!isAddingGroup)
    }

    const addTask = async (groupToUpdate, activity) => {
        let boardToSave = { ...board }
        boardToSave.groups = boardToSave.groups.map(group => (group.id === groupToUpdate.id) ? groupToUpdate : group)
        dispatch(updateBoard(boardToSave, activity))
    }


    // console.log('render GROUP-LIST')

    // console.log('board.groups', currBoard.groups)
    // if (!board) return <div>Loading...</div>
    if (!board) return <Loader />

    return (
        <Droppable
            droppableId='groups'
            direction="horizontal"
            type='group'

        >
            {(provided) => (
                <div
                    ref={(el) => { taskRef.current = el; provided.innerRef(el) }}
                    {...provided.droppableProps}
                    className="group-list-dnd"
                >
                    <section className="group-list">
                        {board?.groups?.map((group, index) => {
                            return <GroupPreview
                                key={group.id}
                                group={group}
                                addTask={addTask}
                                taskRef={taskRef}
                                index={index}
                            />
                        })}
                        {!isAddingGroup &&
                            <div className="btn-add-group-container" onClick={onAddingGroup}>
                                {/* <span>+</span> */}
                                <span className="btn-add-group">+ Add another list</span>
                            </div>}
                        {isAddingGroup && <GroupEdit onAddingGroup={onAddingGroup} boardId={board._id} />}
                        {/* <Link to="/group/edit" className='nice-button'>Add group</Link> */}
                    </section>
                    {provided.placeholder}
                </div>
            )}
        </Droppable>
    )
}