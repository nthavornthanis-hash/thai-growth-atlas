import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type Lang = "th" | "en";

const dict = {
  brand: { th: "Geo-Smart Location Analysis", en: "Geo-Smart Location Analysis" },
  nav_home: { th: "หน้าแรก", en: "Home" },
  nav_map: { th: "แผนที่วิเคราะห์", en: "Interactive Map" },
  nav_rank: { th: "จัดอันดับพื้นที่", en: "Top Rankings" },
  nav_method: { th: "ระเบียบวิธี", en: "Methodology" },
  nav_about: { th: "เกี่ยวกับ", en: "About" },
  api_online: { th: "GISTDA Sphere API เชื่อมต่อแล้ว", en: "GISTDA Sphere API connected" },
  api_fallback: { th: "ใช้ข้อมูลสำรอง (Local CSV)", en: "Fallback to local CSV cache" },
  api_checking: { th: "กำลังตรวจสอบ API...", en: "Checking API..." },
  hero_tag: { th: "พื้นที่เศรษฐกิจใหม่ของไทย", en: "Thailand Emerging Economic Zones" },
  hero_title: {
    th: "วิเคราะห์และคาดการณ์พื้นที่เศรษฐกิจใหม่",
    en: "Analyze and forecast emerging economic zones",
  },
  hero_sub: {
    th: "ด้วยข้อมูลดาวเทียม THEOS-2 และ GISTDA Sphere API ผสานราคาประเมินที่ดินกรมธนารักษ์ พื้นที่นำร่อง: จังหวัดภูเก็ต",
    en: "Powered by THEOS-2 satellite AI, GISTDA Sphere API and Treasury Department land appraisal data. Pilot area: Phuket.",
  },
  cta: { th: "เข้าสู่แดชบอร์ด", en: "Explore Dashboard" },
  cta2: { th: "ดูระเบียบวิธี", en: "View Methodology" },
  pipeline: { th: "กระบวนการวิเคราะห์", en: "Analysis Pipeline" },
  step1: { th: "Input Data", en: "Input Data" },
  step1d: {
    th: "THEOS-2 AI, Sphere Transport / POI / Demographics API และ CSV ราคาประเมินที่ดิน",
    en: "THEOS-2 AI, Sphere Transport / POI / Demographics APIs and land appraisal CSV",
  },
  step2: { th: "Spatial Model", en: "Spatial Model" },
  step2d: {
    th: "Group By ตำบล + Min-Max Normalization ถ่วงน้ำหนักปัจจัยละ 20%",
    en: "Group by sub-district + Min-Max normalization, 20% weight per factor",
  },
  step3: { th: "Potential Score", en: "Potential Score" },
  step3d: {
    th: "คะแนนศักยภาพ 0–100 พร้อม Heatmap และการจัดอันดับ",
    en: "0–100 potential score with heatmap and rankings",
  },
  stat_zones: { th: "ตำบลที่วิเคราะห์", en: "Zones analysed" },
  stat_parcels: { th: "แปลงที่ดินในฐานข้อมูล", en: "Land parcels processed" },
  stat_factors: { th: "ปัจจัยถ่วงน้ำหนักเท่ากัน", en: "Equally weighted factors" },
  macro: { th: "ภาพรวมประเทศ", en: "Macro — Thailand" },
  micro: { th: "เจาะลึกภูเก็ต", en: "Micro — Phuket" },
  layers: { th: "ชั้นข้อมูล", en: "Layers" },
  l_heat: { th: "Heatmap ศักยภาพ", en: "Potential heatmap" },
  l_theos: { th: "การขยายตัวอาคาร THEOS-2", en: "THEOS-2 building expansion" },
  l_road: { th: "เส้นทางถนน", en: "Road network" },
  l_poi: { th: "ตำแหน่ง POI", en: "POI locations" },
  l_pop: { th: "ความหนาแน่นประชากร", en: "Population density" },
  l_price: { th: "ราคาประเมินที่ดิน", en: "Land appraisal value" },
  filters: { th: "ตัวกรอง", en: "Filters" },
  f_score: { th: "ช่วงคะแนนศักยภาพ", en: "Potential score range" },
  f_price: { th: "ช่วงราคาประเมิน (บาท/ตร.ว.)", en: "Appraisal range (THB/sq.wah)" },
  showing: { th: "แสดงผล", en: "Showing" },
  zones_unit: { th: "พื้นที่", en: "zones" },
  detail: { th: "รายละเอียดพื้นที่", en: "Zone detail" },
  pick_zone: {
    th: "คลิกพื้นที่บนแผนที่เพื่อดูรายละเอียด",
    en: "Click a zone on the map to see details",
  },
  score: { th: "คะแนนศักยภาพรวม", en: "Potential score" },
  avg_price: { th: "ราคาประเมินเฉลี่ย", en: "Average appraisal" },
  baht_wah: { th: "บาท/ตร.ว.", en: "THB/sq.wah" },
  poi_count: { th: "จำนวนจุด POI (รัศมี 2 กม.)", en: "POI count (2 km radius)" },
  road_dist: { th: "ระยะห่างถนนสายหลัก", en: "Distance to main road" },
  pop_density: { th: "ความหนาแน่นประชากร", en: "Population density" },
  theos_new: { th: "อาคารใหม่ที่ AI ตรวจจับ", en: "AI-detected new buildings" },
  parcels: { th: "แปลงที่ดิน", en: "parcels" },
  f_urban: { th: "การขยายตัวเมือง", en: "Urban expansion" },
  f_road: { th: "การเข้าถึงถนน", en: "Road proximity" },
  f_poi: { th: "ความหนาแน่น POI", en: "POI density" },
  f_pop: { th: "ประชากร", en: "Population" },
  f_price: { th: "ราคาประเมิน", en: "Appraisal" },
  rank_title: { th: "จัดอันดับพื้นที่ศักยภาพสูงสุด", en: "Top emerging areas" },
  search: { th: "ค้นหาตำบล / อำเภอ / จังหวัด", en: "Search sub-district / district / province" },
  export_csv: { th: "ส่งออก CSV", en: "Export CSV" },
  export_json: { th: "ส่งออก JSON", en: "Export JSON" },
  top10: { th: "เปรียบเทียบ 10 อันดับแรก", en: "Top 10 comparison" },
  th_rank: { th: "อันดับ", en: "Rank" },
  th_tumbon: { th: "ตำบล", en: "Sub-district" },
  th_amphur: { th: "อำเภอ", en: "District" },
  th_changwat: { th: "จังหวัด", en: "Province" },
  th_score: { th: "คะแนน", en: "Score" },
  th_price: { th: "ราคาประเมินเฉลี่ย", en: "Avg. appraisal" },
  method_title: { th: "ระเบียบวิธีและไปป์ไลน์", en: "Methodology & Pipeline" },
  method_intro: {
    th: "ทุกปัจจัยถูกถ่วงน้ำหนักเท่ากันที่ 20% และปรับมาตรฐานด้วย Min-Max Normalization เพื่อความโปร่งใสและปราศจากอคติ",
    en: "Every factor is weighted equally at 20% and standardised with Min-Max normalization for a fully unbiased, transparent score.",
  },
  about_title: { th: "เกี่ยวกับโครงการ", en: "About the project" },
  about_body: {
    th: "โครงการนี้พัฒนาขึ้นเพื่อสนับสนุนการวางผังเมือง การลงทุน และการตัดสินใจเชิงพื้นที่ ด้วยข้อมูลเปิดและภาพถ่ายดาวเทียมของไทย",
    en: "Built to support urban planning, investment and spatial decision-making using Thailand's open data and satellite imagery.",
  },
  contact: { th: "ติดต่อทีมพัฒนา", en: "Contact the team" },
  name: { th: "ชื่อ", en: "Name" },
  email: { th: "อีเมล", en: "Email" },
  message: { th: "ข้อความ", en: "Message" },
  send: { th: "ส่งข้อความ", en: "Send message" },
  sent: { th: "ส่งข้อความเรียบร้อยแล้ว", en: "Message sent" },
  data_sources: { th: "แหล่งข้อมูล", en: "Data sources" },
} as const;

export type Key = keyof typeof dict;

const Ctx = createContext<{ lang: Lang; setLang: (l: Lang) => void; t: (k: Key) => string }>({
  lang: "th",
  setLang: () => {},
  t: (k) => dict[k].th,
});

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>("th");
  useEffect(() => {
    const saved = localStorage.getItem("gsla-lang") as Lang | null;
    if (saved) setLang(saved);
  }, []);
  useEffect(() => {
    localStorage.setItem("gsla-lang", lang);
  }, [lang]);
  return (
    <Ctx.Provider value={{ lang, setLang, t: (k) => dict[k][lang] }}>{children}</Ctx.Provider>
  );
}

export const useI18n = () => useContext(Ctx);