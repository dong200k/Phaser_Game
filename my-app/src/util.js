
export const getDeepCopy = (obj)=>{
  
    let newObj 
    if(obj instanceof Array){
      newObj = [...obj]
      newObj.forEach((val, key)=>{
        if(val instanceof Object) newObj[key] = getDeepCopy(val)
      })
    }else{
      newObj = {...obj}
      Object.entries(newObj).forEach(([key, val])=>{
        if(val instanceof Object) newObj[key] = getDeepCopy(val)
      })
    }

    return newObj
}