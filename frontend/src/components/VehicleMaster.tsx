import { useEffect } from "preact/hooks"
import axiosURL from "../axiosConfig"
const VehicleMaster = () => {
  useEffect(() => {
    axiosURL.get('/vehicleMaster')
    .then((res)=>{
      console.log(res.data)
    })
  }, [])
  
  return (
    <>
    <div>VehicleMaster</div>
    <table>
      <thead>
        <tr>
          <th>SI.</th>
          <th>Vehicle Model</th>
          <th>Vehicle No.</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>

      </tbody>
    </table>

    </>
  )
}

export default VehicleMaster