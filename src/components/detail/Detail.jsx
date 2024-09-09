import { arrayRemove, arrayUnion, doc, updateDoc } from "firebase/firestore"
import useChatStore from "../../lib/chatStore"
import { auth, db } from "../../lib/firebase"
import "./detail.css"
import useUserStore from "../../lib/userStore"

const Detail=()=>{


    const {user,changeBlock,isReceiverBlocked,isCurrentUserBlocked}=useChatStore()
    const {current_user}=useUserStore()

    const handleBlock =async ()=>{
        if (!user) return
        try {
            const res=await updateDoc(doc(db,"users",current_user?.id),{
                blocked: isReceiverBlocked ? arrayRemove(user.id) : arrayUnion(user.id)
            })
            changeBlock()
        } catch (error) {
            console.log(error);
        }
    }

return (
    <div className="detail">
        <div className="user">
            <img src={user?.avatar ? user?.avatar : "./avatar.png"} alt="" />
            <h2>{user?.username}</h2>
            <p></p>

        </div>
        <div className="info">
            <div className="option">
                <div className="title">
                    <span>Chat Settings</span>
                    <img src="./arrowUp.png" alt="" />
                </div>
            </div>
            <div className="option">
                <div className="title">
                    <span>Privacy & Help</span>
                    <img src="./arrowUp.png" alt="" />
                </div>
            </div>
            <div className="option">
                <div className="title">
                    <span>Shared Photos</span>
                    <img src="./arrowDown.png" alt="" />
                </div> 
                <div className="photos">
                    <div className="photoItem">
                        <div className="photoDetail">
                            <img src="./avatar.png" alt="" />
                            <span>Random Img</span>
                        </div>
                        <img src="./download.png" className="icon" alt="" />
                    </div>
                    <div className="photoItem">
                        <div className="photoDetail">
                            <img src="./avatar.png" alt="" />
                            <span>Random Img</span>
                        </div>
                        <img src="./download.png" className="icon" alt="" />
                    </div>
                    <div className="photoItem">
                        <div className="photoDetail">
                            <img src="./avatar.png" alt="" />
                            <span>Random Img</span>
                        </div>
                        <img src="./download.png" className="icon" alt="" />
                    </div>
                </div>
            </div>
            <div className="option">
                <div className="title">
                    <span>Shared Files</span>
                    <img src="./arrowUp.png" alt="" />
                </div>
            </div>
                <button onClick={handleBlock}>
                    {
                        isCurrentUserBlocked ? "You are Blocked" : isReceiverBlocked ? "User Blocked" : "Block User"
                    }
                </button>
                <button className="logout" onClick={()=>auth.signOut()}>Log Out</button>
        </div>
    </div>
)
}

export default Detail