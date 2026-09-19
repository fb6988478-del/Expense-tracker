import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

export type UserType = 'professional' | 'nrb' | 'student' | 'family' | 'business';
export type CurrencyCode = 'BDT' | 'USD' | 'GBP' | 'EUR' | 'SAR' | 'MYR' | 'CAD';
export type WalletType = 'personal' | 'business';

export type UserTypeOption = {
  id: UserType;
  title: string;
  subtitle: string;
  icon: string;
};

export const USER_TYPES: UserTypeOption[] = [
  {
    id: 'professional',
    title: 'চাকরিজীবী / পেশাজীবী',
    subtitle: 'মাসিক আয় ও দৈনন্দিন খরচ গুছিয়ে রাখুন',
    icon: 'briefcase-outline',
  },
  {
    id: 'nrb',
    title: 'বিদেশে কর্মরত / অবস্থানরত',
    subtitle: 'একাধিক currency-তে নিজের ও দেশের হিসাব রাখুন',
    icon: 'airplane-outline',
  },
  {
    id: 'student',
    title: 'স্টুডেন্ট',
    subtitle: 'প্যাসিভ ইনকাম, সাইড কাজ ও পড়াশোনার খরচ',
    icon: 'school-outline',
  },
  {
    id: 'family',
    title: 'পরিবারের কর্তা / বাবা',
    subtitle: 'নিজের, সন্তান ও পুরো পরিবারের পরিকল্পনা',
    icon: 'people-outline',
  },
  {
    id: 'business',
    title: 'ব্যবসায়ী',
    subtitle: 'ব্যক্তিগত ও ব্যবসার টাকা আলাদা রাখুন',
    icon: 'storefront-outline',
  },
];

export const CURRENCIES: { id: CurrencyCode; symbol: string; title: string }[] = [
  { id: 'BDT', symbol: '৳', title: 'বাংলাদেশি টাকা' },
  { id: 'USD', symbol: '$', title: 'মার্কিন ডলার' },
  { id: 'GBP', symbol: '£', title: 'ব্রিটিশ পাউন্ড' },
  { id: 'EUR', symbol: '€', title: 'ইউরো' },
  { id: 'SAR', symbol: '﷼', title: 'সৌদি রিয়াল' },
  { id: 'MYR', symbol: 'RM', title: 'মালয়েশিয়ান রিঙ্গিত' },
  { id: 'CAD', symbol: 'CA$', title: 'কানাডিয়ান ডলার' },
];

export type ExpenseCategory = {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  color: 'coral' | 'green' | 'yellow' | 'blue' | 'purple';
  wallet: WalletType | 'both';
  audiences?: UserType[];
};

export const EXPENSE_CATEGORIES: ExpenseCategory[] = [
  { id: 'food', title: 'খাবার', subtitle: 'বাজার, রেস্টুরেন্ট', icon: 'restaurant-outline', color: 'coral', wallet: 'personal' },
  { id: 'transport', title: 'যাতায়াত', subtitle: 'বাস, রাইড, জ্বালানি', icon: 'bus-outline', color: 'blue', wallet: 'personal' },
  { id: 'housing', title: 'বাসা ভাড়া', subtitle: 'ভাড়া, মেরামত', icon: 'home-outline', color: 'purple', wallet: 'personal' },
  { id: 'utility', title: 'ইউটিলিটি', subtitle: 'বিদ্যুৎ, গ্যাস, নেট', icon: 'flash-outline', color: 'yellow', wallet: 'personal' },
  { id: 'education', title: 'শিক্ষা', subtitle: 'ফি, বই, কোর্স', icon: 'book-outline', color: 'green', wallet: 'personal' },
  { id: 'data', title: 'মোবাইল ডাটা', subtitle: 'ইন্টারনেট ও রিচার্জ', icon: 'wifi-outline', color: 'blue', wallet: 'personal', audiences: ['student'] },
  { id: 'learning', title: 'কোর্স ও শেখা', subtitle: 'স্কিল, বই, পরীক্ষা', icon: 'school-outline', color: 'purple', wallet: 'personal', audiences: ['student'] },
  { id: 'sidework', title: 'সাইড কাজ', subtitle: 'প্রজেক্ট ও কাজের খরচ', icon: 'laptop-outline', color: 'green', wallet: 'personal', audiences: ['student'] },
  { id: 'family', title: 'সন্তান ও পরিবার', subtitle: 'পরিবারের প্রয়োজন', icon: 'heart-outline', color: 'coral', wallet: 'personal' },
  { id: 'occasion', title: 'উপলক্ষ', subtitle: 'বিয়ে, ঈদ, জন্মদিন', icon: 'gift-outline', color: 'purple', wallet: 'personal' },
  { id: 'savings', title: 'সঞ্চয়', subtitle: 'সঞ্চয় ও ইনভেস্টমেন্ট', icon: 'trending-up-outline', color: 'green', wallet: 'personal' },
  { id: 'emergency', title: 'জরুরি তহবিল', subtitle: 'প্রয়োজনে পাশে থাকবে', icon: 'shield-checkmark-outline', color: 'blue', wallet: 'personal' },
  { id: 'commission', title: 'এজেন্ট কমিশন', subtitle: 'বিক্রয় ও ডেলিভারি', icon: 'people-outline', color: 'yellow', wallet: 'business' },
  { id: 'operations', title: 'অপারেশনাল খরচ', subtitle: 'দোকান, পরিবহন, খরচ', icon: 'construct-outline', color: 'blue', wallet: 'business' },
  { id: 'staff', title: 'স্টাফ বেতন', subtitle: 'টিমের সম্মানী', icon: 'person-outline', color: 'green', wallet: 'business' },
  { id: 'stock', title: 'স্টক / পণ্য', subtitle: 'নতুন মালামাল', icon: 'cube-outline', color: 'purple', wallet: 'business' },
  { id: 'marketing', title: 'মার্কেটিং', subtitle: 'প্রচার ও বিজ্ঞাপন', icon: 'megaphone-outline', color: 'coral', wallet: 'business' },
];

export const OCCASION_SUBOPTIONS = [
  'বিয়ে (নিজের)',
  'বিয়ে (ছেলে-মেয়ের)',
  'বিয়ে (আত্মীয়ের)',
  'জন্মদিন',
  'ঈদ',
  'পূজা',
  'অ্যানিভার্সারি',
  'অন্যান্য',
] as const;

export const BUDGET_GROUPS = [
  { id: 'necessary', title: 'প্রয়োজনীয়', subtitle: 'যা না হলে চলবে না', icon: 'checkmark-circle-outline', items: ['বাসা ভাড়া', 'খাবার', 'যাতায়াত', 'ইউটিলিটি', 'শিক্ষা'] },
  { id: 'occasion', title: 'উপলক্ষ', subtitle: 'আগে থেকে প্রস্তুতি নিন', icon: 'gift-outline', items: [...OCCASION_SUBOPTIONS] },
  { id: 'savings', title: 'ইনভেস্টমেন্ট / সঞ্চয়', subtitle: 'আগামীর জন্য আজই', icon: 'trending-up-outline', items: ['সঞ্চয়', 'ইনভেস্টমেন্ট', 'ডিপিএস'] },
  { id: 'family', title: 'সন্তান ও পরিবার', subtitle: 'আপনজনদের সুন্দর সময়', icon: 'people-outline', items: ['চিকিৎসা', 'শিক্ষা', 'পরিবারের ভ্রমণ', 'মাসিক সহায়তা'] },
  { id: 'emergency', title: 'জরুরি তহবিল', subtitle: 'হঠাৎ প্রয়োজনের নিরাপত্তা', icon: 'shield-checkmark-outline', items: ['চিকিৎসা', 'জরুরি যাতায়াত', 'বাড়ির মেরামত'] },
  { id: 'business', title: 'ব্যবসায়িক খরচ', subtitle: 'ব্যবসা এগিয়ে নেওয়ার পরিকল্পনা', icon: 'storefront-outline', items: ['এজেন্ট কমিশন', 'অপারেশনাল খরচ', 'স্টাফ বেতন', 'স্টক', 'মার্কেটিং', 'দোকান ভাড়া'] },
];

export type Expense = {
  id: string;
  amount: number;
  categoryId: string;
  categoryTitle: string;
  subCategory?: string;
  note: string;
  wallet: WalletType;
  date: string;
};

export type Income = {
  id: string;
  amount: number;
  source: string;
  sourceType: 'salary' | 'passive' | 'business' | 'other';
  note: string;
  date: string;
};

export type Budget = {
  id: string;
  title: string;
  groupId: string;
  amount: number;
  spent: number;
  month: string;
};

export type AppProfile = {
  name: string;
  userType: UserType | null;
  currency: CurrencyCode;
  onboarded: boolean;
  notifications: {
    morning: boolean;
    lunch: boolean;
    evening: boolean;
    streak: boolean;
    monthEnd: boolean;
  };
};

export type SmartMessage = {
  title: string;
  body: string;
  mood: 'hello' | 'happy' | 'thinking' | 'celebrate';
};

export function getSmartMessage({
  monthExpenses,
  monthIncome,
  totalBudget,
  streak,
  expenseCount,
  incomeCount,
  userType,
}: {
  monthExpenses: number;
  monthIncome: number;
  totalBudget: number;
  streak: number;
  expenseCount: number;
  incomeCount: number;
  userType: UserType | null;
}): SmartMessage {
  if (expenseCount === 0 && incomeCount === 0) {
    return {
      title: 'অগ্র শুরুটা নিজের দায়িত্বে নিয়েছে',
      body: 'আজ শুধু একটি আয় বা খরচ লিখুন। বাকিটা অগ্র ধীরে ধীরে গুছিয়ে দেবে।',
      mood: 'hello',
    };
  }
  if (totalBudget > 0 && monthExpenses > totalBudget) {
    return {
      title: 'অগ্র একটু আগে থেকেই জানাচ্ছে',
      body: 'এই মাসের খরচ আপনার পরিকল্পনার চেয়ে এগিয়ে গেছে। দোষ নয়—আজ থেকে কোন খরচটা একটু থামানো যায়, অগ্র সেটাই দেখাবে।',
      mood: 'thinking',
    };
  }
  if (streak >= 3) {
    return {
      title: `অগ্র আপনার ${streak} দিনের অভ্যাসটি দেখছে`,
      body: 'প্রতিদিন একবার হিসাব লেখা মানে নিজের ভবিষ্যতের জন্য একটু জায়গা রাখা। এই ছোট ধারাটাই ধরে রাখুন।',
      mood: 'celebrate',
    };
  }
  if (userType === 'business' && monthIncome > 0) {
    return {
      title: 'অগ্র ব্যবসার হিসাবটাও আলাদা করে দেখছে',
      body: 'ব্যক্তিগত ও ব্যবসার টাকা আলাদা রাখলে লাভ-ক্ষতির ছবিটা আরও পরিষ্কার হবে।',
      mood: 'happy',
    };
  }
  if (userType === 'student') {
    return {
      title: 'অগ্র আপনার পড়াশোনা আর আয়ের পাশে আছে',
      body: 'ডাটা, কোর্স, সাইড কাজ—ছোট খরচগুলোও লিখে রাখলে নিজের পরিশ্রমের পুরো ছবিটা দেখা যায়।',
      mood: 'happy',
    };
  }
  if (monthIncome > 0 && monthExpenses <= monthIncome * 0.7) {
    return {
      title: 'অগ্র বলছে, আপনার গতি ঠিক আছে',
      body: 'আয়ের বড় অংশ এখনো আপনার হাতে আছে। পরিকল্পনাটা ধরে রাখলেই মাসটা আরও স্বস্তির হবে।',
      mood: 'happy',
    };
  }
  return {
    title: 'অগ্র আজকের হিসাবটা মনে রাখছে',
    body: 'সবকিছু একদিনে গুছাতে হয় না। আজকের ছোট্ট হিসাবটুকুই আগামী দিনের স্বস্তির শুরু।',
    mood: 'hello',
  };
}

type AmarHisabValue = {
  profile: AppProfile;
  expenses: Expense[];
  incomes: Income[];
  budgets: Budget[];
  focusMinutes: number;
  streak: number;
  bestStreak: number;
  isHydrated: boolean;
  todayExpenses: number;
  monthExpenses: number;
  monthIncome: number;
  personalExpenses: number;
  businessExpenses: number;
  completeOnboarding: (name: string, userType: UserType, currency: CurrencyCode) => void;
  addExpense: (input: Omit<Expense, 'id' | 'date'>) => void;
  addIncome: (input: Omit<Income, 'id' | 'date'>) => void;
  addBudget: (input: Omit<Budget, 'id' | 'spent' | 'month'>) => void;
  removeExpense: (id: string) => void;
  toggleNotification: (key: keyof AppProfile['notifications']) => void;
  setCurrency: (currency: CurrencyCode) => void;
  recordFocusSession: (minutes: number) => void;
  claimReward: (rewardId: string) => void;
  claimedRewards: string[];
};

const STORAGE_KEY = '@amar-hisab-state';
const todayKey = () => new Date().toISOString().slice(0, 10);
const monthKey = () => todayKey().slice(0, 7);

const initialProfile: AppProfile = {
  name: '',
  userType: null,
  currency: 'BDT',
  onboarded: false,
  notifications: {
    morning: true,
    lunch: true,
    evening: true,
    streak: true,
    monthEnd: true,
  },
};

const AmarHisabContext = createContext<AmarHisabValue | null>(null);

export function AmarHisabProvider({ children }: PropsWithChildren) {
  const [profile, setProfile] = useState<AppProfile>(initialProfile);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [incomes, setIncomes] = useState<Income[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [focusMinutes, setFocusMinutes] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);
  const [bestStreak, setBestStreak] = useState<number>(0);
  const [lastActivity, setLastActivity] = useState<string>('');
  const [claimedRewards, setClaimedRewards] = useState<string[]>([]);
  const [isHydrated, setIsHydrated] = useState<boolean>(false);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((stored) => {
        if (!stored) return;
        try {
          const parsed = JSON.parse(stored) as Partial<{
            profile: AppProfile;
            expenses: Expense[];
            incomes: Income[];
            budgets: Budget[];
            focusMinutes: number;
            streak: number;
            bestStreak: number;
            lastActivity: string;
            claimedRewards: string[];
          }>;
          if (parsed.profile) setProfile({ ...initialProfile, ...parsed.profile, notifications: { ...initialProfile.notifications, ...parsed.profile.notifications } });
          if (parsed.expenses) setExpenses(parsed.expenses);
          if (parsed.incomes) setIncomes(parsed.incomes);
          if (parsed.budgets) setBudgets(parsed.budgets);
          if (typeof parsed.focusMinutes === 'number') setFocusMinutes(parsed.focusMinutes);
          if (typeof parsed.streak === 'number') setStreak(parsed.streak);
          if (typeof parsed.bestStreak === 'number') setBestStreak(parsed.bestStreak);
          if (parsed.lastActivity) setLastActivity(parsed.lastActivity);
          if (parsed.claimedRewards) setClaimedRewards(parsed.claimedRewards);
        } catch {
          // A fresh state is safer than showing a broken ledger.
        }
      })
      .finally(() => setIsHydrated(true));
  }, []);

  useEffect(() => {
    if (!isHydrated) return;
    AsyncStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ profile, expenses, incomes, budgets, focusMinutes, streak, bestStreak, lastActivity, claimedRewards }),
    ).catch(() => undefined);
  }, [bestStreak, budgets, claimedRewards, expenses, focusMinutes, incomes, isHydrated, lastActivity, profile, streak]);

  const markActivity = useCallback(() => {
    const today = todayKey();
    if (lastActivity === today) return;
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const nextStreak = lastActivity === yesterday.toISOString().slice(0, 10) ? streak + 1 : 1;
    setStreak(nextStreak);
    setBestStreak((current) => Math.max(current, nextStreak));
    setLastActivity(today);
  }, [lastActivity, streak]);

  const completeOnboarding = useCallback((name: string, userType: UserType, currency: CurrencyCode) => {
    setProfile((current) => ({ ...current, name: name.trim() || 'বন্ধু', userType, currency, onboarded: true }));
    setBudgets([
      { id: 'starter-food', title: 'খাবার', groupId: 'necessary', amount: 8000, spent: 0, month: monthKey() },
      { id: 'starter-transport', title: 'যাতায়াত', groupId: 'necessary', amount: 3500, spent: 0, month: monthKey() },
      { id: 'starter-savings', title: 'সঞ্চয়', groupId: 'savings', amount: 5000, spent: 0, month: monthKey() },
    ]);
  }, []);

  const addExpense = useCallback((input: Omit<Expense, 'id' | 'date'>) => {
    setExpenses((current) => [{ ...input, id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`, date: new Date().toISOString() }, ...current]);
    setBudgets((current) => current.map((budget) => budget.title === input.categoryTitle ? { ...budget, spent: budget.spent + input.amount } : budget));
    markActivity();
  }, [markActivity]);

  const addIncome = useCallback((input: Omit<Income, 'id' | 'date'>) => {
    setIncomes((current) => [{ ...input, id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`, date: new Date().toISOString() }, ...current]);
    markActivity();
  }, [markActivity]);

  const addBudget = useCallback((input: Omit<Budget, 'id' | 'spent' | 'month'>) => {
    setBudgets((current) => [{ ...input, id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`, spent: 0, month: monthKey() }, ...current]);
  }, []);

  const removeExpense = useCallback((id: string) => setExpenses((current) => current.filter((expense) => expense.id !== id)), []);
  const toggleNotification = useCallback((key: keyof AppProfile['notifications']) => setProfile((current) => ({ ...current, notifications: { ...current.notifications, [key]: !current.notifications[key] } })), []);
  const setCurrency = useCallback((currency: CurrencyCode) => setProfile((current) => ({ ...current, currency })), []);
  const recordFocusSession = useCallback((minutes: number) => { setFocusMinutes((current) => current + minutes); markActivity(); }, [markActivity]);
  const claimReward = useCallback((rewardId: string) => setClaimedRewards((current) => current.includes(rewardId) ? current : [...current, rewardId]), []);

  const todayExpenses = expenses.filter((expense) => expense.date.slice(0, 10) === todayKey()).reduce((sum, expense) => sum + expense.amount, 0);
  const monthExpenses = expenses.filter((expense) => expense.date.slice(0, 7) === monthKey()).reduce((sum, expense) => sum + expense.amount, 0);
  const monthIncome = incomes.filter((income) => income.date.slice(0, 7) === monthKey()).reduce((sum, income) => sum + income.amount, 0);
  const personalExpenses = expenses.filter((expense) => expense.wallet === 'personal' && expense.date.slice(0, 7) === monthKey()).reduce((sum, expense) => sum + expense.amount, 0);
  const businessExpenses = expenses.filter((expense) => expense.wallet === 'business' && expense.date.slice(0, 7) === monthKey()).reduce((sum, expense) => sum + expense.amount, 0);

  const value = useMemo(() => ({
    profile, expenses, incomes, budgets, focusMinutes, streak, bestStreak, isHydrated, todayExpenses, monthExpenses, monthIncome, personalExpenses, businessExpenses,
    completeOnboarding, addExpense, addIncome, addBudget, removeExpense, toggleNotification, setCurrency, recordFocusSession, claimReward, claimedRewards,
  }), [addBudget, addExpense, addIncome, bestStreak, businessExpenses, claimReward, claimedRewards, completeOnboarding, budgets, expenses, focusMinutes, incomes, isHydrated, monthExpenses, monthIncome, personalExpenses, profile, recordFocusSession, removeExpense, setCurrency, streak, toggleNotification, todayExpenses]);

  return <AmarHisabContext.Provider value={value}>{children}</AmarHisabContext.Provider>;
}

export function useAmarHisab() {
  const context = useContext(AmarHisabContext);
  if (!context) throw new Error('useAmarHisab must be used inside AmarHisabProvider');
  return context;
}

export function currencySymbol(currency: CurrencyCode) {
  return CURRENCIES.find((item) => item.id === currency)?.symbol ?? '৳';
}

export function formatMoney(amount: number, currency: CurrencyCode = 'BDT') {
  return `${currencySymbol(currency)}${Math.round(amount).toLocaleString('en-IN')}`;
}

export function categoryFor(id: string) {
  return EXPENSE_CATEGORIES.find((category) => category.id === id) ?? EXPENSE_CATEGORIES[0];
}