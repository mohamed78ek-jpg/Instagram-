import { UserAccount, LinkedIgAccount, Order, PromoCode, RefFriend, MiningLog } from '../types';

const STORAGE_KEYS = {
  USER: 'topfollow_user_v2',
  LINKED_ACCOUNTS: 'topfollow_linked_accs_v2',
  ORDERS: 'topfollow_orders_v2',
  PROMO_CODES: 'topfollow_promos_v2',
  REF_FRIENDS: 'topfollow_refs_v2',
  MINING_LOGS: 'topfollow_logs_v2',
};

const DEFAULT_USER: UserAccount = {
  username: '',
  coins: 0,
  diamonds: 0,
  totalFollowersDelivered: 0,
  totalLikesDelivered: 0,
  dailyStreak: 0,
  lastCheckInDate: null,
  vipLevel: 'Standard',
  refCode: 'TOP-' + Math.floor(10000 + Math.random() * 90000),
  totalRefEarned: 0,
  refCount: 0,
  activeLinkedAccountId: '',
  antiBanEnabled: true,
};

const DEFAULT_LINKED_ACCOUNTS: LinkedIgAccount[] = [];

const DEFAULT_ORDERS: Order[] = [];

const DEFAULT_PROMO_CODES: PromoCode[] = [
  {
    code: 'TOP2026',
    coinsReward: 1000,
    descriptionAr: 'كود الترحيب الخاص بمنصة توب فلو 2026',
    descriptionEn: 'Welcome code for TopFollow 2026',
    isRedeemed: false,
    category: 'welcome',
  },
  {
    code: 'ARAB2026',
    coinsReward: 500,
    descriptionAr: 'كود الدعم العربي المجاني (+500 نقطة)',
    descriptionEn: 'Free Arab community code (+500 coins)',
    isRedeemed: false,
    category: 'event',
  },
  {
    code: 'FREE500',
    coinsReward: 500,
    descriptionAr: 'هدية الاشتراك اليومية لزيادة المتابعين',
    descriptionEn: 'Daily boost reward gift',
    isRedeemed: false,
    category: 'daily',
  },
  {
    code: 'VIPBOOST',
    coinsReward: 2500,
    descriptionAr: 'كود الأعضاء الـ VIP الفخمة (+2500 نقطة)',
    descriptionEn: 'VIP Platinum special package code (+2500 coins)',
    isRedeemed: false,
    category: 'vip',
  },
];

const DEFAULT_REF_FRIENDS: RefFriend[] = [];

export const loadUser = (): UserAccount => {
  const saved = localStorage.getItem(STORAGE_KEYS.USER);
  return saved ? JSON.parse(saved) : DEFAULT_USER;
};

export const saveUser = (user: UserAccount) => {
  localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
};

export const loadLinkedAccounts = (): LinkedIgAccount[] => {
  const saved = localStorage.getItem(STORAGE_KEYS.LINKED_ACCOUNTS);
  if (!saved) return DEFAULT_LINKED_ACCOUNTS;
  try {
    const parsed = JSON.parse(saved);
    // Filter out any leftover mock accounts
    return Array.isArray(parsed)
      ? parsed.filter((a) => a.id !== 'acc_1' && a.id !== 'acc_2')
      : [];
  } catch {
    return [];
  }
};

export const saveLinkedAccounts = (accs: LinkedIgAccount[]) => {
  localStorage.setItem(STORAGE_KEYS.LINKED_ACCOUNTS, JSON.stringify(accs));
};

export const loadOrders = (): Order[] => {
  const saved = localStorage.getItem(STORAGE_KEYS.ORDERS);
  if (!saved) return DEFAULT_ORDERS;
  try {
    const parsed = JSON.parse(saved);
    return Array.isArray(parsed)
      ? parsed.filter((o) => o.id !== 'ord_101' && o.id !== 'ord_102' && o.id !== 'ord_103')
      : [];
  } catch {
    return [];
  }
};

export const saveOrders = (orders: Order[]) => {
  localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
};

export const loadPromoCodes = (): PromoCode[] => {
  const saved = localStorage.getItem(STORAGE_KEYS.PROMO_CODES);
  return saved ? JSON.parse(saved) : DEFAULT_PROMO_CODES;
};

export const savePromoCodes = (codes: PromoCode[]) => {
  localStorage.setItem(STORAGE_KEYS.PROMO_CODES, JSON.stringify(codes));
};

export const loadRefFriends = (): RefFriend[] => {
  const saved = localStorage.getItem(STORAGE_KEYS.REF_FRIENDS);
  return saved ? JSON.parse(saved) : DEFAULT_REF_FRIENDS;
};

export const loadMiningLogs = (): MiningLog[] => {
  const saved = localStorage.getItem(STORAGE_KEYS.MINING_LOGS);
  if (!saved) return [];
  try {
    const parsed = JSON.parse(saved);
    return Array.isArray(parsed) ? parsed.filter((l) => l.id !== 'log_1' && l.id !== 'log_2') : [];
  } catch {
    return [];
  }
};

export const saveMiningLogs = (logs: MiningLog[]) => {
  localStorage.setItem(STORAGE_KEYS.MINING_LOGS, JSON.stringify(logs.slice(0, 50)));
};
