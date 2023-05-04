export default function NodeDetails({nodeDatum: node, edit}){
    let {data, children, nodeId} = node
    return (
      <div>
        <h5><span className="text-primary">Name: </span>{data.name}</h5>
        <div><span className="text-primary">id:</span> {nodeId}</div>
        <p><span className="text-primary">description:</span> {data.description}</p>
        {data.weaponId && <div><span className="text-danger">weaponId:</span> {data.weaponId}</div>}
        {
          Object.keys(data.stat).filter((key)=>data.stat[key]!==0).map(function(key) {
            return <div><span className="text-danger">{key}:</span> {data.stat[key]}</div>
          })
        }  
      </div>
    )
  }