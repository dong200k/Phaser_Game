/** Removes the information that the d3 library uses for the tree view. 
 * @returns a new document with the d3 info removed.
 */
export function removeD3TreeInfo(document: any){
    let newDoc = structuredClone(document)
  
    function dfsHelper(node: any){
      if(node === undefined) return
  
      delete node["__rd3t"]
  
      for(let child of node.children){
        dfsHelper(child)
      }
    }
  
    dfsHelper(newDoc.root)
    return newDoc
  }
  