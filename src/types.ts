export type AppLanguage = 'ar' | 'en';

export type OrderStatus = 'active' | 'completed' | 'cancelled';
export type OrderType = 'followers' | 'likes' | 'comments';

export interface UserAccount {
  username: string;
  coins: number;
  diamonds: number;
  totalFollowersDelivered: number;
  totalLikesDelivered: number;
  dailyStreak: number;
  lastCheckInDate: string | null;
  vipLevel: 'Free' | 'Silver' | 'Gold' | 'VIP Platinum';
  refCode: string;
  totalRefEarned: number;
  refCount: number;
  activeLinkedAccountId: string;
  antiBanEnabled: boolean;
}

export interface LinkedIgAccount {
  id: string;
  username: string;
  fullName: string;
  avatarUrl: string;
  followersCount: number;
  followingCount: number;
  postsCount: number;
  isPrivate: boolean;
  status: 'active' | 'idle' | 'safeguard';
  totalMinedCoins: number;
  healthScore: number; // 0 - 100%
  proxyLocation: string;
  isSelectedForMining?: boolean;
}

export interface Order {
  id: string;
  type: OrderType;
  targetUsername: string;
  postUrl?: string;
  postImage?: string;
  customComments?: string[];
  totalQuantity: number;
  deliveredQuantity: number;
  costInCoins: number;
  status: OrderStatus;
  createdAt: string;
  estimatedDeliverySpeed: 'standard' | 'turbo';
}

export interface PromoCode {
  code: string;
  coinsReward: number;
  descriptionAr: string;
  descriptionEn: string;
  isRedeemed: boolean;
  category: 'welcome' | 'event' | 'vip' | 'daily';
}

export interface MiningLog {
  id: string;
  timestamp: string;
  actionType: 'follow' | 'like';
  targetUser: string;
  postShortcode?: string;
  coinsEarned: number;
  accountId: string;
}

export interface IgPost {
  id: string;
  imageUrl: string;
  likesCount: number;
  commentsCount: number;
  caption: string;
  postUrl: string;
}

export interface RefFriend {
  id: string;
  username: string;
  joinedAt: string;
  coinsContributed: number;
  status: 'active' | 'mining';
}
