const KEY='battle-companion:v1'
export const loadState=()=>{try{const value=localStorage.getItem(KEY);return value?JSON.parse(value):null}catch{return null}}
export const saveState=value=>localStorage.setItem(KEY,JSON.stringify(value))
export const clearState=()=>localStorage.removeItem(KEY)
