import clsx from "clsx";
import { useForm } from "react-hook-form";
import SucessFull from "../ui/animation/Sucessfull";
import Headphone from "../ui/animation/Headphone";
import { useEffect, useState } from "react";
import { ErrorAnimated } from "../ui/animation/ErrorAnimated";
import { obtainDispatcher, obtainDriver, obtainTrailer, obtainVehicle, outBoundCall } from "@/api";
import { Dispatcher, Driver, Vehicule, Trailer } from '@/types/app';
import { LoadingScreen } from "../ui/animation/loadingScreen";
import { useWebSocket } from "@/contexts/WebSocketContext";

type FormInputs = {
  origin: string;
  destination: string;
  broker_name: string;
  weight: number;
  rate: string;
  length: string;
  commodity: string;
  delivery_date: string;
  pickup_date: string;
  load_reference: string;
  to_number: string;
  trailer_type: string;

  // business
  proposed_rate: string,
  proposed_rate_minimum: string,
  final_rate: string,

  // truck
  vehicle: string;
  trailer: string;
  driver: string;
  company: string;
  dispatcher: string;
}

type LoadingState = "create" | "loading" | "loading_call" | "success" | "error" | "info";

const authorities = [
  {
    id: 1,
    name: 'ITR APP',
    email: 'info.itrapp@gmail.com	',
    mcNumber: '1582744'
  },
  {
    id: 2,
    name: 'VIZU LOGISTICS SOLUTIONS	',
    email: 'vizulogisticssolutions@gmail.com',
    mcNumber: '1130788'
  },
  {
    id: 3,
    name: 'MOLA S TRANSPORT',
    email: 'molastransport@gmail.com',
    mcNumber: '125039'
  },
  {
    id: 4,
    name: 'TECH TRUCK INC',
    email: 'techtruck49gmail.com',
    mcNumber: '1713895'
  }
]

export const CallForm = () => {

  const { messages } = useWebSocket();
  const [loading, setLoading] = useState<LoadingState>('loading');
  const [dispatchers, setDisparchers] = useState<Dispatcher[]>([]);
  const [Drivers, setDrivers] = useState<Driver[]>([]);
  const [vehicles, setVehicles] = useState<Vehicule[]>([]);
  const [trailers, setTrailers] = useState<Trailer[]>([]);
  const [lastData, setLastData] = useState<any | null>(null);
  const { handleSubmit, register, formState: { isValid }, reset } = useForm<FormInputs>({
        defaultValues: {
            
        }
    });

  const allDispatcher = async (accessToken: string): Promise<Dispatcher[]> => {
    const result = await obtainDispatcher(accessToken);
    return result
  }

  const allDriver = async (accessToken: string): Promise<Driver[]> => {
    const result = await obtainDriver(accessToken);
    return result
  }

  const allVehicle = async (accessToken: string): Promise<Vehicule[]> => {
    const result = await obtainVehicle(accessToken);
    return result
  }

  const allTrailer = async (accessToken: string): Promise<Trailer[]> => {
    const result = await obtainTrailer(accessToken);
    return result
  }

  useEffect(() => {
    const fetchData = async () => {
      
      const cachedData = localStorage.getItem('appDataCache');

      if (cachedData) {
        const parsedData = JSON.parse(cachedData);
        setDisparchers(parsedData.dispatchers);
        setDrivers(parsedData.drivers);
        setVehicles(parsedData.vehicles);
        setTrailers(parsedData.trailers);
        setLoading('create');
        return;
      }

      setLoading('loading');
      try {
        const accessToken = localStorage.getItem("auth_token");
        if (!accessToken) throw new Error('Token vacío');

        const [dispatchers, drivers, vehicles, trailers] = await Promise.all([
          allDispatcher(accessToken),
          allDriver(accessToken),
          allVehicle(accessToken),
          allTrailer(accessToken)
        ]);

        const filteredData = {
          dispatchers: dispatchers.filter(element => element.active),
          drivers: drivers.filter(element => element.active),
          vehicles: vehicles.filter(element => element.active),
          trailers: trailers.filter(element => element.active)
        };

        setDisparchers(filteredData.dispatchers);
        setDrivers(filteredData.drivers);
        setVehicles(filteredData.vehicles);
        setTrailers(filteredData.trailers);
        setLoading('create');
        
        localStorage.setItem('appDataCache', JSON.stringify(filteredData));
      } catch (error: any) {
        console.error(error?.message ?? 'Error al procesar consultas');
        setLoading('error');
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      
      if (lastMessage.type === "post-call-webhook") {
        if (lastMessage.status === "Successful") {
          setLoading("success");
        } else {
          setLoading("error");
        }

        // después de 2 segundos mostramos el resto
        setTimeout(() => {
          setLastData(lastMessage);
          setLoading('info');
        }, 2000);
      }
    }
  }, [messages]);
  
  const onSubmit = async ( data: FormInputs ) => {
    setLoading('loading_call');

    const company = authorities.find((element) => element.id === Number(data.company));
    const driver = Drivers.find((element) => element.id === data.driver);
    const dispatcher = dispatchers.find((element) => element.id === data.dispatcher);
    const vehicle = vehicles.find((element) => element.id === Number(data.vehicle));
    const trailer = trailers.find((element) => element.id === Number(data.trailer));

    const elevenLabsRequest = {
      to_number: data.to_number,
      conversation_initiation_client_data:{
        dynamic_variables: {
          company_name:          company?.name ?? '',
          company_mc_number:     company?.mcNumber ?? '',
          origin:                data.origin,
          destination:           data.destination,
          BrokerName:            data.broker_name,
          weight:                String(data.weight),
          rate:                  data.rate,
          proposed_rate:         data.proposed_rate,
          final_rate:            data.final_rate,
          company_email:         company?.email ?? '',
          driver_name:           `${ driver?.firstName } ${ driver?.lastName }`,
          dispatcher_phone:      dispatcher?.phoneNumber ?? '',
          truck_number:          String(vehicle?.id),
          trailer_number:        trailer?.unit ?? '',
          load_reference:        data.load_reference,
          delivery_date:         data.delivery_date,
          pickup_date:           data.pickup_date,
          proposed_rate_minimum: data.proposed_rate_minimum,
          driver_phone:          driver?.phone ?? '',
          length:                data.length,
          commodity:             data.commodity,
          dispatcher_email:      company?.email ?? '',
          trailer_type:          data.trailer_type,
          dispatcher_name:       `${dispatcher?.firstName} ${dispatcher?.lastName}`,
        }
      }
    }

    try {
      await outBoundCall(elevenLabsRequest);  
    } catch (error) {
      setLoading('error')
    }
    
  }

  const resetForm = () => {
    reset();
    setLoading('create');
    setLastData(null);
  }


  return (
    <>
      {
        loading === "create" && (
          <form onSubmit={ handleSubmit( onSubmit ) } className="grid grid-cols-1 gap-2 sm:gap-5 sm:grid-cols-2">

            <div className="flex flex-col mb-2">
              <span>Telefono Broker</span>
              <input
                  type="text"
                  className="p-2 border rounded-md bg-gray-200"
                  autoFocus
                  { ...register('to_number', { required: true }) }
              />
            </div>
      
            <div className="flex flex-col mb-2">
              <span>Dispatcher</span>
              <select
                  className="p-2 border rounded-md bg-gray-200"
                  { ...register('dispatcher', { required: true }) }
              >
                <option value="">[ Seleccione ]</option>
                
                {
                  dispatchers.map((dispacht) => (
                    <option key={ dispacht.id } value={ dispacht.id }>{ dispacht.firstName } {dispacht.lastName}</option>
                  ))
                }
              </select>
            </div>

            <div className="flex flex-col mb-2">
              <span>Company</span>
              <select
                  className="p-2 border rounded-md bg-gray-200"
                  { ...register('company', { required: true }) }
              >
                  <option value="">[ Seleccione ]</option>
                  
                  {
                    authorities.map((company) => (
                      <option key={ company.id } value={ company.id }>{ company.name }</option>
                    ))
                  }
              </select>
            </div>

            <div className="flex flex-col mb-2">
              <span>Driver</span>
              <select
                  className="p-2 border rounded-md bg-gray-200"
                  { ...register('driver', { required: true }) }
              >
                <option value="">[ Seleccione ]</option>
                
                {
                  Drivers.map((drvier) => (
                    <option key={ drvier.id } value={ drvier.id }>{ drvier.firstName } { drvier.lastName }</option>
                  ))
                }
              </select>
            </div>

            <div className="flex flex-col mb-2">
              <span>Vehicle</span>
              <select
                  className="p-2 border rounded-md bg-gray-200"
                  { ...register('vehicle', { required: true }) }
              >
                  <option value="">[ Seleccione ]</option>
                  {
                    vehicles.map((vehicle) => (
                      <option key={ vehicle.id } value={ vehicle.id }>{ vehicle.id }</option>
                    ))
                  }
              </select>
            </div>

            <div className="flex flex-col mb-2">
              <span>Trailer</span>
              <select
                  className="p-2 border rounded-md bg-gray-200"
                  { ...register('trailer', { required: true }) }
              >
                  <option value="">[ Seleccione ]</option>
                  {
                    trailers.map((trailer) => (
                      <option key={ trailer.id } value={ trailer.id }>{ trailer.unit }</option>
                    ))
                  }
              </select>
            </div>

            <div className="flex flex-col mb-2">
              <span>Tipo de Trailer</span>
              <select
                  className="p-2 border rounded-md bg-gray-200"
                  { ...register('trailer_type', { required: true }) }
              >
                  <option value="">[ Seleccione ]</option>
                  <option value="Dry van">Dry van</option>
                  <option value="Reefer">Reefer</option>
                  <option value="Flatbed">Flatbed</option>
              </select>
            </div>

            <div className="flex flex-col mb-2">
              <span>Origin</span>
              <input
                  type="text"
                  className="p-2 border rounded-md bg-gray-200"
                  { ...register('origin', { required: true }) }
              />
            </div>

            <div className="flex flex-col mb-2">
              <span>Destination</span>
              <input
                  type="text"
                  className="p-2 border rounded-md bg-gray-200"
                  { ...register('destination', { required: true }) }
              />
            </div>

            <div className="flex flex-col mb-2">
              <span>Broker Name</span>
              <input
                  type="text"
                  className="p-2 border rounded-md bg-gray-200"
                  { ...register('broker_name', { required: true }) }
              />
            </div>

            <div className="flex flex-col mb-2">
              <span>Weight</span>
              <input
                  type="text"
                  className="p-2 border rounded-md bg-gray-200"
                  { ...register('weight', { required: true }) }
              />
            </div>

            <div className="flex flex-col mb-2">
              <span>Posted rate</span>
              <input
                  type="text"
                  className="p-2 border rounded-md bg-gray-200"
                  { ...register('rate', { required: true }) }
              />
            </div>

            <div className="flex flex-col mb-2">
              <span>Length</span>
              <input
                  type="text"
                  className="p-2 border rounded-md bg-gray-200"
                  { ...register('length') }
              />
            </div>

            <div className="flex flex-col mb-2">
              <span>Commodity</span>
              <input
                  type="text"
                  className="p-2 border rounded-md bg-gray-200"
                  { ...register('commodity') }
              />
            </div>

            <div className="flex flex-col mb-2">
              <span>Pickup Date</span>
              <input
                  type="date"
                  className="p-2 border rounded-md bg-gray-200"
                  { ...register('pickup_date') }
              />
            </div>

            <div className="flex flex-col mb-2">
              <span>Delivery Date</span>
              <input
                  type="date"
                  className="p-2 border rounded-md bg-gray-200"
                  { ...register('delivery_date') }
              />
            </div>

            <div className="flex flex-col mb-2">
              <span>Load Reference</span>
              <input
                  type="text"
                  className="p-2 border rounded-md bg-gray-200"
                  { ...register('load_reference') }
              />
            </div>

            <div className="flex flex-col mb-2">
              <span>Expected rate</span>
              <input
                  type="text"
                  className="p-2 border rounded-md bg-gray-200"
                  { ...register('proposed_rate') }
              />
            </div>


            <div className="flex flex-col mb-2">
              <span>Minimum rate</span>
              <input
                  type="text"
                  className="p-2 border rounded-md bg-gray-200"
                  { ...register('proposed_rate_minimum') }
              />
            </div>


            <div className="flex flex-col mb-2">
              <span>Valor final</span>
              <input
                  type="text"
                  className="p-2 border rounded-md bg-gray-200"
                  { ...register('final_rate') }
              />
            </div>

            <div className="flex flex-col mb-2 sm:mt-2">
              <div className="flex flex-auto">
                <button
                    disabled={ !isValid }
                    type='submit'
                    className={
                        clsx(
                            "flex w-full sm:w-1/2 justify-center ",
                            {
                                'btn-primary': isValid,
                                'btn-disabled': !isValid
                            }
                        )
                    }>
                    Submit
                </button>
              </div>
            </div>

          </form>
        )
      }

      <div>
        {loading === "success" && (
          <div className="grid place-items-center h-full">
            <SucessFull />
          </div>
          
        )}
        {loading === "loading_call" && (
          <div className="grid place-items-center h-full">
            <Headphone />
          </div>
          
        )}
        {loading === "loading" && (
          <div className="grid place-items-center h-full">
            <LoadingScreen />
          </div>
          
        )}
        {loading === "error" && (
          <div className="grid place-items-center h-full">
            <ErrorAnimated />

            <div>
              <button onClick={ resetForm } className="btn-primary">New call</button>
            </div>
          </div>
        )}
      </div>

      {
        loading === 'info' && (
          <div className="p-4 border rounded-md shadow-sm">
            <h2 className="font-bold text-lg mb-2">Estado de la llamada</h2>

            {lastData && (
              <>
                <div className="mt-4 space-y-2">
                  <p>
                    <strong>Agent ID:</strong> {lastData.agentId}
                  </p>
                  <p>
                    <strong>Conversation ID:</strong> {lastData.conversation_id}
                  </p>
                  <p>
                    <strong>User ID:</strong> {lastData.userId}
                  </p>
                  <p>
                    <strong>Status:</strong> {lastData.status}
                  </p>
                  <p>
                    <strong>Transcript:</strong>
                  </p>
                  <pre className="bg-gray-100 p-2 text-left rounded text-sm whitespace-pre-wrap">
                    {lastData.transcript}
                  </pre>
                </div>
                <div>
                  <button onClick={ resetForm } className="btn-primary">New call</button>
                </div>
              </>
            )}
          </div>
        )
      }

      
    </>
  )
}
