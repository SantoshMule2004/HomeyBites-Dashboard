// src/pages/Settings/dummySettingsData.js
//
// Stand-in for what GET /tiffin-provider/{providerId}/settings (or similar)
// would return. SettingsPage loads this into state once on mount; each
// section edits its own local copy and "saves" independently — see the
// 👇 API comments inside each section component for where the real calls
// go once your endpoints exist.

const dummySettingsData = {
  general: {
    firstName: "Pradip",
    lastName: "Chavan",
    dob: "1994-03-18",
    gender: "Male",
    email: "pradip@homeybites.com", // read-only here — see Security > Change Email
    mobileNumber: "9876543210",
  },
  business: {
    businessName: "Homey Bites Kitchen",
    addressLine: "12, Sunshine Apartments, FC Road",
    area: "Shivajinagar",
    latitude: "18.5204",
    longitude: "73.8567",
    serviceRadius: "5",
    openingTime: "08:00",
    closingTime: "21:00",
    fssaiLicenseNo: "12345678901234",
    gstNumber: "27ABCDE1234F1Z5",
  },
  delivery: {
    acceptOneTimeOrders: true,
    acceptNewSubscriptions: true,
    maxOrdersPerDay: "40",
    maxActiveSubscriptions: "60",
    deliveryRadius: "6",
    estimatedDeliveryTime: "30-45", // minutes, as a range
  },
};

export default dummySettingsData;