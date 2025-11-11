export interface AdminSettings {
  flightPopupEnabled: boolean;
  bookingPopupEnabled: boolean;
  overlayEnabled: boolean;
  phoneNumber: string;
  leadPageEnabled: boolean;
}

let settings: AdminSettings = {
  flightPopupEnabled: true,
  bookingPopupEnabled: true,
  overlayEnabled: true,
  phoneNumber: '(888) 319-6206',
  leadPageEnabled: false,
};

export function getAdminSettings(): AdminSettings {
  return settings;
}

export function updateAdminSettings(partial: Partial<AdminSettings>): AdminSettings {
  const filteredEntries = Object.entries(partial).filter(
    ([, value]) => typeof value !== 'undefined'
  ) as [keyof AdminSettings, AdminSettings[keyof AdminSettings]][];

  if (filteredEntries.length > 0) {
    settings = filteredEntries.reduce((acc, [key, value]) => {
      return { ...acc, [key]: value };
    }, settings);
  }

  return settings;
}

