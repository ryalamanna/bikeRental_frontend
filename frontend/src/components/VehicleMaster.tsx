import { useEffect, useState } from "preact/hooks"
import axiosURL from "../axiosConfig"
import { vehicleModel, vehicleNameModel } from "../Models/VehicleModel";
import {Link} from 'preact-router';
const VehicleMaster = () => {
  const[loading, setLoading] = useState<boolean>(true);
  const[option, setOption] = useState<string>('');
  const[vehicles, setVehicles] = useState<vehicleModel[]>([]);
  const[vehicleName, setVehicleName] = useState<vehicleNameModel[]>([]);
  const[data , setData] = useState<vehicleModel>(new vehicleModel());
  const [errors, seterrors] = useState<any>({})

  const loadData = () =>{
    setLoading(true)
    try{
      Promise.all([
        axiosURL.get('/vehicles'),
        axiosURL.get('/vehicleName')
      ]).then(([vehiclesRes, vehicleNameRes])=>{
        setVehicles(vehiclesRes.data)
        setVehicleName(vehicleNameRes.data)
      }).catch(err=>{
        console.log(err)
      }).finally(()=>{
        setLoading(false)
      })
    } catch(err){
      console.log(err)
    }
  }
  useEffect(() => {
    loadData();
  }, [])


  // || handle change ||
  const handleChange = (e:Event)=>{
    const {name, value} = e.target as HTMLInputElement | HTMLSelectElement;
    setData({...data, [name]: value})
    console.log(data);
  }
  
  // || validation ||
  const validate = () => {
    return new Promise((resolve , reject ) => {
    let errors :any = {};
    
    const requiredFields :{key: keyof vehicleModel , message : string}[] = [
      { key: 'name_id', message: 'Name is required' },
      { key: 'vehicle_no', message: 'Vehicle no is required' },
      { key: 'color', message: 'Color is required' },
      { key: 'km_driven', message: 'Km driven is required' },
      { key: 'rc', message: 'RC is required' }
    ];

    for (const field of requiredFields) {
      if (!data[field.key]) {
        errors[field.key] = field.message;
      }
    }

    if (data.km_driven && (data.km_driven < 0 || data.km_driven > 999999 || isNaN(data.km_driven))) {
      errors.km_driven = 'Km driven is invalid';
    }

    if (data.last_service_km && (isNaN(data.last_service_km) || data.last_service_km < 0 || data.last_service_km > 999999)) {
      errors.last_service_km = 'Last service km is invalid';
    }
    // if (!values.email) {
    //   errors.email = 'Email is required';
    // } else if (!/\S+@\S+\.\S+/.test(values.email)) {
    //   errors.email = 'Email is invalid';
    // }
    // if (!values.password) {
    //   errors.password = 'Password is required';
    // } else if (values.password.length < 6) {
    //   errors.password = 'Password must be at least 6 characters';
    // }
    // if (!values.confirmPassword) {
    //   errors.confirmPassword = 'Confirm password is required';
    // } else if (values.confirmPassword !== values.password) {
    //   errors.confirmPassword = 'Passwords do not match';
    // }
    resolve(errors) ;
   });
  };

  // || Add function || 
  const handleAdd = async (e:Event)=>{
    e.preventDefault();
    const errors: any =await validate();
    seterrors(errors);
    if (Object.keys(errors).length === 0) {
      axiosURL.post('/vehicles', data).then(res=>{
        if(res.data.message === 'success'){
          alert('Vehicle added successfully');
          setData(new vehicleModel());
        }else{
          alert('Something went wrong');
        }
      })
    }
  }

  // || Delete function ||
  const handleDelete = (id:number)=>{
    if(window.confirm('Are you sure you want to delete this vehicle?')){
      axiosURL.delete(`/vehicles/${id}`).then(res=>{
        if(res.data.message === 'success'){
          alert('Vehicle deleted successfully');
          loadData();
        }else{
          alert('Something went wrong');
        }
      })
    }else{
      return;
    }
  }

  // || open Edit function ||
  const OpenEdit = (id:number)=>{
    try{
      axiosURL.get(`/vehicles/${id}`).then(res=>{
        if(res.data.message === 'success'){
        setOption('Edit');
        setData(res.data.data);
      } else{
        alert('Something went wrong');
      } });
    } catch (err){
      console.log(err);
    }
  }

  // || Edit function || 
  const handleEdit = async (e:Event)=>{
    e.preventDefault();
    const errors: any =await validate();
    seterrors(errors);
    if (Object.keys(errors).length === 0) {
      axiosURL.put(`/vehicles/${data.vehicle_id}`, data).then(res=>{
        if(res.data.message === 'success'){
          alert('Vehicle updated successfully');
          setOption('');
          setData(new vehicleModel());
          loadData();
        }else{
          alert('Something went wrong');
        }
      })
    }
  }

  // || view function ||
  const handleView = (id:number)=>{
    setOption('View');
    setData(vehicles.find(vehicle=>vehicle.vehicle_id === id) as vehicleModel);
  }

  // || submit function ||
  const handleSubmit = (e:Event)=> {
    if(option === 'Add'){
      handleAdd(e);
    }else if(option === 'Edit'){
      handleEdit(e);
    }
  }
 


  
  
  return (
    <>
    <div>VehicleMaster</div>
    {!loading && option === '' && <>
    <div class='add_btn'>

      <button onClick={()=>setOption('Add')}>
        <i class="fa fa-plus"></i>
      </button>

    </div>
    <table >
      <thead>
        <tr>
          <th>SI.</th>
          <th>Vehicle Model</th>
          <th>Vehicle No.</th>
          <th class='mob_hide'>Km driven</th>
          <th class='mob_hide'>color</th>
          <th>Service Due</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {
          vehicles.map((vehicle, key)=>{
            return(
              <tr key={key} style={vehicle.is_available === 'y' || vehicle.is_available === 'Y' ? '' : 'background : #fe6161'}>
                <td>{key+1}</td>
                <td>{vehicleName.find(name => name.name_id === vehicle.name_id)?.name}</td>
                <td>{vehicle.vehicle_no}</td>
                <td class='mob_hide'>{vehicle.km_driven}</td>
                <td class='mob_hide' >{vehicle.color}</td>
                <td>
                  {vehicleName.find(name => name.name_id === vehicle.name_id) !== undefined
                    ? vehicle.last_service_km + vehicleName.find(name => name.name_id === vehicle.name_id)!.service_interval >= vehicle.km_driven
                      ? <div style={`background: green; width: 100%; height: 20px`}></div>
                      : <div style={`background: red; width: 100%; height: 20px`}></div>
                    : 'N/A'}
                </td>

                <td>
                  <button class='edit_btn' onClick={()=>OpenEdit(vehicle.vehicle_id)}>
                    <i class="fa fa-pencil"></i>
                  </button>
                  <button class='view_btn' onClick={()=>handleView(vehicle.vehicle_id)}>
                    <i class="fa fa-eye"></i>
                  </button>
                  <button class='del_btn' onClick={()=>handleDelete(vehicle.vehicle_id)}>
                    <i class="fa fa-trash"></i>
                  </button>
                </td>
              </tr>
            )
          })
        }
      </tbody>
    </table></>}

    {loading &&
    <div className="loader">
      <div className="lds-ellipsis"><div></div><div></div><div></div><div></div></div>
    </div>}

{option !== '' &&
    <div>
      <form onSubmit={handleSubmit}>
      <fieldset disabled={option==='View'}>
      <label>Vehicle Name</label>
      <select value={data.name_id} name="name_id" id="" onChange={handleChange}>
        <option value={0}>Select vehicle name</option>
        {
          vehicleName.map((name, key)=>{
            return(
              <option value={name.name_id}>{name.name_id}{name.name}</option>
            )
          })
        }
      </select>
      <p class='error' data-active={errors.name_id? 'true' : 'false'}>{errors.name_id && errors.name_id}</p>
      <br />
      <label>Vehicle Color</label>
      <input value={data.color} type="text" name='color' onInput={handleChange} />
      <p class='error' data-active={errors.color? 'true' : 'false'}>{errors.color && errors.color}</p>
      <br />
      <label>Vehicle No.</label>
      <input value={data.vehicle_no} type="text" name='vehicle_no' onInput={handleChange} />
      <p class='error' data-active={errors.vehicle_no? 'true' : 'false'}>{errors.vehicle_no && errors.vehicle_no}</p>
      <br />
      <label>RC No.</label>
      <input value={data.rc} type="text" name='rc' onInput={handleChange} />
      <p class='error' data-active={errors.rc? 'true' : 'false'}>{errors.rc && errors.rc}</p>
      <br />
      <label>Km driven</label>
      <input value={data.km_driven} type="number" name='km_driven' onInput={handleChange} />
      <p class='error' data-active={errors.km_driven? 'true' : 'false'}>{errors.km_driven && errors.km_driven}</p>
      <br />
      <label>Last Service Km</label>
      <input value={data.last_service_km} type="number" name='last_service_km' onInput={handleChange} />
      <p class='error' data-active={errors.last_service_km? 'true' : 'false'}>{errors.last_service_km && errors.last_service_km}</p>
      <br />
      <label>Is available</label>
      <select value={data.is_available} name="is_available" id="" onInput={handleChange}>
        <option value="y">Yes</option>
        <option value="n">No</option>
      </select>
      <br />
      {option != 'View' && <button type='submit' >{option === 'Edit'? 'Save and Exit' : 'Add'}</button>}
      </fieldset>
      <Link href='/' onClick={()=>setData(new vehicleModel)}><button type='button' >cancel</button></Link>
      </form>
    </div>
}
    </>
  )
}

export default VehicleMaster