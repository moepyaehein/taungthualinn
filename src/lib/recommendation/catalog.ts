export interface RecommendationCropOption {
  id: string;
  label: string;
  datasetCrop: string;
  defaultRegion: string;
  defaultMarket?: string;
  defaultQuality?: string;
  unit?: string;
}

export const farmerCropOptions: RecommendationCropOption[] = [
  {
    id: "brown-sesame",
    label: "နှမ်းညို",
    datasetCrop: "Brown Sesame",
    defaultRegion: "Magway Region",
    defaultMarket: "Pakokku Produce Market",
    defaultQuality: "Standard",
    unit: "viss",
  },
  {
    id: "white-sesame",
    label: "နှမ်းဖြူ",
    datasetCrop: "White Sesame",
    defaultRegion: "Sagaing Region",
    defaultMarket: "Monywa Grain Market",
    defaultQuality: "Premium Export",
    unit: "viss",
  },
  {
    id: "emata",
    label: "ဧမာတာစပါး",
    datasetCrop: "Emata",
    defaultRegion: "Ayeyarwady Region",
    defaultMarket: "Pathein Market Yard",
    defaultQuality: "Standard",
    unit: "viss",
  },
  {
    id: "hybrid-corn",
    label: "ဟိုက်ဘရစ်ပြောင်းဖူးအဝါ",
    datasetCrop: "Hybrid Yellow Corn",
    defaultRegion: "Shan State",
    defaultMarket: "Taunggyi Aye Thar Yar Market",
    defaultQuality: "Grade A",
    unit: "kg",
  },
];

export const merchantCropOptions: RecommendationCropOption[] = [
  {
    id: "sesame",
    label: "နှမ်းညို",
    datasetCrop: "Brown Sesame",
    defaultRegion: "Magway Region",
    defaultMarket: "Pakokku Produce Market",
    defaultQuality: "Standard",
    unit: "viss",
  },
  {
    id: "white-sesame",
    label: "နှမ်းဖြူ",
    datasetCrop: "White Sesame",
    defaultRegion: "Sagaing Region",
    defaultMarket: "Monywa Grain Market",
    defaultQuality: "Premium Export",
    unit: "viss",
  },
  {
    id: "rice",
    label: "ဧမာတာစပါး",
    datasetCrop: "Emata",
    defaultRegion: "Yangon Region",
    defaultMarket: "Bayintnaung Wholesale Market",
    defaultQuality: "Standard",
    unit: "viss",
  },
  {
    id: "wheat",
    label: "ရွှေဘိုပျော့ဂျုံ",
    datasetCrop: "Shwebo Soft Wheat",
    defaultRegion: "Mandalay Region",
    defaultMarket: "Pyigyidagun Commodity Center",
    defaultQuality: "Grade A",
    unit: "kg",
  },
  {
    id: "corn",
    label: "ဟိုက်ဘရစ်ပြောင်းဖူးအဝါ",
    datasetCrop: "Hybrid Yellow Corn",
    defaultRegion: "Shan State",
    defaultMarket: "Taunggyi Aye Thar Yar Market",
    defaultQuality: "Grade A",
    unit: "kg",
  },
];

export const supportedRegions = [
  "Yangon Region",
  "Mandalay Region",
  "Sagaing Region",
  "Magway Region",
  "Ayeyarwady Region",
  "Bago Region",
  "Shan State",
  "Kayin State",
  "Mon State",
  "Naypyidaw",
] as const;

export const regionMarkets: Record<string, string[]> = {
  "Yangon Region": ["Bayintnaung Wholesale Market"],
  "Mandalay Region": ["Pyigyidagun Commodity Center"],
  "Sagaing Region": ["Monywa Grain Market"],
  "Magway Region": ["Pakokku Produce Market"],
  "Ayeyarwady Region": ["Pathein Market Yard"],
  "Bago Region": ["Pyay Market Yard"],
  "Shan State": ["Taunggyi Aye Thar Yar Market"],
  "Kayin State": ["Hpa-An Market Yard"],
  "Mon State": ["Mawlamyine Central Market"],
  Naypyidaw: ["Thapyaygone Commodity Depot"],
};

const cropNamesMm: Record<string, string> = {
  "Brown Sesame": "နှမ်းညို",
  "White Sesame": "နှမ်းဖြူ",
  "Black Sesame": "နှမ်းနက်",
  Emata: "ဧမာတာစပါး",
  "Sin Thwe Latt": "စင်သွယ်လတ်ဆန်",
  "Paw San Hmwe": "ပေါ်ဆန်းမွှေးဆန်",
  "Hard Milling Wheat": "ကြိတ်ခွဲဂျုံမာ",
  "Feed Wheat": "အစာကျွေးဂျုံ",
  "Hybrid Yellow Corn": "ဟိုက်ဘရစ်ပြောင်းဖူးအဝါ",
  "Local Yellow Corn": "ဒေသခံပြောင်းဖူးအဝါ",
  "Feed Corn": "အစာကျွေးပြောင်းဖူး",
  "Shwebo Soft Wheat": "ရွှေဘိုပျော့ဂျုံ",
};

const regionNamesMm: Record<string, string> = {
  "Yangon Region": "ရန်ကုန်တိုင်းဒေသကြီး",
  "Mandalay Region": "မန္တလေးတိုင်းဒေသကြီး",
  "Sagaing Region": "စစ်ကိုင်းတိုင်းဒေသကြီး",
  "Magway Region": "မကွေးတိုင်းဒေသကြီး",
  "Ayeyarwady Region": "ဧရာဝတီတိုင်းဒေသကြီး",
  "Bago Region": "ပဲခူးတိုင်းဒေသကြီး",
  "Shan State": "ရှမ်းပြည်နယ်",
  "Kayin State": "ကရင်ပြည်နယ်",
  "Mon State": "မွန်ပြည်နယ်",
  Naypyidaw: "နေပြည်တော်",
};

const marketNamesMm: Record<string, string> = {
  "Bayintnaung Wholesale Market": "ဘုရင့်နောင် လက်ကားဈေး",
  "Pyigyidagun Commodity Center": "ပြည်ကြီးတံခွန် ကုန်စည်ဒိုင်",
  "Monywa Grain Market": "မုံရွာ သီးနှံဈေး",
  "Pakokku Produce Market": "ပခုက္ကူ ပွဲရုံဈေး",
  "Pathein Market Yard": "ပုသိမ် ကုန်စည်ဈေးကွက်",
  "Pyay Market Yard": "ပြည် ကုန်စည်ဈေးကွက်",
  "Taunggyi Aye Thar Yar Market": "တောင်ကြီး အေးသာယာဈေး",
  "Hpa-An Market Yard": "ဘားအံ ကုန်စည်ဈေးကွက်",
  "Mawlamyine Central Market": "မော်လမြိုင် ဗဟိုဈေး",
  "Thapyaygone Commodity Depot": "သပြေကုန်း ကုန်စည်ဒိုင်",
};

const unitNamesMm: Record<string, string> = {
  viss: "ပိဿာ",
  kg: "ကီလိုဂရမ်",
};

const qualityNamesMm: Record<string, string> = {
  Standard: "ပုံမှန်အရည်အသွေး",
  "Grade A": "အဆင့် A",
  "Premium Export": "ပို့ကုန်အရည်အသွေးမြင့်",
  standard: "ပုံမှန်အရည်အသွေး",
  high: "အရည်အသွေးမြင့်",
  low: "အရည်အသွေးနိမ့်",
};

export function toMyanmarCropName(value: string) {
  return cropNamesMm[value] ?? value;
}

export function toMyanmarRegionName(value: string) {
  return regionNamesMm[value] ?? value;
}

export function toMyanmarMarketName(value: string) {
  return marketNamesMm[value] ?? value;
}

export function toMyanmarUnitName(value: string) {
  return unitNamesMm[value] ?? value;
}

export function toMyanmarQualityName(value: string) {
  return qualityNamesMm[value] ?? value;
}
