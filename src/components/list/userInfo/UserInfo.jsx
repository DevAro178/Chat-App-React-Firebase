import useUserStore from "../../../lib/userStore"
import "./userinfo.css"

const UserInfo=()=>{

    const {current_user}=useUserStore()

    return(
        <div className="userinfo">
            <div className="user">
                <img src={current_user.avatar ? current_user.avatar : "./avatar.png"} alt="" />
                <h2>{current_user?.username}</h2>
            </div>
            <div className="icons">
                <img src="./more.png" alt="" />
                <img src="./video.png" alt="" />
                <img src="./edit.png" alt="" />
            </div>
        </div>
    )
}

export default UserInfo