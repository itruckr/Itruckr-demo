import clsx from "clsx";
import { Controller, useForm } from "react-hook-form";
import SucessFull from "../ui/animation/Sucessfull";
import Headphone from "../ui/animation/Headphone";
import { useEffect, useState } from "react";
import { ErrorAnimated } from "../ui/animation/ErrorAnimated";
import { datExtractorSingleLoad, obtainAuthority, obtainDispatcher, obtainDriver, obtainTrailer, outBoundCall } from "@/api";
import { Dispatcher, DriverForm as Driver, Vehicule, Trailer, Authority } from '@/types/app';
import { LoadingScreen } from "../ui/animation/loadingScreen";
import { useWebSocket } from "@/contexts/WebSocketContext";
import { UploadFile } from '../ui/uploadFile';
import toInputTime from "@/utils/hour_format";
import { CollapseList } from '../ui/collapse_list';
import Time from "../ui/timer";


declare global {
  interface Window {
    DavidAI: any;
  }
}

type FormInputs = {
  origin: string;
  destination: string;
  pickup_date: string;
  pickup_time_min:       string,
  pickup_time_max:       string,
  delivery_date: string;
  delivery_time_min:      string,
  delivery_time_max:      string,
  weight: number;
  load_number: string;
  to_number: string;
  broker_offer: string,

  // business
  proposed_rate: string,
  proposed_rate_minimum: string,
  //final_rate: string,

  // truck
  vehicle: string;
  trailer: string;
  trailer_type: string;

  //driver
  driver: string;

  //company
  company: string;
  
  //dispa
  dispatcher: string;
}

type LoadingState = "create" | "loading" | "loading_call" | "success" | "error" | "info";

export const CallForm = () => {

  const { messages } = useWebSocket();
  const [loading, setLoading] = useState<LoadingState>('loading');
  const [dispatchers, setDisparchers] = useState<Dispatcher[]>([]);
  const [Drivers, setDrivers] = useState<Driver[]>([]);
  const [vehicles, setVehicles] = useState<Vehicule[]>([]);
  const [authority, setAuthority] = useState<Authority[]>([]);
  const [trailers, setTrailers] = useState<Trailer[]>([]);
  const [lastData, setLastData] = useState<any | null>(null);
  const [audioUrl, setAudioUrl] = useState<any | null>(null);
  const [isOpenDAT, setisOpenDAT] = useState<boolean>(false);
  const [copied, setCopied] = useState(false);
  const { handleSubmit, register, control, formState: { isValid }, reset } = useForm<FormInputs>({
        defaultValues: {
          pickup_time_min: "00:00",
          pickup_time_max: "00:00",
          delivery_time_min: "00:00",
          delivery_time_max: "00:00",
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

  const allAuthority = async (accessToken: string): Promise<Authority[]> => {
    const result = await obtainAuthority(accessToken);
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
        setAuthority(parsedData.authority);
        setTrailers(parsedData.trailers);
        setLoading('create');
        return;
      }

      setLoading('loading');
      try {
        const accessToken = localStorage.getItem("auth_token");
        if (!accessToken) throw new Error('Token vacío');

        const [dispatchers, drivers, authority, trailers] = await Promise.all([
          allDispatcher(accessToken),
          allDriver(accessToken),
          allAuthority(accessToken),
          allTrailer(accessToken)
        ]);

        const filteredData = {
          dispatchers: dispatchers.filter(element => element.active),
          drivers: drivers.filter(element => element.active),
          authority: authority,
          trailers: trailers.filter(element => element.active)
        };

        setDisparchers(filteredData.dispatchers);
        setDrivers(filteredData.drivers);
        setAuthority(filteredData.authority);
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

      if (lastMessage.type ==  "post-call-audio-webhook") {
        setAudioUrl(lastMessage.url);
      }
    }
  }, [messages]);
  
  const onSubmit = async ( data: FormInputs ) => {
    setLoading('loading_call');

    const company = authority.find((element) => element.authorityId === Number(data.company));
    const driver = Drivers.find((element) => element.id === data.driver);
    const dispatcher = dispatchers.find((element) => element.id === data.dispatcher);
    const vehicle = vehicles.find((element) => element.id === Number(data.vehicle));
    const trailer = trailers.find((element) => element.id === Number(data.trailer));

    const elevenLabsRequest = {
      to_number: data.to_number,
      conversation_initiation_client_data:{
        dynamic_variables: {
          origin:                data.origin,
          destination:           data.destination,
          pickup_date:           data.pickup_date,
          pickup_time_min:       data.pickup_time_min,
          pickup_time_max:       data.pickup_time_max,
          delivery_date:         data.delivery_date,
          delivery_time_min:     data.delivery_time_min,
          delivery_time_max:     data.delivery_time_max,
          weight:                String(data.weight),
          
          final_rate: '',
          load_number:           data.load_number,
          broker_offer:           data.broker_offer,

          //proposed
          proposed_rate:         data.proposed_rate,
          proposed_rate_minimum: data.proposed_rate_minimum,

          //company
          company_name:          company?.name ?? '',
          mc_number:             company?.mcNumber ?? '',
          company_email:         company?.email ?? '',

          //driver
          driver_name:           `${ driver?.firstName } ${ driver?.lastName }`,
          driver_phone:          driver?.phoneNumber ?? '',

          // trailer
          truck_number:          String(vehicle?.id),
          trailer_number:        trailer?.unit ?? '',
          truck_specs:           '[{"type":"straps","status":"available"},{"type":"refrigeration/temp control","status":"not available"},{"type":"extra stops","status":"available"}]',

          // dispatcher
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
    setAudioUrl(null);
  }

  const copyTranscript = () => {
    if (lastData?.transcript) {
      navigator.clipboard.writeText(lastData.transcript)
        .then(() => setCopied(true))
        .catch((err) => console.error("Error copiando:", err));
      
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>): Promise<void> => {
    return new Promise((resolve, reject) => {
      const file = e.target.files?.[0];
      if (!file) {
        resolve(); // nada que hacer
        return;
      }

      const reader = new FileReader();

      reader.onloadend = async () => {
        try {
          if (typeof reader.result === "string") {
            const image = reader.result;
            const base64 = image.split(",")[1];
            
            const result = await datExtractorSingleLoad(base64!);
            fillOutForm(result);
            
          }
          resolve();
        } catch (err) {
          reject(err);
        }
      };

      reader.onerror = () => reject(reader.error);
      reader.readAsDataURL(file);
    });
  };

  const fillOutForm = (result: any) => {
    const origin = result.trip.origin;
    const destination =  result.trip.destination;
    const rate = result.rate.total_usd;
    const load_details = result.load_details;
    const company = result.company;

    
    reset({
      to_number: company.contact_phone,
      origin: `${origin.city} ${origin.state}`,
      pickup_date: origin.pickup_date,
      pickup_time_min: toInputTime(origin.pickup_time_window_start),
      pickup_time_max: toInputTime(origin.pickup_time_window_end),
      destination: `${destination.city} ${destination.state}`,
      delivery_date: destination.delivery_date,
      delivery_time_max: toInputTime(destination.delivery_time_window_start),
      delivery_time_min: toInputTime(destination.delivery_time_window_end),
      weight: Number(load_details.weight_lbs),
      broker_offer: rate,
      load_number: load_details.load_number
    });

    setisOpenDAT(true);
  }

  useEffect(() => {
    if (window.DavidAI) {
      window.DavidAI.initCollapse();
    }
  }, []);

  const handleCompanyChange = (id: string) => {
    const selectedAuthority = authority.find((element) => element.authorityId === Number(id));
    if (selectedAuthority) {
      setVehicles(selectedAuthority.vehicles);
    }
  };


  return (
    <>
      {
        loading === "create" && (
          <>
            <UploadFile
              label="Search data"
              handleFileChange={ handleFileChange }
            />
            <form onSubmit={ handleSubmit( onSubmit ) } className="grid grid-cols-1 gap-5">

              <CollapseList title="General info" isOpenInit={ true } >
                <div className="grid grid-cols-1 gap-2 sm:gap-5 sm:grid-cols-2 mt-5">
                  <div className="flex flex-col mb-2">
                    <span>Broker phone</span>
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
                        onChange={(e) => {
                          const selectedId = e.target.value;
                          handleCompanyChange(selectedId);
                        }}
                    >
                        <option value="">[ Seleccione ]</option>
                        
                        {
                          authority.map((company) => (
                            <option key={ company.authorityId } value={ company.authorityId }>{ company.name }</option>
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
                </div>
              </CollapseList>

              <CollapseList title="Load info" isOpen={ isOpenDAT } onToggle={ () => setisOpenDAT(!isOpenDAT) } >
                <div className="grid grid-cols-1 gap-2 sm:gap-5 sm:grid-cols-2 mt-5">
                  <div className="flex flex-col mb-2">
                    <span >Load Number</span>
                    <input
                        type="text"
                        className="p-2 border rounded-md bg-gray-200"
                        { ...register('load_number') }
                    />
                  </div>
                  <div className="flex flex-col mb-2">
                    <span >Weight</span>
                    <input
                        type="text"
                        className="p-2 border rounded-md bg-gray-200"
                        { ...register('weight', { required: true }) }
                    />
                  </div>

                  <div className="flex flex-col mb-2">
                    <span >Offer</span>
                    <input
                        type="text"
                        className="p-2 border rounded-md bg-gray-200"
                        { ...register('broker_offer', { required: true }) }
                    />
                  </div>
                </div> 

                <div className="grid grid-cols-1 gap-2 sm:gap-5 sm:grid-cols-2 my-3">

                  <div className="flex flex-col gap-5 bg-gray-100 rounded-lg shadow-md p-5">
                    <div className="flex p-2 justify-start">
                      <h2 className="font-bold">Pick up</h2>
                    </div>
                    <div className="flex flex-col mb-2">
                      <span >Origin</span>
                      <input
                          type="text"
                          className="p-2 border rounded-md bg-gray-200"
                          { ...register('origin', { required: true }) }
                      />
                    </div>
                    <div className="flex flex-col mb-2">
                      <span >Pickup Date</span>
                      <input
                          type="date"
                          className="p-2 border rounded-md bg-gray-200"
                          { ...register('pickup_date') }
                      />
                    </div>

                    <div className="flex flex-col mb-2">
                      <span >Pickup Time Min</span>
                      <Controller
                        name="pickup_time_min"
                        control={control}
                        render={({ field }) => (
                          <Time
                            timeInit={field.value}
                            onChange={(val) => field.onChange(val)}
                          />
                        )}
                      />
                    </div>

                    <div className="flex flex-col mb-2">
                      <span >Pickup Time Max</span>
                      <Controller
                        name="pickup_time_max"
                        control={control}
                        render={({ field }) => (
                          <Time
                            timeInit={field.value}
                            onChange={(val) => field.onChange(val)}
                          />
                        )}
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-5 bg-gray-100 rounded-lg shadow-md p-5">
                    <div className="flex p-2 justify-start">
                      <h2 className="font-bold">Delivery</h2>
                    </div>
                    <div className="flex flex-col mb-2">
                        <span >Destination</span>
                        <input
                            type="text"
                            className="p-2 border rounded-md  bg-gray-200"
                            { ...register('destination', { required: true }) }
                        />
                      </div>
                      <div className="flex flex-col mb-2">
                      <span >Delivery Date</span>
                      <input
                          type="date"
                          className="p-2 border rounded-md bg-gray-200"
                          { ...register('delivery_date') }
                      />
                    </div>

                    <div className="flex flex-col mb-2">
                      <span >Delivery Time Min</span>
                      <Controller
                        name="delivery_time_min"
                        control={control}
                        render={({ field }) => (
                          <Time
                            timeInit={field.value}
                            onChange={(val) => field.onChange(val)}
                          />
                        )}
                      />
                    </div>

                    <div className="flex flex-col mb-2">
                      <span >Delivery Time Max</span>
                      <Controller
                        name="delivery_time_max"
                        control={control}
                        render={({ field }) => (
                          <Time
                            timeInit={field.value}
                            onChange={(val) => field.onChange(val)}
                          />
                        )}
                      />
                    </div>
                  </div>   
                
                </div>
              </CollapseList>

              <div className="grid grid-cols-1 gap-2 sm:gap-5 sm:grid-cols-2 mt-5">
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
          </>
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

            {
              audioUrl && (
                <div className="flex w-full justify-center p-2 mt-2">
                  <audio controls >
                      <source src={ audioUrl } type="audio/mpeg" />
                    Tu navegador no soporta audio.
                  </audio>
                </div>
                
              )
            }

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
                  <button 
                    disabled={ copied }
                    onClick={copyTranscript} className="btn-primary">
                    {copied ? "Copied!" : "Copy Transcript"}
                  </button>
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
