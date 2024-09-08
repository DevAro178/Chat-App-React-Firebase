import { auth } from "../../lib/firebase"
import "./detail.css"

const Detail=()=>{
return (
    <div className="detail">
        <div className="user">
            <img src="./avatar.png" alt="" />
            <h2>John Doe</h2>
            <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Esse doloribus, aspernatur qui temporibus ipsam ducimus assumenda debitis maxime aut, quas minus voluptatum cumque. Quos omnis ab pariatur soluta autem ipsam.</p>

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
                <button>Block User</button>
                <button className="logout" onClick={()=>auth.signOut()}>Log Out</button>
        </div>
    </div>
)
}

export default Detail