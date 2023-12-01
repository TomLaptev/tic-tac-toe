
 interface IStore {
    language: string,
    sound: string,
    button: string
}

const store: IStore = {
    language: localStorage.lang ? localStorage.lang : 'ru', 
    sound: localStorage.getItem('sound'),
    button: localStorage.getItem('button'),
     
}


export default store;

