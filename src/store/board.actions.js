import { boardService } from "../services/board.service.js"
import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service.js'
import { uploadService } from "../services/upload.service.js"

// Action Creators:
export function getActionRemoveBoard(boardId) {
    return {
        type: 'REMOVE_BOARD',
        boardId
    }
}
export function getActionAddBoard(board) {

    return {
        type: 'ADD_BOARD',
        board
    }
}
export function getActionUpdateBoard(board) {
    return {
        type: 'UPDATE_BOARD',
        board
    }
}

export function loadBoards(filterBY = {}) {
    return async (dispatch) => {
        try {
            const boards = await boardService.query(filterBY)
            dispatch({
                type: 'SET_BOARDS',
                boards
            })

        } catch (err) {
            showErrorMsg('Cannot load boards')
            console.log('Cannot load boards', err)
        }
    }
}

export function getBoard(boardId) {
    return async (dispatch) => {
        try {
            const updatedBoard = await boardService.getById(boardId)
            const { board } = dispatch({
                type: 'SET_BOARD',
                board: updatedBoard
            })
            return board
        } catch (err) {
            console.log('Cannot get board by id', err)
            throw (err)
        }
    }
}

export function removeBoard(boardId) {
    return async (dispatch) => {
        try {
            await boardService.remove(boardId)
            dispatch(getActionRemoveBoard(boardId))
        } catch (err) {
            console.log('Cannot remove board', err)
        }
    }
}

export function addGroup(boardId, group, activity) {
    return async (dispatch) => {
        try {
            console.log('group', group)
            const updateBoard = await boardService.addGroupToBoard(boardId, group, activity)
            return dispatch(getActionUpdateBoard(updateBoard))
        } catch (err) {
            console.log('Cannot add group', err)
        }
    }
}

export function removeGroup(boardId, groupId, activity) {
    return async (dispatch) => {
        try {
            const updateBoard = await boardService.removeGroupFromBoard(boardId, groupId, activity)
            return dispatch(getActionUpdateBoard(updateBoard))
        } catch (err) {
            console.log('Cannot remove group', err)
        }
    }
}

export function addBoard(board, activity) {
    return async (dispatch) => {
        try {
            const savedBoard = await boardService.save(board, activity)
            return dispatch(getActionAddBoard(savedBoard)).board
        } catch (err) {
            console.log('Cannot add board', err)
        }
    }
}

export function updateBoard(board, activity) {
    
    return async (dispatch) => {
        try {
            const savedBoard = await boardService.save(board, activity)
            return dispatch(getActionUpdateBoard(savedBoard))
        } catch (err) {
            console.log('Cannot save board', err)
        }
    }
}


/*------------------------------------------------------------------------------*/
export function updateTask(boardId, groupId, taskForUpdate, activity) {
    return async (dispatch) => {
        try {

            const groupForUpdate = await boardService.getGroupById(boardId, groupId)
            const board = await boardService.getById(boardId)

            const idx = groupForUpdate.tasks.findIndex(task => task.id === taskForUpdate.id)
            groupForUpdate.tasks.splice(idx, 1, taskForUpdate)

            const groupIdx = board.groups.findIndex(group => group.id === groupForUpdate.id)
            board.groups.splice(groupIdx, 1, groupForUpdate)

            dispatch(updateBoard(board, activity))

            dispatch({
                type: 'SET_TASK',
                task: taskForUpdate
            })

            return board
        } catch (err) {
            console.log('Cannot complete updateTask', err)
            throw err
        }
    }
}

export function removeTask(boardId, groupId, taskForUpdate) {
    return async (dispatch) => {
        try {
            const groupForUpdate = await boardService.getGroupById(boardId, groupId)
            const board = await boardService.getById(boardId)

            const idx = groupForUpdate.tasks.findIndex(task => task.id === taskForUpdate.id)
            groupForUpdate.tasks.splice(idx, 1)

            const groupIdx = board.groups.findIndex(group => group.id === groupForUpdate.id)
            board.groups.splice(groupIdx, 1, groupForUpdate)

            dispatch(updateBoard(board))
            return board
        } catch (err) {
            console.log('Cannot complete removeTask', err)
            throw err
        }
    }
}

export function getTask(boardId, groupId, taskId) {
    return async (dispatch) => {
        try {
            const updatedTask = await boardService.getTaskById(boardId, groupId, taskId)
            const { task } = dispatch({
                type: 'SET_TASK',
                task: updatedTask
            })
            return task
        } catch (err) {
            console.log('Cannot load task', err)
        }
    }
}

export function getImgUrl(ev) {
    return async (dispatch) => {
        try {
            const imgEv = await uploadService.uploadImg(ev)
            if (!imgEv.fileFormat) imgEv.url = 'https://res.cloudinary.com/dln4kbx1f/image/upload/v1664031478/a7aqgf6kxvow44jn3qzf.png'
            const { imgJson } = dispatch({
                type: 'SET_IMG_URL',
                imgJson: imgEv
            })
        } catch (err) {
            console.log('Cannot load img url', err)
        }
    }
}

export function getImgFromUrl(currentImgJson) {
    return async (dispatch) => {
        try {
            const { imgJson } = dispatch({
                type: 'SET_IMG_URL',
                imgJson: currentImgJson
            })
            return imgJson
        } catch (err) {
            console.log('Cannot load img url', err)
        }
    }
}

export function getVidUrl(ev) {
    return async (dispatch) => {
        try {
            const vidEv = await uploadService.uploadImg(ev)
            if (!vidEv.fileFormat) vidEv.url = 'https://res.cloudinary.com/dln4kbx1f/image/upload/v1664031478/a7aqgf6kxvow44jn3qzf.png'
            const { vidJson } = dispatch({
                type: 'SET_VID_URL',
                vidJson: vidEv
            })
        } catch (err) {
            console.log('Cannot load video url', err)
        }
    }
}



export function resizeLabel(resizeLabel) {
    return async (dispatch) => {
        try {
            // console.log('resizeLabel', resizeLabel)
            dispatch({
                type: 'RESIZE_LABEL',
                resizeLabel
            })
        } catch (err) {
            console.log('Cannot resize label', err)

        }
    }
}

export function setBoardBackgroundColor(color) {
    return async (dispatch) => {
        try {
            dispatch({
                type: 'SET_BOARD_THEME_COLOR',
                boardThemeColor: color
            })
        } catch (err) {
            console.log('Cannot update background Color ', err)

        }
    }
}

export function getUploadedImg(imgUrl) {

}
/*------------------------------------------------------------------------------*/


// Demo for Optimistic Mutation 
// (IOW - Assuming the server call will work, so updating the UI first)
export function onRemoveBoardOptimistic(boardId) {

    return async (dispatch, getState) => {
        dispatch({
            type: 'REMOVE_BOARD',
            boardId
        })
        showSuccessMsg('Board removed')

        try {
            await boardService.remove(boardId)
        } catch (err) {
            showErrorMsg('Cannot remove board')
            console.log('Cannot load boards', err)
            dispatch({
                type: 'UNDO_REMOVE_BOARD',
            })
        }
    }
}

export function handleDrag(
    board,
    droppableIdStart,
    droppableIdEnd,
    droppableIndexStart,
    droppableIndexEnd,
    type
) {

    return async dispatch => {

        if (type === 'member') {
            console.log('a member has been dragged')
            return
        }

        if (type === 'group') {
            // remove group from origin
            const group = board.groups.splice(droppableIndexStart, 1)
            // put group in new place
            board.groups.splice(droppableIndexEnd, 0, ...group)
        } else {
            // task within same group
            if (droppableIdStart === droppableIdEnd) {
                const group = board.groups.find(group => group.id === droppableIdStart)
                const task = group.tasks.splice(droppableIndexStart, 1)
                group.tasks.splice(droppableIndexEnd, 0, ...task)

            } else {
                // tasks in diff groups
                const groupStart = board.groups.find(group => group.id === droppableIdStart)

                // remove task from origin
                const task = groupStart.tasks.splice(droppableIndexStart, 1)

                // find destination group
                const groupEnd = board.groups.find(group => group.id === droppableIdEnd)

                // insert task in group
                groupEnd.tasks.splice(droppableIndexEnd, 0, ...task)
            }
            // }
        }
        // socketService.emit(SOCKET_EMIT_DND, (board))
        try {
            const boardToUpdate = await boardService.save(board)
            dispatch({
                type: 'UPDATE_BOARD',
                board: boardToUpdate,
            })
        } catch (err) {
            console.log('Cannot update board', err)

        }
    }
}

export function addChecklist(board, group, task, title) {

    return async dispatch => {
        try {
            const boardToSave = await boardService.addChecklist(
                board,
                group,
                task,
                title
            )
            // console.log('boardToSave FROM ACTION:', boardToSave)
            dispatch({
                type: 'UPDATE_BOARD',
                board: boardToSave,
            })
        } catch (err) {
            console.log('Cannot add checklist', err)
        }
    }
}

export function addNewTodo(board, groupId, taskId, checklistId, title) {

    return async dispatch => {
        try {
            const updatedBoard = await boardService.addTodo(board, groupId, taskId, checklistId, title)
            dispatch({
                type: 'UPDATE_BOARD',
                board: updatedBoard,
            })
        } catch (err) {
            console.log('Cannot add Todo. Heres why:', err)
        }
    }
}