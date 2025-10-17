import clsx from "clsx";
import { Controller, useForm } from "react-hook-form";
import SucessFull from "../ui/animation/Sucessfull";
import Headphone from "../ui/animation/Headphone";
import { useEffect, useState } from "react";
import { ErrorAnimated } from "../ui/animation/ErrorAnimated";
import { datExtractorSingleLoad, obtainAuthority, obtainTrailer, outBoundCall, } from "@/api";
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
  broker_offer: string,
  extension: string,

  origin: string;
  destination: string;
  
  
  weight: number;
  load_number: string;
  to_number: string;
 
  //email: string,

  //pickup
  pickup_date: string;
  pickup_date_min: string;
  pickup_date_max: string;
  pickup_time_min: string;
  pickup_time_max: string;

  //delivery
  delivery_date_min: string;
  delivery_date_max: string;
  delivery_time_min: string;
  delivery_time_max: string;

  // business
  proposed_rate: number,
  proposed_rate_minimum: number,

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
        }
    });

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
        setAuthority(parsedData.authority);
        setTrailers(parsedData.trailers);
        setLoading('create');
        return;
      }

      setLoading('loading');
      try {
        const accessToken = localStorage.getItem("auth_token");
        if (!accessToken) throw new Error('Token vacío');

        const [authority, trailers] = await Promise.all([
          allAuthority(accessToken),
          allTrailer(accessToken)
        ]);

        const filteredData = {
          authority: authority,
          trailers: trailers.filter(element => element.active)
        };

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

  //region email
  /*const email = watch("email");
  const company = watch("company");

  const handleSendEmail = async () => {
    if (!isValid) {
      alert("El formulario no es válido");
      return;
    }

    if (!email) {
      alert("Debe ingresar un correo electrónico para enviar el email");
      return;
    }

    if (company !== "3") {
      alert("Solo se permite enviar correos si la empresa es 'MOLA S TRANSPORT'");
      return;
    }


    const data: EmailPayload = {
      requestEmail: {
        to: email,
        cc: null,
        bbc: null,
        subject: "esto es una prueba",
        text: "hola que mas ???????????",
        attachments: [],
      },
      username: "molastransport@gmail.com",
      password: "idlpmgwhbokctrfy",
      personal: "test Email",
    };

    await sendEmailDynamic(data);
    // Aquí tu lógica para enviar el correo
    alert("Correo enviado correctamente ✅");
  };*/
  //endregion email
  
  const onSubmit = async ( data: FormInputs ) => {
    if (!isValid) return;
    if (data.proposed_rate < data.proposed_rate_minimum) {
      alert(`Proposed rate (${data.proposed_rate}) debe ser mayor o igual al rate mínimo (${data.proposed_rate_minimum})`);
      return;
    }
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
          pickup_date_min:       data.pickup_date_min,
          pickup_date_max:       data.pickup_date_max,
          pickup_time_min:       data.pickup_time_min,
          pickup_time_max:       data.pickup_time_max,
          delivery_date_min:     data.delivery_date_min,
          delivery_date_max:     data.delivery_date_max,
          delivery_time_min:     data.delivery_time_min,
          delivery_time_max:     data.delivery_time_max,
          weight:                String(data.weight),
          
          final_rate: '',
          load_number:           (!data.load_number || isNaN(Number(data.load_number)) || String(data.load_number).length <= 2 ) ? null : data.load_number,
          broker_offer:           data.broker_offer,
          extension:            data.extension,

          //proposed
          proposed_rate:         data.proposed_rate,
          proposed_rate_minimum: data.proposed_rate_minimum,
          counter_rate: (((data.proposed_rate - data.proposed_rate_minimum) / 2) + data.proposed_rate_minimum),

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
          truck_specs:           JSON.stringify(vehicle?.equipment ?? {}),

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
      extension: company.number_extension,
      origin: `${origin.city} ${origin.state}`,
      pickup_date_min: origin.delivery_date_window_start,
      pickup_date_max: origin.delivery_date_window_end,
      pickup_time_min: toInputTime(origin.pickup_time_window_start),
      pickup_time_max: toInputTime(origin.pickup_time_window_end),
      destination: `${destination.city} ${destination.state}`,
      delivery_date_min: destination.delivery_date_window_start,
      delivery_date_max: destination.delivery_date_window_end,
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
      setDisparchers(selectedAuthority.dispatchers);
      setDrivers(selectedAuthority.drivers);
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
                    <span>Number ext.</span>
                    <input
                        type="text"
                        className="p-2 border rounded-md bg-gray-200"
                        autoFocus
                        { ...register('extension') }
                    />
                  </div>

                  {/*<div className="flex flex-col mb-2">
                    <span>Email</span>
                    <input
                        type="email"
                        className="p-2 border rounded-md bg-gray-200"
                        autoFocus
                        { ...register('email') }
                    />
                  </div>*/}

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

                <div className="grid grid-cols-1 gap-2 lg:gap-5 lg:grid-cols-2 my-3">

                  <div className="flex flex-col gap-5 bg-gray-100 justify-center rounded-lg shadow-md p-5">
                    <div className="flex justify-start">
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

                    <div className="flex flex-col sm:flex-row gap-3">
                        <div className="flex flex-col mb-2 w-full">
                          <span >Pickup Date Min</span>
                          <input
                              type="date"
                              className="p-2 border rounded-md bg-gray-200"
                              { ...register('pickup_date_min', { required: true }) }
                          />
                        </div>
                        <div className="hidden sm:flex sm:items-center pt-3">to</div>
                        <div className="flex flex-col mb-2 w-full">
                          <span >Pickup Date Max</span>
                          <input
                              type="date"
                              className="p-2 border rounded-md bg-gray-200"
                              { ...register('pickup_date_max', { required: true }) }
                          />
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3">
                      <div className="flex flex-col mb-2 w-full">
                        <span >Pickup Time Min</span>
                        <Controller
                          name="pickup_time_min"
                          control={control}
                          rules={{required: true}}
                          render={({ field }) => (
                            <Time
                              timeInit={field.value}
                              onChange={(val) => field.onChange(val)}
                            />
                          )}
                        />
                      </div>

                      <div className="hidden sm:flex sm:items-center pt-3">to</div>

                      <div className="flex flex-col mb-2 w-full">
                        <span >Pickup Time Max</span>
                        <Controller
                          name="pickup_time_max"
                          control={control}
                          rules={{required: true}}
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

                  <div className="flex flex-col gap-5 bg-gray-100 rounded-lg shadow-md p-5 justify-center">
                      <div className="flex justify-start">
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
                      
                      <div className="flex flex-col sm:flex-row gap-3">
                          <div className="flex flex-col mb-2 w-full">
                            <span >Delivery Date Min</span>
                            <input
                                type="date"
                                className="p-2 border rounded-md bg-gray-200"
                                { ...register('delivery_date_min', { required: true }) }
                            />
                          </div>

                          <div className="hidden sm:flex sm:items-center pt-3">to</div>

                          <div className="flex flex-col mb-2 w-full">
                            <span >Delivery Date Max</span>
                            <input
                                type="date"
                                className="p-2 border rounded-md bg-gray-200"
                                { ...register('delivery_date_max', { required: true }) }
                            />
                          </div>
                      </div>
                      <div className="flex flex-col sm:flex-row gap-3">
                          <div className="flex flex-col mb-2 w-full">
                            <span >Delivery Time Min</span>
                            <Controller
                              name="delivery_time_min"
                              control={control}
                              rules={{required: true}}
                              render={({ field }) => (
                                <Time
                                  timeInit={field.value}
                                  onChange={(val) => field.onChange(val)}
                                />
                              )}
                            />
                          </div>

                          <div className="hidden sm:flex sm:items-center pt-3">to</div>

                          <div className="flex flex-col mb-2 w-full">
                            <span >Delivery Time Max</span>
                            <Controller
                              name="delivery_time_max"
                              control={control}
                              rules={{required: true}}
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
                
                </div>
              </CollapseList>

              <div className="grid grid-cols-1 gap-2 sm:gap-5 sm:grid-cols-2 mt-5">
                <div className="flex flex-col mb-2">
                  <span>Minimum rate</span>
                  <input
                      type="number"
                      className="p-2 border rounded-md bg-gray-200"
                      { ...register('proposed_rate_minimum') }
                  />
                </div>

                <div className="flex flex-col mb-2">
                  <span>Expected rate</span>
                  <input
                      type="number"
                      className="p-2 border rounded-md bg-gray-200"
                      { ...register('proposed_rate') }
                  />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 mb-2 sm:mt-2">
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
                      Call
                  </button>
                  {/*<button
                      disabled={ !isValid }
                      type='button'
                      onClick={ handleSendEmail }
                      className={
                          clsx(
                              "flex w-full sm:w-1/2 justify-center ",
                              {
                                  'btn-primary': isValid,
                                  'btn-disabled': !isValid
                              }
                          )
                      }>
                      Send email
                  </button>*/}
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
