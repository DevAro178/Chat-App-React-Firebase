import { useEffect, useState } from "react";
import "./chatlist.css";
import AddUser from "./addUser/AddUser";
import useUserStore from "../../../lib/userStore";
import { doc, getDoc, onSnapshot, updateDoc } from "firebase/firestore";
import { db } from "../../../lib/firebase";
import useChatStore from "../../../lib/chatStore";

const Chatlist = () => {
    const [chats,setChats]=useState([]);
    const [addMode,setAddMode]=useState(false);
    const [input,setInput]=useState("");
    const {current_user}=useUserStore()
    const {changeChat,chatId}=useChatStore()
    const [filteredChats,setFilteredChats]=useState([])
    

    // useEffect(()=>{
    //     if(input === "") return setFilteredChats(chats)
        
    //         setFilteredChats(filtered)
    //     },[input])
        
    const filtered=chats.filter((chat)=>chat.user.username.toLowerCase().includes(input.toLowerCase()))
    useEffect(()=>{
        const unsub = onSnapshot(doc(db, "userchats", current_user.id), async (res) => {
            console.log(res.data().chats);
            const items = res.data().chats;
            
            const promises = items.map(async (item) => {
                const userDocRef = doc(db, "users", item.receiverId);
                const userDocSnap = await getDoc(userDocRef);
                const user=userDocSnap.data();

                return {...item,user}
            })
            
            const chatData = await Promise.all(promises);
            setChats(chatData.sort((a,b)=>b.updatedAt-a.updatedAt));
            console.log(chatData);
        });
        
        return ()=>unsub()
    },[current_user.id])

    const handleSelect = async (chat)=>{

        const userChats=chats.map((item)=>{
            const {user,...chats}=item;
            return chats
        })

        const chatIndex=userChats.findIndex((item)=>item.chatId===chat.chatId)
        userChats[chatIndex].isSeen=true

        const userChatRef=doc(db,"userchats",current_user.id)
        try {
            await updateDoc(userChatRef,{
                chats:userChats
            })
            changeChat(chat.chatId,chat.user)
        } catch (error) {
            console.log(error);
        }

    }

    return (
        <div className="chatlist">
            <div className="search">
                <div className="searchBar">
                    <img src="/search.png" alt="" />
                    <input type="text" placeholder="Search" onChange={(e)=>{
                        setInput(e.target.value)
                    }} />
                </div>
                <img src={addMode ? "./minus.png" : "./plus.png"} onClick={()=>(setAddMode((prev)=>!prev))} alt="" className="add" />
            </div>
            {filtered.map((chat)=>(
                <div className="item" key={chat.chatId} onClick={()=>handleSelect(chat)} style={{backgroundColor: chat?.isSeen ? "transparent":"#5183fe"}} >
                    <img src={chat.user.blocked.includes(current_user.id) ? "./avatar.png" : (chat.user.avatar ? chat.user.avatar : "./avatar.png")} alt="" />
                    <div className="texts">
                        <span>{chat.user.blocked.includes(current_user.id) ? "User" : chat.user.username}</span>
                        <p>{chat.lastMessage}</p>
                    </div>
                </div>
            ))}
            { addMode && <AddUser /> }
        </div>
    );
}

export default Chatlist;