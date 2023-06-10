export default function NodeDetails({nodeDatum: node, type}){
    let {data, children, id} = node
    let dataKeys = ["name", "description", "stat", "weaponId", "effect"]
    return (
      <div>
        <h5><span className="text-primary">Name: </span>{data.name}</h5>
        <div><span className="text-primary">id:</span> {id}</div>
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
        {
          type === "upgrade" && node.data.effect && node.data.effect.effectId &&
          <div>
            <h3>Effect</h3>
              <div className="">
                  <span className="text-danger">effectLogicId: <span className="text-dark">{node.data.effect.effectLogicId}</span></span>
              </div>
              <div>
                  <span className="text-danger">type: <span className="text-dark">{node.data.effect.type}</span> </span>
              </div>
              {
                node.data.effect.cooldown &&
                <div>
                  <span className="text-danger">cooldown(ms): <span className="text-dark">{node.data.effect.cooldown}</span> </span>
                </div>
              }

              <div>
                  <span className="text-danger">collisionGroup: <span className="text-dark">{node.data.effect.collisionGroup}</span> </span>
              </div>
              
              <div>
                  <span className="text-danger">doesStack: <span className="text-dark">{node.data.effect.doesStack}</span> </span>
              </div>

              
              <br></br>
          </div>
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