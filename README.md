# Thai Growth Atlas

PROMPT: Interactive Web Dashboard - "Geo-Smart Location Analysis"

เป้าหมาย:

สร้าง Interactive Web Dashboard ชื่อ "Geo-Smart Location Analysis" สำหรับวิเคราะห์และคาดการณ์ศักยภาพ "พื้นที่เศรษฐกิจใหม่" (Emerging Economic Zones) ในประเทศไทย โดยใช้พื้นที่นำร่องหลักคือ จังหวัดภูเก็ต เชื่อมต่อข้อมูลจาก GISTDA Sphere API และประมวลผลไฟล์ราคาประเมินที่ดินกรมธนารักษ์ (CSV) 

เว็บไซต์ต้องรองรับ 2 ภาษา (TH/EN) พร้อมปุ่มสลับภาษาที่มุมขวาบนของทุกหน้า โทนสีเน้นความทันสมัยและน่าเชื่อถือ (Professional GIS Dashboard: Navy Blue #0F172A, Teal #0D9488, Slate Grey)

----------------------------------------------------------------------

1. การตั้งค่าระบบ และ แหล่งข้อมูล (Data Integration Setup)

----------------------------------------------------------------------

- GISTDA Sphere API Key หลัก: 4D27BCCC05294C9FA3C6EF01401D8942

  (ใช้สำหรับ Map Canvas Tiles, Sphere Transport API, Sphere POI API, Sphere Demographics API และ ขอบเขตตำบล/อำเภอ)

- ไฟล์ราคาประเมินที่ดิน (Local Data): 

  - ให้ระบบอ่านไฟล์ `attach_all_20240805.csv` ที่อยู่ในโฟลเดอร์ public/ โดยใช้ไลบรารี PapaParse 

  - ใช้โค้ด JavaScript ทำการ Group By ตามคอลัมน์ `TUMBON_NAME` (รวมถึง AMPHUR_NAME, CHANGWAT_NAME) และคำนวณหา "ค่าเฉลี่ยราคาประเมิน" (Average EVAPRICE) ของแต่ละตำบล

- THEOS-2 AI Layer: Mock Vector Polygon/Point แสดงพื้นที่ขยายตัวของสิ่งปลูกสร้างใหม่ที่ AI ตรวจจับได้จากดาวเทียม THEOS-2 (เน้นในพื้นที่ภูเก็ต)

----------------------------------------------------------------------

2. อัลกอริทึมคำนวณคะแนนศักยภาพ (100% Unbiased Scoring Algorithm)

----------------------------------------------------------------------

คำนวณ Potential Score (0–100) ของแต่ละพื้นที่โดยถ่วงน้ำหนักเท่ากันอย่างละ 20% จาก 5 ปัจจัย ผ่านสูตร Min-Max Normalization:

1. [Urban Expansion Rate - THEOS-2 AI Layer] (น้ำหนัก 20%)

   - สกัดความหนาแน่นสิ่งปลูกสร้างใหม่จากภาพดาวเทียม THEOS-2

   - Score = (ค่าอาคารใหม่ในโซน - 0) / (ค่าสูงสุดในไทย - 0) * 100

2. [Road Network Proximity - Sphere Transport API] (น้ำหนัก 20%)

   - ระยะห่างเฉลี่ยจากโซนไปยังถนนสายหลัก (เมตร)

   - Inverse Logic (ยิ่งใกล้ ยิ่งคะแนนสูง): 100 - [(ระยะทางจริง - 0m) / (5000m - 0m) * 100] (หากไกลกว่า 5km ได้ 0 คะแนน)

3. [Commercial POI Density - Sphere POI API] (น้ำหนัก 20%)

   - จำนวนสถานที่สำคัญ (ห้างสรรพสินค้า, สถานศึกษา, โรงพยาบาล, ตลาด) ในรัศมี 2 กม.

   - Score = (จำนวน POI จริง - 0) / (50 จุด - 0) * 100

4. [Population Density - Sphere Demographics API] (น้ำหนัก 20%)

   - ความหนาแน่นประชากรต่อ ตร.กม.

   - Score = (ความหนาแน่นจริง - 30) / (4000 - 30) * 100

5. [Land Appraisal Value - CSV Data: Average EVAPRICE] (น้ำหนัก 20%)

   - ค่าเฉลี่ยราคาประเมินที่ดินกรมธนารักษ์รายตำบล

   - Score = (ราคาประเมินเฉลี่ยจริง - 25) / (120000 - 25) * 100

*คะแนนรวม Potential Score = (Score1 * 0.2) + (Score2 * 0.2) + (Score3 * 0.2) + (Score4 * 0.2) + (Score5 * 0.2)*

----------------------------------------------------------------------

3. โครงสร้างหน้าเว็บและองค์ประกอบ UI (Page Structure & Components)

----------------------------------------------------------------------

[3.1 Navbar & Control Header]

- Logo "Geo-Smart Location Analysis"

- Navigation Menu: Home, Interactive Map, Top Rankings, Methodology, About

- ปุ่ม Switcher: Language Toggle (TH/EN) และ Dark/Light Mode

- API Status Indicator: แสดงสถานะการเชื่อมต่อ GISTDA Sphere API Key

[3.2 Page: Landing / Home]

- Hero Section: อธิบายจุดขาย "วิเคราะห์และคาดการณ์พื้นที่เศรษฐกิจใหม่ด้วยข้อมูลดาวเทียม THEOS-2 และ GISTDA Sphere API"

- Interactive Pipeline Infographic (3 Steps: Input Data -> Spatial Model -> Potential Score)

- ปุ่ม CTA "เข้าสู่แดชบอร์ด / Explore Dashboard"

[3.3 Page: Interactive Map Dashboard (หน้าหลักการทำงาน)]

- กลยุทธ์การแสดงผล 2 ระดับ (Two-Tier View):

  - [Macro View - ภาพรวมประเทศ]: แสดงแผนที่ประเทศไทยแบ่งตามพื้นที่/ตำบล แสดง Heatmap และราคาประเมินเฉลี่ยภาพรวม

  - [Micro View - เจาะลึกภูเก็ต]: พิกัดเริ่มต้น (Lat: 7.8804, Lon: 98.3923) เมื่อเลือกภูเก็ต ระบบจะแสดงขอบเขตตำบล ชี้จุด POI เส้นทางถนน และซ้อนทับชั้นข้อมูล THEOS-2 AI Layer

- Layer Control Panel: สวิตช์ เปิด-ปิด (Heatmap ศักยภาพ, การขยายตัวอาคาร THEOS-2, เส้นทางถนน, ตำแหน่ง POI, ความหนาแน่นประชากร, ราคาประเมินที่ดิน)

- Dynamic Filter Panel: ปรับสไลเดอร์กรอง ช่วงคะแนนศักยภาพ (0-100) และช่วงราคาประเมินที่ดิน

- Zone Detail Panel (Side Panel): เมื่อคลิกพื้นที่/ตำบลบนแผนที่ ให้สไลด์แถบข้างแสดง:

  - ชื่อตำบล/อำเภอ/จังหวัด

  - คะแนนรวม Potential Score (0-100) พร้อม Radar Chart แสดงคะแนนย่อยทั้ง 5 ปัจจัย

  - ค่าเฉลี่ยราคาประเมินที่ดินกรมธนารักษ์ (บาท/ตร.ว.)

  - จำนวนจุด POI และระยะห่างถนนสายหลัก

[3.4 Page: Top Emerging Rankings]

- ตารางจัดอันดับพื้นที่ที่มีศักยภาพสูงสุด (Top Emerging Areas) เรียงตาม Potential Score พร้อมระบบ Search และ Sort

- Bar Chart เปรียบเทียบ Top 10 พื้นที่ศักยภาพสูงสุด

- ปุ่ม "Export Data" (ดาวน์โหลดข้อมูลวิเคราะห์เป็น CSV / JSON)

[3.5 Page: Methodology & Pipeline]

- อธิบายกระบวนการวิเคราะห์เชิงพื้นที่ (Spatial Analytics Pipeline)

- แสดงสูตรการคำนวณ Min-Max Normalization และการถ่วงน้ำหนักปัจจัยละ 20% อย่างโปร่งใส

[3.6 Page: About / Contact]

- ข้อมูลวัตถุประสงค์โครงการ และฟอร์มติดต่อสอบถามสำหรับนักพัฒนา/หน่วยงานผังเมือง

----------------------------------------------------------------------

4. การจัดการ Loading State และ Error Handling

----------------------------------------------------------------------

- ระหว่างที่ PapaParse กำลังอ่านไฟล์ CSV หรือยิง API จาก Sphere ให้แสดง Skeleton Loader อย่างสวยงาม

- หากดึงข้อมูล API ไม่สำเร็จ ให้มีระบบ Fallback ไปใช้ข้อมูล Local Cache/CSV เพื่อให้ระบบแสดงผลหน้า Dashboard ได้ราบรื่นเสมอ

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://thai-growth-atlas.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/44bb12a4-c5d1-405c-a460-343a0fb217a1).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
