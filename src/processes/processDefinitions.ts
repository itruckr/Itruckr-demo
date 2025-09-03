import {
  AlertTriangle,
  ArrowRight,
  BadgeDollarSign,
  BellRing,
  CalendarPlus,
  Check,
  CheckCircle2,
  ClipboardCheck,
  FileUp,
  Handshake,
  Mail,
  MapPin,
  PackageCheck,
  PackagePlus,
  PackageSearch,
  RefreshCcw,
  Search,
  Truck,
  UserCheck,
} from 'lucide-react';

import {
  DRIVER_1,
  EMAIL_POD_OUTBOUND_STEP_10,
  EMAIL_RATECON_INBOUND_STEP_5,
  EMAIL_RATECON_OUTBOUND_STEP_7,
  LOAD_1,
  LOAD_2,
  LOAD_2_PROCESS_STEP_1_AGENT_MESSAGE,
  LOAD_2_PROCESS_STEP_3_AGENT_MESSAGE,
  LOAD_PROCESS_STEP_13_AGENT_CHAT_MESSAGE,
  LOAD_PROCESS_STEP_13_DRIVER_CHAT_MESSAGE_1,
  LOAD_PROCESS_STEP_13_DRIVER_CHAT_MESSAGE_2,
  LOAD_PROCESS_STEP_1_AGENT_MESSAGE,
  LOAD_PROCESS_STEP_3_AGENT_MESSAGE,
  LOAD_PROCESS_STEP_5_AGENT_CHAT_MESSAGE,
  LOAD_PROCESS_STEP_6_DRIVER_CHAT_MESSAGE,
  OIL_CHANGE_STEP_1_AGENT_CHAT_MESSAGE,
  OIL_CHANGE_STEP_2_AGENT_CHAT_MESSAGE,
  OIL_CHANGE_STEP_2_DRIVER_CHAT_MESSAGE,
  OIL_CHANGE_STEP_3_AGENT_CHAT_MESSAGE_1,
  OIL_CHANGE_STEP_3_AGENT_CHAT_MESSAGE_2,
  OIL_CHANGE_STEP_4_DRIVER_MESSAGE
} from '@/constants';

import { generateId } from '../stores/utils'; // Assuming utils.ts is in store folder
import {
  Email,
  Load,
  LoadProcessStepName,
  OilChangeProcessStepName,
  ProcessStep,
} from '../types/app';

/**
 * Generates the initial steps for a Load Process.
 * @returns An array of ProcessStep objects specific to a Load Process.
 */
export function getLoadProcessSteps(step: 1 | 2): ProcessStep<LoadProcessStepName>[] {
  if (step === 2) {
    return [
    {
      id: generateId(),
      name: 'waiting_dispatcher_confirmation',
      title: 'Dispatcher Confirmation',
      status: 'pending',
      description:
        'Driver D-158 is near their destination. A new load search can start.',
      messages: [LOAD_2_PROCESS_STEP_1_AGENT_MESSAGE],
      aiAgentAssigned: 'Operations Agent',
      requiredUserInput: ['review_load_details', 'accept_or_decline'],
      nextStepOptions: [
        {
          label: 'Accept Search',
          action: 'complete_step',
          data: { actionType: 'accept_load' },
        },
        {
          label: 'Decline Search',
          action: 'complete_step',
          data: { actionType: 'decline_load' },
        },
      ],
      startedAt: '',
      lucideIcon: PackagePlus,
    },
    {
      id: generateId(),
      name: 'looking_for_loads',
      title: 'Looking for Loads',
      status: 'pending',
      description:
        "The load search is active, based on the driver's preferences and location.",
      messages: [],
      aiAgentAssigned: 'Rate Negotiator',
      awaitFor: 5000,
      triggersApiCall: {
        endpoint: 'https://itruckrlabs.app.n8n.cloud/webhook/gestion-llamadas',
        method: 'GET',
        expect: { message: "Workflow was started" },
      },
      startedAt: '',
      lucideIcon: PackageSearch,
    },
    {
      id: generateId(),
      name: 'negociating_load',
      title: 'Negotiating Load',
      status: 'pending',
      description:
        "A Load has been found and is currently being negotiated with the broker.",
      messages: [],
      aiAgentAssigned: 'Rate Negotiator',
      triggersApiCall: {
        endpoint: 'https://itruckrlabs.app.n8n.cloud/webhook/call-ended-f1',
        method: 'GET',
        expect: { message: 'call ended' },
      },
      startedAt: '',
      lucideIcon: Handshake,
    },
    {
      id: generateId(),
      name: 'load_booked',
      title: 'Load Booked',
      status: 'completed',
      description:
        "A load matching the driver's preferences & location has been found and it has been booked.",
      messages: [LOAD_2_PROCESS_STEP_3_AGENT_MESSAGE],
      requiredUserInput: ['review_load_details', 'accept_or_decline'],
      nextStepOptions: [
        {
          label: 'Confirm Load',
          action: 'complete_step',
          data: { actionType: 'accept_load' },
        },
        {
          label: 'Decline Load',
          action: 'complete_step',
          data: { actionType: 'decline_load' },
        },
      ],
      aiAgentAssigned: 'Operations Agent',
      createsEntities: [
        {
          entityType: 'load',
          newEntity: LOAD_2 as Load,
        },
      ],
      startedAt: '',
      lucideIcon: Search,
    },
    {
      id: generateId(),
      name: 'waiting_rate_confirmation',
      title: 'Waiting for Rate Confirmation',
      status: 'pending',
      description: 'Awaiting final rate confirmation from the broker.',
      messages: [],
      aiAgentAssigned: 'Rate Negotiator',
      awaitFor: 3000,
      /*triggersApiCall: {
        endpoint:
          'https://itruckrlabs.app.n8n.cloud/webhook/arrived-rateconfirmation',
        method: 'GET',
        expect: { message: 'message sent' },
      },*/
      startedAt: '',
      lucideIcon: BadgeDollarSign,
    },
    {
      id: generateId(),
      name: 'load_confirmed_broker',
      title: 'Rate Confirmation Received',
      status: 'pending',
      description:
        'Load details confirmed with the broker. Ready for driver assignment.',
      messages: [],
      aiAgentAssigned: 'Operations Agent',
      createsEntities: [
        {
          entityType: 'email',
          newEntity: EMAIL_RATECON_INBOUND_STEP_5,
        },
      ],
      updatesEntities: [
        {
          entityType: 'load',
          entityId: LOAD_1.id,
          updateData: { status: 'delivered' },
        },
        {
          entityType: 'load',
          entityId: LOAD_2.id,
          updateData: { status: 'confirmed' },
        },
        {
          entityType: 'conversation',
          entityId: '',
          updateData: LOAD_PROCESS_STEP_5_AGENT_CHAT_MESSAGE,
        },
      ],
      startedAt: '',
      lucideIcon: CheckCircle2,
    },
    {
      id: generateId(),
      name: 'waiting_driver_confirmation',
      title: 'Waiting for Driver Confirmation',
      status: 'pending',
      description:
        'Driver has been notified and is expected to confirm the load.',
      messages: [],
      aiAgentAssigned: 'Operations Agent',
      awaitFor: 20000,
      updatesEntities: [
        {
          entityType: 'conversation',
          entityId: '',
          updateData: LOAD_PROCESS_STEP_6_DRIVER_CHAT_MESSAGE,
        },
      ],
      startedAt: '',
      lucideIcon: UserCheck,
    },
    {
      id: generateId(),
      name: 'load_confirmed_driver',
      title: 'Load Confirmed with Driver',
      status: 'pending',
      description: 'Driver has confirmed the load. Preparing for pickup.',
      messages: [],
      createsEntities: [
        {
          entityType: 'email',
          newEntity: EMAIL_RATECON_OUTBOUND_STEP_7,
        },
      ],
      aiAgentAssigned: 'Operations Agent',
      startedAt: '',
      lucideIcon: ClipboardCheck,
    },
    {
      id: generateId(),
      name: 'in_transit_pickup',
      title: 'In Transit to Pickup',
      status: 'pending',
      description: 'Driver is en route to the pickup location.',
      messages: [],
      aiAgentAssigned: 'General Assistant',
      awaitFor: 10000,
      startedAt: '',
      lucideIcon: Truck,
    },
    {
      id: generateId(),
      name: 'at_pickup_location',
      title: 'At Pickup Location',
      status: 'pending',
      description: 'Driver has arrived at the pickup location.',
      messages: [],
      awaitFor: 10000,
      aiAgentAssigned: 'General Assistant',
      startedAt: '',
      lucideIcon: MapPin,
    },
    {
      id: generateId(),
      name: 'load_picked_up',
      title: 'Load Picked Up',
      status: 'pending',
      description: 'Cargo has been successfully picked up by the driver.',
      messages: [],
      aiAgentAssigned: 'General Assistant',
      startedAt: '',
      lucideIcon: PackageCheck,
    },
    {
      id: generateId(),
      name: 'in_transit_delivery',
      title: 'In Transit to Delivery',
      status: 'pending',
      description:
        'Driver is en route to the delivery location with the cargo.',
      messages: [],
      awaitFor: 10000,
      updatesEntities: [
        {
          entityType: 'load',
          entityId: LOAD_2.id,
          updateData: { status: 'in_transit' },
        },
      ],
      aiAgentAssigned: 'General Assistant',
      startedAt: '',
      lucideIcon: ArrowRight,
    },
    {
      id: generateId(),
      name: 'at_delivery_location',
      title: 'At Delivery Location',
      status: 'pending',
      description: 'Driver has arrived at the delivery location.',
      messages: [],
      awaitFor: 20000,
      updatesEntities: [
        {
          entityType: 'conversation',
          entityId: '',
          updateData: LOAD_PROCESS_STEP_13_DRIVER_CHAT_MESSAGE_1,
        },
        {
          entityType: 'conversation',
          entityId: '',
          updateData: LOAD_PROCESS_STEP_13_DRIVER_CHAT_MESSAGE_2,
        },
      ],
      aiAgentAssigned: 'General Assistant',
      startedAt: '',
      lucideIcon: MapPin,
    },
    {
      id: generateId(),
      name: 'document_upload_pending',
      title: 'POD Received',
      status: 'completed',
      description: 'Proof of Delivery document have been sent by the driver.',
      messages: [],
      aiAgentAssigned: 'Operations Agent',
      startedAt: '',
      lucideIcon: FileUp,
    },
    {
      id: generateId(),
      name: 'load_completed',
      title: 'Load Completed',
      status: 'pending',
      description:
        'The load process has been successfully completed and billed.',
      messages: [],
      aiAgentAssigned: 'General Assistant',
      createsEntities: [
        {
          entityType: 'email',
          newEntity: EMAIL_POD_OUTBOUND_STEP_10 as Email,
        }
      ],
      updatesEntities: [
        {
          entityType: 'load',
          entityId: LOAD_2.id,
          updateData: { status: 'delivered' },
        },
        {
          entityType: 'driver',
          entityId: DRIVER_1.id,
          updateData: { currentLoadId: null, status: 'available' },
        },
        {
          entityType: 'conversation',
          entityId: '',
          updateData: LOAD_PROCESS_STEP_13_AGENT_CHAT_MESSAGE,
          withDelay: 10000,
        },
      ],
      startedAt: '',
      lucideIcon: Check,
    },
  ];
  } else {
    return [
      {
        id: generateId(),
        name: 'waiting_dispatcher_confirmation',
        title: 'Dispatcher Confirmation',
        status: 'pending',
        description:
          'Driver D-158 is near their destination. A new load search can start.',
        messages: step === 1 ? [LOAD_PROCESS_STEP_1_AGENT_MESSAGE] : [LOAD_2_PROCESS_STEP_1_AGENT_MESSAGE],
        aiAgentAssigned: 'Operations Agent',
        requiredUserInput: ['review_load_details', 'accept_or_decline'],
        nextStepOptions: [
          {
            label: 'Accept Search',
            action: 'complete_step',
            data: { actionType: 'accept_load' },
          },
          {
            label: 'Decline Search',
            action: 'complete_step',
            data: { actionType: 'decline_load' },
          },
        ],
        startedAt: '',
        lucideIcon: PackagePlus,
      },
      {
        id: generateId(),
        name: 'looking_for_loads',
        title: 'Looking for Loads',
        status: 'pending',
        description:
          "The load search is active, based on the driver's preferences and location.",
        messages: [],
        aiAgentAssigned: 'Rate Negotiator',
        awaitFor: 5000,
        triggersApiCall: {
          endpoint: 'https://itruckrlabs.app.n8n.cloud/webhook/gestion-llamadas',
          method: 'GET',
          expect: { message: "Workflow was started" },
        },
        startedAt: '',
        lucideIcon: PackageSearch,
      },
      {
        id: generateId(),
        name: 'negociating_load',
        title: 'Negotiating Load',
        status: 'pending',
        description:
          "A Load has been found and is currently being negotiated with the broker.",
        messages: [],
        aiAgentAssigned: 'Rate Negotiator',
        triggersApiCall: {
          endpoint: 'https://itruckrlabs.app.n8n.cloud/webhook/call-ended-f1',
          method: 'GET',
          expect: { message: 'call ended' },
        },
        startedAt: '',
        lucideIcon: Handshake,
      },
      {
        id: generateId(),
        name: 'load_booked',
        title: 'Load Booked',
        status: 'completed',
        description:
          "A load matching the driver's preferences & location has been found and it has been booked.",
        messages: step === 1 ? [LOAD_PROCESS_STEP_3_AGENT_MESSAGE] : [LOAD_2_PROCESS_STEP_3_AGENT_MESSAGE],
        requiredUserInput: ['review_load_details', 'accept_or_decline'],
        nextStepOptions: [
          {
            label: 'Confirm Load',
            action: 'complete_step',
            data: { actionType: 'accept_load' },
          },
          {
            label: 'Decline Load',
            action: 'complete_step',
            data: { actionType: 'decline_load' },
          },
        ],
        aiAgentAssigned: 'Operations Agent',
        createsEntities: [
          {
            entityType: 'load',
            newEntity: LOAD_2 as Load,
          },
        ],
        startedAt: '',
        lucideIcon: Search,
      },
      {
        id: generateId(),
        name: 'waiting_rate_confirmation',
        title: 'Waiting for Rate Confirmation',
        status: 'pending',
        description: 'Awaiting final rate confirmation from the broker.',
        messages: [],
        aiAgentAssigned: 'Rate Negotiator',
        //awaitFor: 1000,
        triggersApiCall: {
          endpoint:
            'https://itruckrlabs.app.n8n.cloud/webhook/arrived-rateconfirmation',
          method: 'GET',
          expect: { message: 'message sent' },
        },
        startedAt: '',
        lucideIcon: BadgeDollarSign,
      },
      {
        id: generateId(),
        name: 'load_confirmed_broker',
        title: 'Rate Confirmation Received',
        status: 'pending',
        description:
          'Load details confirmed with the broker. Ready for driver assignment.',
        messages: [],
        aiAgentAssigned: 'Operations Agent',
        createsEntities: [
          {
            entityType: 'email',
            newEntity: EMAIL_RATECON_INBOUND_STEP_5,
          },
        ],
        updatesEntities: [
          {
            entityType: 'load',
            entityId: LOAD_1.id,
            updateData: { status: 'delivered' },
          },
          {
            entityType: 'load',
            entityId: LOAD_2.id,
            updateData: { status: 'confirmed' },
          },
          {
            entityType: 'conversation',
            entityId: '',
            updateData: LOAD_PROCESS_STEP_5_AGENT_CHAT_MESSAGE,
          },
        ],
        startedAt: '',
        lucideIcon: CheckCircle2,
      },
      {
        id: generateId(),
        name: 'waiting_driver_confirmation',
        title: 'Waiting for Driver Confirmation',
        status: 'pending',
        description:
          'Driver has been notified and is expected to confirm the load.',
        messages: [],
        aiAgentAssigned: 'Operations Agent',
        awaitFor: 20000,
        updatesEntities: [
          {
            entityType: 'conversation',
            entityId: '',
            updateData: LOAD_PROCESS_STEP_6_DRIVER_CHAT_MESSAGE,
          },
        ],
        startedAt: '',
        lucideIcon: UserCheck,
      },
      {
        id: generateId(),
        name: 'load_confirmed_driver',
        title: 'Load Confirmed with Driver',
        status: 'pending',
        description: 'Driver has confirmed the load. Preparing for pickup.',
        messages: [],
        createsEntities: [
          {
            entityType: 'email',
            newEntity: EMAIL_RATECON_OUTBOUND_STEP_7,
          },
        ],
        aiAgentAssigned: 'Operations Agent',
        startedAt: '',
        lucideIcon: ClipboardCheck,
      },
      {
        id: generateId(),
        name: 'in_transit_pickup',
        title: 'In Transit to Pickup',
        status: 'pending',
        description: 'Driver is en route to the pickup location.',
        messages: [],
        aiAgentAssigned: 'General Assistant',
        awaitFor: 10000,
        startedAt: '',
        lucideIcon: Truck,
      },
      {
        id: generateId(),
        name: 'at_pickup_location',
        title: 'At Pickup Location',
        status: 'pending',
        description: 'Driver has arrived at the pickup location.',
        messages: [],
        awaitFor: 10000,
        aiAgentAssigned: 'General Assistant',
        startedAt: '',
        lucideIcon: MapPin,
      },
      {
        id: generateId(),
        name: 'load_picked_up',
        title: 'Load Picked Up',
        status: 'pending',
        description: 'Cargo has been successfully picked up by the driver.',
        messages: [],
        aiAgentAssigned: 'General Assistant',
        startedAt: '',
        lucideIcon: PackageCheck,
      },
      {
        id: generateId(),
        name: 'in_transit_delivery',
        title: 'In Transit to Delivery',
        status: 'pending',
        description:
          'Driver is en route to the delivery location with the cargo.',
        messages: [],
        awaitFor: 10000,
        updatesEntities: [
          {
            entityType: 'load',
            entityId: LOAD_2.id,
            updateData: { status: 'in_transit' },
          },
        ],
        aiAgentAssigned: 'General Assistant',
        startedAt: '',
        lucideIcon: ArrowRight,
      },
      {
        id: generateId(),
        name: 'at_delivery_location',
        title: 'At Delivery Location',
        status: 'pending',
        description: 'Driver has arrived at the delivery location.',
        messages: [],
        awaitFor: 20000,
        updatesEntities: [
          {
            entityType: 'conversation',
            entityId: '',
            updateData: LOAD_PROCESS_STEP_13_DRIVER_CHAT_MESSAGE_1,
          },
          {
            entityType: 'conversation',
            entityId: '',
            updateData: LOAD_PROCESS_STEP_13_DRIVER_CHAT_MESSAGE_2,
          },
        ],
        aiAgentAssigned: 'General Assistant',
        startedAt: '',
        lucideIcon: MapPin,
      },
      {
        id: generateId(),
        name: 'document_upload_pending',
        title: 'POD Received',
        status: 'completed',
        description: 'Proof of Delivery document have been sent by the driver.',
        messages: [],
        aiAgentAssigned: 'Operations Agent',
        startedAt: '',
        lucideIcon: FileUp,
      },
      {
        id: generateId(),
        name: 'load_completed',
        title: 'Load Completed',
        status: 'pending',
        description:
          'The load process has been successfully completed and billed.',
        messages: [],
        aiAgentAssigned: 'General Assistant',
        createsEntities: [
          {
            entityType: 'email',
            newEntity: EMAIL_POD_OUTBOUND_STEP_10 as Email,
          }
        ],
        updatesEntities: [
          {
            entityType: 'load',
            entityId: LOAD_2.id,
            updateData: { status: 'delivered' },
          },
          {
            entityType: 'driver',
            entityId: DRIVER_1.id,
            updateData: { currentLoadId: null, status: 'available' },
          },
          {
            entityType: 'conversation',
            entityId: '',
            updateData: LOAD_PROCESS_STEP_13_AGENT_CHAT_MESSAGE,
            withDelay: 10000,
          },
        ],
        startedAt: '',
        lucideIcon: Check,
      },
    ];
  }
}

/**
 * Generates the initial steps for a Road Emergency Process.
 * @returns An array of ProcessStep objects specific to a Road Emergency Process.
 */
export function getOilChangeProcessSteps(): ProcessStep<OilChangeProcessStepName>[] {
  return [
    {
      id: generateId(),
      name: 'oil_change_needed',
      title: 'Oil Change Needed',
      status: 'pending',
      description:
        'The system has detected that an oil change is due for the truck (58) based on mileage.',
      messages: [],
      updatesEntities: [
        {
          entityType: 'conversation',
          entityId: 'D-200',
          updateData: OIL_CHANGE_STEP_1_AGENT_CHAT_MESSAGE,
        },
      ],
      aiAgentAssigned: 'Maintenance Support Agent',
      nextStepOptions: [
        {
          label: 'Continue',
          action: 'complete_step',
          data: { actionType: 'continue' },
        },
      ],
      lucideIcon: AlertTriangle,
      startedAt: '',
    },
    {
      id: generateId(),
      name: 'initial_driver_notification_sent',
      title: 'Driver Notified',
      status: 'pending',
      description:
        'An automated notification has been sent to the truck driver regarding the upcoming oil change.',
      messages: [],
      awaitFor: 10000,
      triggersApiCall: {
        endpoint: "https://itruckrlabs.app.n8n.cloud/webhook/workshop-call",
        method: "GET",
        expect: { message: "Workflow was started" }
      },
      updatesEntities: [
        {
          entityType: 'conversation',
          entityId: 'D-200',
          updateData: OIL_CHANGE_STEP_2_DRIVER_CHAT_MESSAGE,
        },
        {
          entityType: 'conversation',
          entityId: 'D-200',
          updateData: OIL_CHANGE_STEP_2_AGENT_CHAT_MESSAGE,
          withDelay: 1000
        },
      ],
      aiAgentAssigned: 'Maintenance Support Agent',
      lucideIcon: Mail,
      startedAt: '',
    },
    {
      id: generateId(),
      name: 'scheduling_appointment',
      title: 'Looking for near Workshops',
      status: 'pending',
      description:
        'The process of finding and booking a suitable oil change appointment for the truck.',
      messages: [],
      triggersApiCall: {
        endpoint: "https://itruckrlabs.app.n8n.cloud/webhook/confirm-call-workshop-ended",
        method: "GET",
        expect: { message: "Call Workshop Ended" }
      },
      updatesEntities: [
        {
          entityType: 'conversation',
          entityId: 'D-200',
          updateData: OIL_CHANGE_STEP_3_AGENT_CHAT_MESSAGE_1,
        },
        {
          entityType: 'conversation',
          entityId: 'D-200',
          updateData: OIL_CHANGE_STEP_3_AGENT_CHAT_MESSAGE_2,
          withDelay: 1000
        },
      ],
      aiAgentAssigned: 'Maintenance Support Agent',
      lucideIcon: CalendarPlus,
      startedAt: '',
    },
    {
      id: generateId(),
      name: 'driver_notified_of_appointment',
      title: 'Driver Notified of Appointment',
      status: 'pending',
      description:
        'The truck driver has been informed about the details of the confirmed oil change appointment.',
      messages: [],
      awaitFor: 10000,
      aiAgentAssigned: 'Maintenance Support Agent',
      lucideIcon: BellRing,
      startedAt: '',
    },
    {
      id: generateId(),
      name: 'service_in_progress',
      title: 'Driver at Workshop Location',
      status: 'pending',
      description:
        'The Driver is currently at Total Truck Care and Maintenance Montgomery, IL',
      messages: [],
      updatesEntities: [
        {
          entityType: 'conversation',
          entityId: 'D-200',
          updateData: OIL_CHANGE_STEP_4_DRIVER_MESSAGE,
        },
      ],
      awaitFor: 10000,
      aiAgentAssigned: 'Maintenance Support Agent',
      lucideIcon: RefreshCcw,
      startedAt: '',
    },
    {
      id: generateId(),
      name: 'service_completed',
      title: 'Invoice Received & Oil Change Confirmed',
      status: 'pending',
      description: 'The oil change service has been successfully completed.',
      messages: [],
      aiAgentAssigned: 'Maintenance Support Agent',
      lucideIcon: CheckCircle2,
      startedAt: '',
    },
  ];
}
