export default function NodeDetails({nodeDatum: node, type}){
    let {data, children, nodeId} = node
    let dataKeys = ["name", "description", "stat", "weaponId"]
    return (
      <div>
        <h5><span className="text-primary">Name: </span>{data.name}</h5>
        <div><span className="text-primary">id:</span> {nodeId}</div>
        <p><span className="text-primary">description:</span> {data.description}</p>

        
        {data.weaponId && type==="upgrade" && 
          <div>
            <br/><br/>
            <h5>BaseWeapon:</h5> 
            <div><span className="text-danger">weaponId:</span> {data.weaponId}</div>
          </div>
        }
        
        <br/><br/>
        <h5>Stats:</h5>
        {
          Object.keys(data.stat).filter((key)=>data.stat[key]!==0).map(function(key) {
            return <div><span className="text-danger">{key}:</span> {data.stat[key]}</div>
          })
        }  
        
        <br/><br/>
        <h5>Other:</h5>
        {
          Object.keys(data)
            .filter((key)=>!dataKeys.includes(key) && data[key]!== 0)
            .map(key=> <div><span className="text-danger">{key}:</span> {data[key]}</div>)
        }
      </div>
    )
  }