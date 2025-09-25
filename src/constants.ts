import { generateId, getCurrentIsoDate } from './stores/utils';
import { ChatMessage, Driver, Email, Load, Truck } from './types/app';

// LOAD PROCESS

export const LOAD_PROCESS_STEP_1_AGENT_MESSAGE = {
  id: '001',
  senderId: 'ai_agent',
  senderType: 'ai_agent',
  timestamp: getCurrentIsoDate(),
  content: `## Load Search Configuration

Your load search has been configured with the following parameters:

### 💰 Rate Requirements
| Parameter | Value |
|-----------|-------|
| **Expected Rate** | $2.50/mile |
| **Minimum Rate** | $1.90/mile |

### 🚛 Equipment & Capacity
| Parameter | Value |
|---|---|
| **Truck Type** | Dry Van |
| **Max Weight** | 48.0000 lbs |
| **Insurance Status** | ✅ Valid |

### ⏰ Availability & Schedule
| Parameter | Value |
|---|---|
| **Remaining Hours** | 12 hours |
| **Max Distance** | 700 miles |
| **Weekend Delivery** | ✅ Yes |
| **Overnight Loads** | ✅ Yes |
| **Max Layover** | 24 hours |

### 📍 Location Preferences
| Parameter | Value |
|---|---|
| **Current Location** | New Castle County, DE |
| **Preferred Destinations** | OH, MD, IN, IL |
| **Banned States** | TX, LA |

### ⚙️ Operational Preferences
| Parameter | Value |
|---|---|
| **Loading Assistance** | Not Required |
| **Preferred Pickup Times** | 08:00-12:00 |
| **Preferred Delivery Times** | 09:00-17:00 |

---

**Ready to search for loads matching these criteria. Please approve to proceed with the load search.**`,
} as ChatMessage;

export const LOAD_PROCESS_STEP_3_AGENT_MESSAGE = {
  id: '002',
  senderId: 'ai_agent',
  senderType: 'ai_agent',
  timestamp: getCurrentIsoDate(),
  content: `## Current Load Details

Here are the details of booked load:

### ℹ️ General Information
| Parameter | Value |
|---|---|
| **Miles** | 760 |
| **Total Load Value** | $1600 |
| **Weight of the Load** | 46,600 lbs |
| **Broker Name** | PLS |

### ⬆️ Pickup Details
| Parameter | Value |
|---|---|
| **Pickup Date** | 09/25/2025 |
| **Pickup Window** | 08:00 - 15:00 |
| **Address** | Baltimore, MD, 21222 |

### ⬇️ Delivery Details
| Parameter | Value |
|---|---|
| **Delivery Date** | 09/27/2025 |
| **Delivery Window** | 08:00 - 15:00 |
| **Address** | Montgomery, IL, 60538 |`,
} as ChatMessage;

export const LOAD_PROCESS_STEP_5_AGENT_CHAT_MESSAGE = {
  senderId: 'ai_agent',
  senderType: 'ai_agent',
  content: `Hi John,

You’ve been assigned a new load. Please review the details below

**ℹ️ General Information**
* **Truck Assigned:** 58
* **Commodity:** 3 Stainless Steel Coils
* **Weight:** 46600.00 Lbs
* **Miles:** 760.00
* **Rate:** $1600.00

**⬆️ Pickup Details**
* **Contact:** RTW LOGISTICS INC
* **Address:** 8203 Fischer Road, BALTIMORE, MD, 21222
* **Date:** 09/25/2025 08:00
* **Pickup Window:** 8:00 - 15:00

**⬇️ Delivery Details**
* **Name:** Tsa Processing - Montgomery
* **Address:** 325 S Route 31, Suite G103 Building G, MONTGOMERY, IL, 60538
* **Delivery Date:** 09/27/2025 15:00
* **Delivery Window:** 08:00 - 15:00

**📋 Aditional Information**
* **Truck Brand:** Freightliner
* **Truck Model:** 2017
* **Truck Color:** White
* **VIN Last 4 digits:** 6320
---

Let us know if you have any issues. Drive safe!`,
};

export const LOAD_PROCESS_STEP_6_DRIVER_CHAT_MESSAGE = {
  senderId: 'D-158',
  senderType: 'user',
  content: 'Confirmed!',
};

export const LOAD_PROCESS_STEP_13_DRIVER_CHAT_MESSAGE_1 = {
  senderId: 'D-158',
  senderType: 'user',
  content: "I've arrived. Attaching POD",
};

export const LOAD_PROCESS_STEP_13_DRIVER_CHAT_MESSAGE_2 = {
  senderId: 'D-158',
  senderType: 'user',
  content: 'POD',
};

export const LOAD_PROCESS_STEP_13_AGENT_CHAT_MESSAGE = {
  senderId: 'ai_agent',
  senderType: 'ai_agent',
  content: 'POD Received & Validated',
};

export const EMAIL_RATECON_INBOUND_STEP_5 = {
  id: generateId(),
  subject: 'Rate Confirmation',
  content: `Hello, attached Rate Confirmation.

Please provide Drivers info:

&nbsp;

Name:

Phone Number:

Truck Number:

Trailer Number:

City of previous delivery:

&nbsp;

**Please note: Driver must accept Macro Point to Avoid a Fine**

&nbsp;

DRIVER MUST BE ON TIME ON HIS PU AND DELIVER APPT.`,
  sender: { name: 'iTruckr', email: 'itruckr.testing@gmail.com' },
  recipients: ['inbound@itruckrapp.com'],
  cc: [],
  bcc: [],
  timestamp: new Date(Date.now()).toISOString(),
  isRead: false,
  isStarred: true,
  isArchived: false,
  isDeleted: false,
  isSent: false,
  isDraft: false,
  hasAttachments: true,
  attachments: [
    {
      name: '31724985_rate_agreement_doc_1751571688731.pdf',
      size: '142kb',
      type: 'application/pdf',
      url: './31724985_rate_agreement_doc_1751571688731.pdf',
    },
  ],
  preview: 'Rate Confirmation',
  threadId: '001',
  labels: ['Rate Confirmation'],
} as Email;

export const EMAIL_RATECON_OUTBOUND_STEP_7 = {
  id: generateId(),
  subject: 'Rate Confirmation',
  content: `Please see Driver's information below:

&nbsp;

Name: John Smith

Phone Number: 9543093895

Truck Number: 58

Trailer Number: 745

City of previous delivery: Washington, DC

---

Refer to the details of the Rate Confirmation:

Invoice Number: 31724985

Total: 1600.00

Description: 3 Stainless Steel Coils

Rate: 1600.00

Quantity: 3

Facility: RTW LOGISTICS INC

Earliest: 09/25/2025 08:00

Latest: 09/25/2025 15:00

Origin: 8203 Fischer Road, Baltimore, Maryland, 21222

Destination: 325 S Route 31, Suite G103 Building G, Montgomery, Illinois, 60538

Size: Flatbed

MC: 4132509

Dispatcher: Maya Jordan

Phone: (754) 305-9234`,
  sender: { name: 'iTruckr', email: 'inbound@itruckrapp.com' },
  recipients: ['itruckr.testing@gmail.com'],
  cc: [],
  bcc: [],
  timestamp: new Date(Date.now()).toISOString(),
  isRead: false,
  isStarred: true,
  isArchived: false,
  isDeleted: false,
  isSent: true,
  isDraft: false,
  hasAttachments: false,
  attachments: [],
  preview: 'Rate Confirmation',
  threadId: '001',
  labels: ['Rate Confirmation'],
} as Email;

export const EMAIL_POD_OUTBOUND_STEP_10 = {
  id: generateId(),
  subject: 'POD Accepted',
  content: 'Your load was successfully delivered.',
  sender: { name: 'iTruckr', email: 'inbound@itruckrapp.com' },
  recipients: ['itruckr.testing@gmail.com'],
  cc: [],
  bcc: [],
  timestamp: new Date(Date.now()).toISOString(),
  isRead: false,
  isStarred: false,
  isArchived: false,
  isDeleted: false,
  isSent: true,
  isDraft: false,
  hasAttachments: true,
  attachments: [
    {
      name: 'POD.jpeg',
      size: '163kb',
      type: 'image/',
      url: './POD.jpeg',
    },
  ],
  preview:
    'We are pleased to inform you that your load with the following details has been successfully delivered.',
  threadId: generateId(),
  labels: ['Load'],
} as Email;

// LOAD PROCESS # 2

export const LOAD_2_PROCESS_STEP_1_AGENT_MESSAGE = {
  id: '001',
  senderId: 'ai_agent',
  senderType: 'ai_agent',
  timestamp: getCurrentIsoDate(),
  content: `## Load Search Configuration

Your load search has been configured with the following parameters:

### 💰 Rate Requirements
| Parameter | Value |
|-----------|-------|
| **Expected Rate** | $2.50/mile |
| **Minimum Rate** | $1.90/mile |

### 🚛 Equipment & Capacity
| Parameter | Value |
|---|---|
| **Truck Type** | Dry Van |
| **Max Weight** | 48.0000 lbs |
| **Insurance Status** | ✅ Valid |

### ⏰ Availability & Schedule
| Parameter | Value |
|---|---|
| **Remaining Hours** | 12 hours |
| **Max Distance** | 700 miles |
| **Weekend Delivery** | ✅ Yes |
| **Overnight Loads** | ✅ Yes |
| **Max Layover** | 24 hours |

### 📍 Location Preferences
| Parameter | Value |
|---|---|
| **Current Location** | Montgomery, IL |
| **Preferred Destinations** | OH, MD, IN, IL |
| **Banned States** | TX, LA |

### ⚙️ Operational Preferences
| Parameter | Value |
|---|---|
| **Loading Assistance** | Not Required |
| **Preferred Pickup Times** | 08:00-12:00 |
| **Preferred Delivery Times** | 09:00-17:00 |

---

**Ready to search for loads matching these criteria. Please approve to proceed with the load search.**`,
} as ChatMessage;

export const LOAD_2_PROCESS_STEP_3_AGENT_MESSAGE = {
  id: '002',
  senderId: 'ai_agent',
  senderType: 'ai_agent',
  timestamp: getCurrentIsoDate(),
  content: `## Current Load Details

Here are the details of booked load:

### ℹ️ General Information
| Parameter | Value |
|---|---|
| **Miles** | 720 |
| **Total Load Value** | $1440 |
| **Weight of the Load** | 44,000 lbs |
| **Broker Name** | PLS |

### ⬆️ Pickup Details
| Parameter | Value |
|---|---|
| **Pickup Date** | 08/13/2025 |
| **Pickup Window** | 08:00 - 15:00 |
| **Address** | Chicago, IL, 26836 |

### ⬇️ Delivery Details
| Parameter | Value |
|---|---|
| **Delivery Date** | 08/15/2025 |
| **Delivery Window** | 08:00 - 15:00 |
| **Address** | Atlanta, GA, 30316 |`,
} as ChatMessage;

// OIL CHANGE PROCESS

export const OIL_CHANGE_STEP_1_AGENT_CHAT_MESSAGE = {
  senderId: 'ai_agent',
  senderType: 'ai_agent',
  content: 'Hi Robert García, your truck is due for a routine oil change. Want me to help you find a nearby workshop?'
};

export const OIL_CHANGE_STEP_2_DRIVER_CHAT_MESSAGE = {
  senderId: 'D-200',
  senderType: 'user',
  content: 'YES'
};

export const OIL_CHANGE_STEP_2_AGENT_CHAT_MESSAGE = {
  senderId: 'ai_agent',
  senderType: 'ai_agent',
  content: 'Great. I&apos;m checking for workshops near your current location'
};

export const OIL_CHANGE_STEP_3_AGENT_CHAT_MESSAGE_1 = {
  senderId: 'ai_agent',
  senderType: 'ai_agent',
  content: `Appointment confirmed for 3:00 pm.

&nbsp;

**PTR Truck Repair**

1415 Bohr Ave, Montgomery, IL 60538

Location: https://maps.app.goo.gl/J6LuzUTeTD6MGJeD8`
};

export const OIL_CHANGE_STEP_3_AGENT_CHAT_MESSAGE_2 = {
  senderId: 'ai_agent',
  senderType: 'ai_agent',
  content: 'All set! Just send me the invoice when you’re finished'
};

export const OIL_CHANGE_STEP_4_DRIVER_MESSAGE = {
  senderId: 'D-200',
  senderType: 'user',
  content: 'Invoice'
};

// ENTITIES

export const TRUCK_1 = {
  id: 'T-058',
  type: 'dry_van',
  brand: 'Freightliner',
  model: '2017',
  licensePlate: 'ABC-123',
  capacity: {
    weightLbs: 80000,
    volumeCubicFt: 3000,
  },
  companyId: 'C-001',
  status: 'in_transit',
} as Truck;

// Additional demo truck/driver/load for preloaded case & maintenance
export const TRUCK_ROBERT = {
  id: 'T-072',
  type: 'dry_van',
  brand: 'Freightliner',
  model: '2019',
  licensePlate: 'XYZ-720',
  capacity: {
    weightLbs: 80000,
    volumeCubicFt: 3000,
  },
  companyId: 'C-001',
  status: 'in_transit',
} as Truck;

export const DRIVER_1 = {
  id: 'D-158',
  name: 'John Smith',
  email: 'john@itruckr-test.com',
  phone: '(555) 123-4567',
  companyId: 'C-001',
  licenseNumber: 'DL123456789',
  truckId: 'T-058',
  isInsuranceValid: true,
  remainingDrivingHours: 8,
  currentLocation: {
    city: 'Philadelphia',
    state: 'PA',
  },
  status: 'in_transit',
  currentLoadId: null,
  nextLoadId: null,
  driverPreferences: {
    expectedRatePerMile: 2.5,
    lowestRatePerMile: 2.0,
    maxDrivingDistanceMiles: 500,
    preferredStateDestinations: ['SC', 'NC', 'GA'],
    bannedStateDestinations: ['TX', 'LA'],
    acceptWeekendDelivery: true,
    acceptOvernightLoads: false,
    maxLayoverHours: 24,
    requiresLoadingAssistance: false,
    preferredPickupTimeRanges: ['08:00-12:00'],
    preferredDeliveryTimeRanges: ['09:00-17:00'],
  },
} as Driver;

export const DRIVER_ROBERT = {
  id: 'D-200',
  name: 'Robert García',
  email: 'robert@itruckr-test.com',
  phone: '(555) 987-6543',
  companyId: 'C-001',
  licenseNumber: 'DL987654321',
  truckId: '72',
  isInsuranceValid: true,
  remainingDrivingHours: 10,
  currentLocation: {
    city: 'Chicago',
    state: 'IL',
  },
  status: 'in_transit',
  currentLoadId: null,
  nextLoadId: null,
  driverPreferences: {
    expectedRatePerMile: 2.4,
    lowestRatePerMile: 2.0,
    maxDrivingDistanceMiles: 600,
    preferredStateDestinations: ['IN', 'OH', 'MI', 'GA'],
    bannedStateDestinations: ['TX', 'LA'],
    acceptWeekendDelivery: true,
    acceptOvernightLoads: false,
    maxLayoverHours: 24,
    requiresLoadingAssistance: false,
    preferredPickupTimeRanges: ['08:00-12:00'],
    preferredDeliveryTimeRanges: ['09:00-17:00'],
  },
} as Driver;

export const LOAD_1 = {
  id: 'L-001',
  externalLoadId: 'L-2024-002',
  driverId: 'D-158',
  status: 'in_transit',
  dropOffLocation: {
    city: 'Jersey City',
    state: 'NJ',
    zipCode: '07302',
  },
  pickUpLocation: {
    city: 'Orlando',
    state: 'FL',
    zipCode: '32801',
  },
  pickUpDate: 'July 23, 2025 11:23 AM',
  deliveryDate: 'July 24, 2025 09:00 PM',
  brokerCompanyId: 'B-001',
  carrierCompanyId: 'c-001',
  factoring: false,
  rate: {
    total: 2350,
    currency: 'USD',
    ratePerMile: 2.26,
  },
  paymentTerms: 'Net 30',
  weightLbs: 45000,
  cargoDescription: 'Electronics',
  specialInstructions: 'Handle with care',
} as Load;

export const LOAD_2 = {
  id: 'L-002',
  externalLoadId: 'L-2024-002',
  driverId: 'D-158',
  status: 'new',
  pickUpLocation: {
    city: 'Baltimore',
    state: 'MD',
    zipCode: '21222',
    address: '8203 Fischer Road',
  },
  dropOffLocation: {
    city: 'Montgomery',
    state: 'IL',
    zipCode: '60538',
    address: '325 S Route 31 Suite G103 Building G',
  },
  pickUpDate: 'July 24, 2025',
  deliveryDate: 'July 25, 2025',
  brokerCompanyId: 'B-001',
  carrierCompanyId: 'c-001',
  factoring: false,
  rate: {
    total: 1600,
    currency: 'USD',
    ratePerMile: 2.15,
  },
  weightLbs: 46600,
} as Load;

export const LOAD_3 = {
  id: 'L-003',
  externalLoadId: 'L-2024-003',
  driverId: 'D-158',
  status: 'in_transit',
  pickUpLocation: {
    address: "6466 Pine Rd",
    city: "Chicago",
    state: "IL",
    zipCode: "26836",
  },
  dropOffLocation: {
    address: "1461 Moreland Ave SE",
    city: "Atlanta",
    state: "GA",
    zipCode: "30316",
  },
  pickUpDate: 'July 26, 2025',
  deliveryDate: 'July 28, 2025',
  brokerCompanyId: 'B-001',
  carrierCompanyId: 'c-001',
  factoring: false,
  rate: {
    total: 1440,
    currency: 'USD',
    ratePerMile: 2,
  },
  weightLbs: 44000,
  cargoDescription: 'Food',
} as Load;

export const LOAD_ROBERT = {
  id: 'L-004',
  externalLoadId: 'L-2024-004',
  driverId: 'D-200',
  status: 'new',
  pickUpLocation: {
    address: '6466 Pine Rd',
    city: 'Chicago',
    state: 'IL',
    zipCode: '60612',
  },
  dropOffLocation: {
    address: '1461 Moreland Ave SE',
    city: 'Atlanta',
    state: 'GA',
    zipCode: '30316',
  },
  pickUpDate: 'July 26, 2025',
  deliveryDate: 'July 28, 2025',
  brokerCompanyId: 'B-001',
  carrierCompanyId: 'c-001',
  factoring: false,
  rate: {
    total: 1440,
    currency: 'USD',
    ratePerMile: 2.0,
  },
  weightLbs: 44000,
  cargoDescription: 'Consumer Goods',
} as Load;
