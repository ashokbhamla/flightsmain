import redisClient from '@/lib/redis';

export interface AdminSettings {
  flightPopupEnabled: boolean;
  bookingPopupEnabled: boolean;
  overlayEnabled: boolean;
  phoneNumber: string;
  leadPageEnabled: boolean;
}

const REDIS_KEY = 'admin:settings';

const DEFAULT_SETTINGS: AdminSettings = {
  flightPopupEnabled: true,
  bookingPopupEnabled: true,
  overlayEnabled: true,
  phoneNumber: '(888) 319-6206',
  leadPageEnabled: false,
};

let inMemoryCache: AdminSettings | null = null;

function mergeWithDefaults(partial?: Partial<AdminSettings>): AdminSettings {
  return {
    ...DEFAULT_SETTINGS,
    ...(partial || {}),
  };
}

export async function getAdminSettings(): Promise<AdminSettings> {
  if (inMemoryCache) {
    return inMemoryCache;
  }

  try {
    if (!redisClient.isOpen) {
      await redisClient.connect();
    }

    const stored = await redisClient.get(REDIS_KEY);
    if (stored) {
      const parsed = JSON.parse(stored) as Partial<AdminSettings>;
      inMemoryCache = mergeWithDefaults(parsed);
      return inMemoryCache;
    }
  } catch (error) {
    console.error('Failed to load admin settings from Redis:', error);
  }

  inMemoryCache = DEFAULT_SETTINGS;
  return inMemoryCache;
}

export async function updateAdminSettings(partial: Partial<AdminSettings>): Promise<AdminSettings> {
  const filteredEntries = Object.entries(partial).filter(
    ([, value]) => typeof value !== 'undefined'
  ) as [keyof AdminSettings, AdminSettings[keyof AdminSettings]][];

  const current = await getAdminSettings();
  const updated = filteredEntries.reduce((acc, [key, value]) => {
    return { ...acc, [key]: value };
  }, current);

  inMemoryCache = updated;

  try {
    if (!redisClient.isOpen) {
      await redisClient.connect();
    }
    await redisClient.set(REDIS_KEY, JSON.stringify(updated));
  } catch (error) {
    console.error('Failed to persist admin settings to Redis:', error);
  }

  return updated;
}

