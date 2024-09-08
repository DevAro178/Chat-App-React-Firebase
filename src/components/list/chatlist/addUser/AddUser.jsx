import { collection, query, where, getDocs, doc, setDoc, updateDoc, arrayUnion, serverTimestamp } from "firebase/firestore"
import "./addUser.css"
import { db } from "../../../../lib/firebase"
import { useState } from "react"
import useUserStore from "../../../../lib/userStore"

const AddUser = () =>{

    const {current_user}=useUserStore()

    const [users,setUsers]=useState(null)
    const handleSubmit = async (e) => {
        e.preventDefault()
        const formData = new FormData(e.target)
        const username = formData.get("username")

        try {
            const usersRef=collection(db,"users")
            const q = query(usersRef,where("username","==",username))

            const res = await getDocs(q)

            if(!res.empty){
                setUsers(res.docs[0].data())
            }else{setUsers(null)}
        } catch (error) {
            console.log(error);
            setUsers(null)
        }
    }

    const addUser=async ()=>{

        const chatRef = collection(db, "chats")
        const userChatRef = collection(db, "userchats")

        try {
            const newCharRef = doc(chatRef)
            await setDoc(newCharRef,{
                createdAt: serverTimestamp(),
                messages: []
            })

            await updateDoc(doc(userChatRef, users.id),{
                chats:arrayUnion({
                    chatId:newCharRef.id,
                    lastMessage:"",
                    receiverId:current_user.id,
                    updatedAt:Date.now(),
                })
            })

            await updateDoc(doc(userChatRef, current_user.id),{
                chats:arrayUnion({
                    chatId:newCharRef.id,
                    lastMessage:"",
                    receiverId:users.id,
                    updatedAt:Date.now(),
                })
            })

        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div className="addUser">
            <form onSubmit={handleSubmit}>
                <input type="text" placeholder="Username" name="username" />
                <button>Search</button>
            </form>
            {
                users && (
                    <div className="user">
                <div className="detail">
                    <img src={users.avatar ? users.avatar : "./avatar.png"} alt="" />
                    <span>{users.username}</span>
                </div>
                <button onClick={addUser}>Add</button>
            </div>
                )
            }
        </div>
    )
}

export default AddUser