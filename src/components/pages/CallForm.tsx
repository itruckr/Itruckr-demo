import clsx from "clsx";
import { Controller, useForm } from "react-hook-form";
import SucessFull from "../ui/animation/Sucessfull";
import Headphone from "../ui/animation/Headphone";
import { useEffect, useState } from "react";
import { ErrorAnimated } from "../ui/animation/ErrorAnimated";
import { datExtractorSingleLoad, obtainAuthority, obtainTrailer, outBoundCall } from "@/api";
import { Dispatcher, DriverForm as Driver, Vehicule, Trailer, Authority } from '@/types/app';
import { LoadingScreen } from "../ui/animation/loadingScreen";
import { useWebSocket } from "@/contexts/WebSocketContext";
import { UploadFile } from '../ui/uploadFile';
import { CollapseList } from '../ui/collapse_list';
import Time from "../ui/timer";
import { DateRangePickerField } from "../ui/DateRangePickerField";


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
  pickup_range: {
    startDate: Date;
    endDate: Date;
    key: string;
  };
  pickup_time_min: string;
  pickup_time_max: string;

  //delivery
  delivery_range: {
    startDate: Date;
    endDate: Date;
    key: string;
  };
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
  const { handleSubmit, register, control, formState: { errors, isValid }, reset, clearErrors } = useForm<FormInputs>({  
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
      
      //const cachedData = localStorage.getItem('appDataCache');

      /*if (cachedData) {
        const parsedData = JSON.parse(cachedData);
        setAuthority(parsedData.authority);
        setTrailers(parsedData.trailers);
        setLoading('create');
        return;
      }*/

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
    
    // --- VALIDACIÓN 1: rate propuesto ---
    if (data.proposed_rate < data.proposed_rate_minimum) {
      alert(`Proposed rate (${data.proposed_rate}) debe ser mayor o igual al rate mínimo (${data.proposed_rate_minimum})`);
      return;
    }

    // --- VALIDACIÓN 2: fecha de pickup < fecha de delivery ---
    const pickupMin = new Date(data.pickup_range?.startDate);
    const pickupMax = new Date(data.pickup_range?.endDate);
    const deliveryMin = new Date(data.delivery_range?.startDate);
    const deliveryMax = new Date(data.delivery_range?.endDate);

    if (pickupMin > deliveryMin) {
      alert(`La fecha mínima de pickup (${pickupMin.toLocaleDateString()}) no puede ser posterior a la fecha mínima de delivery (${deliveryMin.toLocaleDateString()}).`);
      return;
    }

    if (pickupMax > deliveryMax) {
      alert(`La fecha máxima de pickup (${pickupMax.toLocaleDateString()}) no puede ser posterior a la fecha máxima de delivery (${deliveryMax.toLocaleDateString()}).`);
      return;
    }

    // --- VALIDACIÓN 3: rango de horas pickup coherente ---
    const pickupTimeMin = normalizeHour(data.pickup_time_min);
    const pickupTimeMax = normalizeHour(data.pickup_time_max);

    if (pickupTimeMin && pickupTimeMax && pickupMin === pickupMax && pickupTimeMax < pickupTimeMin) {
      alert(`La hora máxima de pickup (${pickupTimeMax}) no puede ser menor que la hora mínima (${pickupTimeMin}).`);
      return;
    }

    // --- VALIDACIÓN 4: rango de horas delivery coherente ---
    const deliveryTimeMin = normalizeHour(data.delivery_time_min);
    const deliveryTimeMax = normalizeHour(data.delivery_time_max);

    if (deliveryTimeMin && deliveryTimeMax && deliveryMin === deliveryMax && deliveryTimeMax < deliveryTimeMin) {
      alert(`La hora máxima de delivery (${deliveryTimeMax}) no puede ser menor que la hora mínima (${deliveryTimeMin}).`);
      return;
    }
    
    setLoading('loading_call');

    const company = authority.find((element) => element.authorityId === Number(data.company));
    const driver = Drivers.find((element) => element.id === data.driver);
    const dispatcher = dispatchers.find((element) => element.id === data.dispatcher);
    const vehicle = vehicles.find((element) => element.id === Number(data.vehicle));
    const trailer = trailers.find((element) => element.id === Number(data.trailer));

    const proposed_rate = Number(data.proposed_rate);
    const proposed_rate_minimum = Number(data.proposed_rate_minimum);

    const counter_rate = ((proposed_rate - proposed_rate_minimum) / 2) + proposed_rate_minimum;

    const elevenLabsRequest = {
      to_number: data.to_number,
      conversation_initiation_client_data:{
        dynamic_variables: {
          origin:                data.origin,
          destination:           data.destination,
          pickup_date_min:       data.pickup_range.startDate.toISOString().split("T")[0] ?? "",
          pickup_date_max:       data.pickup_range.endDate.toISOString().split("T")[0] ?? "",
          pickup_time_min:       normalizeHour(data.pickup_time_min),
          pickup_time_max:       normalizeHour(data.pickup_time_max),
          delivery_date_min:     data.delivery_range.startDate.toISOString().split("T")[0] ?? "",
          delivery_date_max:     data.delivery_range.endDate.toISOString().split("T")[0] ?? "",
          delivery_time_min:     normalizeHour(data.delivery_time_min),
          delivery_time_max:     normalizeHour(data.delivery_time_max),
          weight:                String(data.weight),
          
          final_rate: '',
          load_number:           (!data.load_number || isNaN(Number(data.load_number)) || String(data.load_number).length <= 2 ) ? null : data.load_number,
          broker_offer:           data.broker_offer,
          extension:            data.extension,

          //proposed
          proposed_rate:         data.proposed_rate,
          proposed_rate_minimum: data.proposed_rate_minimum,
          counter_rate:           counter_rate,

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

  const normalizeHour = (time: string): string => {
    return time.replace(/^0(\d:)/, '$1');
  };

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

  const handleFileChange = (image: File): Promise<void> => {
    return new Promise((resolve, reject) => {
      const file = image;
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
      pickup_range: {
        startDate: origin.delivery_date_window_start
          ? new Date(origin.delivery_date_window_start)
          : new Date(),
        endDate: origin.delivery_date_window_end
          ? new Date(origin.delivery_date_window_end)
          : new Date(),
        key: "selection",
      },
      //pickup_time_min: toInputTime(origin.pickup_time_window_start),
      //pickup_time_max: toInputTime(origin.pickup_time_window_end),
      destination: `${destination.city} ${destination.state}`,
      delivery_range: {
        startDate: destination.delivery_date_window_start
          ? new Date(destination.delivery_date_window_start)
          : new Date(),
        endDate: destination.delivery_date_window_end
          ? new Date(destination.delivery_date_window_end)
          : new Date(),
        key: "selection",
      },
      //delivery_time_max: toInputTime(destination.delivery_time_window_start),
      //delivery_time_min: toInputTime(destination.delivery_time_window_end),
      weight: Number(load_details.weight_lbs),
      broker_offer: rate,
      load_number: load_details.reference_id
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
                <div className="grid grid-cols-1 gap-2 sm:gap-5 sm:grid-cols-2 mt-5 p-2">
                  <div className="flex flex-col mb-2 text-left">
                    <span className={
                      clsx(
                        "text-sm mb-1",
                        {
                          "text-red-600": errors.to_number
                        }
                      )
                    }>Broker phone</span>
                    <input
                        type="text"
                        className={
                          clsx(
                            "p-2 border border-gray-200 rounded-lg bg-gray-100 show-sm",
                            {
                              "border border-red-600": errors.to_number
                            }
                          )
                        }
                        autoFocus
                        { ...register('to_number', { required: true }) }
                    />
                  </div>

                  <div className="flex flex-col mb-2 text-left">
                    <span className="text-sm mb-1">Number ext. (optional)</span>
                    <input
                        type="text"
                        className="p-2 border border-gray-200 rounded-lg bg-gray-100 show-sm"
                        autoFocus
                        { ...register('extension') }
                    />
                  </div>

                  {/*<div className="flex flex-col mb-2 text-left">
                    <span className="text-sm mb-1">Email</span>
                    <input
                        type="email"
                        className="p-2 border border-gray-200 rounded-lg bg-gray-100 show-sm"
                        autoFocus
                        { ...register('email') }
                    />
                  </div>*/}

                  <div className="flex flex-col mb-2 text-left">
                    <span className={
                      clsx(
                        "text-sm mb-1",
                        {
                          "text-red-600": errors.company
                        }
                      )
                    }>Company</span>
                    <select
                        className={
                          clsx(
                            "p-2 border border-gray-200 rounded-lg bg-gray-100 show-sm",
                            {
                              "border border-red-600": errors.company
                            }
                          )
                        }
                        { ...register('company', { required: true }) }
                        onChange={(e) => {
                          const selectedId = e.target.value;
                          handleCompanyChange(selectedId);
                          if (selectedId) clearErrors("company");
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
            
                  <div className="flex flex-col mb-2 text-left">
                    <span className={
                      clsx(
                        "text-sm mb-1",
                        {
                          "text-red-600": errors.dispatcher
                        }
                      )
                    }>Dispatcher</span>
                    <select
                        className={
                          clsx(
                            "p-2 border border-gray-200 rounded-lg bg-gray-100 show-sm",
                            {
                              "border border-red-600": errors.dispatcher
                            }
                          )
                        }
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

                  <div className="flex flex-col mb-2 text-left">
                    <span className={
                      clsx(
                        "text-sm mb-1",
                        {
                          "text-red-600": errors.driver
                        }
                      )
                    }>Driver</span>
                    <select
                        className={
                          clsx(
                            "p-2 border border-gray-200 rounded-lg bg-gray-100 show-sm",
                            {
                              "border border-red-600": errors.driver
                            }
                          )
                        }
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

                  <div className="flex flex-col mb-2 text-left">
                    <span className={
                      clsx(
                        "text-sm mb-1",
                        {
                          "text-red-600": errors.vehicle
                        }
                      )
                    }>Vehicle</span>
                    <select
                        className={
                          clsx(
                            "p-2 border border-gray-200 rounded-lg bg-gray-100 show-sm",
                            {
                              "border border-red-600": errors.vehicle
                            }
                          )
                        }
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

                  <div className="flex flex-col mb-2 text-left">
                    <span className={
                      clsx(
                        "text-sm mb-1",
                        {
                          "text-red-600": errors.trailer
                        }
                      )
                    }>Trailer</span>
                    <select
                        className={
                          clsx(
                            "p-2 border border-gray-200 rounded-lg bg-gray-100 show-sm",
                            {
                              "border border-red-600": errors.trailer
                            }
                          )
                        }
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
                <div className="grid grid-cols-1 gap-2 sm:gap-5 sm:grid-cols-2 mt-5 p-2">
                  <div className="flex flex-col mb-2 text-left">
                    <span className={
                      clsx(
                        "text-sm mb-1",
                        {
                          "text-red-600": errors.load_number
                        }
                      )
                    }>Load Number (optional)</span>
                    <input
                        type="text"
                        className={
                          clsx(
                            "p-2 border border-gray-200 rounded-lg bg-gray-100 show-sm",
                            {
                              "border border-red-600": errors.load_number
                            }
                          )
                        }
                        { ...register('load_number') }
                    />
                  </div>
                  <div className="flex flex-col mb-2 text-left">
                    <span className={
                      clsx(
                        "text-sm mb-1",
                        {
                          "text-red-600": errors.weight
                        }
                      )
                    }>Weight</span>
                    <input
                        type="text"
                        className={
                          clsx(
                            "p-2 border border-gray-200 rounded-lg bg-gray-100 show-sm",
                            {
                              "border border-red-600": errors.weight
                            }
                          )
                        }
                        { ...register('weight', { required: true }) }
                    />
                  </div>

                  <div className="flex flex-col mb-2 text-left">
                    <span className={
                      clsx(
                        "text-sm mb-1",
                        {
                          "text-red-600": errors.broker_offer
                        }
                      )
                    }>Offer</span>
                    <input
                        type="text"
                        className={
                          clsx(
                            "p-2 border border-gray-200 rounded-lg bg-gray-100 show-sm",
                            {
                              "border border-red-600": errors.broker_offer
                            }
                          )
                        }
                        { ...register('broker_offer', { required: true }) }
                    />
                  </div>
                </div> 

                <div className="grid grid-cols-1 gap-2 lg:gap-5 lg:grid-cols-2 my-3">

                  <div className="flex flex-col gap-5 bg-gray-100 justify-center rounded-lg shadow-md p-5">
                    <div className="flex justify-start">
                      <h2 className="font-bold">Pick up</h2>
                    </div>
                    <div className="flex flex-col mb-2 text-left">
                      <span className={
                      clsx(
                        "text-sm mb-1",
                        {
                          "text-red-600": errors.origin
                        }
                      )
                    }>Origin</span>
                      <input
                          type="text"
                          className={
                          clsx(
                            "p-2 border border-gray-200 rounded-lg bg-gray-100 show-sm",
                            {
                              "border border-red-600": errors.origin
                            }
                          )
                        }
                          { ...register('origin', { required: true }) }
                      />
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3">
                      <DateRangePickerField
                        control={control}
                        name="pickup_range"
                        label="Pickup Date (Min → Max)"
                        error={ errors.pickup_range }
                      />
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3">
                      <div className="flex flex-col mb-2 text-left w-full">
                        <span className={
                          clsx(
                            "text-sm mb-1",
                            {
                              "text-red-600": errors.pickup_time_min
                            }
                          )
                        }>Pickup Time Min</span>
                        <Controller
                          name="pickup_time_min"
                          control={control}
                          rules={{required: true}}
                          render={({ field }) => (
                            <Time
                              timeInit={field.value}
                              onChange={(val) => field.onChange(val)}
                              error={ errors.pickup_time_min }
                            />
                          )}
                        />
                      </div>

                      <div className="hidden sm:flex sm:items-center pt-3">to</div>

                      <div className="flex flex-col mb-2 text-left w-full">
                        <span className={
                          clsx(
                            "text-sm mb-1",
                            {
                              "text-red-600": errors.pickup_time_max
                            }
                          )
                        }>Pickup Time Max</span>
                        <Controller
                          name="pickup_time_max"
                          control={control}
                          rules={{required: true}}
                          render={({ field }) => (
                            <Time
                              timeInit={field.value}
                              onChange={(val) => field.onChange(val)}
                              error={ errors.pickup_time_max }
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
                      
                      <div className="flex flex-col mb-2 text-left">
                        <span className={
                          clsx(
                            "text-sm mb-1",
                            {
                              "text-red-600": errors.destination
                            }
                          )
                        }>Destination</span>
                        <input
                            type="text"
                            className={
                          clsx(
                            "p-2 border border-gray-200 rounded-lg bg-gray-100 show-sm",
                            {
                              "border border-red-600": errors.destination
                            }
                          )
                        }
                            { ...register('destination', { required: true }) }
                        />
                      </div>
                      
                      <div className="flex flex-col sm:flex-row gap-3">
                           <DateRangePickerField
                            control={control}
                            name="delivery_range"
                            label="Delivery Date (Min → Max)"
                            error={ errors.delivery_range }
                          />
                      </div>
                      <div className="flex flex-col sm:flex-row gap-3">
                          <div className="flex flex-col mb-2 text-left w-full">
                            <span className={
                              clsx(
                                "text-sm mb-1",
                                {
                                  "text-red-600": errors.delivery_time_min
                                }
                              )
                            }>Delivery Time Min</span>
                            <Controller
                              name="delivery_time_min"
                              control={control}
                              rules={{required: true}}
                              render={({ field }) => (
                                <Time
                                  timeInit={field.value}
                                  onChange={(val) => field.onChange(val)}
                                  error={ errors.delivery_time_min }
                                />
                              )}
                            />
                          </div>

                          <div className="hidden sm:flex sm:items-center pt-3">to</div>

                          <div className="flex flex-col mb-2 text-left w-full">
                            <span className={
                              clsx(
                                "text-sm mb-1",
                                {
                                  "text-red-600": errors.delivery_time_max
                                }
                              )
                            }>Delivery Time Max</span>
                            <Controller
                              name="delivery_time_max"
                              control={control}
                              rules={{required: true}}
                              render={({ field }) => (
                                <Time
                                  timeInit={field.value}
                                  onChange={(val) => field.onChange(val)}
                                  error={ errors.delivery_time_max }
                                />
                              )}
                            />
                          </div>
                      </div>
                  </div>   
                
                </div>
              </CollapseList>

              <div className="grid grid-cols-1 gap-2 sm:gap-5 sm:grid-cols-2 mt-5">
                <div className="flex flex-col mb-2 text-left">
                  <span className={
                      clsx(
                        "text-sm mb-1",
                        {
                          "text-red-600": errors.proposed_rate_minimum
                        }
                      )
                    }>Minimum rate</span>
                  <input
                      type="number"
                      className={
                          clsx(
                            "p-2 border border-gray-200 rounded-lg bg-gray-100 show-sm",
                            {
                              "border border-red-600": errors.proposed_rate_minimum
                            }
                          )
                        }
                      { ...register('proposed_rate_minimum', {required: true}) }
                  />
                </div>

                <div className="flex flex-col mb-2 text-left">
                  <span className={
                      clsx(
                        "text-sm mb-1",
                        {
                          "text-red-600": errors.proposed_rate
                        }
                      )
                    }>Expected rate</span>
                  <input
                      type="number"
                      className={
                          clsx(
                            "p-2 border border-gray-200 rounded-lg bg-gray-100 show-sm",
                            {
                              "border border-red-600": errors.proposed_rate
                            }
                          )
                        }
                      { ...register('proposed_rate', {required: true}) }
                  />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 mb-2 sm:mt-2">
                <button
                      type='submit'
                      className="flex w-full sm:w-1/2 justify-center btn-primary">
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
