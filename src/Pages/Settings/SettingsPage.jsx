// src/pages/Settings/SettingsPage.jsx
//
// Four independent accordion sections — each loads and saves its own slice
// of data separately, so updating "Delivery Settings" never touches
// "Business Information", etc. Currently backed by dummy data
// (dummySettingsData.js) so you can see the full page working; see the
// 👇 API comments inside each section component (and at the bottom of each
// section's body, in the small code-styled note) for exactly where to wire
// in your real endpoints.
//
// 👇 On mount, this would normally be:
//   GET /tiffin-provider/{providerId}/settings
//   ...returning { general, business, delivery } in one call (or three
//   separate calls if your backend splits them) — replace the dummy import
//   below with that fetch, keeping the same { general, business, delivery }
//   shape so the section components don't need to change.

import { useState } from "react";
import { FaUser, FaStore, FaTruck, FaShieldAlt } from "react-icons/fa";
import { Accordion, AccordionItem } from "../../components/common/Accordion";
import PageHeader from "../../components/common/PageHeader";
import dummySettingsData from "./dummySettingsData";
import GeneralSection from "./GeneralSection";
import BusinessInfoSection from "./BusinessInfoSection";
import DeliverySettingsSection from "./DeliverySettingsSection";
import SecuritySection from "./SecuritySection";
import "./Settings.css";
import { useUserInfo } from "../../Context/UserContext";

export default function SettingsPage() {
  const [settings, setSettings] = useState(dummySettingsData);
  const { getUserInfo, getBusinessDetails } = useUserInfo();
  const user = getUserInfo();
  const buinessDetails = getBusinessDetails()

  return (
    <div>
      <PageHeader title="Settings" />

      <Accordion defaultOpen="general">
        <AccordionItem
          id="general"
          title="General"
          subtitle="Name, contact details"
          icon={FaUser}
        >
          <GeneralSection
            data={{
              firstName: user?.firstName,
              lastName: user?.lastName,
              dob: user?.dob,
              gender: user?.gender,
              email: user?.emailId, // read-only here — see Security > Change Email
              mobileNumber: user?.phoneNo,
            }}
            providerId={user?.userId}
            onSave={(updated) => setSettings((prev) => ({ ...prev, general: updated }))}
          />
        </AccordionItem>

        {user?.userRole === "ROLE_TIFFIN_PROVIDER" &&
          <AccordionItem
            id="business"
            title="Business Information"
            subtitle="Address, location, licenses"
            icon={FaStore}
          >
            <BusinessInfoSection
              data={{
                businessName: buinessDetails?.businessName,
                addressLine: buinessDetails?.addressLine,
                area: buinessDetails?.area,
                latitude: buinessDetails?.latitude,
                longitude: buinessDetails?.longitude,
                serviceRadius: buinessDetails?.serviceRadius,
                // openingTime: buinessDetails?."08:00",
                // closingTime: buinessDetails?."21:00",
                fssaiLicenseNo: buinessDetails?.foodLicenseNo,
                gstNumber: buinessDetails?.gstin,
              }}
              providerId={user?.userId}
              onSave={(updated) => setSettings((prev) => ({ ...prev, business: updated }))}
            />
          </AccordionItem>}

        {/* <AccordionItem
          id="delivery"
          title="Delivery Settings"
          subtitle="Order limits, subscriptions, delivery radius"
          icon={FaTruck}
        >
          <DeliverySettingsSection
            data={settings.delivery}
            onSave={(updated) => setSettings((prev) => ({ ...prev, delivery: updated }))}
          />
        </AccordionItem> */}

        <AccordionItem id="security" title="Security" subtitle="Password and email" icon={FaShieldAlt}>
          <SecuritySection
            currentEmail={user?.emailId}
            onEmailChanged={(newEmail) =>
              setSettings((prev) => ({ ...prev, general: { ...prev.general, email: newEmail } }))
            }
          />
        </AccordionItem>
      </Accordion>
    </div>
  );
}
