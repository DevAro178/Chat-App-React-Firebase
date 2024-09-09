import "./chat.css"
import EmojiPicker from "emoji-picker-react"
import { arrayUnion, doc, getDoc, onSnapshot, updateDoc } from "firebase/firestore"
import { useState,useRef,useEffect } from "react"
import { db } from "../../lib/firebase"
import useChatStore from "../../lib/chatStore"
import useUserStore from "../../lib/userStore"
import upload from "../../lib/upload"


const Chat=()=>{
    const [chat,setChat]=useState()
    const [open,setOpen]=useState(false)
    const [input,setInput]=useState("")
    const endRef=useRef(null)
    const {chatId,user,isReceiverBlocked,isCurrentUserBlocked}=useChatStore()
    
    const {current_user}=useUserStore()
    const [img,setImg]=useState({
        file:null,
        url:null,
    })
    
    const handleImage=(e)=>{
        console.log(e.target.files[0]);
        if(e.target.files[0]){
            setImg({
                file:e.target.files[0],
                url:URL.createObjectURL(e.target.files[0])
            })
        }
    }


    useEffect(()=>{
        endRef.current.scrollIntoView({behavior:"smooth"})
    },[])

    useEffect(()=>{
        const unsub = onSnapshot(doc(db,"chats",chatId),(res)=>{
            setChat(res.data())
        })
        

        return ()=>unsub()
    },[chatId])

    const handleEmoji=(e)=>{
        setInput(input+e.emoji)
        setOpen(false)
    }

    const handleSend=async ()=>{
        if(input === "") return

        let imgUrl=null

        if(img.file){
            imgUrl=await upload(img.file)
        }

        try {
            await updateDoc(doc(db,"chats",chatId),{
                messages:arrayUnion({
                    senderId:current_user.id,
                    text:input,
                    createAt:new Date,
                    ...(imgUrl && {img:imgUrl})
                })
            })

            const userIds=[current_user.id,user.id]
            console.log("-------"+userIds);

            userIds.forEach(async (userId)=>{
                const userChatRef=doc(db,"userchats",userId)
                const userChatSnapshots=await getDoc(userChatRef)
                if(userChatSnapshots.exists()){
                    const userChatData=userChatSnapshots.data()
                    const chatIndex=userChatData.chats.findIndex((chat)=>chat.chatId===chatId)
                    userChatData.chats[chatIndex].lastMessage=input
                    userChatData.chats[chatIndex].isSeen= (userId === current_user.id ? true : false)
                    userChatData.chats[chatIndex].updatedAt=Date.now()
                    await updateDoc(userChatRef,{
                        chats:userChatData.chats
                    })
                }
            })
            
        } catch (error) {
            console.log(error);
        }
        
        setInput("")
        setImg({
            file:null,
            url:null,
        })

    }
return (
    <div className="chat">
        <div className="top">
            <div className="user">
                <img src={user?.avatar ? user?.avatar : "./avatar.png"} alt="" />
                <div className="texts">
                    <span>{(isCurrentUserBlocked || isReceiverBlocked) && user?.username}</span>
                    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Tempora beatae !</p>
                </div>
            </div>
            <div className="icons">
                <img src="./phone.png" alt="" />
                <img src="./video.png" alt="" />
                <img src="./info.png" alt="" />
            </div>
        </div>
        <div className="center">
            
            {
                chat?.messages.map((message)=>(
                    <div className={message?.senderId===current_user.id ? "message own" : "message"} key={message?.createAt}>
                        {message?.senderId!==current_user.id && <img src={user?.avatar ? user?.avatar : "./avatar.png"} alt="" />}
                        <div className="texts">
                            {message?.img && <img src={message.img} alt="" />}
                            <p>{message.text}</p>
                            <span>1 min ago</span>
                        </div>
                    </div>

                ))
            }
            {
                img.url && (
                    <div className="message own">
                        <div className="texts">
                            <img src={img.url} alt="" />
                        </div>
                    </div>
                )
            }
            <div ref={endRef}></div>
        </div>
        <div className="bottom">
            <div className="icons">
                <label htmlFor="imgUpload" >
                    <img src="./img.png" alt=""/>
                </label>
                <input style={{display:"none"}} type="file" id="imgUpload" name="image" onChange={handleImage} />
                <img src="./camera.png" alt="" />
                <img src="./mic.png" alt="" />
            </div>
            <input type="text" value={input} onChange={(e)=>(setInput(e.target.value))} placeholder={(isCurrentUserBlocked || isReceiverBlocked) ? "You cannot send message to blocked users" :"Type a message...."} disabled={isCurrentUserBlocked || isReceiverBlocked} />
            <div className="emoji">
                <img src="./emoji.png" alt="" onClick={()=>(setOpen((prev)=>!prev))} />
                <div className="picker">
                    <EmojiPicker open={open} onEmojiClick={handleEmoji} />
                </div>
            </div>
            <button className="sendButton" onClick={handleSend} disabled={isCurrentUserBlocked || isReceiverBlocked}>Send</button>
        </div>
    </div>
)
}

export default Chat