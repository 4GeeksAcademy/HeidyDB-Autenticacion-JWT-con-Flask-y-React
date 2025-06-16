export const initialStore=()=>{
  return{
    message: null,
    autenticar_usuario: [],
    nuevo_usuario: []

  }
}

export default function storeReducer(store, action = {}) {
  switch(action.type){
   
     case 'loguear_usuario':
    return {
      ...store,
      uautenticar_usuario: action.payload,
    };
    

    case 'registrar_usuario':

     return {
      ...store, 
      nuevo_usuario: action.payload
    } 

   // case 'add_task':

   //   const { id,  color } = action.payload

   //   return {
   //    ...store,
   //     todos: store.todos.map((todo) => (todo.id === id ? { ...todo, background: color } : todo))
   //   };
    default:
      throw Error('Unknown action.');
  }    
}
