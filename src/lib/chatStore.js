import { doc, getDoc } from 'firebase/firestore';
import { create } from 'zustand'
import { db } from './firebase';
import useUserStore from './userStore';

const useChatStore = create((set) => ({
  chatId:null,
  user:null,
  isCurrentUserBlocked:null,
  isReceiverBlocked:null,
  changeChat:(chatId,user)=>{
    const current_user=useUserStore.getState().current_user

    if(user.blocked.includes(current_user.id))
      return set({
              chatId,
              user:null,
              isCurrentUserBlocked:true,
              isReceiverBlocked:false
            })
    else if(current_user.blocked.includes(user.id))
      return set({
              chatId,
              user:null,
              isCurrentUserBlocked:false,
              isReceiverBlocked:true
            })

    else
      return set({
        chatId,
        user,
        isCurrentUserBlocked:false,
        isReceiverBlocked:false
      })
      
  },
  changeBlock:()=>{
    set(state=>({...state,isReceiverBlocked:!state.isReceiverBlocked}))
  }
}))
export default useChatStore