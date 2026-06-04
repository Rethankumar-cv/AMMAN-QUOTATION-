// A simple wrapper around synchronous localStorage for global app settings and counters.
const PREFIX = 'aem_settings_';

export const getSettings = (key) => {
  try {
    const item = localStorage.getItem(`${PREFIX}${key}`);
    return item ? JSON.parse(item) : null;
  } catch (error) {
    console.error('Error reading from localStorage:', error);
    return null;
  }
};

export const saveSettings = (key, value) => {
  try {
    localStorage.setItem(`${PREFIX}${key}`, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error('Error writing to localStorage:', error);
    return false;
  }
};

// Call this once on app boot to ensure defaults exist
export const initializeDefaultSettings = () => {
  if (!getSettings('companyProfile')) {
    saveSettings('companyProfile', {
      companyName: 'AMMAN EARTH MOVERS',
      tagline: 'Heavy Earthmoving & Vehicle Solutions',
      address: '60-A, NGR Street, Kalapatti, Coimbatore - 641 048',
      email: 'ammanearthmoverscbe48@gmail.com',
      contact: '9842267585 | 9842867585',
      gstNumber: ''
    });
  }

  if (!getSettings('branding')) {
    saveSettings('branding', {
      logoUrl: '',
      stampUrl: '',
      signatureUrl: ''
    });
  }

  if (!getSettings('quotationDefaults')) {
    saveSettings('quotationDefaults', {
      keyTerms: "1. Rate is subject to vehicle availability and work-site conditions.\n2. GST will be charged extra as applicable.\n3. Working hours, fuel, and driver charges are as agreed for each vehicle.\n4. This quotation is valid for 5 days from the date of issue.\n5. Interest at 18% will be charged if payment is not made within 30 days from the date of the bill.",
      gstPercentage: '18',
      validityDays: '5'
    });
  }

  if (!getSettings('appPrefs')) {
    saveSettings('appPrefs', {
      theme: 'light',
      backupReminder: 'weekly'
    });
  }
};
