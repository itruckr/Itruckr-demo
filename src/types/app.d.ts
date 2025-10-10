import type { LucideIcon } from 'lucide-react';

/**
 * Geographical state within the United States.
 */
type USState =
  | 'AL'
  | 'AK'
  | 'AZ'
  | 'AR'
  | 'CA'
  | 'CO'
  | 'CT'
  | 'DE'
  | 'FL'
  | 'GA'
  | 'HI'
  | 'ID'
  | 'IL'
  | 'IN'
  | 'IA'
  | 'KS'
  | 'KY'
  | 'LA'
  | 'ME'
  | 'MD'
  | 'MA'
  | 'MI'
  | 'MN'
  | 'MS'
  | 'MO'
  | 'MT'
  | 'NE'
  | 'NV'
  | 'NH'
  | 'NJ'
  | 'NM'
  | 'NY'
  | 'NC'
  | 'ND'
  | 'OH'
  | 'OK'
  | 'OR'
  | 'PA'
  | 'RI'
  | 'SC'
  | 'SD'
  | 'TN'
  | 'TX'
  | 'UT'
  | 'VT'
  | 'VA'
  | 'WA'
  | 'WV'
  | 'WI'
  | 'WY';

/**
 * Types of road emergency events.
 */
type RoadEmergencyEventType =
  | 'vehicle_breakdown'
  | 'cargo_compromise'
  | 'traffic_accident'
  | 'driver_medical_emergency'
  | 'load_theft_attempt'
  | 'other';

/**
 * Status of a road emergency case.
 */
type RoadEmergencyStatus = 'pending' | 'covered' | 'canceled';

/**
 * Types of AI agent assistance available.
 */
type AiAgentRole =
  | 'Operations Agent'
  | 'Rate Negotiator'
  | 'Maintenance Support Agent'
  | 'General Assistant';

/**
 * Types of trucks.
 */
type TruckType =
  | 'dry_van'
  | 'reefer'
  | 'flatbed'
  | 'step_deck'
  | 'lowboy'
  | 'tanker'
  | 'box_truck'
  | 'straight_truck'
  | 'sprinter_van';

/**
 * Status of a company within the system.
 */
type CompanyStatus = 'active' | 'inactive' | 'on_hold' | 'archived';

/**
 * Categorization of a company.
 */
type CompanyType = 'broker' | 'carrier' | 'shipper' | 'logistics_provider';

/**
 * Status of a truck.
 */
type TruckStatus = 'available' | 'in_transit' | 'maintenance' | 'unavailable';

/**
 * Status of a driver.
 */
type DriverStatus = 'available' | 'in_transit' | 'maintenance' | 'unavailable';

/**
 * Status of a freight load.
 */
type LoadStatus =
  | 'new'
  | 'pending_broker_confirmation'
  | 'pending_driver_confirmation'
  | 'confirmed'
  | 'ready_for_pickup'
  | 'in_transit' // Changed 'in_progress' to 'in_transit' for freight
  | 'delivered'
  | 'ready_for_billing'
  | 'billed' // Added billed status
  | 'cancelled';

/**
 * Types of notifications that can be generated.
 */
type NotificationType =
  | 'new_load'
  | 'load_update'
  | 'driver_alert'
  | 'oil_change'
  | 'emergency_alert'
  | 'process_update'
  | 'system_message';

/**
 * Status of a notification.
 */
type NotificationStatus = 'unread' | 'read' | 'actioned' | 'archived';

/**
 * Types of cases that can be created.
 */
type CaseType = 'load_process' | 'oil_change';

/**
 * Status of a case.
 */
type CaseStatus = 'open' | 'in_progress' | 'resolved' | 'closed' | 'cancelled';

/**
 * Type of sender for a chat message.
 */
type MessageSenderType = 'user' | 'ai_agent' | 'me';

/**
 * Status of a process step.
 */
type ProcessStepStatus = 'pending' | 'in_progress' | 'completed' | 'skipped';

/**
 * Source of completion for a process step.
 */
type StepCompletionSource = 'user_input' | 'api_response' | 'internal_process';

/**
 * Source of completion for a process step.
 */
type EntityType = 'driver' | 'company' | 'load';

/**
 * Generic type for API call payloads.
 */
export interface ApiCallPayload {
  endpoint: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  data?: Record<string, unknown>;
  expect: any;
}

/**
 * Configuration for creating entities based on API responses.
 */
export interface EntityCreationConfig {
  entityType:
  | 'load'
  | 'driver'
  | 'company'
  | 'notification'
  | 'truck'
  | 'conversation'
  | 'email';
  newEntity?: any;
  withDelay?: number;
}

export interface EntityUpdateConfig
  extends Partial<Omit<EntityCreationConfig, 'newEntity'>> {
  entityId: string;
  updateData: Record<string, unknown>;
  withDelay?: number;
}

/**
 * A geographic location with detailed information.
 */
export interface Location {
  address?: string;
  city: string;
  state: USState;
  zipCode?: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
}

/**
 * Details of a road emergency reported by a driver.
 */
export interface RoadEmergency {
  id: string;
  driverId: string;
  emergencyType: RoadEmergencyEventType;
  location: Location;
  driverMessage: string;
  status: RoadEmergencyStatus;
  timestamp: string;
  resolvedTimestamp?: string;
  associatedLoadId?: string;
}

/**
 * Represents a company involved in logistics operations.
 */
export interface Company {
  id: string;
  name: string;
  email: string;
  phone: string;
  address?: Location;
  status: CompanyStatus;
  companyType: CompanyType;
}

/**
 * Represents a truck in the fleet.
 */
export interface Truck {
  id: string;
  type: TruckType;
  brand: string;
  model: string;
  licensePlate: string;
  capacity: {
    weightLbs: number;
    volumeCubicFt?: number;
  };
  companyId: string;
  status: TruckStatus;
  currentLocation?: Location;
  lastPingTime?: string;
}

/**
 * Preferences and requirements for a driver.
 */
export interface DriverPreferences {
  expectedRatePerMile: number;
  lowestRatePerMile: number;
  maxDrivingDistanceMiles: number;
  preferredStateDestinations: USState[];
  bannedStateDestinations: USState[];
  preferredTruckType?: TruckType;
  preferredTrailerLengthFeet?: number;
  preferredMaxWeightLbs?: number;
  acceptWeekendDelivery: boolean;
  acceptOvernightLoads: boolean;
  maxLayoverHours: number;
  requiresLoadingAssistance: boolean;
  preferredPickupTimeRanges: string[];
  preferredDeliveryTimeRanges: string[];
  preferredRoutes?: { origin: Location; destination: Location }[];
}

/**
 * Represents a driver in the system.
 */
export interface Driver {
  id: string;
  name: string;
  email: string;
  phone: string;
  companyId: string;
  licenseNumber: string;
  truckId: string;
  isInsuranceValid: boolean;
  remainingDrivingHours: number;
  currentLocation: Location;
  status: DriverStatus;
  driverPreferences: DriverPreferences;
  joinDate: string;
  currentLoadId?: string | null;
  nextLoadId?: string | null;
}

/**
 * Represents a freight load to be transported.
 */
export interface Load {
  id: string;
  externalLoadId: string;
  driverId?: string;
  status: LoadStatus;
  pickUpLocation: Location;
  dropOffLocation: Location;
  pickUpDate: string;
  deliveryDate: string;
  actualPickupDate?: string;
  actualDeliveryDate?: string;
  carrierCompanyId: string;
  brokerCompanyId: string;
  factoring: boolean;
  rate: {
    total: number;
    currency: string;
    ratePerMile?: number;
  };
  paymentTerms: string;
  weightLbs: number;
  dimensions?: {
    lengthFt: number;
    widthFt: number;
    heightFt: number;
  };
  cargoDescription: string;
  specialInstructions?: string;
  createdDate: string;
  updatedDate: string;
}

/**
 * Represents a notification to the user.
 */
export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: string;
  status: NotificationStatus;
  step: 1 | 2;
  relatedEntityType?: EntityType | undefined;
  relatedEntityId?: string;
  caseId?: string;
}

/**
 * Represents a single message in a chat conversation within a process step.
 */
export interface ChatMessage {
  id: string;
  senderId: string;
  senderType: MessageSenderType;
  timestamp: string;
  content: string;
}

/**
 * A generic export interface for any type of process in the application.
 */
export interface BaseProcess {
  id: string;
  caseId: string;
  type: CaseType;
  currentStepIndex: number;
  status: CaseStatus;
  startedAt: string;
  completedAt?: string;
  updatedAt: string;
  // Array of steps, type depends on the concrete process
  steps: ProcessStep[];
}

/**
 * Describes a single step within a multi-step process.
 */
export interface ProcessStep<NameType extends string = string> {
  id: string;
  name: NameType;
  title: string;
  status: ProcessStepStatus;
  description: string;
  messages: ChatMessage[];
  startedAt: string;
  completedAt?: string;
  completionSource?: StepCompletionSource;
  aiAgentAssigned?: AiAgentRole;
  requiredUserInput?: string[];
  triggersApiCall?: ApiCallPayload;
  awaitFor?: number;
  updatesEntities?: EntityUpdateConfig[];
  createsEntities?: EntityCreationConfig[];
  triggeredProcessId?: string;
  nextStepOptions?: {
    label: string;
    action: 'complete_step' | 'trigger_sub_process' | 'custom_action';
    data?: Record<string, unknown>;
  }[];
  lucideIcon?: LucideIcon;
  executionId?: string;
  lastExecutedAt?: string;
}

/**
 * Specific steps for the Load process.
 */
type LoadProcessStepName =
  | 'waiting_dispatcher_confirmation'
  | 'looking_for_loads'
  | 'negociating_load'
  | 'load_booked'
  | 'waiting_rate_confirmation'
  | 'load_confirmed_broker'
  | 'waiting_driver_confirmation'
  | 'load_confirmed_driver'
  | 'in_transit_pickup'
  | 'at_pickup_location'
  | 'load_picked_up'
  | 'in_transit_delivery'
  | 'at_delivery_location'
  | 'load_delivered'
  | 'document_upload_pending'
  | 'ready_for_billing'
  | 'load_completed';

/**
 * Specific steps for the Road Emergency process.
 */
type OilChangeProcessStepName =
  | 'oil_change_needed'
  | 'initial_driver_notification_sent'
  | 'waiting_driver_confirmation'
  | 'scheduling_appointment'
  | 'appointment_confirmed'
  | 'driver_notified_of_appointment'
  | 'driver_acknowledges_appointment'
  | 'service_in_progress'
  | 'service_completed'
  | 'truck_released_to_driver'
  | 'follow_up_communication_sent'
  | 'process_closed';

/**
 * Represents a Load Process.
 */
export interface LoadProcess extends BaseProcess {
  type: 'load_process';
  loadId: string;
  steps: Array<ProcessStep<LoadProcessStepName>>;
}

/**
 * Represents a Road Emergency Process.
 */
export interface OilChangeProcess extends BaseProcess {
  type: 'oil_change';
  roadEmergencyId: string;
  steps: Array<ProcessStep<OilChangeProcessStepName>>;
}

/**
 * Represents a user of the application.
 */
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'dispatcher' | 'driver' | 'broker_agent';
  companyId?: string;
}

/**
 * Represents a "Case" which is an actionable item derived from a notification.
 * Each case will initiate a process.
 */
export interface Case {
  id: string;
  notificationId: string;
  userId: string;
  type: CaseType;
  status: CaseStatus;
  title: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  relatedEntityType?: string;
  relatedEntityId?: string;
  processId?: string;
}

export interface Conversation {
  id: string;
  driverId: string;
  messages: ChatMessage[];
}

export interface EmailSender {
  name: string;
  email: string;
  avatar?: string;
}

export interface EmailAttachment {
  name: string;
  size: string;
  type: string;
  url: string;
}

export interface Email {
  id: string;
  subject: string;
  content: string;
  sender: EmailSender;
  recipients: string[];
  cc: string[];
  bcc: string[];
  timestamp: string;
  isRead: boolean;
  isStarred: boolean;
  isArchived: boolean;
  isDeleted: boolean;
  isSent: boolean;
  isDraft: boolean;
  hasAttachments: boolean;
  attachments: EmailAttachment[];
  preview: string;
  threadId: string;
  labels: string[];
}

export interface EmailFolder {
  id: string;
  name: string;
  icon: any; // Lucide icon component
  count: number;
}

export interface Dispatcher {
    id:          string;
    firstName:   string;
    lastName:    string;
    phoneNumber: string;
    email:       string;
    companies:   CompanyIdList[];
    active:      boolean;
}

export interface CompanyIdList {
    idCompany: string;
}

export interface CompanyForm {
    id:          string;
    companyName: string;
    owner:       string;
    phoneNumber: string;
    email:       string;
    brokers:     Broker[];
    active:      boolean;
}

export interface Broker {
    idBrokerCompany: number;
    brokerId:        number;
    companyId:       string;
    brokerCode:      string;
    brokerActive:    boolean;
}

export interface DriverForm {
    id:                     string;
    firstName:              string;
    lastName:               string;
    namePrefix:             string;
    phoneNumber:            string;
    email:                  string;
    driverLicense:          string;
    licenseExpiration:      Date;
    medicalCard:            string;
    medicalExpiration:      Date;
    emergencyContactName:   string;
    emergencyContactNumber: string;
    active:                 boolean;
    associations:           Association[];
}

export interface Association {
    idDriverCompany: number;
    companyId:       string;
    paymentMethod:   PaymentMethod;
    active:          boolean;
}

export interface Authority {
  authorityId: number,
  name: string,
  email: string,
  mcNumber: string,
  vehicles: Vehicle[]
}

export interface Vehicule {
    id:        number;
    plate:     string;
    vinNumber: string;
    color:     string;
    make:      string;
    model:     string;
    companyId: string;
    active:    boolean;
    authorityId?: number,
    trailerType?: string,
    equipment?:  Equipment = {};
}

type Equipment = {
  [key: string]: any; // cualquier valor
} | null;

export class Trailer {
    id: number;
    unit: string;
    vinNumber: string;
    rent: number;
    active: boolean;
}

export interface ElevenLabsRequest {
    to_number:                           string;
    conversation_initiation_client_data: ConversationInitiationClientData;
}

export interface ConversationInitiationClientData {
    dynamic_variables: DynamicVariables;
}

export interface DynamicVariables {
  dispatcher_name: string;
  company_name: string;
  mc_number: string;
  company_email: string;

  origin: string;
  destination: string;
  pickup_date: string;
  pickup_time_min: string;
  pickup_time_max: string;
  delivery_date: string;
  delivery_time_min: string;
  delivery_time_max: string;
  weight: string;
  truck_specs: string;
  proposed_rate: string;
  proposed_rate_minimum: string;
  final_rate: string;
  load_number: string;

  broker_offer: string;

  truck_number: string;
  trailer_number: string;
  
  driver_phone: string;
  driver_name: string;
}

export interface WhatsappChat {
  id: string;
  name: string;
  type: string;
  waId: string;
  asstId: string;
  threadId: string;
  createdAt: string;
  updatedAt: string;
  messages: string;
  unreadCount: number;
  status: string;
  language: string;
}

export interface WhatsappMessage {
  id: string;
  messageId: string;
  type: string;
  body?: string;
  filename?: string;
  mimeType?: string;
  sha256?: string;
  multimediaId?: string;
  chatId: string;
  createdAt: string;
  updatedAt: string;
  messageFrom: string;
  senderId?: string;
  senderName?: string;
  url?: string;
  loadId: number;
  isBundle: boolean;
  status: string;
  questionNumber: number;
}