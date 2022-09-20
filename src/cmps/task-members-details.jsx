import { useSelector } from "react-redux"

export const TaskMemberDetails = ({ memberIds, onSetMember }) => {
    const board = useSelector(state => state.boardModule.board)
    // const boardMembers = useSelector(state => state.boardModule.boardMembers)

    const getMemberName = (memberId) => {
        const member = board.members.find(member => member._id === memberId)

        const fullname = member.fullname.split(' ')
        let initials = fullname[0][0]
        if (fullname.length >= 2) {
            initials += fullname[1][0]
        }

        if (member.imgUrl) {
            return (
                <section className="member-details">
                    <div className="member-img-container">
                        <div style={{
                            backgroundImage: `url(${member.imgUrl})`,
                            backgroundSize: "cover",
                            height: "28px",
                            width: "28px",
                            borderRadius: "50%"
                        }}></div>
                    </div>
                    <div>{fullname}</div>
                </section>
            )
        }

        return (
            <section className="member-details">
                <div>{initials}</div>
                <div>{fullname}</div>
            </section>
        )
    }

    const checkTaskMember = (memberId) => {
        if(!memberIds) return
        const checkedMember = memberIds.find(member => member=== memberId)
        if (checkedMember) return true
        return false
    }

    if (!board.members) return <div>No board members found</div>
    return (
        <div className="board-member-container">
            {board.members.map(member => {
                return <div className="member"
                    key={member._id}
                    onClick={() => onSetMember(checkTaskMember(member._id), member._id)}>
                    {getMemberName(member._id)}
                    {console.log('checkTaskMember', checkTaskMember(member._id))}
                    {checkTaskMember(member._id) && '✔'}
                </div>
            })}
        </div>
    )
}
