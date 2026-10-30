import { useState, useRef, useEffect } from "react"
import vfBanner  from "@/imports/_VF.jpg"
import bgBanner  from "@/imports/bg.jpg"
import bg2Banner from "@/imports/bg2.jpg"
import kqSheet   from "@/imports/KQ.jpg"
import card01 from "@/imports/card_01_the_go_getter.png"
import card02 from "@/imports/card_02_the_quick_fix.png"
import card03 from "@/imports/card_03_the_no_bs_bro.png"
import card04 from "@/imports/card_04_the_chaos_bro.png"
import card05 from "@/imports/card_05_the_overthinker.png"
import card06 from "@/imports/card_06_the_detective.png"
import card07 from "@/imports/card_07_the_lowkey_boss.png"
import card08 from "@/imports/card_08_the_chill_guy.png"
import card09 from "@/imports/card_09_the_people_bro.png"
import card10 from "@/imports/card_10_the_vibe_bro.png"
import card11 from "@/imports/card_11_the_main_character.png"
import card12 from "@/imports/card_12_the_yap_master.png"
import card13 from "@/imports/card_13_the_soft_bro.png"
import card14 from "@/imports/card_14_the_listener.png"
import card15 from "@/imports/card_15_the_big_bro.png"
import card16 from "@/imports/card_16_the_mom_friend.png"
import {
  LayoutDashboard, BookOpen, ClipboardList, Calendar, BarChart3,
  MessageSquare, Bell, LogOut, ChevronRight, ChevronDown,
  CheckCircle2, Clock, AlertTriangle, ArrowRight, Menu, X,
  FileText, Link2, Video, Upload, Bot, Zap, Trophy, Flame,
  Star, TrendingUp, Users, Play, Lock, CircleDot, Send,
  Paperclip, Filter, Search, UserCheck, Award, Target,
  BookMarked, Layers, Heart, Megaphone, HelpCircle, Eye,
  RefreshCw, CheckSquare, XSquare, PlusCircle, ChevronUp,
} from "lucide-react"
import {
  RadarChart, PolarGrid, PolarAngleAxis,
  Radar, ResponsiveContainer,
} from "recharts"

// ─── FWD Brand Palette ────────────────────────────────────────────────────────
const O  = "#F26522"  // FWD Orange
const DG = "#183028"  // FWD Dark Green
const BL = "#0097A9"  // FWD Blue
const LG = "#6ECEB2"  // FWD Light Green
const YL = "#FED141"  // FWD Yellow

// ─── Types ────────────────────────────────────────────────────────────────────
type Page = "dashboard" | "discover" | "rounds" | "learning" | "interview"
type LTab = "content" | "mini" | "simulation" | "branding"
type TTab = "direction" | "social" | "submissions" | "team" | "final"
type RTab = "score" | "status" | "history" | "mechanics"

// ─── Scoring System ────────────────────────────────────────────────────────────
// Max dimension pts: Cap=425, Com=163, Fit=413 (total 1001, rounds to 1000)
// V1 (500 max): Cap 55%, Com 10%, Fit 35%
// V2 (250 max): Cap 35%, Com 30%, Fit 35%
// V3 (250 max): Cap 25%, Com 15%, Fit 60%
const DIM_MAX = { cap: 425, com: 163, fit: 413 }

const rounds = [
  {
    id: "v1", name: "R1 – DISCOVER", emoji: "🌟",
    question: "Do you have capabilities?",
    color: BL, textColor: "#fff",
    max: 500, threshold: 60,
    candidatePct: 88, candidatePts: 440, status: "completed",
    earnedDim: { cap: 242, com: 44, fit: 154 },
    activities: [
      { name: "Behavior (Videos + MCQ + Critical Thinking)", pct: 95, cap: 55, com: 0,  fit: 35 },
      { name: "Completion",                                  pct: 5,  cap: 0,  com: 10, fit: 0  },
    ],
  },
  {
    id: "v2", name: "R2 – EXPERIENCE", emoji: "🔨",
    question: "Can you commit?",
    color: O, textColor: "#fff",
    max: 250, threshold: 70,
    candidatePct: 82, candidatePts: 205, status: "in_progress",
    earnedDim: { cap: 72, com: 62, fit: 72 },
    activities: [
      { name: "Essay + CV Enhancement (+10 early bonus)",        pct: 60, cap: 15, com: 20, fit: 25 },
      { name: "Learning (Scenario MCQ + Branding + AI content)", pct: 40, cap: 20, com: 10, fit: 10 },
    ],
  },
  {
    id: "v3", name: "R3 – PROVE", emoji: "🎯",
    question: "Are you the right fit, and can you create value?",
    color: LG, textColor: DG,
    max: 250, threshold: 75,
    candidatePct: null, candidatePts: 0, status: "locked",
    earnedDim: { cap: 0, com: 0, fit: 0 },
    activities: [
      { name: "Learning (Financial + FWD Products + Ethics MCQ)", pct: 30, cap: 15, com: 5,  fit: 10 },
      { name: "Participation (Team activities + Company tour + Q&A)", pct: 20, cap: 0,  com: 10, fit: 10 },
      { name: "Interview (Skills · Storytelling · Behavioral)",    pct: 50, cap: 10, com: 0,  fit: 40 },
    ],
  },
]

const bonusRules = [
  { type: "earn", pts: "+10", rule: "Hoàn thành tất cả challenges",       dim: "Commitment" },
  { type: "earn", pts: "+5",  rule: "Hoàn thành toàn bộ nội dung học tập", dim: "Capability" },
  { type: "earn", pts: "+5",  rule: "Đóng góp Q&A tích cực",               dim: "Commitment" },
  { type: "earn", pts: "+5",  rule: "Bonus challenge",                      dim: "Advisory Fit" },
  { type: "lose", pts: "−5",  rule: "Trễ deadline",                        dim: "Commitment" },
  { type: "lose", pts: "−10", rule: "Thiếu hoạt động bắt buộc",           dim: "Commitment" },
  { type: "lose", pts: "−5",  rule: "Nộp bài không hoàn chỉnh",           dim: "Advisory Fit" },
  { type: "lose", pts: "−20", rule: "Vi phạm quy định (Compliance issue)", dim: "All" },
]

// ─── Mock Data ────────────────────────────────────────────────────────────────
// V1(440) + V2(205) + bonus(25) - deduct(5) = 665 pts
// Cap: 242+72=314 / 425 = 74%, Com: 44+62+25-5=126 / 163 = 77%, Fit: 154+72=226 / 413 = 55%
const ME = { name: "In tơn húi", initials: "Fer", status: "qualified", progress: 67, totalScore: 665, maxScore: 1000, rank: 9, total: 156,
  dimPts: { cap: 314, com: 126, fit: 226 } }

const notifications = [
  { id: 1, type: "result",   title: "Kết quả Vòng 1 đã có!", body: "Bạn đạt 362 điểm — PASS. Tiếp tục vòng 2.", time: "Hôm nay 09:12", read: false },
  { id: 2, type: "deadline", title: "Deadline nộp CV còn 3 ngày", body: "Hạn chót: 15/08. Hãy nộp trước khi trễ hạn.", time: "Hôm qua", read: false },
  { id: 3, type: "announce", title: "AI Simulation Vòng 2 đã mở", body: "Hoàn thành trước 15/08 để nhận điểm thưởng.", time: "10/08", read: false },
  { id: 4, type: "feedback", title: "Phản hồi bài luận từ Mentor", body: "Tư duy rõ ràng, có chiều sâu cá nhân. Rất tốt!", time: "09/08", read: true },
  { id: 5, type: "announce", title: "Buổi Q&A với Agent thứ Tư 14/08", body: "Link Zoom sẽ gửi qua email trước 1 tiếng.", time: "08/08", read: true },
]

const courses = [
  { id: 1, title: "Giới thiệu nghề Advisor tài chính", type: "video", duration: "18 phút", status: "done",    required: true  },
  { id: 2, title: "Kỹ năng lắng nghe chủ động",        type: "video", duration: "22 phút", status: "done",    required: true  },
  { id: 3, title: "Phân tích nhu cầu khách hàng",       type: "video", duration: "30 phút", status: "active",  required: true  },
  { id: 4, title: "Sản phẩm bảo hiểm nhân thọ FWD",    type: "doc",   duration: "15 phút", status: "active",  required: true  },
  { id: 5, title: "Xử lý từ chối và phản đối",          type: "video", duration: "25 phút", status: "pending", required: true  },
  { id: 6, title: "Đạo đức nghề tư vấn",                type: "doc",   duration: "10 phút", status: "pending", required: false },
]

const mbtiQs = [
  { q: "Khi tham gia 1 sự kiện lớn, bạn thường...", a: [{ t: "Dễ dàng kết bạn và nói chuyện thoải mái", d: "E" }, { t: "Thích quan sát và chỉ giao tiếp khi cần", d: "I" }] },
  { q: "Khi giải quyết vấn đề, bạn thường...", a: [{ t: "Dựa vào dữ liệu và sự kiện cụ thể", d: "S" }, { t: "Dựa vào linh cảm và nhìn xa hơn sự kiện", d: "N" }] },
  { q: "Khi đưa ra quyết định, bạn...", a: [{ t: "Ưu tiên logic và sự công bằng khách quan", d: "T" }, { t: "Ưu tiên cảm xúc và sự hài hòa trong nhóm", d: "F" }] },
  { q: "Trong công việc hàng ngày, bạn thích...", a: [{ t: "Lên kế hoạch rõ ràng và theo đúng lịch", d: "J" }, { t: "Linh hoạt và điều chỉnh theo tình huống", d: "P" }] },
  { q: "Khi bị áp lực deadline, bạn thường...", a: [{ t: "Hoàn thành sớm để tránh lo lắng", d: "J" }, { t: "Làm tốt nhất có thể ngay trước deadline", d: "P" }] },
]

const miniQs = [
  { q: "Bước đầu tiên trong quy trình tư vấn tài chính là gì?", opts: ["Giới thiệu sản phẩm ngay lập tức", "Tìm hiểu nhu cầu và hoàn cảnh khách hàng", "Báo giá và so sánh sản phẩm", "Yêu cầu khách hàng ký hợp đồng"], ans: 1 },
  { q: "KYC trong tài chính là viết tắt của?", opts: ["Keep Your Customer", "Know Your Customer", "Key Year Contract", "Know Your Competition"], ans: 1 },
  { q: "Advisor nên làm gì khi khách hàng từ chối?", opts: ["Thuyết phục liên tục đến khi đồng ý", "Lắng nghe lý do và giải đáp cụ thể từng lo ngại", "Bỏ qua và tìm khách hàng mới", "Giảm giá sản phẩm ngay lập tức"], ans: 1 },
  { q: "Điều nào KHÔNG phải đặc điểm của Advisor chuyên nghiệp?", opts: ["Ưu tiên lợi ích khách hàng", "Cam kết lợi nhuận cố định cho khách hàng", "Cập nhật kiến thức thường xuyên", "Trung thực về rủi ro sản phẩm"], ans: 1 },
  { q: "Mục tiêu chính của buổi gặp tư vấn đầu tiên là gì?", opts: ["Ký kết hợp đồng bảo hiểm", "Xây dựng niềm tin và hiểu nhu cầu", "Thuyết trình toàn bộ danh mục sản phẩm", "Thu thập dữ liệu tài chính chi tiết"], ans: 1 },
]

const chatScenario = {
  customer: { name: "Bà Ngọc Lan", age: 45, initials: "NL", background: "Giáo viên về hưu sớm · 500 triệu tiết kiệm", concern: "Chưa từng đầu tư, lo lắng về rủi ro" },
  exchanges: [
    {
      msg: "Xin chào, tôi muốn tìm hiểu về sản phẩm đầu tư. Tôi có 500 triệu nhưng không biết gì về tài chính cả — liệu tôi có bị mất tiền không?",
      opts: [
        { id: "a", t: "Bà yên tâm, sản phẩm FWD bảo đảm 100% vốn, không thể mất tiền.", sc: 20, fb: "Không trung thực — không sản phẩm nào bảo đảm 100% vốn." },
        { id: "b", t: "Trước tiên, bà cho tôi hiểu mục tiêu tài chính và thời gian bà có thể để tiền được không ạ?", sc: 95, fb: "Xuất sắc! Tìm hiểu nhu cầu trước khi đề xuất sản phẩm." },
        { id: "c", t: "Đầu tư nào cũng có rủi ro, bà phải chấp nhận nếu muốn sinh lời cao.", sc: 40, fb: "Thiếu đồng cảm và chưa định hướng giải pháp cho khách hàng." },
        { id: "d", t: "Để tôi giới thiệu sản phẩm quỹ FWD — phù hợp nhất với người mới.", sc: 60, fb: "Tốt nhưng hơi vội — nên tìm hiểu nhu cầu trước." },
      ],
    },
    {
      msg: "Tôi muốn để tiền cho hưu trí 15 năm nữa và cần 50 triệu/năm để sinh hoạt. 500 triệu liệu có đủ không?",
      opts: [
        { id: "a", t: "Với tăng trưởng 8%/năm trong 15 năm, 500 triệu sẽ đạt khoảng 1,6 tỷ — đủ nhu cầu của bà.", sc: 82, fb: "Tốt — có tính toán cụ thể. Nên nêu thêm giả định rủi ro." },
        { id: "b", t: "Chúng ta cần lập kế hoạch chi tiết. Tôi sẽ gửi bà proposal đầy đủ trong 2 ngày làm việc.", sc: 90, fb: "Rất chuyên nghiệp — cam kết follow-up cụ thể." },
        { id: "c", t: "500 triệu thì hơi ít, bà nên tiết kiệm thêm nếu có thể.", sc: 25, fb: "Tiêu cực, thiếu giải pháp. Khách hàng cần được hỗ trợ, không phán xét." },
        { id: "d", t: "Tôi đề xuất chia 60% trái phiếu, 40% cổ phiếu để cân bằng rủi ro và lợi nhuận.", sc: 65, fb: "Khá tốt nhưng thiếu cá nhân hóa, chưa giải thích đủ lý do." },
      ],
    },
    {
      msg: "Tôi lo sợ bị lừa lắm. Trên mạng nhiều tin tức về lừa đảo tài chính. Làm sao tôi biết công ty chị đáng tin cậy?",
      opts: [
        { id: "a", t: "Bà hoàn toàn đúng khi cẩn thận. Tôi sẽ gửi giấy phép hoạt động, báo cáo kiểm toán và địa chỉ kiểm tra độc lập.", sc: 100, fb: "Hoàn hảo! Minh bạch tuyệt đối, tôn trọng quyền kiểm tra của khách hàng." },
        { id: "b", t: "FWD hoạt động 15 năm, có hàng triệu khách hàng tin tưởng. Bà không cần lo.", sc: 50, fb: "Chưa đủ thuyết phục — cần bằng chứng cụ thể, không chỉ lời nói." },
        { id: "c", t: "Mạng xã hội hay phóng đại, bà đừng đọc nhiều quá.", sc: 10, fb: "Phản tác dụng — thiếu tôn trọng mối lo ngại chính đáng của khách hàng." },
        { id: "d", t: "Tôi hiểu bà lo. Để tôi gửi thông tin công ty cho bà xem xét nhé.", sc: 68, fb: "Tốt, nhưng có thể chủ động hơn trong việc hỗ trợ bà kiểm tra thông tin." },
      ],
    },
  ],
}

const submissions = [
  { id: 1, title: "CV cá nhân",                   type: "cv",     status: "approved",        deadline: "2026-08-15", score: 95,   fb: "Hồ sơ chuyên nghiệp, ấn tượng." },
  { id: 2, title: 'Bài luận định hướng cá nhân',  type: "essay",  status: "approved",        deadline: "2026-08-18", score: 88,   fb: "Tư duy rõ ràng, có chiều sâu." },
  { id: 3, title: "Link LinkedIn Profile",         type: "link",   status: "needs_revision",  deadline: "2026-08-20", score: null, fb: "Cập nhật ảnh đại diện và mô tả kinh nghiệm." },
  { id: 4, title: "Video giới thiệu bản thân 60s", type: "video",  status: "submitted",       deadline: "2026-08-22", score: null, fb: null },
  { id: 5, title: "Chứng nhận MBTI",               type: "file",   status: "pending",         deadline: "2026-08-25", score: null, fb: null },
  { id: 6, title: "Link TikTok / Social Post",     type: "link",   status: "pending",         deadline: "2026-08-28", score: null, fb: null },
]

const teamActivities = [
  { id: 1, title: "Field Trip tại văn phòng FWD",    date: "16/08", type: "fieldtrip",  status: "upcoming",  pts: 50 },
  { id: 2, title: "Shadow Agent — theo chân Agent",   date: "19/08", type: "shadow",     status: "upcoming",  pts: 80 },
  { id: 3, title: "Q&A với Agent Senior",             date: "14/08", type: "qa",         status: "today",     pts: 30 },
  { id: 4, title: "Role-play: Xử lý từ chối khách",  date: "09/08", type: "roleplay",   status: "done",      pts: 60 },
  { id: 5, title: "Team Challenge: Pitch sản phẩm",  date: "05/08", type: "challenge",  status: "done",      pts: 100 },
]

const scoreHistory = [
  { date: "05/08", activity: "Hoàn thành V1 – Behavior MCQ",     delta: "+380", type: "pos", reason: "Cap +242 · Fit +154 · đạt 88%", dim: "cap+fit" },
  { date: "06/08", activity: "Completion V1",                     delta: "+60",  type: "pos", reason: "Com +44 · Bonus early +10+5+5",  dim: "com" },
  { date: "08/08", activity: "Nộp CV & Bài luận (V2)",           delta: "+112", type: "pos", reason: "Cap +40 · Com +42 · Fit +30",     dim: "all" },
  { date: "10/08", activity: "Learning V2 – Scenario MCQ",       delta: "+90",  type: "pos", reason: "Cap +32 · Com +18 · Fit +18 (+10 early)", dim: "cap+com+fit" },
  { date: "13/08", activity: "LinkedIn profile cần chỉnh sửa",   delta: "−5",   type: "neg", reason: "Com −5 (incomplete submission)",   dim: "com" },
  { date: "14/08", activity: "Q&A với Agent Senior",             delta: "+30",  type: "pos", reason: "Com +5 (bonus) · Participation +25", dim: "com+fit" },
]

const radarData = [
  { subject: "Capability",   value: 74, fullMark: 100 },
  { subject: "Commitment",   value: 77, fullMark: 100 },
  { subject: "Advisory Fit", value: 55, fullMark: 100 },
]

const supportHistory = [
  { id: 1, cat: "Điểm số", q: "Điểm Commitment của tôi bị trừ 15 điểm ở đâu?", status: "answered", time: "13/08", ans: "Điểm trừ do LinkedIn chưa đủ thông tin theo tiêu chí đánh giá. Vui lòng cập nhật và nộp lại." },
  { id: 2, cat: "Round",   q: "Vòng 2 có bắt buộc làm AI Simulation không?",    status: "answered", time: "10/08", ans: "Có, AI Simulation là bài bắt buộc và chiếm 30% điểm Vòng 2." },
  { id: 3, cat: "Kỹ thuật",q: "Tôi không upload được file CV, lỗi 413.",        status: "pending",  time: "14/08", ans: null },
]

const interviewSlots = [
  { date: "Mon 19/08", slots: ["09:00", "10:00", "14:00", "15:00"] },
  { date: "Tue 20/08", slots: ["09:00", "11:00", "13:00"] },
  { date: "Wed 21/08", slots: ["10:00", "14:00", "16:00"] },
  { date: "Thu 22/08", slots: ["09:00", "10:00", "15:00"] },
]

// ─── AI Test Center missions (R1 – Mission F) ─────────────────────────────────
const aiMissions = [
  {
    id: "m1", code: "M1", type: "case", pts: 50, duration: 10,
    name: "Case Study: Khách hàng trẻ, mới đi làm",
    emoji: "📊", status: "done", score: 45,
    desc: "Anh Minh, 26 tuổi, thu nhập 15tr/tháng, muốn bắt đầu đầu tư nhưng chưa có kiến thức.",
    questions: [
      { q: "Bước đầu tiên nên tư vấn điều gì cho Anh Minh?", opts: ["Giới thiệu sản phẩm đầu tư ngay lập tức","Tìm hiểu mục tiêu tài chính và thời hạn đầu tư","Đề xuất mua bảo hiểm nhân thọ","Yêu cầu bảng kê thu nhập chi tiết"], ans: 1 },
      { q: "Tỷ lệ tiết kiệm khuyến nghị cho người mới đi làm?", opts: ["5-10%","20-30%","50-60%","Không cần thiết"], ans: 1 },
      { q: "KYC trong tài chính là viết tắt của?", opts: ["Keep Your Capital","Know Your Customer","Key Year Contract","Know Your Competition"], ans: 1 },
      { q: "Quỹ khẩn cấp nên tương đương bao nhiêu tháng chi tiêu?", opts: ["1 tháng","3-6 tháng","12 tháng","2 năm"], ans: 1 },
      { q: "Rủi ro lớn nhất khi không có bảo hiểm nhân thọ là gì?", opts: ["Thiếu tiền hưu trí","Mất khả năng đầu tư","Gánh nặng tài chính cho gia đình khi rủi ro xảy ra","Chi phí y tế cao"], ans: 2 },
    ],
  },
  {
    id: "m2", code: "M2", type: "case", pts: 50, duration: 10,
    name: "Case Study: Chuẩn bị hưu trí",
    emoji: "👴", status: "done", score: 48,
    desc: "Bà Ngọc, 52 tuổi, giáo viên, còn 8 năm đến nghỉ hưu. Có 400 triệu tiết kiệm, lo lắng về tương lai.",
    questions: [
      { q: "Ưu tiên hàng đầu trong kế hoạch tài chính của Bà Ngọc?", opts: ["Tăng trưởng vốn tối đa","Bảo toàn vốn và tạo thu nhập ổn định","Đầu tư cổ phiếu tăng trưởng","Mua bất động sản"], ans: 1 },
      { q: "Danh mục đầu tư phù hợp cho người sắp nghỉ hưu?", opts: ["100% cổ phiếu tăng trưởng","70% trái phiếu + 30% cổ phiếu ổn định","100% tiết kiệm ngân hàng","50% crypto + 50% cổ phiếu"], ans: 1 },
      { q: "Advisor nên làm gì đầu tiên với khách hàng mới?", opts: ["Báo giá sản phẩm ngay","Xây dựng niềm tin và hiểu nhu cầu","Ký hợp đồng","Giới thiệu tất cả sản phẩm"], ans: 1 },
      { q: "Lạm phát ảnh hưởng thế nào đến kế hoạch hưu trí?", opts: ["Không ảnh hưởng","Làm giảm sức mua của tiền tiết kiệm","Tăng giá trị tiết kiệm","Chỉ ảnh hưởng ngắn hạn"], ans: 1 },
      { q: "Sản phẩm phù hợp nhất cho thu nhập ổn định khi nghỉ hưu?", opts: ["Quỹ tăng trưởng","Bảo hiểm hưu trí/annuity","Cổ phiếu vốn hóa nhỏ","Tiền kỹ thuật số"], ans: 1 },
    ],
  },
  {
    id: "m3", code: "M3", type: "game", pts: 40, duration: 5,
    name: "Classified Game — Phân loại hồ sơ",
    emoji: "🔍", status: "active", score: 0,
    desc: "Phân loại 8 hồ sơ khách hàng vào đúng nhóm rủi ro: Thấp / Trung bình / Cao.",
    profiles: [
      { name: "Anh Tuấn, 30t", detail: "30tr/th · Khỏe mạnh · Không nợ", correct: "low" },
      { name: "Chị Hoa, 45t", detail: "20tr/th · Bệnh tim · Nợ 200tr", correct: "high" },
      { name: "Anh Nam, 38t", detail: "50tr/th · Bình thường · Nợ 100tr", correct: "medium" },
      { name: "Bà Lan, 58t", detail: "10tr/th · Tiểu đường · Không nợ", correct: "high" },
    ],
  },
  {
    id: "m4", code: "M4", type: "game", pts: 30, duration: 5,
    name: "Find F — Tìm phản hồi đúng tinh thần FWD",
    emoji: "🎯", status: "locked", score: 0,
    desc: "Trong 6 tình huống, chọn phản hồi thể hiện đúng tinh thần FWD Advisor.",
    questions: [
      { q: "KH: 'Tôi không cần bảo hiểm vì tôi còn trẻ và khỏe.'", opts: ["'Đó là suy nghĩ sai lầm'","'Nếu bạn không thể đi làm 3 tháng vì ốm, bạn sẽ xoay sở thế nào?'","'Phí rẻ hơn khi mua lúc trẻ'","'Bảo hiểm là bắt buộc'"], ans: 1 },
      { q: "KH: 'Tôi sợ mất tiền khi đầu tư.'", opts: ["'Mọi đầu tư đều có rủi ro, chấp nhận thôi'","'Bà muốn đạt mục tiêu gì từ số tiền này trong bao lâu?'","'Quỹ FWD an toàn nhất thị trường'","'Tiết kiệm ngân hàng thì không mất tiền'"], ans: 1 },
      { q: "KH: 'Tôi đã có bảo hiểm y tế của công ty rồi.'", opts: ["'Vậy bạn không cần mua thêm'","'Bảo hiểm y tế công ty chỉ bảo vệ khi đi bệnh viện, còn nếu bạn không thể làm việc dài hạn thì sao?'","'Bảo hiểm công ty không đủ tốt'","'Mua thêm cho chắc'"], ans: 1 },
    ],
  },
]

// ─── Social Challenge per round ───────────────────────────────────────────────
const socialChallenges = [
  {
    roundId: "r1", round: "R1 – Mission F", active: false,
    topic: "My Perspective on Life Insurance",
    hashtags: ["#FWD", "#FProgram", "#MyPerspectiveOnLifeInsurance"],
    platforms: ["TikTok", "Facebook", "LinkedIn", "Instagram"],
    desc: "Chia sẻ quan điểm cá nhân của bạn về bảo hiểm nhân thọ — tại sao nó quan trọng với Gen Z.",
    status: "approved", pts: "+25", deadline: null,
    submittedPlatform: "TikTok", submittedLink: "https://tiktok.com/@minhanhle/video/123",
    feedback: "Nội dung authentic, góc nhìn tươi trẻ. Rất tốt!",
  },
  {
    roundId: "r2", round: "R2 – What kind of F", active: true,
    topic: "Personal Branding",
    hashtags: ["#FWDVietNam", "#FProgram", "#PersonalBranding"],
    platforms: ["LinkedIn", "Facebook", "Instagram"],
    desc: "Xây dựng thương hiệu cá nhân: Bạn muốn được biết đến là Advisor như thế nào? Chia sẻ câu chuyện, giá trị và mục tiêu nghề nghiệp.",
    status: "pending", pts: "+25", deadline: "2026-08-22",
    submittedPlatform: null, submittedLink: null, feedback: null,
  },
  {
    roundId: "r3", round: "R3 – Make your own F", active: false,
    topic: "Field Experience Content",
    hashtags: ["#FWD", "#FProgram", "#FieldExperience"],
    platforms: ["TikTok", "LinkedIn", "Instagram"],
    desc: "Ghi lại hành trình thực tế — shadow Agent, company tour, và trải nghiệm nghề Advisor đầu tiên của bạn.",
    status: "locked", pts: "+25", deadline: null,
    submittedPlatform: null, submittedLink: null, feedback: null,
  },
]

// ─── Round detail data ────────────────────────────────────────────────────────
const roundDetails = [
  {
    id: "r1", name: "R1 – Mission F", period: "1/4 – 22/4/2027",
    objective: "Chứng minh bạn có năng lực — kiến thức tài chính, tư duy phản biện và tinh thần FWD Advisor.",
    candidateQuota: 500, threshold: 60, candidatePct: 88, status: "completed",
    atRisk: false,
    activities: [
      { name: "AI Test Center", sub: "M1 & M2: Case Study (5 câu), M3: Classified Game, M4: Find F", weight: 95, cap: 55, com: 0, fit: 35, status: "done", deadline: "22/4/2027" },
      { name: "Social Challenge", sub: "#MyPerspectiveOnLifeInsurance — TikTok/FB/LinkedIn/IG", weight: 5, cap: 0, com: 10, fit: 0, status: "done", deadline: "22/4/2027" },
    ],
  },
  {
    id: "r2", name: "R2 – What kind of F are you", period: "22/4 – 6/5/2027",
    objective: "Khám phá và xây dựng bản sắc cá nhân — bạn là loại F nào trong hành trình Advisor?",
    candidateQuota: 250, threshold: 70, candidatePct: 82, status: "in_progress",
    atRisk: false, earlySlots: 12,
    activities: [
      { name: "CV Enhancement + Bài luận", sub: "Chọn hướng GAD/AD+ · Early +10đ first-come-first-served", weight: 60, cap: 15, com: 20, fit: 25, status: "done", deadline: "2026-08-18" },
      { name: "Learning Center 4 module", sub: "CV · Personal Branding · AI+MKT Tools · Career Pathway", weight: 40, cap: 20, com: 10, fit: 10, status: "in_progress", deadline: "2026-08-20" },
      { name: "Social Challenge #PersonalBranding", sub: "LinkedIn/Facebook/Instagram", weight: 0, cap: 0, com: 0, fit: 0, status: "pending", deadline: "2026-08-22", isBonus: true },
    ],
  },
  {
    id: "r3", name: "R3 – Make your own F", period: "6/5 – 20/5/2027",
    objective: "Chứng minh bạn là người phù hợp và có thể tạo ra giá trị thực trong môi trường Advisor.",
    candidateQuota: 60, threshold: 75, candidatePct: null, status: "locked",
    atRisk: false,
    activities: [
      { name: "Learning Center 2 module", sub: "Product Knowledge · Skill Building", weight: 30, cap: 15, com: 5, fit: 10, status: "locked", deadline: "20/5/2027" },
      { name: "Team Activities", sub: "GA Company Tour · Q&A với Agent Senior · Shadow Agent", weight: 20, cap: 0, com: 10, fit: 10, status: "locked", deadline: "20/5/2027" },
      { name: "Interview trực tiếp", sub: "GA Lead + AD+ Manager · Skills · Storytelling · Behavioral", weight: 50, cap: 10, com: 0, fit: 40, status: "locked", deadline: "20/5/2027" },
      { name: "Social Challenge #FieldExperience", sub: "TikTok/LinkedIn/Instagram", weight: 0, cap: 0, com: 0, fit: 0, status: "locked", deadline: "20/5/2027", isBonus: true },
    ],
  },
  {
    id: "r4", name: "R4 – Graduation", period: "25/5/2027",
    objective: "Office Matching — Bắt đầu hành trình 2 tháng tại HN/HCMC và trở thành Advisor chuyên nghiệp.",
    candidateQuota: 60, threshold: null, candidatePct: null, status: "locked",
    atRisk: false,
    activities: [
      { name: "Lễ Tốt nghiệp F Program", sub: "25/5/2027 · Văn phòng FWD HN/HCMC", weight: 0, cap: 0, com: 0, fit: 0, status: "locked", deadline: "25/5/2027" },
      { name: "Office Matching & Onboarding", sub: "Phân công văn phòng theo pathway GAD/AD+", weight: 0, cap: 0, com: 0, fit: 0, status: "locked", deadline: "25/5/2027" },
    ],
  },
]

// ─── Utility Components ───────────────────────────────────────────────────────

function StatusBadge({ status }: { status: string }) {
  const m: Record<string, { label: string; cls: string; dot: string }> = {
    qualified:     { label: "QUALIFIED",  cls: "bg-green-100 text-green-700",  dot: "bg-green-500" },
    at_risk:       { label: "AT RISK",    cls: "bg-amber-100 text-amber-700",  dot: "bg-amber-500" },
    not_qualified: { label: "NOT QUAL",   cls: "bg-red-100 text-red-700",      dot: "bg-red-500" },
    approved:      { label: "Approved",     cls: "bg-green-100 text-green-700",  dot: "bg-green-500" },
    submitted:     { label: "In Review",    cls: "bg-blue-100 text-blue-700",    dot: "bg-blue-400" },
    needs_revision:{ label: "Revision",     cls: "bg-amber-100 text-amber-700",  dot: "bg-amber-500" },
    pending:       { label: "Pending",      cls: "bg-gray-100 text-gray-500",    dot: "bg-gray-400" },
    answered:      { label: "Answered",     cls: "bg-green-100 text-green-700",  dot: "bg-green-500" },
    done:          { label: "Done",         cls: "bg-green-100 text-green-700",  dot: "bg-green-500" },
    today:         { label: "Today",        cls: "bg-orange-100 text-orange-700",dot: "bg-orange-500" },
    upcoming:      { label: "Upcoming",     cls: "bg-blue-100 text-blue-700",    dot: "bg-blue-400" },
    completed:     { label: "Pass ✓",       cls: "bg-green-100 text-green-700",  dot: "bg-green-500" },
    in_progress:   { label: "In Progress",  cls: "bg-orange-100 text-orange-700",dot: "bg-orange-500" },
    locked:        { label: "Locked",       cls: "bg-gray-100 text-gray-400",    dot: "bg-gray-300" },
    active:        { label: "Active",       cls: "bg-blue-100 text-blue-700",    dot: "bg-blue-400" },
  }
  const c = m[status] ?? { label: status, cls: "bg-gray-100 text-gray-500", dot: "bg-gray-400" }
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${c.cls}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
      {c.label}
    </span>
  )
}

function ProgressRing({ value, size = 96, sw = 7, color = O }: {
  value: number; size?: number; sw?: number; color?: string
}) {
  const r = (size - sw * 2) / 2
  const circ = 2 * Math.PI * r
  const off = circ - (value / 100) * circ
  const c = size / 2
  return (
    <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
      <circle cx={c} cy={c} r={r} fill="none" stroke="#EDD9C8" strokeWidth={sw} />
      <circle cx={c} cy={c} r={r} fill="none" stroke={color} strokeWidth={sw}
        strokeDasharray={circ} strokeDashoffset={off} strokeLinecap="round"
        style={{ transition: "stroke-dashoffset 0.9s cubic-bezier(.4,0,.2,1)" }} />
    </svg>
  )
}

function DeadlineChip({ deadline }: { deadline: string }) {
  const d = Math.ceil((new Date(deadline).getTime() - Date.now()) / 86400000)
  if (d <= 0) return <span className="text-xs font-semibold text-red-600 bg-red-50 px-2 py-0.5 rounded-full">Hết hạn</span>
  if (d <= 2) return <span className="text-xs font-semibold text-red-600 bg-red-50 px-2 py-0.5 rounded-full">⚡ Còn {d} ngày</span>
  if (d <= 7) return <span className="text-xs font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full">Còn {d} ngày</span>
  return <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full font-medium">Còn {d} ngày</span>
}

// ─── Notification Dropdown ─────────────────────────────────────────────────────

function NotifDropdown({ onClose }: { onClose: () => void }) {
  const [filter, setFilter] = useState("all")
  const typeIcon: Record<string, string> = { result: "🏆", deadline: "⏰", announce: "📢", feedback: "💬" }
  const typeLabel: Record<string, string> = { result: "Kết quả", deadline: "Deadline", announce: "Thông báo", feedback: "Feedback" }
  const filtered = filter === "all" ? notifications : notifications.filter(n => n.type === filter)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) onClose() }
    document.addEventListener("mousedown", h)
    return () => document.removeEventListener("mousedown", h)
  }, [onClose])

  return (
    <>
      {/* Mobile backdrop */}
      <div className="fixed inset-0 bg-black/40 z-40 lg:hidden" onClick={onClose} />
    <div ref={ref} className="
      fixed inset-x-3 top-1/2 -translate-y-1/2 z-50
      lg:absolute lg:inset-auto lg:right-0 lg:top-full lg:translate-y-0 lg:mt-2 lg:w-96
      w-auto bg-white rounded-2xl shadow-[0_8px_40px_rgba(24,48,40,0.18)] border border-gray-100 overflow-hidden
    ">
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
        <div>
          <div className="font-bold text-[#183028]">Thông báo</div>
          <div className="text-xs text-gray-400">{notifications.filter(n => !n.read).length} chưa đọc</div>
        </div>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-700"><X className="w-4 h-4" /></button>
      </div>
      <div className="flex gap-1 px-4 py-2.5 border-b border-gray-50 overflow-x-auto">
        {[["all","Tất cả"],["result","Kết quả"],["deadline","Deadline"],["announce","Thông báo"],["feedback","Feedback"]].map(([v,l]) => (
          <button key={v} onClick={() => setFilter(v)}
            className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${filter === v ? "text-white" : "bg-gray-100 text-gray-500 hover:bg-gray-200"}`}
            style={filter === v ? { backgroundColor: O } : {}}>
            {l}
          </button>
        ))}
      </div>
      <div className="max-h-80 overflow-y-auto divide-y divide-gray-50">
        {filtered.map(n => (
          <div key={n.id} className={`flex gap-3 px-4 py-3.5 hover:bg-gray-50 transition-colors ${!n.read ? "bg-orange-50/40" : ""}`}>
            <div className="text-xl flex-shrink-0 mt-0.5">{typeIcon[n.type]}</div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div className={`text-sm font-semibold ${!n.read ? "text-[#183028]" : "text-gray-600"}`}>{n.title}</div>
                {!n.read && <div className="w-2 h-2 rounded-full bg-[#F26522] flex-shrink-0 mt-1" />}
              </div>
              <div className="text-xs text-gray-500 mt-0.5 leading-relaxed">{n.body}</div>
              <div className="text-[10px] text-gray-400 mt-1">{n.time}</div>
            </div>
          </div>
        ))}
      </div>
      <div className="px-4 py-3 border-t border-gray-100 text-center">
        <button className="text-xs font-semibold text-[#F26522] hover:text-orange-700 transition-colors">Xem tất cả thông báo →</button>
      </div>
    </div>
    </>
  )
}

// ─── Sidebar ──────────────────────────────────────────────────────────────────

const navGroups = [
  { id: "main", items: [
    { id: "dashboard" as Page, Icon: LayoutDashboard, label: "Dashboard" },
  ]},
  { id: "journey", label: "Your Journey", items: [
    { id: "discover"  as Page, Icon: UserCheck, label: "Discover Your Agent F" },
    { id: "rounds"    as Page, Icon: Target,    label: "Rounds", badge: "R2 Active" },
  ]},
  { id: "resources", label: "Resources", items: [
    { id: "learning"  as Page, Icon: BookOpen, label: "Learning Hub", badge: "3 new" },
    { id: "interview" as Page, Icon: Calendar, label: "Interview Schedule" },
  ]},
]

function Sidebar({ page, setPage, open, toggle }: {
  page: Page; setPage: (p: Page) => void; open: boolean; toggle: () => void
}) {
  return (
    <>
      {open && <div className="fixed inset-0 bg-black/40 z-20 lg:hidden" onClick={toggle} />}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-30 w-64 flex flex-col
        transition-transform duration-300 ease-out
        ${open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `} style={{ backgroundColor: "#FFFFFF", borderRight: "1px solid rgba(242,101,34,0.12)" }}>
        {/* Brand */}
        <div className="flex items-center gap-3 px-5 py-5 border-b border-black/8">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center shadow-lg"
            style={{ backgroundColor: O }}>
            <Zap className="w-4 h-4 text-white fill-white" />
          </div>
          <div>
            <div className="font-bold text-sm leading-none" style={{ color: "#183028" }}>Gen Z Advocate</div>
            <div className="text-[11px] mt-0.5" style={{ color: "#6B4F3A" }}>FWD Candidate Portal</div>
          </div>
          <button onClick={toggle} className="ml-auto lg:hidden transition-colors" style={{ color: "#6B4F3A" }}>
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* User card */}
        <div className="mx-3 mt-3 mb-2 rounded-xl p-3.5" style={{ backgroundColor: "rgba(242,101,34,0.08)" }}>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
              style={{ backgroundColor: O }}>
              {ME.initials}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold truncate" style={{ color: "#183028" }}>{ME.name}</div>
              <div className="text-xs" style={{ color: "#6B4F3A" }}>R2 · EXPERIENCE</div>
            </div>
          </div>
          <div className="mt-3">
            <div className="flex justify-between text-xs mb-1.5">
              <span style={{ color: "#6B4F3A" }}>Tiến độ tổng</span>
              <span className="font-bold" style={{ color: "#183028" }}>{ME.progress}%</span>
            </div>
            <div className="h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: "rgba(242,101,34,0.15)" }}>
              <div className="h-full rounded-full transition-all duration-700" style={{ width: `${ME.progress}%`, backgroundColor: O }} />
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-2 overflow-y-auto space-y-4">
          {navGroups.map(g => (
            <div key={g.id}>
              {g.label && <div className="text-[10px] font-bold uppercase tracking-widest px-3 mb-1" style={{ color: "#6B4F3A" }}>{g.label}</div>}
              <div className="space-y-0.5">
                {g.items.map(({ id, Icon, label, badge }) => (
                  <button key={id}
                    onClick={() => { setPage(id); if (window.innerWidth < 1024) toggle() }}
                    className={`
                      w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150
                      ${page === id ? "text-white shadow-lg" : "text-stone-700"}
                    `}
                    style={page === id ? { backgroundColor: O, boxShadow: `0 0 18px rgba(232,119,34,0.35)` } : { backgroundColor: "transparent" }}
                    onMouseEnter={e => { if (page !== id) (e.currentTarget as HTMLElement).style.backgroundColor = "rgba(242,101,34,0.08)" }}
                    onMouseLeave={e => { if (page !== id) (e.currentTarget as HTMLElement).style.backgroundColor = "transparent" }}
                  >
                    <Icon className="w-4 h-4 flex-shrink-0" />
                    <span className="flex-1 text-left">{label}</span>
                    {badge && (
                      <span className={`text-xs font-bold px-1.5 py-0.5 rounded-full ${page === id ? "bg-white/20 text-white" : "text-white"}`}
                        style={page !== id ? { backgroundColor: O } : {}}>
                        {badge}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div className="px-3 pb-4 pt-3 border-t border-black/8 space-y-0.5">
          <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors" style={{ color: "#6B4F3A" }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.backgroundColor = "rgba(255,255,255,0.08)" }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.backgroundColor = "transparent" }}>
            <LogOut className="w-4 h-4" />Đăng xuất
          </button>
        </div>
      </aside>
    </>
  )
}

// ─── Header ───────────────────────────────────────────────────────────────────

function Header({ page, toggleSidebar }: { page: Page; toggleSidebar: () => void }) {
  const [notifOpen, setNotifOpen] = useState(false)
  const titles: Record<Page, string> = {
    dashboard:  "Dashboard",
    discover:   "Discover Your Agent F",
    rounds:     "Rounds",
    learning:   "Learning Hub",
    interview:  "Interview Schedule",
  }
  const unread = notifications.filter(n => !n.read).length

  return (
    <header className="bg-white border-b border-gray-100 h-14 flex items-center px-4 lg:px-6 gap-3 flex-shrink-0 relative">
      <button onClick={toggleSidebar} className="lg:hidden text-gray-400 hover:text-gray-700 transition-colors">
        <Menu className="w-5 h-5" />
      </button>
      <div className="flex items-center gap-2 text-sm">
        <span className="text-gray-400 hidden sm:inline">Gen Z Advocate</span>
        <ChevronRight className="w-3.5 h-3.5 text-gray-200 hidden sm:block" />
        <span className="font-semibold" style={{ color: DG }}>{titles[page]}</span>
      </div>
      <div className="ml-auto flex items-center gap-2.5">
        {/* Notification Bell */}
        <div className="relative">
          <button
            onClick={() => setNotifOpen(v => !v)}
            className="relative w-9 h-9 rounded-xl flex items-center justify-center transition-colors hover:bg-gray-100"
            style={{ color: DG }}
          >
            <Bell className="w-4.5 h-4.5" />
            {unread > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 rounded-full flex items-center justify-center text-white text-[9px] font-bold"
                style={{ backgroundColor: O }}>
                {unread}
              </span>
            )}
          </button>
          {notifOpen && <NotifDropdown onClose={() => setNotifOpen(false)} />}
        </div>
        {/* Score */}
        <div className="hidden sm:flex items-center gap-1.5 border rounded-lg px-3 py-1.5 text-sm"
          style={{ borderColor: "rgba(232,119,34,0.25)", backgroundColor: "#FEF3E8" }}>
          <Trophy className="w-3.5 h-3.5" style={{ color: O }} />
          <span className="font-bold" style={{ color: DG }}>{ME.totalScore}</span>
          <span className="text-gray-400">pts</span>
        </div>
        {/* Status badge */}
        <StatusBadge status={ME.status} />
        {/* Avatar */}
        <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold"
          style={{ backgroundColor: O }}>
          {ME.initials}
        </div>
      </div>
    </header>
  )
}

// ─── Dashboard ────────────────────────────────────────────────────────────────

function Dashboard({ setPage }: { setPage: (p: Page) => void }) {
  const phases = [
    { label: "R1 – DISCOVER",   sub: "1/4–22/4/2027",  st: "done"     },
    { label: "R2 – EXPERIENCE", sub: "22/4–6/5/2027",  st: "active"   },
    { label: "R3 – PROVE",      sub: "6/5–20/5/2027",  st: "upcoming" },
    { label: "R4 – BECOME",     sub: "25/5/2027",       st: "upcoming" },
  ]
  const dims = [
    { label: "Capability",   val: radarData[0].value, pts: ME.dimPts.cap, color: O  },
    { label: "Commitment",   val: radarData[1].value, pts: ME.dimPts.com, color: LG },
    { label: "Advisory Fit", val: radarData[2].value, pts: ME.dimPts.fit, color: BL },
  ]
  // Current round: R2
  const currentRound = { name: "R2", score: 82, threshold: 70, daysLeft: 4, deadline: "6/5/2027", maxPts: 250 }

  return (
    <div className="p-4 lg:p-6 space-y-5 max-w-6xl mx-auto w-full">
      {/* Welcome */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight" style={{ color: DG }}>Chào In tơn húi </h1>
          <p className="text-gray-500 mt-1 text-sm">Bạn đang ở <span className="font-semibold" style={{ color: DG }}>Vòng 2 · AI Simulation</span> — còn 4 ngày để hoàn thành.</p>
        </div>
        <div className="flex items-center gap-3 flex-shrink-0">
          <div className="text-right hidden sm:block">
            <div className="text-2xl font-bold" style={{ color: DG }}>#{ME.rank}</div>
            <div className="text-xs text-gray-400">/ {ME.total} ứng viên</div>
          </div>
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ backgroundColor: "#FEF3E8" }}>
            <Trophy className="w-7 h-7" style={{ color: O }} />
          </div>
        </div>
      </div>

      {/* Hero banners — both locked to vfBanner's exact 1535:1024 ratio */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="rounded-2xl overflow-hidden" style={{ aspectRatio: "1535/1024" }}>
          <img src={vfBanner} alt="FWD Gen Z Advocate — Đặc Vụ F"
            className="w-full h-full object-cover object-center" />
        </div>
        <div className="rounded-2xl overflow-hidden" style={{ aspectRatio: "1535/1024" }}>
          <img src={bg2Banner} alt="FWD Gen Z Advocate team activity"
            className="w-full h-full object-cover object-center" />
        </div>
      </div>

      {/* Journey timeline + threshold bar */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5 lg:p-6">
        <div className="flex items-center justify-between mb-5">
          <div className="text-xs font-bold text-gray-400 uppercase tracking-widest">Hành trình F Program</div>
          <button onClick={() => setPage("rounds")} className="text-xs font-semibold transition-colors hover:opacity-70" style={{ color: O }}>
            Xem chi tiết vòng →
          </button>
        </div>
        <div className="relative">
          <div className="absolute top-5 left-5 right-5 h-0.5" style={{ backgroundColor: "#EDD9C8" }} />
          <div className="absolute top-5 left-5 h-0.5" style={{ backgroundColor: O, width: "30%" }} />
          <div className="relative flex justify-between">
            {phases.map((p, i) => (
              <div key={i} className="flex flex-col items-center gap-2.5 max-w-[90px]">
                <div className={`relative w-10 h-10 rounded-full border-2 z-10 flex items-center justify-center`}
                  style={{
                    backgroundColor: p.st === "done" ? O : p.st === "active" ? "white" : "white",
                    borderColor: p.st === "upcoming" ? "#EDD9C8" : O,
                    color: p.st === "done" ? "white" : p.st === "active" ? O : "#B0C4BB",
                    boxShadow: p.st === "active" ? `0 0 0 5px rgba(232,119,34,0.15)` : undefined,
                  }}>
                  {p.st === "done" ? <CheckCircle2 className="w-5 h-5" /> :
                   p.st === "active" ? <CircleDot className="w-5 h-5" /> :
                   <Lock className="w-4 h-4" />}
                  {p.st === "active" && (
                    <span className="absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full" style={{ backgroundColor: O }}>
                      <span className="absolute inset-0 rounded-full animate-ping opacity-60" style={{ backgroundColor: O }} />
                    </span>
                  )}
                </div>
                <div className="text-center">
                  <div className="text-[11px] font-semibold leading-tight" style={{ color: p.st === "upcoming" ? "#B0C4BB" : DG }}>{p.label}</div>
                  <div className="text-[10px] text-gray-400 mt-0.5">{p.sub}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Current round progress */}
        <div className="mt-5 pt-5 border-t border-gray-50">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold" style={{ color: DG }}>R2 — EXPERIENCE · Current Progress</span>
            <div className="flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 text-red-400" />
              <span className="text-xs font-bold text-red-500">4 days left · 6/5/2027</span>
            </div>
          </div>
          <div className="h-4 rounded-full overflow-hidden" style={{ backgroundColor: "#F5E8DC" }}>
            <div className="h-full rounded-full flex items-center justify-end pr-2 transition-all duration-700"
              style={{ width: `${currentRound.score}%`, backgroundColor: LG }}>
              <span className="text-[10px] font-black text-white">{currentRound.score}%</span>
            </div>
          </div>
          <div className="flex justify-between text-[10px] text-gray-400 mt-1.5">
            <span>0%</span>
            <span className="font-semibold text-green-600">✓ On track</span>
            <span>100%</span>
          </div>
        </div>
      </div>

      {/* Score rings + CTA */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 p-5 lg:p-6">
          <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-5">Điểm số theo chiều cạnh</div>
          <div className="grid grid-cols-3 gap-4">
            {dims.map(d => (
              <div key={d.label} className="flex flex-col items-center gap-3">
                <div className="relative">
                  <ProgressRing value={d.val} color={d.color} />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xl font-bold" style={{ color: DG }}>{d.val}</span>
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-xs font-semibold" style={{ color: DG }}>{d.label}</div>
                  <div className="mt-0.5 text-[10px] font-semibold" style={{ color: d.val >= 75 ? "#22A262" : d.val >= 60 ? O : "#D93025" }}>
                    {d.val >= 75 ? "✓ Tốt" : d.val >= 60 ? "△ Khá" : "Cần cải thiện"}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="rounded-2xl p-5 flex flex-col" style={{ backgroundColor: O }}>
          <div className="flex items-center gap-2 mb-3">
            <Flame className="w-4 h-4 text-white/80" />
            <span className="text-[11px] font-bold uppercase tracking-widest text-white/80">Ưu tiên cao nhất</span>
          </div>
          <div className="text-white font-bold text-base leading-snug">Hoàn thành AI Simulation Vòng 2</div>
          <p className="text-white/85 text-sm mt-2 leading-relaxed flex-1">3 tình huống khách hàng · ~30 phút · Còn 4 ngày.</p>
          <div className="mt-4 space-y-3">
            <div className="flex items-center gap-2 text-xs">
              <Clock className="w-3.5 h-3.5 text-white" />
              <span className="text-white font-semibold">Hạn: 15/08</span>
              <span className="ml-auto text-white/70">+150 pts</span>
            </div>
            <button onClick={() => setPage("learning")}
              className="w-full text-white rounded-xl py-3 text-sm font-bold flex items-center justify-center gap-2 transition-all active:scale-95 hover:brightness-110 border border-white/30"
              style={{ backgroundColor: "rgba(255,255,255,0.18)" }}>
              Bắt đầu ngay <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Discover Your Agent F banner */}
      <div className="rounded-2xl p-5 flex items-center gap-4 cursor-pointer transition-all hover:opacity-90 active:scale-[0.99]"
        onClick={() => setPage("discover")}
        style={{ background: `linear-gradient(135deg, ${O} 0%, #E84800 100%)` }}>
        <div className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 text-2xl"
          style={{ backgroundColor: `${LG}25` }}>🌟</div>
        <div className="flex-1 min-w-0">
          <div className="text-xs font-bold uppercase tracking-widest mb-0.5" style={{ color: LG }}>Personality Assessment</div>
          <div className="text-white font-black text-lg leading-tight">DISCOVER YOUR AGENT F</div>
          <div className="text-white/80 text-xs mt-0.5">Find out your Agent personality type · ~5 minutes</div>
        </div>
        <ArrowRight className="w-6 h-6 flex-shrink-0 text-white/70" />
      </div>

      {/* Recent activity */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="text-xs font-bold text-gray-400 uppercase tracking-widest">Hoạt động gần đây</div>
          <button onClick={() => setPage("rounds")} className="text-xs font-semibold transition-colors hover:opacity-70" style={{ color: O }}>Xem tất cả →</button>
        </div>
        <div className="divide-y divide-gray-50">
          {scoreHistory.slice(0, 4).map((item, i) => (
            <div key={i} className="flex items-center gap-3.5 py-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${item.type === "pos" ? "bg-green-50" : "bg-red-50"}`}>
                {item.type === "pos" ? <TrendingUp className="w-3.5 h-3.5 text-green-600" /> : <AlertTriangle className="w-3.5 h-3.5 text-red-500" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold truncate" style={{ color: DG }}>{item.activity}</div>
                <div className="text-xs text-gray-400">{item.date}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── Discover Your Agent F — Agent F: The First Mission ─────────────────────

const agentMissions = [
  {
    id: "01", emoji: "📂", accent: "#0097A9",
    caseId: "CASE FILE 001: NHẬN NHIỆM VỤ", title: "THE BRIEF",
    scene: ["#0D3A4A","#0097A9","#1A5A6A"],
    scenario: "Bạn vừa nhận được hồ sơ của một vụ án mới. Brief chỉ có vài dòng, nhưng càng đọc bạn càng nhận ra vẫn còn một số thông tin chưa thật sự rõ. Trước khi bắt tay vào mission, bạn sẽ...",
    choices: [
      { label: "A", text: "Tự hệ thống lại những gì đã có, xác định các điểm còn thiếu và tìm thêm thông tin cần thiết.", value: "R" },
      { label: "B", text: "Trao đổi với người giao nhiệm vụ để hiểu thêm bối cảnh và điều họ thực sự đang cần.", value: "E" },
    ],
  },
  {
    id: "02", emoji: "📡", accent: "#6ECEB2",
    caseId: "CASE FILE 002: TÍN HIỆU ĐẦU TIÊN", title: "THE FIRST CONTACT",
    scene: ["#1C0800","#2D1000","#3D1800"],
    scenario: "Manh mối đầu tiên dẫn bạn đến một người mà bạn chưa từng làm việc cùng. Bạn chỉ có vài phút để bắt đầu cuộc trao đổi, nhưng cách mở đầu có thể quyết định rất nhiều về những gì bạn tìm được sau đó. Bạn sẽ...",
    choices: [
      { label: "A", text: "Bắt đầu bằng những thông tin liên quan trực tiếp đến mission để nhanh chóng hiểu hai bên có thể phối hợp như thế nào.", value: "R" },
      { label: "B", text: "Bắt đầu bằng một cuộc trò chuyện tự nhiên để cả hai cảm thấy thoải mái hơn trước khi đi vào mission.", value: "E" },
    ],
  },
  {
    id: "03", emoji: "🔐", accent: "#F26522",
    caseId: "CASE FILE 003: HAI MANH MỐI", title: "THE CROSSROAD",
    scene: ["#2A1A0D","#7A3210","#F26522"],
    scenario: "Sau một hồi điều tra, bạn tìm được hai manh mối. Cả hai đều có lý và đều có thể dẫn đến đáp án. Nhưng bạn chỉ có thể chọn một hướng để đi tiếp. Bạn sẽ...",
    choices: [
      { label: "A", text: "Chọn phương án có cơ sở rõ ràng hơn và bắt đầu hành động.", value: "B" },
      { label: "B", text: "Trao đổi thêm với những người liên quan để cân nhắc các góc nhìn trước khi chốt.", value: "S" },
    ],
  },
  {
    id: "04", emoji: "🧩", accent: "#FED141",
    caseId: "CASE FILE 004: MANH MỐI KHÁC BIỆT", title: "THE DIFFERENT VIEW",
    scene: ["#2A2A0D","#5A4A10","#FED141"],
    scenario: "Trong lúc điều tra, một Agent trong team đưa ra một cách nhìn hoàn toàn khác với bạn. Bạn không chắc mình đồng ý với cách đó. Nhưng biết đâu, chính góc nhìn này lại đang giữ một manh mối quan trọng. Bạn sẽ...",
    choices: [
      { label: "A", text: "Chia sẻ thẳng góc nhìn của mình, sau đó cùng tìm ra phương án hợp lý nhất.", value: "B" },
      { label: "B", text: "Hỏi thêm để hiểu vì sao Agent ấy nhìn vấn đề theo hướng đó, rồi mới đưa ra quan điểm của mình.", value: "S" },
    ],
  },
  {
    id: "05", emoji: "🗺️", accent: "#0097A9",
    caseId: "CASE FILE 005: TRƯỚC GIỜ G", title: "THE PLAN",
    scene: ["#0D1A3A","#0D3A6A","#0097A9"],
    scenario: "Bạn đã xác định được hướng điều tra. Mission chính thức sẽ bắt đầu vào ngày mai. Mục tiêu đã rõ, nhưng cách triển khai vẫn còn khá mở. Tối nay, bạn sẽ...",
    choices: [
      { label: "A", text: "Phác trước những bước chính để ngày mai có một direction rõ ràng.", value: "P" },
      { label: "B", text: "Giữ mục tiêu trong đầu, còn cách triển khai cụ thể sẽ quyết định dựa trên tình hình thực tế.", value: "I" },
    ],
  },
  {
    id: "06", emoji: "🚨", accent: "#D93025",
    caseId: "CASE FILE 006: MẬT LỆNH MỚI", title: "THE TWIST",
    scene: ["#2A0D0D","#6A1A1A","#D93025"],
    scenario: "3 tiếng trước giờ G. Một thông tin mới xuất hiện. Nó khiến một phần kế hoạch ban đầu không còn phù hợp. Bạn sẽ...",
    choices: [
      { label: "A", text: "Dừng lại một nhịp, sắp xếp lại những phần cần thay đổi rồi tiếp tục theo plan mới.", value: "P" },
      { label: "B", text: "Giữ mục tiêu ban đầu và điều chỉnh cách làm ngay trong lúc triển khai.", value: "I" },
    ],
  },
  {
    id: "07", emoji: "🕵🏻", accent: "#6ECEB2",
    caseId: "CASE FILE 007: MANH MỐI NGOÀI HỒ SƠ", title: "THE UNEXPECTED CLUE",
    scene: ["#1C0800","#2D1000","#3D2000"],
    scenario: "Mission đang diễn ra khá suôn sẻ thì bạn phát hiện một manh mối không nằm trong hồ sơ ban đầu. Nó không chắc chắn, nhưng có vẻ đáng để tìm hiểu. Bạn sẽ...",
    choices: [
      { label: "A", text: "Chủ động tìm cách khai thác manh mối này vì biết đâu nó lại mở ra một hướng mới.", value: "H" },
      { label: "B", text: "Cân nhắc xem manh mối này có thực sự cần thiết trước khi quyết định có đổi hướng điều tra hay không.", value: "C" },
    ],
  },
  {
    id: "08", emoji: "🔓", accent: "#F26522",
    caseId: "CASE FILE 008: MISSION COMPLETE?", title: "THE FINAL MOVE",
    scene: ["#1A0D2A","#3A1A5A","#7A3A9A"],
    scenario: "Sau một hành trình dài, bạn đã thu thập gần đủ các manh mối. Hồ sơ đã rõ hơn rất nhiều, nhưng mission tiếp theo vẫn chưa bắt đầu. Trước khi rời khỏi Agency, bạn sẽ...",
    choices: [
      { label: "A", text: "Xem trước mission tiếp theo để biết mình sẽ cần chuẩn bị những gì.", value: "H" },
      { label: "B", text: "Đóng hồ sơ lại, nghỉ một chút và để dành năng lượng cho mission tiếp theo.", value: "C" },
    ],
  },
]

type AgentProfile = {
  name: string; color: "RED"|"BLUE"|"YELLOW"|"GREEN"; colorHex: string; bgHex: string
  hashtags: string[]; desc: string; dimensions: string; fit: number; bua: string; slogan: string
}
const agentProfiles: Record<string, AgentProfile> = {
  RSPH: { name: "The Go-Getter",    color:"RED",    colorHex:"#DC2626", bgHex:"#FEF2F2",
    hashtags:["#lets_get_it","#mission_on"],
    desc:"Fen đã muốn là Fen làm. Không thích ngồi quá lâu để suy nghĩ xem có nên bắt đầu hay không. Có mục tiêu là Fen tự động bật mode hành động, vừa làm vừa chỉnh, miễn sao mission vẫn tiến về phía trước.",
    dimensions:"Rational · Soft · Planner · Hunter", fit:94,
    bua:"📓 To-do list — viết ra để còn tick cho đã", slogan:"Gánh GDP cả nước" },
  RSIH: { name: "The Quick Fix",    color:"RED",    colorHex:"#DC2626", bgHex:"#FEF2F2",
    hashtags:["#figure_it_out","#we_move"],
    desc:"Fen không cần mọi thứ hoàn hảo mới bắt đầu. Có vấn đề thì xử lý, plan đổi thì đổi theo. Khá giỏi xoay sở khi mọi thứ không diễn ra như dự kiến, không đứng hình quá lâu.",
    dimensions:"Rational · Soft · Improviser · Hunter", fit:91,
    bua:"🎧 Tai nghe — bật nhạc lên rồi xử lý", slogan:"Bạn ấy đã nói như vậy thì mọi người cứ ok đi" },
  RBPH: { name: "The No-BS Bro",    color:"RED",    colorHex:"#DC2626", bgHex:"#FEF2F2",
    hashtags:["#straight_to_the_point","#say_less_do_more"],
    desc:"Fen thích mọi thứ rõ ràng. Đã làm thì phải biết đang làm gì, vì sao làm và bước tiếp theo là gì. Không thích vòng vo, nhưng cũng không hành động bừa — đã move là có tính toán.",
    dimensions:"Rational · Bold · Planner · Hunter", fit:98,
    bua:"⌚ Đồng hồ — đúng giờ, đúng việc, đúng deadline", slogan:"E nói này chị đừng buồn nha" },
  RBIH: { name: "The Chaos Bro",    color:"RED",    colorHex:"#DC2626", bgHex:"#FEF2F2",
    hashtags:["#bring_it_on","#idk_but_i_got_this"],
    desc:"Càng bất ngờ, Fen càng bật mode. Fen không quá phụ thuộc vào script. Có chuyện phát sinh thì xử lý ngay tại trận, đôi khi còn nghĩ ra cách giải quyết mà lúc đầu chính Fen cũng không biết mình sẽ làm thế nào.",
    dimensions:"Rational · Bold · Improviser · Hunter", fit:96,
    bua:"🕶️ Kính râm — đeo vào là tự tin hơn 20%", slogan:"Tui oánh cái nha, tui oánh đau lắm á." },
  RSPC: { name: "The Overthinker",  color:"BLUE",   colorHex:"#2563EB", bgHex:"#EFF6FF",
    hashtags:["#lemme_think","#wait_a_min"],
    desc:"Fen không thích quyết định khi chưa đủ information. Thường muốn nhìn toàn cảnh, cân nhắc các khả năng và chuẩn bị trước một vài đường đi. Có thể hơi lâu một nhịp, nhưng một khi đã quyết thì khá chắc tay.",
    dimensions:"Rational · Soft · Planner · Chill", fit:82,
    bua:"💻 Laptop — mở lên là bắt đầu research", slogan:"Biết là vội rồi nhưng brief đầy đủ 1 tí được ko" },
  RSIC: { name: "The Detective",    color:"BLUE",   colorHex:"#2563EB", bgHex:"#EFF6FF",
    hashtags:["#read_the_room","#connect_the_dots"],
    desc:"Fen thích tìm cái nằm phía sau vấn đề. Không chỉ nhìn vào chuyện đang xảy ra mà còn muốn biết nguyên nhân, context và những detail nhỏ có thể đang bị bỏ sót.",
    dimensions:"Rational · Soft · Improviser · Chill", fit:86,
    bua:"🔍 Kính lúp — detail nhỏ cũng không thoát được Fen", slogan:"Fen tôi đấy, kĩ tính, tìm tòi, tôn trọng" },
  RBPC: { name: "The Lowkey Boss",  color:"BLUE",   colorHex:"#2563EB", bgHex:"#EFF6FF",
    hashtags:["#ive_got_a_plan","#keep_it_together"],
    desc:"Fen không cần ồn để lead. Thích có structure, biết mình muốn gì và thường chủ động sắp xếp mọi thứ trước khi bắt tay vào làm. Khi team bắt đầu hơi loạn, Fen có xu hướng tự nhiên kéo mọi người về lại đường ray.",
    dimensions:"Rational · Bold · Planner · Chill", fit:94,
    bua:"📋 Checklist — chưa tick hết thì chưa ngủ", slogan:"Ăm chã húi thương các bà chã hơm" },
  RBIC: { name: "The Chill Guy",    color:"BLUE",   colorHex:"#2563EB", bgHex:"#EFF6FF",
    hashtags:["#keep_calm","#no_stress"],
    desc:"Fen có một skill khá hiếm: không hoảng theo người khác. Có thể xử lý tình huống trực diện nhưng vẫn giữ được cái đầu lạnh. Không cần mọi thứ diễn ra đúng plan — Fen tin mình đủ tỉnh để xoay tiếp.",
    dimensions:"Rational · Bold · Improviser · Chill", fit:90,
    bua:"☕ Cà phê — emergency kit của mọi ngày đi làm", slogan:"Không nên can thiệp vào nhân quả của người khác" },
  ESPH: { name: "The People Bro",   color:"YELLOW", colorHex:"#D97706", bgHex:"#FFFBEB",
    hashtags:["#people_person","#good_vibes_only"],
    desc:"Fen làm việc bằng connection. Thường chủ động bắt chuyện, tìm điểm chung và khiến người khác cảm thấy thoải mái. Fen tin rằng khi mọi người work well together thì chuyện khó cũng dễ hơn một chút.",
    dimensions:"Empathy · Soft · Planner · Hunter", fit:93,
    bua:"☕ Coffee — không coffee thì sao mà nói chuyện", slogan:"Cơ địa khó thất nghiệp" },
  ESIH: { name: "The Vibe Bro",     color:"YELLOW", colorHex:"#D97706", bgHex:"#FFFBEB",
    hashtags:["#go_with_the_flow","#match_the_energy"],
    desc:"Fen đọc mood nhanh hơn đọc instruction. Không quá thích một cách làm cứng nhắc. Fen thường quan sát tình hình rồi tự điều chỉnh cách giao tiếp, cách phối hợp và cách xử lý cho hợp vibe.",
    dimensions:"Empathy · Soft · Improviser · Hunter", fit:95,
    bua:"🎧 Playlist — mood nào cũng có bài", slogan:"Hài hước mà tưởng mình vô duyên" },
  EBPH: { name: "The Main Character",color:"YELLOW",colorHex:"#D97706", bgHex:"#FFFBEB",
    hashtags:["#know_your_worth","#lets_do_this"],
    desc:"Fen hiểu người, nhưng Fen cũng biết mình muốn gì. Không chỉ quan tâm đến cảm xúc của mọi người mà còn có khả năng chủ động đưa mọi thứ tiến lên. Đã chuẩn bị thì khá quyết, đã chọn thì không ngại đứng ra lead.",
    dimensions:"Empathy · Bold · Planner · Hunter", fit:97,
    bua:"📱 Điện thoại — calendar, notes, contacts, tất cả trong một", slogan:"Cảnh báo có yasssss" },
  EBIH: { name: "The Yap Master",   color:"YELLOW", colorHex:"#D97706", bgHex:"#FFFBEB",
    hashtags:["#let_me_tell_you","#match_my_energy"],
    desc:"Fen có thể biến một cuộc họp 15 phút thành podcast 45 phút. Nhưng đằng sau cái \"yap\" là khả năng ứng biến và bắt nhịp người đối diện rất nhanh. Không sợ awkward silence — vì Fen luôn có chuyện để nói.",
    dimensions:"Empathy · Bold · Improviser · Hunter", fit:99,
    bua:"🎤 Micro — đã cầm là khó trả", slogan:"Đang thu thập dữ liệu xã hội." },
  ESPC: { name: "The Soft Bro",     color:"GREEN",  colorHex:"#16A34A", bgHex:"#F0FDF4",
    hashtags:["#people_first","#take_it_easy"],
    desc:"Fen không thích làm mọi thứ căng hơn mức cần thiết. Thường quan sát cảm xúc của mọi người, thích chuẩn bị kỹ và muốn mọi người cùng cảm thấy ổn trong quá trình làm việc.",
    dimensions:"Empathy · Soft · Planner · Chill", fit:88,
    bua:"🧸 Móc khóa — nhỏ thôi nhưng phải có bên mình", slogan:"Bạn đăng bên zalo đi, bên đó mình ko xem" },
  ESIC: { name: "The Listener",     color:"GREEN",  colorHex:"#16A34A", bgHex:"#F0FDF4",
    hashtags:["#tell_me_more","#im_all_ears"],
    desc:"Fen không vội lấp đầy khoảng im lặng. Thích nghe đủ trước khi đưa ra ý kiến, nhưng cũng khá linh hoạt trong cách phản ứng. Fen thường để người khác nói hết câu rồi mới: \"Okay, tui hiểu rồi.\"",
    dimensions:"Empathy · Soft · Improviser · Chill", fit:84,
    bua:"🎧 Tai nghe — nghe kỹ rồi mới nói", slogan:"Vì thông tin bán rẻ thời gian" },
  EBPC: { name: "The Big Bro",      color:"GREEN",  colorHex:"#16A34A", bgHex:"#F0FDF4",
    hashtags:["#ive_got_you","#say_less_do_more"],
    desc:"Fen mềm với người, nhưng khá chắc với việc. Có sự đồng cảm nhưng không phải kiểu ai nói gì cũng \"ừ\". Khi cần, Fen có thể đứng ra đưa direction rõ ràng và giữ mọi thứ đi đúng hướng.",
    dimensions:"Empathy · Bold · Planner · Chill", fit:95,
    bua:"🛡️ Badge — đã nhận mission thì có trách nhiệm", slogan:"Fen nước mình vất vả" },
  EBIC: { name: "The Mom Friend",   color:"GREEN",  colorHex:"#16A34A", bgHex:"#F0FDF4",
    hashtags:["#ive_got_you","#dont_forget_to_eat"],
    desc:"Fen có radar dành riêng cho chuyện mọi người có ổn không. Không nhất thiết phải là người lead, nhưng thường nhớ deadline của người khác, nhắc mọi người nghỉ ngơi và somehow mang theo đủ thứ \"phòng khi cần\".",
    dimensions:"Empathy · Bold · Improviser · Chill", fit:92,
    bua:"🧃 Hộp đồ emergency — \"tui có mang nè\"", slogan:"Bà cứ làm công chúa đi, để tui làm công nhân cho" },
}

function DiscoverPage({ setPage }: { setPage: (p: Page) => void }) {
  const [phase, setPhase] = useState<"intro" | "mission" | "result">("intro")
  const [idx, setIdx] = useState(0)
  const [answers, setAnswers] = useState<string[]>([])
  const [picked, setPicked] = useState<string | null>(null)

  const calcResult = () => {
    const dims = [
      { vals: [answers[0], answers[1]], a: "R", b: "E" },
      { vals: [answers[2], answers[3]], a: "B", b: "S" },
      { vals: [answers[4], answers[5]], a: "P", b: "I" },
      { vals: [answers[6], answers[7]], a: "H", b: "C" },
    ]
    return dims.map(d => d.vals.filter(v => v === d.a).length >= 1 ? d.a : d.b).join("")
  }

  const mission = agentMissions[idx]
  const total = agentMissions.length
  const isLast = idx === total - 1

  const advance = () => {
    if (!picked) return
    const next = [...answers, picked]
    setAnswers(next)
    setPicked(null)
    if (isLast) { setPhase("result") }
    else { setIdx(i => i + 1) }
  }

  // ── INTRO ──────────────────────────────────────────────────────────────────
  if (phase === "intro") return (
    <div className="fixed inset-0 z-50 flex flex-col text-white overflow-hidden"
      style={{ background: `linear-gradient(160deg, #1C0800 0%, #2D1000 50%, #1A0800 100%)` }}>

      {/* Decorative orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-96 h-96 rounded-full opacity-10" style={{ background: `radial-gradient(circle, ${O}, transparent)`, top: "-8rem", right: "-8rem" }} />
        <div className="absolute w-64 h-64 rounded-full opacity-10" style={{ background: `radial-gradient(circle, ${BL}, transparent)`, bottom: "-4rem", left: "-4rem" }} />
        <div className="absolute w-2 h-2 rounded-full bg-white/40" style={{ top: "20%", left: "15%" }} />
        <div className="absolute w-1 h-1 rounded-full bg-white/30" style={{ top: "35%", left: "80%" }} />
        <div className="absolute w-1.5 h-1.5 rounded-full bg-white/20" style={{ top: "65%", left: "25%" }} />
        <div className="absolute w-1 h-1 rounded-full" style={{ backgroundColor: O, opacity: 0.5, top: "55%", left: "70%" }} />
      </div>

      <button onClick={() => setPage("dashboard")}
        className="absolute top-5 left-5 z-20 flex items-center gap-1.5 text-white/50 hover:text-white transition-colors text-xs font-semibold">
        <X className="w-3.5 h-3.5" /> Exit
      </button>

      <div className="flex-1 flex flex-col items-center justify-center px-8 text-center relative z-10">
        {/* Badge */}
        <div className="flex items-center gap-2 mb-8">
          <div className="h-px w-8 opacity-40" style={{ backgroundColor: O }} />
          <span className="text-[11px] font-black uppercase tracking-[0.25em]" style={{ color: O }}>🕵️ F Program · Agent Assessment</span>
          <div className="h-px w-8 opacity-40" style={{ backgroundColor: O }} />
        </div>

        {/* Main title */}
        <div className="mb-2 text-[11px] font-bold uppercase tracking-widest text-white/40">AGENT F —</div>
        <h1 className="text-5xl font-black leading-none mb-1 tracking-tight">THE FIRST</h1>
        <h1 className="text-5xl font-black leading-none mb-10 tracking-tight" style={{ color: O }}>MISSION</h1>

        {/* Narrative */}
        <div className="max-w-sm space-y-3 mb-10">
          <p className="text-white/70 text-sm leading-relaxed">
            Bạn là <strong className="text-white">Đặc vụ F.</strong> Sau thời gian training, hôm nay là lần đầu bạn chính thức nhận nhiệm vụ.
          </p>
          <p className="text-white/50 text-sm leading-relaxed">
            Một vụ án mới vừa được chuyển đến. Thông tin ban đầu khá ít, manh mối thì rải rác, và không có một "đáp án đúng" nào được gửi kèm.
          </p>
          <p className="text-white/70 text-sm leading-relaxed font-medium">
            Nhiệm vụ của bạn: thu thập manh mối, xử lý tình huống và hoàn thành mission theo cách của riêng mình.
          </p>
        </div>

        {/* CTA */}
        <button onClick={() => setPhase("mission")}
          className="px-10 py-4 rounded-2xl font-black text-white text-base uppercase tracking-wider transition-all hover:scale-105 active:scale-95"
          style={{ backgroundColor: O, boxShadow: `0 0 40px ${O}55` }}>
          Start Mission →
        </button>

        <p className="mt-5 text-white/25 text-xs">8 missions · No right or wrong answers</p>
      </div>
    </div>
  )

  // ── RESULT ─────────────────────────────────────────────────────────────────
  if (phase === "result") {
    const code = calcResult()
    const profile = agentProfiles[code] ?? {
      name: "The Agent", color: "RED" as const, colorHex: "#DC2626", bgHex: "#FEF2F2",
      hashtags: ["#agent_f"], desc: "Một Agent F độc đáo.", dimensions: "Unique · Bold · Ready · Focused",
      fit: 90, bua: "🎯 Mission — luôn sẵn sàng", slogan: "Born ready."
    }
    const cx = profile.colorHex
    const bg = profile.bgHex

    // Radar axes values derived from code
    const radarAxes = [
      { axis: "Tập trung\n(F)", val: code[2] === "P" ? 88 : 52 },
      { axis: "Tự lập\n(I)",   val: code[3] === "C" ? 86 : 54 },
      { axis: "Cảm nhận\n(S)", val: code[0] === "E" ? 88 : 44 },
      { axis: "Thực tế\n(G)",  val: code[3] === "H" ? 86 : 54 },
      { axis: "Khám phá\n(E)", val: code[2] === "I" ? 88 : 52 },
      { axis: "Hoà đồng\n(N)", val: code[1] === "S" ? 86 : 54 },
      { axis: "Lý trí\n(A)",   val: code[0] === "R" ? 88 : 44 },
      { axis: "Tham vọng\n(D)",val: code[1] === "B" ? 86 : 54 },
    ]

    const colorDot: Record<string, string> = { RED:"🔴", BLUE:"🔵", YELLOW:"🟡", GREEN:"🟢" }

    // Individual card PNGs (10 available); fallback to sprite sheet for 11–16
    const cardImages: Record<string, string> = {
      RSPH: card01, RSIH: card02, RBPH: card03, RBIH: card04,
      RSPC: card05, RSIC: card06, RBPC: card07, RBIC: card08,
      ESPH: card09, ESIH: card10, EBPH: card11, EBIH: card12,
      ESPC: card13, ESIC: card14, EBPC: card15, EBIC: card16,
    }
    const individualCard = cardImages[code] ?? null

    // Sprite-sheet fallback — image-10.png: 2103×748, label 108px, card 499×187
    const CW = 499, CH = 187, LBL = 108, IW = 2103, IH = 748
    const charPos: Record<string, [number,number]> = {
      ESPH:[2,0], ESIH:[2,1], EBPH:[2,2], EBIH:[2,3],
      ESPC:[3,0], ESIC:[3,1], EBPC:[3,2], EBIC:[3,3],
    }
    const [charRow, charCol] = charPos[code] ?? [2,2]
    const bgSize = `${(IW / CW * 100).toFixed(2)}% auto`
    const bpx = `${((LBL + charCol * CW) / (IW - CW) * 100).toFixed(2)}%`
    const bpy = `${(charRow * CH / (IH - CH) * 100).toFixed(2)}%`

    return (
      <div className="fixed inset-0 z-50 overflow-y-auto" style={{ backgroundColor: bg }}>
        <div className="min-h-full px-4 py-8 max-w-xl mx-auto">

          {/* Header */}
          <div className="text-center mb-6">
            <div className="flex items-center justify-center gap-2 mb-1">
              <span className="text-lg">{colorDot[profile.color]}</span>
              <span className="text-sm font-black uppercase tracking-widest" style={{ color: cx }}>{profile.color}</span>
            </div>
            <p className="text-gray-500 text-sm mb-1">Bạn là...</p>
            <h1 className="text-4xl font-black mb-1" style={{ color: cx }}>{profile.name}</h1>
            <div className="flex justify-center mb-3">
              <div className="h-1 w-24 rounded-full" style={{ backgroundColor: cx }} />
            </div>

            {/* Full FWD Agent character card — hero of result */}
            <div className="w-full rounded-2xl overflow-hidden mb-4 shadow-md"
              style={{ border: `2px solid ${cx}30` }}>
              {individualCard ? (
                <img src={individualCard} alt={profile.name} className="w-full h-auto block" />
              ) : (
                <div style={{
                  paddingBottom: `${(CH / CW * 100).toFixed(2)}%`,
                  position: "relative",
                  backgroundImage: `url(${kqSheet})`,
                  backgroundSize: bgSize,
                  backgroundPosition: `${bpx} ${bpy}`,
                  backgroundRepeat: "no-repeat",
                }} />
              )}
            </div>

            {/* Hashtags */}
            <div className="flex flex-wrap gap-2 justify-center">
              {profile.hashtags.map((h, i) => (
                <span key={i} className="text-xs font-bold px-3 py-1.5 rounded-full text-white" style={{ backgroundColor: cx }}>
                  {h}
                </span>
              ))}
            </div>
          </div>

          {/* Main grid */}
          <div className="grid grid-cols-1 gap-4 mb-4">
            {/* Work Vibe radar */}
            <div className="bg-white rounded-2xl p-4 border" style={{ borderColor: `${cx}20` }}>
              <div className="flex items-center justify-center gap-2 mb-3">
                <div className="px-4 py-1 rounded-full text-white text-xs font-black uppercase tracking-widest" style={{ backgroundColor: cx }}>
                  WORK VIBE
                </div>
              </div>
              <div style={{ height: 240 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={radarAxes} margin={{ top: 10, right: 40, left: 40, bottom: 10 }}>
                    <PolarGrid stroke={`${cx}25`} />
                    <PolarAngleAxis dataKey="axis" tick={{ fontSize: 9, fontWeight: 700, fill: "#374151", whiteSpace: "pre" }} />
                    <Radar dataKey="val" stroke={cx} fill={cx} fillOpacity={0.2} strokeWidth={2} dot={false} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Right info cards */}
            <div className="grid grid-cols-2 gap-3">
              {/* Agent ID */}
              <div className="col-span-2 rounded-2xl p-4 text-white" style={{ backgroundColor: cx }}>
                <div className="text-[10px] font-black uppercase tracking-widest opacity-70 mb-1">AGENT ID</div>
                <div className="text-4xl font-black tracking-widest mb-1">{code}</div>
                <div className="text-xs opacity-80 leading-relaxed">{profile.dimensions}</div>
              </div>

              {/* Mission Fit */}
              <div className="rounded-2xl p-4 bg-white border" style={{ borderColor: `${cx}20` }}>
                <div className="text-[10px] font-black uppercase tracking-widest mb-2" style={{ color: cx }}>MISSION FIT</div>
                <div className="text-4xl font-black" style={{ color: cx }}>{profile.fit}%</div>
                <div className="text-[10px] text-gray-400 mt-1">compatibility score</div>
              </div>

              {/* Bùa sự nghiệp */}
              <div className="rounded-2xl p-4 bg-white border" style={{ borderColor: `${cx}20` }}>
                <div className="text-[10px] font-black uppercase tracking-widest mb-2" style={{ color: cx }}>BÙA SỰ NGHIỆP</div>
                <div className="text-sm leading-snug text-gray-700">{profile.bua}</div>
              </div>
            </div>

            {/* Agent Code desc */}
            <div className="bg-white rounded-2xl p-4 border" style={{ borderColor: `${cx}20` }}>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-black text-sm flex-shrink-0" style={{ backgroundColor: cx }}>👑</div>
                <div className="text-[10px] font-black uppercase tracking-widest" style={{ color: cx }}>AGENT CODE</div>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">{profile.desc}</p>
            </div>

            {/* Slogan */}
            <div className="rounded-2xl p-5 text-center" style={{ backgroundColor: `${cx}10`, border: `2px solid ${cx}30` }}>
              <div className="text-[10px] font-black uppercase tracking-widest mb-3" style={{ color: cx }}>SLOGAN</div>
              <div className="text-2xl font-black italic leading-snug" style={{ color: cx }}>
                "{profile.slogan}"
              </div>
            </div>
          </div>

          {/* Saved note */}
          <div className="text-center text-xs text-gray-400 mb-4 px-4">
            Your profile has been saved and will be reviewed by the program team as part of your Agent F evaluation.
          </div>

          {/* CTA */}
          <button onClick={() => setPage("dashboard")}
            className="w-full py-4 rounded-2xl font-black text-white uppercase tracking-wider transition-all hover:scale-[1.02] active:scale-95"
            style={{ backgroundColor: O, boxShadow: `0 4px 24px rgba(242,101,34,0.4)` }}>
            Back to Dashboard
          </button>
        </div>
      </div>
    )
  }

  // ── MISSION QUESTION ───────────────────────────────────────────────────────
  const sceneGrad = `linear-gradient(160deg, ${mission.scene[0]} 0%, ${mission.scene[1]} 60%, ${mission.scene[2]} 100%)`

  return (
    <div className="fixed inset-0 z-50 flex flex-col text-white overflow-hidden">
      {/* Top: Scene area (upper ~42%) */}
      <div className="relative flex-shrink-0 overflow-hidden" style={{ height: "42%", background: sceneGrad }}>

        {/* Decorative geometric shapes — unique per mission */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute rounded-full opacity-20"
            style={{ width: 200, height: 200, background: `radial-gradient(circle, ${mission.accent}, transparent)`, top: "-3rem", right: "-3rem" }} />
          <div className="absolute rounded-full opacity-10"
            style={{ width: 120, height: 120, background: `radial-gradient(circle, white, transparent)`, bottom: "1rem", left: "2rem" }} />
          <div className="absolute w-16 h-16 rounded-2xl opacity-15 rotate-12"
            style={{ backgroundColor: mission.accent, top: "30%", right: "20%" }} />
          <div className="absolute w-8 h-8 rounded-full opacity-20"
            style={{ backgroundColor: "white", top: "20%", left: "30%" }} />
          <div className="absolute w-3 h-3 rounded-full opacity-40"
            style={{ backgroundColor: mission.accent, bottom: "20%", right: "35%" }} />
          <div className="absolute opacity-5 text-[10rem] font-black select-none"
            style={{ bottom: "-2rem", left: "-1rem", color: "white" }}>{idx + 1}</div>
        </div>

        {/* Top bar inside scene */}
        <div className="relative z-20 flex items-center justify-between px-5 pt-5">
          <button onClick={() => setPage("dashboard")}
            className="flex items-center gap-1.5 text-white/40 hover:text-white/80 transition-colors text-xs font-semibold">
            <X className="w-3.5 h-3.5" /> Exit
          </button>
          {/* Progress dots */}
          <div className="flex items-center gap-1.5">
            {agentMissions.map((_, i) => (
              <div key={i} className="rounded-full transition-all duration-300"
                style={{
                  width: i === idx ? 20 : 6, height: 6,
                  backgroundColor: i < idx ? mission.accent : i === idx ? "white" : "rgba(255,255,255,0.2)",
                }} />
            ))}
          </div>
          <div className="text-xs font-bold text-white/40">{idx + 1}/{total}</div>
        </div>

        {/* Mission label centered in scene */}
        <div className="relative z-10 flex flex-col items-center justify-center h-full pb-6">
          <div className="text-5xl mb-3 drop-shadow-lg">{mission.emoji}</div>
          <div className="text-[10px] font-black uppercase tracking-[0.2em]" style={{ color: mission.accent }}>
            MISSION {mission.id}
          </div>
          <div className="text-xs font-bold text-white/50 mt-0.5">{mission.title}</div>
        </div>
      </div>

      {/* Bottom: Content panel (lower ~58%) */}
      <div className="flex-1 flex flex-col overflow-hidden" style={{ backgroundColor: "#1C0800" }}>
        <div className="flex-1 overflow-y-auto px-5 pt-5 pb-2">
          {/* Case file tag */}
          <div className="inline-flex items-center gap-2 mb-3 px-3 py-1 rounded-full"
            style={{ backgroundColor: `${mission.accent}20`, border: `1px solid ${mission.accent}40` }}>
            <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: mission.accent }} />
            <span className="text-[10px] font-black uppercase tracking-wider" style={{ color: mission.accent }}>{mission.caseId}</span>
          </div>

          {/* Scenario */}
          <p className="text-white/80 text-sm leading-relaxed mb-5">{mission.scenario}</p>

          {/* Choices */}
          <div className="space-y-3 pb-4">
            {mission.choices.map((choice) => {
              const isSelected = picked === choice.value
              return (
                <button key={choice.value}
                  onClick={() => setPicked(choice.value)}
                  className="w-full text-left rounded-2xl px-4 py-4 transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] flex items-start gap-3"
                  style={{
                    backgroundColor: isSelected ? `${mission.accent}20` : "rgba(255,255,255,0.05)",
                    border: `2px solid ${isSelected ? mission.accent : "rgba(255,255,255,0.1)"}`,
                  }}>
                  <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-black transition-all"
                    style={{
                      backgroundColor: isSelected ? mission.accent : "rgba(255,255,255,0.1)",
                      color: isSelected ? "#fff" : "rgba(255,255,255,0.5)",
                    }}>
                    {choice.label}
                  </div>
                  <span className="text-sm leading-relaxed pt-0.5" style={{ color: isSelected ? "white" : "rgba(255,255,255,0.65)" }}>
                    {choice.text}
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Nav footer */}
        <div className="flex items-center gap-3 px-5 py-4 flex-shrink-0" style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}>
          {idx > 0 && (
            <button
              onClick={() => { setIdx(i => i - 1); setAnswers(a => a.slice(0, -1)); setPicked(null) }}
              className="px-4 py-2.5 rounded-xl text-sm font-semibold text-white/50 hover:text-white transition-colors"
              style={{ backgroundColor: "rgba(255,255,255,0.07)" }}>
              ← Back
            </button>
          )}
          <button
            onClick={advance}
            disabled={!picked}
            className="flex-1 py-3 rounded-xl font-black text-sm uppercase tracking-wider transition-all disabled:opacity-30 hover:opacity-90 active:scale-[0.98]"
            style={{ backgroundColor: picked ? mission.accent : "rgba(255,255,255,0.1)", color: picked ? "white" : "rgba(255,255,255,0.4)" }}>
            {isLast ? "Complete Mission ✓" : "Next Mission →"}
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── AI Test Center component ────────────────────────────────────────────────

function AITestCenter() {
  const [activeMission, setActiveMission] = useState<string | null>(null)
  const [missionQ, setMissionQ] = useState(0)
  const [missionAns, setMissionAns] = useState<number[]>([])
  const [missionSelected, setMissionSelected] = useState<number | null>(null)
  const [missionDone, setMissionDone] = useState(false)
  const [classifyAnswers, setClassifyAnswers] = useState<Record<string, string>>({})
  const [findFSelected, setFindFSelected] = useState<number | null>(null)
  const [timer, setTimer] = useState(1800) // 30 min in seconds

  useEffect(() => {
    if (!activeMission) return
    const t = setInterval(() => setTimer(v => Math.max(0, v - 1)), 1000)
    return () => clearInterval(t)
  }, [activeMission])

  const fmt = (s: number) => `${String(Math.floor(s/60)).padStart(2,"0")}:${String(s%60).padStart(2,"0")}`
  const totalPts = aiMissions.reduce((s, m) => s + (m.status === "done" ? (m as any).score ?? 0 : 0), 0)
  const maxPts = aiMissions.reduce((s, m) => s + m.pts, 0)

  const selectedMission = aiMissions.find(m => m.id === activeMission)

  const resetMission = () => { setActiveMission(null); setMissionQ(0); setMissionAns([]); setMissionSelected(null); setMissionDone(false); setClassifyAnswers({}); setFindFSelected(null) }

  if (activeMission && selectedMission) {
    return (
      <div className="p-4 lg:p-6 flex items-start justify-center">
        <div className="w-full max-w-2xl">
          {/* Mission header with timer */}
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden mb-4">
            <div className="px-5 py-4 flex items-center gap-3" style={{ background: `linear-gradient(135deg, ${O}, #E84800)` }}>
              <div className="text-2xl">{selectedMission.emoji}</div>
              <div className="flex-1">
                <div className="text-white/60 text-xs font-bold uppercase tracking-wide">{selectedMission.code}</div>
                <div className="text-white font-bold">{selectedMission.name}</div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <Clock className="w-4 h-4 text-amber-400" />
                <span className={`font-black font-mono text-lg ${timer < 300 ? "text-red-400" : timer < 600 ? "text-amber-400" : "text-white"}`}>
                  {fmt(timer)}
                </span>
              </div>
            </div>
          </div>

          {/* Case desc for M1/M2 */}
          {selectedMission.type === "case" && (selectedMission as any).desc && !missionDone && (
            <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 mb-4">
              <div className="text-xs font-bold text-blue-600 uppercase tracking-wide mb-1">Hồ sơ khách hàng</div>
              <p className="text-sm text-blue-800 leading-relaxed">{(selectedMission as any).desc}</p>
            </div>
          )}

          {/* Case study questions */}
          {selectedMission.type === "case" && !missionDone && (
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
              <div className="p-5 border-b border-gray-100">
                <div className="flex items-center justify-between mb-3">
                  <div className="text-xs font-bold text-gray-400 uppercase tracking-widest">{selectedMission.code} · Câu {missionQ + 1}/{(selectedMission as any).questions.length}</div>
                  <span className="text-xs font-semibold text-gray-400">{(selectedMission as any).pts} pts max</span>
                </div>
                <div className="h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: "#F5E8DC" }}>
                  <div className="h-full rounded-full transition-all" style={{ width: `${(missionQ/(selectedMission as any).questions.length)*100}%`, backgroundColor: BL }} />
                </div>
              </div>
              <div className="p-5">
                <h3 className="text-base font-bold mb-5" style={{ color: DG }}>{(selectedMission as any).questions[missionQ].q}</h3>
                <div className="space-y-2.5">
                  {(selectedMission as any).questions[missionQ].opts.map((opt: string, i: number) => (
                    <button key={i} onClick={() => { if (missionSelected !== null) return; setMissionSelected(i); const a=[...missionAns]; a[missionQ]=i; setMissionAns(a) }}
                      className={`w-full text-left px-4 py-3 rounded-xl border-2 text-sm font-medium transition-all ${
                        missionSelected === null ? "hover:border-[#0097A9] hover:bg-blue-50/50" :
                        i === (selectedMission as any).questions[missionQ].ans ? "border-green-400 bg-green-50" :
                        missionSelected === i ? "border-red-300 bg-red-50" : ""
                      }`}
                      style={{ borderColor: missionSelected === null ? "#EDD9C8" : undefined, color: DG }}>
                      <span className="font-bold mr-2" style={{ color: BL }}>{String.fromCharCode(65+i)}.</span>{opt}
                    </button>
                  ))}
                </div>
                {missionSelected !== null && (
                  <button onClick={() => { setMissionSelected(null); if (missionQ+1 >= (selectedMission as any).questions.length) setMissionDone(true); else setMissionQ(q=>q+1) }}
                    className="w-full mt-4 py-3 rounded-xl text-white text-sm font-bold flex items-center justify-center gap-2 hover:opacity-90 active:scale-95 transition-all"
                    style={{ backgroundColor: BL }}>
                    {missionQ+1 >= (selectedMission as any).questions.length ? "Xem kết quả" : "Câu tiếp theo"} <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Case study result */}
          {selectedMission.type === "case" && missionDone && (
            <div className="bg-white rounded-2xl border border-gray-100 text-center overflow-hidden">
              <div className="py-8 px-6" style={{ background: `linear-gradient(135deg, ${BL}, #006A7A)` }}>
                <div className="text-5xl font-black text-white">{missionAns.filter((a,i)=>a===(selectedMission as any).questions[i].ans).length}/{(selectedMission as any).questions.length}</div>
                <div className="text-white/70 mt-1 text-sm">câu trả lời đúng · {(selectedMission as any).code}</div>
              </div>
              <div className="p-6">
                <div className="text-lg font-bold mb-4" style={{ color: missionAns.filter((a,i)=>a===(selectedMission as any).questions[i].ans).length>=4 ? "#22A262" : "#D97706" }}>
                  {missionAns.filter((a,i)=>a===(selectedMission as any).questions[i].ans).length>=4 ? "Xuất sắc! 🎉" : "Tốt — tiếp tục ôn luyện 📚"}
                </div>
                <button onClick={resetMission} className="w-full border-2 py-3 rounded-xl font-semibold text-sm hover:opacity-70 transition-all" style={{ borderColor: "#EDD9C8", color: DG }}>
                  ← Quay lại danh sách Mission
                </button>
              </div>
            </div>
          )}

          {/* Classified Game (M3) */}
          {selectedMission.type === "game" && selectedMission.id === "m3" && (
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
              <div className="p-5 border-b border-gray-100">
                <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Classified Game</div>
                <p className="text-sm text-gray-600">{(selectedMission as any).desc}</p>
              </div>
              <div className="p-5 space-y-4">
                <div className="grid grid-cols-3 gap-3 mb-4">
                  {["low","medium","high"].map(r => (
                    <div key={r} className="rounded-xl p-2.5 text-center text-xs font-bold border-2 border-dashed min-h-[60px] flex items-center justify-center"
                      style={{ borderColor: r==="low"?LG:r==="medium"?YL:"#D93025", color: r==="low"?"#22A262":r==="medium"?"#B45309":"#D93025", backgroundColor: r==="low"?"#EDFAF5":r==="medium"?"#FEFCE8":"#FEF2F2" }}>
                      {r==="low"?"🟢 Rủi ro Thấp":r==="medium"?"🟡 Trung bình":"🔴 Rủi ro Cao"}
                    </div>
                  ))}
                </div>
                <div className="space-y-2.5">
                  {(selectedMission as any).profiles.map((p: any) => {
                    const chosen = classifyAnswers[p.name]
                    return (
                      <div key={p.name} className="border rounded-xl p-3.5" style={{ borderColor: "#EDD9C8" }}>
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0" style={{ backgroundColor: O }}>
                            {p.name.split(",")[0][3] ?? "K"}
                          </div>
                          <div>
                            <div className="font-semibold text-sm" style={{ color: DG }}>{p.name}</div>
                            <div className="text-xs text-gray-400">{p.detail}</div>
                          </div>
                          {chosen && (
                            <span className="ml-auto text-xs font-bold px-2 py-1 rounded-full" style={{
                              backgroundColor: chosen===p.correct?"#EDFAF5":chosen!==p.correct?"#FEF2F2":"#FEF6F0",
                              color: chosen===p.correct?"#22A262":chosen!==p.correct?"#D93025":DG,
                            }}>
                              {chosen===p.correct?"✓ Đúng":"✗ Sai"}
                            </span>
                          )}
                        </div>
                        <div className="flex gap-2">
                          {["low","medium","high"].map(r => (
                            <button key={r} onClick={() => setClassifyAnswers(prev=>({...prev,[p.name]:r}))}
                              className={`flex-1 py-1.5 rounded-lg text-xs font-bold border-2 transition-all ${chosen===r?"text-white":"text-gray-400 hover:text-gray-600"}`}
                              style={{ borderColor: chosen===r?(r==="low"?LG:r==="medium"?YL:"#D93025"):"#EDD9C8", backgroundColor: chosen===r?(r==="low"?LG:r==="medium"?YL:"#D93025"):"white" }}>
                              {r==="low"?"Thấp":r==="medium"?"T.Bình":"Cao"}
                            </button>
                          ))}
                        </div>
                      </div>
                    )
                  })}
                </div>
                {Object.keys(classifyAnswers).length === (selectedMission as any).profiles.length && (
                  <div className="pt-3 border-t border-gray-100">
                    <div className="text-sm font-bold text-center mb-3" style={{ color: DG }}>
                      {Object.keys(classifyAnswers).filter(k=>{const p=(selectedMission as any).profiles.find((x:any)=>x.name===k);return p&&classifyAnswers[k]===p.correct}).length}/{(selectedMission as any).profiles.length} phân loại đúng ✓
                    </div>
                    <button onClick={resetMission} className="w-full border-2 py-3 rounded-xl font-semibold text-sm hover:opacity-70 transition-all" style={{ borderColor: "#EDD9C8", color: DG }}>
                      ← Quay lại danh sách
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Find F (M4) */}
          {selectedMission.type === "game" && selectedMission.id === "m4" && (
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
              <div className="p-5 border-b border-gray-100">
                <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Find F</div>
                <p className="text-sm text-gray-600">{(selectedMission as any).desc}</p>
              </div>
              <div className="p-5">
                {(selectedMission as any).questions.slice(0,1).map((q: any, qi: number) => (
                  <div key={qi}>
                    <h3 className="text-sm font-bold mb-4" style={{ color: DG }}>{q.q}</h3>
                    <div className="space-y-2.5">
                      {q.opts.map((opt: string, i: number) => (
                        <button key={i} onClick={() => setFindFSelected(i)}
                          className={`w-full text-left px-4 py-3 rounded-xl border-2 text-sm font-medium transition-all ${
                            findFSelected === null ? "hover:border-[#F26522] hover:bg-orange-50/50" :
                            i === q.ans ? "border-green-400 bg-green-50" :
                            findFSelected === i ? "border-red-300 bg-red-50" : ""
                          }`}
                          style={{ borderColor: findFSelected === null ? "#EDD9C8" : undefined, color: DG }}>
                          {opt}
                        </button>
                      ))}
                    </div>
                    {findFSelected !== null && (
                      <button onClick={resetMission} className="w-full mt-4 border-2 py-3 rounded-xl font-semibold text-sm hover:opacity-70 transition-all" style={{ borderColor: "#EDD9C8", color: DG }}>
                        ← Quay lại danh sách
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }

  // Mission overview screen
  return (
    <div className="p-4 lg:p-6 max-w-3xl mx-auto w-full">
      {/* Header */}
      <div className="rounded-2xl p-5 mb-5" style={{ background: `linear-gradient(135deg, ${O}, #E84800)` }}>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: "rgba(255,255,255,0.18)" }}>
            <Zap className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="text-white font-bold">AI Test Center · R1 – Mission F</div>
            <div className="text-white/50 text-xs">30 phút · 4 Mission · {totalPts}/{maxPts} pts đã tích lũy</div>
          </div>
          <StatusBadge status="completed" />
        </div>
        <div className="mt-3 h-2 rounded-full overflow-hidden" style={{ backgroundColor: "rgba(255,255,255,0.15)" }}>
          <div className="h-full rounded-full" style={{ width: `${(totalPts/maxPts)*100}%`, backgroundColor: LG }} />
        </div>
        <div className="text-white/40 text-xs mt-1">{totalPts} / {maxPts} pts tối đa (đã hoàn thành vòng R1)</div>
      </div>

      {/* Mission cards */}
      <div className="space-y-3">
        {aiMissions.map((m, i) => (
          <div key={m.id} className={`bg-white rounded-2xl border overflow-hidden ${m.status === "locked" ? "opacity-60" : m.status === "active" ? "border-orange-200" : "border-gray-100"}`}
            style={m.status === "active" ? { boxShadow: `0 0 0 3px rgba(232,119,34,0.1)` } : {}}>
            <div className="flex items-center gap-4 p-4">
              <div className="w-14 h-14 rounded-xl flex items-center justify-center text-3xl flex-shrink-0"
                style={{ backgroundColor: m.status === "done" ? "#EDFAF5" : m.status === "active" ? "#FEF3E8" : "#FEF6F0" }}>
                {m.emoji}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-black" style={{ color: m.status === "done" ? "#22A262" : m.status === "active" ? O : "#B0C4BB" }}>{m.code}</span>
                  {m.status === "done" && <CheckCircle2 className="w-4 h-4 text-green-500" />}
                  {m.status === "active" && <span className="text-[10px] font-black px-2 py-0.5 rounded-full text-white" style={{ backgroundColor: O }}>OPEN</span>}
                  {m.status === "locked" && <Lock className="w-3.5 h-3.5 text-gray-300" />}
                </div>
                <div className="font-bold text-sm mt-0.5" style={{ color: DG }}>{m.name}</div>
                <div className="text-xs text-gray-400 mt-0.5">{m.type === "case" ? `Case Study · ${(m as any).questions?.length ?? 5} câu hỏi` : "Interactive Game"} · {m.duration} phút · {m.pts} pts</div>
                {m.status === "done" && (
                  <div className="mt-1.5 flex items-center gap-1.5">
                    <div className="h-1.5 rounded-full overflow-hidden flex-1" style={{ backgroundColor: "#F5E8DC", maxWidth: "120px" }}>
                      <div className="h-full rounded-full" style={{ width: `${((m as any).score/(m.pts))*100}%`, backgroundColor: LG }} />
                    </div>
                    <span className="text-xs font-bold font-mono" style={{ color: "#22A262" }}>{(m as any).score}/{m.pts}</span>
                  </div>
                )}
              </div>
              <div className="flex-shrink-0">
                {m.status === "done" ? (
                  <button onClick={() => setActiveMission(m.id)} className="text-xs font-bold px-3 py-1.5 rounded-lg border-2 transition-all hover:opacity-70" style={{ borderColor: "#EDD9C8", color: DG }}>
                    Xem lại
                  </button>
                ) : m.status === "active" ? (
                  <button onClick={() => { setActiveMission(m.id); setTimer(1800) }}
                    className="text-white text-xs font-bold px-4 py-2 rounded-xl hover:opacity-90 active:scale-95 transition-all"
                    style={{ backgroundColor: O }}>
                    Bắt đầu →
                  </button>
                ) : (
                  <Lock className="w-4 h-4 text-gray-300" />
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Learning Center ──────────────────────────────────────────────────────────

type SimStep = "intro" | "chat" | "result"

function LearningCenter() {
  const [tab, setTab] = useState<LTab>("content")
  // Mini test state
  const [miniStarted, setMiniStarted] = useState(false)
  const [miniQ, setMiniQ] = useState(0)
  const [miniAns, setMiniAns] = useState<number[]>([])
  const [miniSelected, setMiniSelected] = useState<number | null>(null)
  const [miniDone, setMiniDone] = useState(false)
  // AI Sim state
  const [simStep, setSimStep] = useState<SimStep>("intro")
  const [exchIdx, setExchIdx] = useState(0)
  const [selected, setSelected] = useState<string | null>(null)
  const [showFb, setShowFb] = useState(false)
  const [simScore, setSimScore] = useState(0)
  const [messages, setMessages] = useState<Array<{from: "ai"|"user"; text: string}>>([])
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }) }, [messages, showFb])

  const tabs: { id: LTab; label: string; Icon: any }[] = [
    { id: "content",    label: "Training 1",     Icon: BookOpen },
    { id: "mini",       label: "Knowledge Test",  Icon: CheckSquare },
    { id: "simulation", label: "AI Simulation",   Icon: Bot },
    { id: "branding",   label: "Training 2",      Icon: Megaphone },
  ]

  const maxSimScore = chatScenario.exchanges.reduce((s, e) => s + Math.max(...e.opts.map(o => o.sc)), 0)

  const startSim = () => { setSimStep("chat"); setMessages([{ from: "ai", text: chatScenario.exchanges[0].msg }]) }
  const chooseSim = (id: string) => {
    if (selected) return
    setSelected(id); setShowFb(true)
    const opt = chatScenario.exchanges[exchIdx].opts.find(o => o.id === id)!
    setMessages(prev => [...prev, { from: "user", text: opt.t }])
    setSimScore(prev => prev + opt.sc)
  }
  const nextSim = () => {
    const ni = exchIdx + 1
    if (ni >= chatScenario.exchanges.length) { setSimStep("result"); return }
    setExchIdx(ni); setSelected(null); setShowFb(false)
    setMessages(prev => [...prev, { from: "ai", text: chatScenario.exchanges[ni].msg }])
  }
  const resetSim = () => { setSimStep("intro"); setExchIdx(0); setSelected(null); setShowFb(false); setSimScore(0); setMessages([]) }

  const miniScore = miniAns.filter((a, i) => a === miniQs[i].ans).length

  return (
    <div className="flex flex-col h-full">
      {/* Tab bar */}
      <div className="bg-white border-b border-gray-100 px-4 lg:px-6 overflow-x-auto flex-shrink-0">
        <div className="flex">
          {tabs.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`flex items-center gap-2 px-4 py-4 text-sm font-semibold border-b-2 whitespace-nowrap transition-all ${
                tab === t.id ? "border-[#F26522] text-[#F26522]" : "border-transparent text-gray-400 hover:text-gray-700 hover:border-gray-200"
              }`}>
              <t.Icon className="w-3.5 h-3.5" />{t.label}
              {t.id === "simulation" && <span className="bg-amber-400 text-amber-900 text-[10px] font-bold px-1.5 rounded-full">LIVE</span>}
              {t.badge && t.id !== "simulation" && <span className="bg-gray-200 text-gray-600 text-[10px] font-bold px-1.5 rounded-full">{t.badge}</span>}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* ── Content ── */}
        {tab === "content" && (
          <div className="p-4 lg:p-6 max-w-5xl mx-auto w-full">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-lg font-bold" style={{ color: DG }}>Nội dung đào tạo Vòng 2</h2>
                <p className="text-sm text-gray-400 mt-0.5">{courses.filter(c => c.status === "done").length}/{courses.length} bài hoàn thành</p>
              </div>
              <div className="h-2 w-32 rounded-full overflow-hidden" style={{ backgroundColor: "#F5E8DC" }}>
                <div className="h-full rounded-full" style={{ width: `${(courses.filter(c=>c.status==="done").length/courses.length)*100}%`, backgroundColor: LG }} />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {courses.map(c => (
                <div key={c.id} className={`bg-white rounded-2xl border overflow-hidden transition-all hover:shadow-md ${c.status === "active" ? "border-orange-200 shadow-sm" : "border-gray-100"}`}>
                  <div className={`h-2 ${c.status === "done" ? "" : c.status === "active" ? "" : "bg-gray-100"}`}
                    style={{ backgroundColor: c.status === "done" ? LG : c.status === "active" ? O : "" }} />
                  <div className="p-4">
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${
                        c.type === "video" ? "bg-blue-50" : "bg-purple-50"
                      }`}>
                        {c.type === "video" ? <Play className="w-4 h-4 text-blue-600" /> : <FileText className="w-4 h-4 text-purple-600" />}
                      </div>
                      {c.status === "done" && <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />}
                      {c.status === "pending" && <Lock className="w-4 h-4 text-gray-300 flex-shrink-0 mt-0.5" />}
                    </div>
                    <div className="text-sm font-semibold mb-1" style={{ color: DG }}>{c.title}</div>
                    <div className="flex items-center justify-between text-xs text-gray-400">
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{c.duration}</span>
                      {c.required && <span className="text-orange-600 font-semibold">Bắt buộc</span>}
                    </div>
                    <button
                      disabled={c.status === "pending"}
                      className={`w-full mt-3 py-2 rounded-xl text-xs font-bold transition-all ${
                        c.status === "done" ? "text-green-700 bg-green-50 cursor-default" :
                        c.status === "pending" ? "text-gray-300 bg-gray-50 cursor-not-allowed" :
                        "text-white hover:opacity-90 active:scale-95"
                      }`}
                      style={c.status === "active" ? { backgroundColor: O } : {}}>
                      {c.status === "done" ? "Đã hoàn thành ✓" : c.status === "pending" ? "Chưa mở khóa" : "Học ngay →"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Mini Test ── */}
        {tab === "mini" && (
          <div className="p-4 lg:p-6 flex items-start justify-center">
            <div className="w-full max-w-lg">
              {/* ── Start screen ── */}
              {!miniStarted && !miniDone && (
                <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                  <div className="p-6" style={{ background: `linear-gradient(135deg, ${BL}, #006A7A)` }}>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ backgroundColor: "rgba(255,255,255,0.18)" }}>
                        <CheckSquare className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <div className="text-white font-black text-lg">Knowledge Test</div>
                        <div className="text-white/70 text-sm">Kiến thức tư vấn bảo hiểm</div>
                      </div>
                    </div>
                    <p className="text-white/80 text-sm leading-relaxed">Bài kiểm tra giúp bạn tự đánh giá mức độ hiểu biết về tư vấn tài chính và bảo hiểm nhân thọ trước khi bước vào vòng tiếp theo.</p>
                  </div>
                  <div className="p-6 space-y-4">
                    <div className="grid grid-cols-3 gap-3">
                      {[["📋","Số câu",`${miniQs.length} câu`],["⏱️","Thời gian","Không giới hạn"],["✅","Dạng câu","Trắc nghiệm"]].map(([icon,label,val]) => (
                        <div key={label} className="rounded-xl p-3 text-center" style={{ backgroundColor: "#F5F9FF" }}>
                          <div className="text-xl mb-1">{icon}</div>
                          <div className="text-[10px] text-gray-400 font-semibold uppercase tracking-wide">{label}</div>
                          <div className="text-sm font-bold mt-0.5" style={{ color: DG }}>{val}</div>
                        </div>
                      ))}
                    </div>
                    <div className="rounded-xl p-4 text-sm" style={{ backgroundColor: "#EFF6FF", border: "1px solid #BFDBFE" }}>
                      <div className="font-semibold mb-1" style={{ color: BL }}>📌 Lưu ý trước khi bắt đầu</div>
                      <ul className="text-gray-600 space-y-1 text-xs leading-relaxed list-disc list-inside">
                        <li>Chọn đáp án bạn cho là đúng nhất</li>
                        <li>Đáp án sẽ hiển thị ngay sau khi bạn chọn</li>
                        <li>Bạn có thể làm lại nhiều lần để ôn luyện</li>
                      </ul>
                    </div>
                    <button
                      onClick={() => setMiniStarted(true)}
                      className="w-full py-4 rounded-xl text-white font-black text-base flex items-center justify-center gap-2 transition-all hover:opacity-90 active:scale-95"
                      style={{ backgroundColor: BL, boxShadow: "0 4px 16px rgba(0,151,169,0.3)" }}>
                      Bắt đầu Test <ArrowRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              )}

              {/* ── Quiz ── */}
              {miniStarted && !miniDone && (
                <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                  <div className="p-5 border-b border-gray-100">
                    <div className="flex items-center justify-between mb-3">
                      <div className="text-xs font-bold text-gray-400 uppercase tracking-widest">Knowledge Test · Kiến thức tư vấn</div>
                      <span className="text-xs font-semibold text-gray-400">{miniQ + 1} / {miniQs.length}</span>
                    </div>
                    <div className="h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: "#F5E8DC" }}>
                      <div className="h-full rounded-full transition-all" style={{ width: `${(miniQ / miniQs.length) * 100}%`, backgroundColor: BL }} />
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-base font-bold mb-5" style={{ color: DG }}>{miniQs[miniQ].q}</h3>
                    <div className="space-y-2.5">
                      {miniQs[miniQ].opts.map((opt, i) => (
                        <button key={i}
                          onClick={() => {
                            if (miniSelected !== null) return
                            setMiniSelected(i)
                            const ans = [...miniAns]; ans[miniQ] = i; setMiniAns(ans)
                          }}
                          className={`w-full text-left px-4 py-3 rounded-xl border-2 text-sm font-medium transition-all ${
                            miniSelected === null ? "hover:border-[#0097A9] hover:bg-blue-50/50" :
                            i === miniQs[miniQ].ans ? "border-green-400 bg-green-50" :
                            miniSelected === i ? "border-red-300 bg-red-50" : ""
                          }`}
                          style={{ borderColor: miniSelected === null ? "#EDD9C8" : undefined, color: DG }}>
                          <span className="font-bold mr-2" style={{ color: BL }}>{String.fromCharCode(65+i)}.</span>{opt}
                        </button>
                      ))}
                    </div>
                    {miniSelected !== null && (
                      <button
                        onClick={() => {
                          setMiniSelected(null)
                          if (miniQ + 1 >= miniQs.length) setMiniDone(true)
                          else setMiniQ(q => q + 1)
                        }}
                        className="w-full mt-4 py-3 rounded-xl text-white text-sm font-bold flex items-center justify-center gap-2 transition-all hover:opacity-90 active:scale-95"
                        style={{ backgroundColor: BL }}>
                        {miniQ + 1 >= miniQs.length ? "Xem kết quả" : "Câu tiếp theo"} <ArrowRight className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* ── Result ── */}
              {miniDone && (
                <div className="bg-white rounded-2xl border border-gray-100 text-center overflow-hidden">
                  <div className="py-8 px-6" style={{ background: `linear-gradient(135deg, ${BL}, #006A7A)` }}>
                    <div className="text-5xl font-black text-white">{miniScore}/{miniQs.length}</div>
                    <div className="text-white/70 mt-1">câu trả lời đúng</div>
                  </div>
                  <div className="p-6">
                    <div className={`text-lg font-bold mb-2 ${miniScore >= 4 ? "text-green-600" : miniScore >= 3 ? "text-amber-600" : "text-red-500"}`}>
                      {miniScore >= 4 ? "Xuất sắc! 🎉" : miniScore >= 3 ? "Tốt! 👍" : "Cần ôn luyện thêm 📚"}
                    </div>
                    <button onClick={() => { setMiniDone(false); setMiniStarted(false); setMiniQ(0); setMiniAns([]); setMiniSelected(null) }}
                      className="w-full border-2 py-3 rounded-xl font-semibold text-sm mt-2 hover:opacity-70 transition-all"
                      style={{ borderColor: "#EDD9C8", color: DG }}>Làm lại</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── AI Simulation ── */}
        {tab === "simulation" && (
          <div className="flex flex-col" style={{ minHeight: "calc(100vh - 8.5rem)" }}>
            {simStep === "intro" && (
              <div className="p-4 lg:p-6 flex items-start justify-center">
                <div className="w-full max-w-lg bg-white rounded-2xl border border-gray-100 overflow-hidden">
                  <div className="p-6" style={{ background: `linear-gradient(135deg, ${O}, #E84800)` }}>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ backgroundColor: "rgba(255,255,255,0.18)" }}>
                        <Bot className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <div className="text-white font-bold">AI Simulation · Vòng 2</div>
                        <div className="text-white/50 text-sm">Customer Advisory Roleplay</div>
                      </div>
                      <span className="ml-auto bg-amber-400 text-amber-900 text-xs font-bold px-2.5 py-1 rounded-full">LIVE</span>
                    </div>
                    <p className="text-white/70 text-sm leading-relaxed">Đóng vai Advisor, tư vấn khách hàng AI mô phỏng qua {chatScenario.exchanges.length} tình huống thực tế.</p>
                  </div>
                  <div className="p-6">
                    <div className="bg-gray-50 rounded-xl p-4 flex gap-3 mb-5">
                      <div className="w-11 h-11 rounded-full bg-purple-100 text-purple-700 font-bold flex items-center justify-center flex-shrink-0">
                        {chatScenario.customer.initials}
                      </div>
                      <div>
                        <div className="font-semibold text-sm" style={{ color: DG }}>{chatScenario.customer.name}, {chatScenario.customer.age} tuổi</div>
                        <div className="text-xs text-gray-500 mt-0.5">{chatScenario.customer.background}</div>
                        <div className="text-xs text-amber-700 mt-1 flex items-center gap-1"><AlertTriangle className="w-3 h-3" />{chatScenario.customer.concern}</div>
                      </div>
                    </div>
                    <button onClick={startSim}
                      className="w-full text-white rounded-xl py-3.5 font-bold flex items-center justify-center gap-2 hover:opacity-90 active:scale-95 transition-all"
                      style={{ backgroundColor: O, boxShadow: `0 4px 16px rgba(232,119,34,0.35)` }}>
                      <Bot className="w-4 h-4" />Bắt đầu mô phỏng
                    </button>
                  </div>
                </div>
              </div>
            )}

            {simStep === "result" && (
              <div className="p-4 lg:p-6 flex items-start justify-center">
                <div className="w-full max-w-lg bg-white rounded-2xl border border-gray-100 overflow-hidden text-center">
                  <div className="py-8 px-6" style={{ background: `linear-gradient(135deg, ${LG}, #3BAF94)` }}>
                    <CheckCircle2 className="w-12 h-12 text-white mx-auto mb-3" />
                    <div className="text-white text-2xl font-bold">Hoàn thành!</div>
                  </div>
                  <div className="p-6">
                    <div className="text-5xl font-black" style={{ color: DG }}>{simScore}</div>
                    <div className="text-gray-400 text-sm">/ {maxSimScore} pts</div>
                    <div className="text-lg font-bold mt-2" style={{ color: O }}>
                      {Math.round(simScore/maxSimScore*100) >= 85 ? "Xuất sắc" : Math.round(simScore/maxSimScore*100) >= 70 ? "Tốt" : "Đạt"}
                    </div>
                    <button onClick={resetSim} className="w-full mt-5 border-2 py-3 rounded-xl font-semibold text-sm hover:opacity-70 transition-all"
                      style={{ borderColor: "#EDD9C8", color: DG }}>Thử lại</button>
                  </div>
                </div>
              </div>
            )}

            {simStep === "chat" && (
              <div className="flex flex-col flex-1">
                <div className="bg-white border-b border-gray-100 px-4 py-3 flex-shrink-0">
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="text-gray-500">Trao đổi {exchIdx + 1} / {chatScenario.exchanges.length}</span>
                    <span className="font-bold" style={{ color: O }}>{simScore} pts</span>
                  </div>
                  <div className="h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: "#F5E8DC" }}>
                    <div className="h-full rounded-full transition-all" style={{ width: `${((exchIdx+(selected?1:0))/chatScenario.exchanges.length)*100}%`, backgroundColor: O }} />
                  </div>
                </div>
                <div className="bg-purple-50/60 border-b border-purple-100/60 px-4 py-2.5 flex items-center gap-3 flex-shrink-0">
                  <div className="w-8 h-8 rounded-full bg-purple-200 text-purple-700 font-bold text-xs flex items-center justify-center">{chatScenario.customer.initials}</div>
                  <span className="text-sm font-semibold" style={{ color: DG }}>{chatScenario.customer.name}</span>
                  <span className="ml-auto text-xs bg-purple-100 text-purple-700 font-semibold px-2 py-0.5 rounded-full">AI Customer</span>
                </div>
                <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0" style={{ maxHeight: "calc(100vh - 20rem)" }}>
                  {messages.map((m, i) => (
                    <div key={i} className={`flex gap-3 ${m.from === "user" ? "flex-row-reverse" : ""}`}>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${m.from === "ai" ? "bg-purple-200 text-purple-700" : "text-white"}`}
                        style={m.from === "user" ? { backgroundColor: O } : {}}>
                        {m.from === "ai" ? chatScenario.customer.initials : ME.initials}
                      </div>
                      <div className={`max-w-[78%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${m.from === "ai" ? "bg-white border border-gray-100 text-gray-800 rounded-tl-sm" : "text-white rounded-tr-sm"}`}
                        style={m.from === "user" ? { backgroundColor: O } : {}}>
                        {m.text}
                      </div>
                    </div>
                  ))}
                  {showFb && selected && (() => {
                    const opt = chatScenario.exchanges[exchIdx].opts.find(o => o.id === selected)!
                    return (
                      <div className="flex justify-center">
                        <div className={`px-4 py-3 rounded-2xl text-sm max-w-sm text-center leading-relaxed ${opt.sc >= 85 ? "bg-green-50 border border-green-200 text-green-800" : opt.sc >= 60 ? "bg-amber-50 border border-amber-200 text-amber-800" : "bg-red-50 border border-red-200 text-red-800"}`}>
                          <strong>{opt.sc >= 85 ? "✅" : opt.sc >= 60 ? "⚠️" : "❌"} +{opt.sc} pts · </strong>{opt.fb}
                        </div>
                      </div>
                    )
                  })()}
                  <div ref={bottomRef} />
                </div>
                <div className="border-t border-gray-100 bg-white p-4 flex-shrink-0">
                  {!selected ? (
                    <div className="space-y-2">
                      <div className="text-xs text-gray-400 font-medium mb-2">Chọn phản hồi của bạn:</div>
                      {chatScenario.exchanges[exchIdx].opts.map(opt => (
                        <button key={opt.id} onClick={() => chooseSim(opt.id)}
                          className="w-full text-left px-4 py-3 rounded-xl border-2 text-sm font-medium transition-all hover:bg-orange-50/50"
                          style={{ borderColor: "#EDD9C8", color: DG }}
                          onMouseEnter={e => (e.currentTarget as HTMLElement).style.borderColor = O}
                          onMouseLeave={e => (e.currentTarget as HTMLElement).style.borderColor = "#EDD9C8"}>
                          <span className="font-bold mr-2" style={{ color: O }}>{opt.id.toUpperCase()}.</span>{opt.t}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <button onClick={nextSim}
                      className="w-full text-white rounded-xl py-3.5 font-bold flex items-center justify-center gap-2 hover:opacity-90 active:scale-95 transition-all"
                      style={{ backgroundColor: O }}>
                      {exchIdx + 1 >= chatScenario.exchanges.length ? "Xem kết quả" : "Tiếp theo"} <ArrowRight className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── Personal Branding ── */}
        {tab === "branding" && (
          <div className="p-4 lg:p-6 max-w-3xl mx-auto w-full">
            <div className="mb-5">
              <h2 className="text-lg font-bold" style={{ color: DG }}>Personal Branding cho Advisor</h2>
              <p className="text-sm text-gray-400 mt-1">Xây dựng hình ảnh chuyên nghiệp trên mạng xã hội như 1 Advisor thực thụ.</p>
            </div>
            {[
              { icon: "🎯", title: "Xác định niche và định vị cá nhân", done: true,  desc: "Ai là bạn? Bạn tư vấn cho đối tượng nào? Điểm khác biệt của bạn là gì?" },
              { icon: "📸", title: "Tối ưu hóa profile LinkedIn & Facebook", done: true,  desc: "Ảnh đại diện, bio, featured section, kinh nghiệm và skills liên quan." },
              { icon: "📝", title: "Xây dựng content strategy 30 ngày",    done: false, desc: "Content pillars: Kiến thức tài chính, hành trình cá nhân, case study ẩn danh." },
              { icon: "🎬", title: "Tạo video giới thiệu bản thân 60 giây", done: false, desc: "Script, quay và edit video ngắn thể hiện giá trị và tính cách của bạn." },
              { icon: "📊", title: "Theo dõi và tối ưu engagement",         done: false, desc: "Analytics, best time to post, hashtag strategy cho mảng tài chính." },
            ].map((item, i) => (
              <div key={i} className={`flex gap-4 p-4 rounded-2xl mb-3 border transition-all hover:shadow-sm ${item.done ? "bg-green-50 border-green-100" : "bg-white border-gray-100"}`}>
                <div className="text-2xl flex-shrink-0">{item.icon}</div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <div className="font-semibold text-sm" style={{ color: DG }}>{item.title}</div>
                    {item.done && <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />}
                  </div>
                  <p className="text-xs text-gray-500 mt-1 leading-relaxed">{item.desc}</p>
                </div>
                <button className={`px-3 py-1.5 rounded-lg text-xs font-bold flex-shrink-0 self-start transition-all hover:opacity-80 ${item.done ? "bg-green-100 text-green-700" : "text-white"}`}
                  style={!item.done ? { backgroundColor: O } : {}}>
                  {item.done ? "Xem lại" : "Bắt đầu"}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Social Challenge Card (needs own state) ──────────────────────────────────

function SocialChallengeCard({ sc }: { sc: typeof socialChallenges[0] }) {
  const [platform, setPlatform] = useState<string | null>(null)
  const [link, setLink] = useState("")
  const [submitted, setSubmitted] = useState(false)
  const isActive = sc.active && sc.status === "pending"

  return (
    <div className={`bg-white rounded-2xl border-2 overflow-hidden ${sc.status === "locked" ? "opacity-60" : ""}`}
      style={{ borderColor: sc.status === "approved" ? `${LG}60` : sc.active ? `${O}40` : "#EDD9C8" }}>
      <div className="px-5 py-4 flex items-center gap-3" style={{ backgroundColor: sc.status === "approved" ? "#EDFAF5" : sc.status === "locked" ? "#FEF6F0" : "#FEF3E8" }}>
        <div className="flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-bold text-gray-500">{sc.round}</span>
            {sc.active && <span className="text-[10px] font-black px-2 py-0.5 rounded-full text-white" style={{ backgroundColor: O }}>ACTIVE</span>}
            {sc.status === "locked" && <Lock className="w-3.5 h-3.5 text-gray-300" />}
          </div>
          <div className="font-bold text-sm mt-0.5" style={{ color: DG }}>#{sc.topic}</div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className="text-sm font-black" style={{ color: sc.status === "approved" ? "#22A262" : sc.status === "pending" ? O : "#B0C4BB" }}>{sc.pts}</span>
          <StatusBadge status={sc.status} />
        </div>
      </div>
      <div className="px-5 py-4">
        <p className="text-sm text-gray-600 leading-relaxed mb-3">{sc.desc}</p>
        <div className="flex flex-wrap gap-2 mb-4">
          {sc.hashtags.map(h => (
            <span key={h} className="text-xs font-semibold px-2.5 py-1 rounded-full" style={{ backgroundColor: `${BL}15`, color: BL }}>{h}</span>
          ))}
        </div>
        {sc.status === "approved" && (
          <div className="rounded-xl p-3.5 border" style={{ backgroundColor: "#EDFAF5", borderColor: "#B2EDD8" }}>
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <div className="text-sm font-semibold text-green-800">Đã duyệt ✓</div>
                <div className="text-xs text-green-700 mt-0.5">{sc.submittedPlatform} · {sc.submittedLink}</div>
                {sc.feedback && <div className="text-xs text-green-700 mt-1.5 font-medium italic">"{sc.feedback}"</div>}
              </div>
            </div>
          </div>
        )}
        {isActive && !submitted && (
          <div className="space-y-4">
            {sc.deadline && (
              <div className="flex items-center gap-2 text-xs font-semibold" style={{ color: O }}>
                <Clock className="w-3.5 h-3.5" />Deadline: <DeadlineChip deadline={sc.deadline} />
              </div>
            )}
            <div>
              <label className="text-xs font-bold text-gray-500 mb-2 block uppercase tracking-wide">Chọn nền tảng</label>
              <div className="flex flex-wrap gap-2">
                {sc.platforms.map(p => (
                  <button key={p} onClick={() => setPlatform(platform === p ? null : p)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold border-2 transition-all ${platform === p ? "text-white" : "text-gray-500 hover:text-gray-700"}`}
                    style={{ borderColor: platform === p ? O : "#EDD9C8", backgroundColor: platform === p ? O : "white" }}>
                    {p === "TikTok" ? "📱 " : p === "Facebook" ? "👥 " : p === "LinkedIn" ? "💼 " : "📸 "}{p}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-xs font-bold text-gray-500 mb-2 block uppercase tracking-wide">Link bài đăng</label>
              <div className="flex gap-2">
                <input value={link} onChange={e => setLink(e.target.value)}
                  placeholder={`Dán link ${platform ?? "bài đăng"} của bạn...`}
                  className="flex-1 rounded-xl px-4 py-2.5 text-sm border-2 outline-none transition-all"
                  style={{ borderColor: "#EDD9C8", color: DG }}
                  onFocus={e => (e.currentTarget as HTMLElement).style.borderColor = O}
                  onBlur={e => (e.currentTarget as HTMLElement).style.borderColor = "#EDD9C8"}
                />
                <button disabled={!link.trim() || !platform} onClick={() => setSubmitted(true)}
                  className={`px-4 py-2.5 rounded-xl text-sm font-bold text-white transition-all ${link.trim() && platform ? "hover:opacity-90" : "opacity-40 cursor-not-allowed"}`}
                  style={{ backgroundColor: O }}>Nộp</button>
              </div>
            </div>
          </div>
        )}
        {isActive && submitted && (
          <div className="rounded-xl p-3.5 border" style={{ backgroundColor: "#FDE8D0", borderColor: `${LG}60` }}>
            <div className="text-sm font-semibold" style={{ color: DG }}>Đã gửi — đang chờ BTC duyệt ✓</div>
            <div className="text-xs text-gray-500 mt-0.5">Thường được duyệt trong 24-48h làm việc.</div>
          </div>
        )}
        {sc.status === "locked" && (
          <div className="flex items-center gap-2 text-xs text-gray-400 mt-1">
            <Lock className="w-3.5 h-3.5" />
            <span>Sẽ mở khi vòng {sc.round.split(" – ")[0]} bắt đầu</span>
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Task Center ──────────────────────────────────────────────────────────────

function TaskCenter() {
  const [tab, setTab] = useState<TTab>("submissions")
  const [expanded, setExpanded] = useState<number | null>(null)
  const [chosenDir, setChosenDir] = useState<string | null>(null)

  const tabs: { id: TTab; label: string; Icon: any }[] = [
    { id: "direction",   label: "Chọn hướng GAD/AD+",  Icon: Layers },
    { id: "social",      label: "Social Challenge",      Icon: Megaphone },
    { id: "submissions", label: "Nộp bài",              Icon: Upload },
    { id: "team",        label: "Hoạt động team",       Icon: Users },
    { id: "final",       label: "Bài thi cuối vòng",    Icon: Award },
  ]

  const typeMap: Record<string, { Icon: any; label: string; cls: string }> = {
    cv:    { Icon: FileText, label: "CV",       cls: "bg-blue-100 text-blue-700" },
    essay: { Icon: FileText, label: "Bài luận", cls: "bg-purple-100 text-purple-700" },
    link:  { Icon: Link2,    label: "Link",      cls: "bg-cyan-100 text-cyan-700" },
    video: { Icon: Video,    label: "Video",     cls: "bg-pink-100 text-pink-700" },
    file:  { Icon: FileText, label: "File",      cls: "bg-amber-100 text-amber-700" },
  }

  return (
    <div className="flex flex-col h-full">
      <div className="bg-white border-b border-gray-100 px-4 lg:px-6 overflow-x-auto flex-shrink-0">
        <div className="flex">
          {tabs.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`flex items-center gap-2 px-4 py-4 text-sm font-semibold border-b-2 whitespace-nowrap transition-all ${
                tab === t.id ? "border-[#F26522] text-[#F26522]" : "border-transparent text-gray-400 hover:text-gray-700 hover:border-gray-200"
              }`}>
              <t.Icon className="w-3.5 h-3.5" />{t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* ── Direction ── */}
        {tab === "direction" && (
          <div className="p-4 lg:p-6">
            <div className="mb-5">
              <h2 className="text-lg font-bold" style={{ color: DG }}>Chọn hướng phát triển — R2</h2>
              <p className="text-sm text-gray-400 mt-1">Lựa chọn định hướng sự nghiệp Advisor. Quyết định này sẽ ảnh hưởng đến Office Matching tại R4.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-3xl">
              {[
                {
                  id: "gad", title: "GAD Track", fullName: "General Agency Development",
                  emoji: "🌟", color: O,
                  tagline: "Xây dựng thương hiệu cá nhân · Mạng lưới rộng · BHNT & Tài chính",
                  desc: "Phát triển theo mô hình agency rộng — tự xây dựng đội nhóm, mở rộng thị trường và trở thành Advisor độc lập với thu nhập không giới hạn.",
                  perks: ["Chứng chỉ MICA / Agent License", "Mentor 1-1 với GA Lead", "Tự quản lý danh mục khách hàng", "Hoa hồng không giới hạn + override", "Office tại HN hoặc HCMC theo lựa chọn"],
                  req: "Advisory Fit ≥ 55% · Có tư duy kinh doanh độc lập",
                },
                {
                  id: "adplus", title: "AD+ Track", fullName: "Agency Director Plus",
                  emoji: "🎯", color: DG,
                  tagline: "Chuyên sâu · Quản lý nhóm · Con đường Agency Director",
                  desc: "Theo lộ trình trở thành Agency Director — quản lý đội nhóm, đào tạo Advisor mới và phát triển chiến lược kinh doanh cấp cao.",
                  perks: ["Fast-track lên Agency Director trong 12-18 tháng", "Đào tạo leadership & team management", "KPI rõ ràng với lộ trình thăng tiến minh bạch", "Thưởng team performance + personal bonus", "Ưu tiên văn phòng trung tâm HN/HCMC"],
                  req: "Commitment ≥ 70% · Điểm Interview ≥ 80/100",
                },
              ].map(dir => (
                <div key={dir.id}
                  onClick={() => setChosenDir(chosenDir === dir.id ? null : dir.id)}
                  className={`bg-white rounded-2xl border-2 p-5 cursor-pointer transition-all hover:shadow-md ${chosenDir === dir.id ? "" : "border-gray-100 hover:border-gray-200"}`}
                  style={chosenDir === dir.id ? { borderColor: dir.color, boxShadow: `0 0 0 3px ${dir.color}20` } : {}}>
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="text-2xl mb-1">{dir.emoji}</div>
                      <div className="font-black text-xl" style={{ color: dir.color }}>{dir.title}</div>
                      <div className="text-xs text-gray-400 mt-0.5">{dir.fullName}</div>
                    </div>
                    {chosenDir === dir.id ? (
                      <div className="w-7 h-7 rounded-full flex items-center justify-center text-white flex-shrink-0" style={{ backgroundColor: dir.color }}>
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                    ) : (
                      <div className="w-7 h-7 rounded-full border-2 flex-shrink-0" style={{ borderColor: "#EDD9C8" }} />
                    )}
                  </div>
                  <div className="text-xs font-semibold px-2.5 py-1.5 rounded-lg mb-3 inline-block" style={{ backgroundColor: `${dir.color}10`, color: dir.color }}>
                    {dir.tagline}
                  </div>
                  <p className="text-sm text-gray-500 mb-4 leading-relaxed">{dir.desc}</p>
                  <div className="space-y-1.5 mb-4">
                    {dir.perks.map((p, i) => (
                      <div key={i} className="flex items-start gap-2 text-sm">
                        <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" style={{ color: dir.color }} />
                        <span style={{ color: DG }}>{p}</span>
                      </div>
                    ))}
                  </div>
                  <div className="text-xs text-gray-500 bg-gray-50 rounded-lg px-3 py-2">
                    <span className="font-semibold">Điều kiện: </span>{dir.req}
                  </div>
                </div>
              ))}
            </div>
            {chosenDir && (
              <div className="mt-5 max-w-3xl">
                <div className="rounded-xl p-4 mb-3" style={{ backgroundColor: "#FEF3E8", border: `1px solid ${O}30` }}>
                  <div className="text-sm font-semibold" style={{ color: O }}>⚠ Lưu ý quan trọng</div>
                  <div className="text-xs text-gray-600 mt-1">Bạn có thể thay đổi lựa chọn trước deadline 22/4/2027. Sau khi vòng R2 đóng, lựa chọn sẽ được khóa lại.</div>
                </div>
                <button className="text-white px-6 py-3.5 rounded-xl font-bold text-sm flex items-center gap-2 hover:opacity-90 active:scale-95 transition-all"
                  style={{ backgroundColor: O, boxShadow: `0 4px 14px rgba(232,119,34,0.35)` }}>
                  <CheckCircle2 className="w-4 h-4" />
                  Xác nhận chọn {chosenDir === "gad" ? "GAD Track 🌟" : "AD+ Track 🎯"} →
                </button>
              </div>
            )}
          </div>
        )}

        {/* ── Social Challenge ── */}
        {tab === "social" && (
          <div className="p-4 lg:p-6 max-w-3xl mx-auto w-full space-y-4">
            <div className="mb-1">
              <h2 className="text-lg font-bold" style={{ color: DG }}>Social Challenge</h2>
              <p className="text-sm text-gray-400 mt-1">Chia sẻ hành trình F Program của bạn — mỗi vòng có 1 Social Challenge. Hoàn thành để nhận điểm Commitment.</p>
            </div>

            {socialChallenges.map(sc => (
              <SocialChallengeCard key={sc.roundId} sc={sc} />
            ))}
          </div>
        )}

        {/* ── Submissions ── */}
        {tab === "submissions" && (
          <div className="p-4 lg:p-6 max-w-3xl mx-auto w-full">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
              {[
                { l: "Đã duyệt",  s: "approved",       cls: "bg-green-50 text-green-700" },
                { l: "Đang xét",  s: "submitted",       cls: "bg-blue-50 text-blue-700" },
                { l: "Cần sửa",   s: "needs_revision",  cls: "bg-amber-50 text-amber-700" },
                { l: "Chưa nộp",  s: "pending",         cls: "bg-gray-50 text-gray-600" },
              ].map(s => (
                <div key={s.l} className={`${s.cls} rounded-xl p-4`}>
                  <div className="text-2xl font-bold">{submissions.filter(x => x.status === s.s).length}</div>
                  <div className="text-sm font-medium mt-0.5 opacity-80">{s.l}</div>
                </div>
              ))}
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
              <div className="divide-y divide-gray-50">
                {submissions.map(sub => {
                  const ti = typeMap[sub.type]
                  const isOpen = expanded === sub.id
                  return (
                    <div key={sub.id} className={`transition-colors ${isOpen ? "bg-gray-50/50" : "hover:bg-gray-50/30"}`}>
                      <div className="flex items-center gap-3.5 px-5 py-4 cursor-pointer"
                        onClick={() => setExpanded(isOpen ? null : sub.id)}>
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${ti.cls}`}>
                          <ti.Icon className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-sm truncate" style={{ color: DG }}>{sub.title}</div>
                          <div className="flex items-center gap-2 mt-1 flex-wrap">
                            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${ti.cls}`}>{ti.label}</span>
                            <DeadlineChip deadline={sub.deadline} />
                          </div>
                        </div>
                        <div className="flex items-center gap-3 flex-shrink-0">
                          {sub.score != null && <div className="text-sm font-bold font-mono hidden sm:block" style={{ color: DG }}>{sub.score}%</div>}
                          <StatusBadge status={sub.status} />
                          <ChevronRight className={`w-4 h-4 text-gray-300 transition-transform ${isOpen ? "rotate-90" : ""}`} />
                        </div>
                      </div>
                      {isOpen && (
                        <div className="px-5 pb-5">
                          {sub.fb && (
                            <div className={`rounded-xl p-3.5 text-sm mb-4 leading-relaxed ${
                              sub.status === "approved" ? "bg-green-50 text-green-800 border border-green-100" :
                              sub.status === "needs_revision" ? "bg-amber-50 text-amber-800 border border-amber-100" :
                              "bg-blue-50 text-blue-800 border border-blue-100"
                            }`}>
                              <span className="font-semibold">Nhận xét BTC: </span>{sub.fb}
                            </div>
                          )}
                          {(sub.status === "pending" || sub.status === "needs_revision") && (
                            <div className="border-2 border-dashed rounded-xl p-5 text-center group cursor-pointer transition-all hover:bg-orange-50/40"
                              style={{ borderColor: "#EDD9C8" }}
                              onMouseEnter={e => (e.currentTarget as HTMLElement).style.borderColor = O}
                              onMouseLeave={e => (e.currentTarget as HTMLElement).style.borderColor = "#EDD9C8"}>
                              <Upload className="w-6 h-6 text-gray-300 mx-auto mb-2 group-hover:text-[#F26522] transition-colors" />
                              <div className="text-sm font-semibold text-gray-500 group-hover:text-gray-700">
                                {sub.type === "link" ? "Dán link vào đây" : "Kéo thả file hoặc nhấn để tải lên"}
                              </div>
                              <div className="text-xs text-gray-300 mt-1">Tối đa 50MB</div>
                              <button className="mt-4 text-white text-sm font-bold px-5 py-2 rounded-lg hover:opacity-90 transition-all"
                                style={{ backgroundColor: O }}>
                                {sub.type === "link" ? "Nộp link" : "Chọn file"}
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        )}

        {/* ── Team Activities ── */}
        {tab === "team" && (
          <div className="p-4 lg:p-6 max-w-3xl mx-auto w-full">
            <div className="mb-5">
              <h2 className="text-lg font-bold" style={{ color: DG }}>Hoạt động team</h2>
              <p className="text-sm text-gray-400 mt-1">Tham gia đầy đủ để tích lũy điểm Commitment.</p>
            </div>
            <div className="space-y-3">
              {teamActivities.map(act => (
                <div key={act.id} className={`bg-white rounded-2xl border p-4 flex items-center gap-4 ${act.status === "today" ? "border-orange-200" : "border-gray-100"}`}
                  style={act.status === "today" ? { boxShadow: `0 0 0 3px rgba(232,119,34,0.1)` } : {}}>
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0 ${
                    act.status === "done" ? "bg-green-50" : act.status === "today" ? "bg-orange-50" : "bg-blue-50"
                  }`}>
                    {act.type === "fieldtrip" ? "🏢" : act.type === "shadow" ? "👤" : act.type === "qa" ? "💬" : act.type === "roleplay" ? "🎭" : "⚡"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-sm" style={{ color: DG }}>{act.title}</div>
                    <div className="flex items-center gap-2 mt-1 text-xs text-gray-400">
                      <Calendar className="w-3 h-3" />{act.date}
                      <span className="text-green-600 font-semibold">+{act.pts} pts</span>
                    </div>
                  </div>
                  <div className="flex-shrink-0">
                    {act.status === "done" ? (
                      <span className="flex items-center gap-1 text-xs font-semibold text-green-600 bg-green-50 px-3 py-1.5 rounded-full">
                        <CheckCircle2 className="w-3.5 h-3.5" />Hoàn thành
                      </span>
                    ) : act.status === "today" ? (
                      <button className="text-white text-xs font-bold px-3 py-1.5 rounded-full hover:opacity-90 transition-all"
                        style={{ backgroundColor: O }}>Tham gia ngay</button>
                    ) : (
                      <StatusBadge status="upcoming" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Final Exam ── */}
        {tab === "final" && (
          <div className="p-4 lg:p-6 max-w-2xl mx-auto w-full">
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
              <div className="p-6" style={{ background: `linear-gradient(135deg, ${O}, #E84800)` }}>
                <Award className="w-10 h-10 text-white mb-3" />
                <div className="text-white font-bold text-lg">Bài thi cuối Vòng 2</div>
                <div className="text-white/60 text-sm mt-1">Case Study: Lập kế hoạch tài chính toàn diện</div>
              </div>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  {[["Hình thức","Deck / PDF (max 20 slides)"],["Deadline","22/08/2026"],["Điểm tối đa","200 pts"],["Nộp tối đa","2 lần"]].map(([l,v]) => (
                    <div key={l} className="bg-gray-50 rounded-xl p-3">
                      <div className="text-gray-400 text-xs">{l}</div>
                      <div className="font-semibold mt-0.5" style={{ color: DG }}>{v}</div>
                    </div>
                  ))}
                </div>
                <div className="bg-orange-50 border border-orange-100 rounded-xl p-4 text-sm" style={{ color: DG }}>
                  <div className="font-semibold mb-1">Đề bài:</div>
                  <p className="text-gray-600 leading-relaxed">Khách hàng Anh Tuấn, 35 tuổi, có 2 con nhỏ và thu nhập 30 triệu/tháng. Lập kế hoạch tài chính 20 năm bao gồm: quỹ khẩn cấp, bảo hiểm, đầu tư và học phí cho con.</p>
                </div>
                <div className="border-2 border-dashed rounded-xl p-5 text-center cursor-pointer hover:bg-orange-50/30 transition-all"
                  style={{ borderColor: "#EDD9C8" }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.borderColor = O}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.borderColor = "#EDD9C8"}>
                  <Upload className="w-7 h-7 mx-auto mb-2 text-gray-300" />
                  <div className="text-sm font-semibold text-gray-500">Kéo thả file hoặc nhấn để chọn</div>
                  <div className="text-xs text-gray-300 mt-1">PDF, PPTX — tối đa 50MB</div>
                  <button className="mt-4 text-white text-sm font-bold px-6 py-2.5 rounded-xl hover:opacity-90 active:scale-95 transition-all"
                    style={{ backgroundColor: O }}>Nộp bài thi</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Interview ────────────────────────────────────────────────────────────────

function Interview() {
  const [pickedSlot, setPickedSlot] = useState<string | null>(null)
  const [confirmed, setConfirmed] = useState(false)

  return (
    <div className="p-4 lg:p-6 space-y-5 max-w-3xl mx-auto w-full">
      {confirmed ? (
        <div className="bg-white rounded-2xl border border-gray-100 text-center p-10">
          <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: "#EAFAF5" }}>
            <CheckCircle2 className="w-8 h-8" style={{ color: LG }} />
          </div>
          <div className="text-xl font-bold" style={{ color: DG }}>Đã đặt lịch thành công!</div>
          <div className="text-gray-500 mt-2">{pickedSlot}</div>
          <div className="mt-4 text-sm text-gray-400">Link Zoom sẽ được gửi đến email của bạn trước 30 phút.</div>
          <button onClick={() => { setConfirmed(false); setPickedSlot(null) }}
            className="mt-6 border-2 py-2.5 px-5 rounded-xl font-semibold text-sm hover:opacity-70 transition-all"
            style={{ borderColor: "#EDD9C8", color: DG }}>Đặt lại lịch</button>
        </div>
      ) : (
        <>
          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl overflow-hidden flex items-center justify-center text-white font-bold flex-shrink-0"
                style={{ backgroundColor: O }}>BL</div>
              <div>
                <div className="font-bold" style={{ color: DG }}>Nguyễn Bảo Long</div>
                <div className="text-sm text-gray-500">Senior Advisor · FWD Vietnam · 8 năm kinh nghiệm</div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {["Tư vấn hưu trí","Bảo hiểm nhân thọ","Financial Planning"].map(t => (
                    <span key={t} className="text-xs px-2.5 py-1 rounded-full" style={{ backgroundColor: "#F5E8DC", color: DG }}>{t}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Chọn khung giờ phỏng vấn</div>
            <div className="space-y-4">
              {interviewSlots.map(day => (
                <div key={day.date}>
                  <div className="text-sm font-semibold mb-2" style={{ color: DG }}>{day.date}</div>
                  <div className="flex flex-wrap gap-2">
                    {day.slots.map(slot => {
                      const key = `${day.date} ${slot}`
                      return (
                        <button key={slot} onClick={() => setPickedSlot(key)}
                          className={`px-4 py-2 rounded-xl text-sm font-semibold border-2 transition-all ${pickedSlot === key ? "text-white" : "hover:border-[#F26522] hover:text-[#F26522]"}`}
                          style={{
                            borderColor: pickedSlot === key ? O : "#EDD9C8",
                            backgroundColor: pickedSlot === key ? O : "white",
                            color: pickedSlot === key ? "white" : DG,
                          }}>
                          {slot}
                        </button>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>
            <button
              disabled={!pickedSlot}
              onClick={() => pickedSlot && setConfirmed(true)}
              className={`w-full mt-5 py-3.5 rounded-xl font-bold text-sm transition-all ${pickedSlot ? "text-white hover:opacity-90 active:scale-95" : "cursor-not-allowed opacity-40"}`}
              style={{ backgroundColor: pickedSlot ? O : "#EDD9C8", color: pickedSlot ? "white" : DG }}>
              {pickedSlot ? `Xác nhận: ${pickedSlot}` : "Chọn khung giờ để tiếp tục"}
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Hướng dẫn chuẩn bị</div>
            <ul className="space-y-2.5">
              {[
                "Mặc trang phục lịch sự, kiểm tra camera và micro trước 10 phút",
                "Chuẩn bị CV và portfolio để chia sẻ màn hình nếu được yêu cầu",
                "Ôn lại kiến thức về sản phẩm FWD và quy trình tư vấn cơ bản",
                "Chuẩn bị 2-3 ví dụ về tình huống bạn đã xử lý trong AI Simulation",
                "Nghĩ về lý do tại sao bạn phù hợp với nghề Advisor tài chính",
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-gray-600">
                  <span className="w-5 h-5 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0 mt-0.5"
                    style={{ backgroundColor: O }}>{i + 1}</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </>
      )}
    </div>
  )
}

// ─── Results & Scorecard ──────────────────────────────────────────────────────

function Results() {
  const [tab, setTab] = useState<RTab>("score")
  const [expandedRound, setExpandedRound] = useState<string | null>("v1")

  const dimDefs = [
    { key: "cap" as const, label: "Capability",   color: O,  pct: radarData[0].value },
    { key: "com" as const, label: "Commitment",   color: LG, pct: radarData[1].value },
    { key: "fit" as const, label: "Advisory Fit", color: BL, pct: radarData[2].value },
  ]

  const roundStatuses = [
    { round: "V1 – CREATE",  desc: "Do you have capabilities?",      threshold: 60,  pct: 88, status: "completed" },
    { round: "V2 – BUILD",   desc: "Can you commit?",                threshold: 70,  pct: 82, status: "in_progress" },
    { round: "V3 – PROVE",   desc: "Are you the right fit?",         threshold: 75,  pct: null, status: "locked" },
    { round: "Graduate",     desc: "Office Matching & Certification", threshold: null,pct: null, status: "locked" },
  ]

  return (
    <div className="flex flex-col h-full">
      <div className="bg-white border-b border-gray-100 px-4 lg:px-6 overflow-x-auto flex-shrink-0">
        <div className="flex">
          {[
            { id: "score"     as RTab, label: "Điểm & Radar" },
            { id: "mechanics" as RTab, label: "Cơ chế tính điểm" },
            { id: "status"    as RTab, label: "Trạng thái vòng" },
            { id: "history"   as RTab, label: "Lịch sử hoạt động" },
          ].map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`px-4 py-4 text-sm font-semibold border-b-2 whitespace-nowrap transition-all ${
                tab === t.id ? "border-[#F26522] text-[#F26522]" : "border-transparent text-gray-400 hover:text-gray-700"
              }`}>{t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* ── Score & Radar ── */}
        {tab === "score" && (
          <div className="p-4 lg:p-6 space-y-5 max-w-5xl mx-auto w-full">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
              <div className="lg:col-span-2 rounded-2xl p-6" style={{ backgroundColor: O }}>
                <div className="text-white/40 text-xs font-bold uppercase tracking-widest mb-3">Tổng điểm</div>
                <div className="text-6xl font-black text-white font-mono">{ME.totalScore}</div>
                <div className="text-white/30 text-sm mt-1">/ {ME.maxScore} điểm tối đa</div>
                <div className="mt-3 h-2 rounded-full overflow-hidden" style={{ backgroundColor: "rgba(255,255,255,0.15)" }}>
                  <div className="h-full rounded-full" style={{ width: `${(ME.totalScore/ME.maxScore)*100}%`, background: `linear-gradient(90deg, ${O}, ${YL})` }} />
                </div>
                <div className="mt-2 text-xs text-white/30">V3 locked — {1000-ME.totalScore} pts còn lại</div>
                <div className="grid grid-cols-2 gap-4 mt-5 pt-5 border-t border-white/10">
                  <div><div className="text-3xl font-black text-white">#{ME.rank}</div><div className="text-white/40 text-xs mt-0.5">/ {ME.total} ứng viên</div></div>
                  <div><div className="text-3xl font-black" style={{ color: LG }}>PASS</div><div className="text-white/40 text-xs mt-0.5">V1 + V2 ✓</div></div>
                </div>
                {/* Per-round pts */}
                <div className="mt-4 pt-4 border-t border-white/10 space-y-2">
                  {rounds.map(r => (
                    <div key={r.id} className="flex items-center justify-between text-xs">
                      <span className="text-white/50">{r.name}</span>
                      <span className={`font-bold font-mono ${r.status === "locked" ? "text-white/20" : "text-white"}`}>
                        {r.status === "locked" ? "—" : `${r.candidatePts} / ${r.max}`}
                      </span>
                    </div>
                  ))}
                  <div className="flex items-center justify-between text-xs border-t border-white/10 pt-2">
                    <span className="text-white/50">Bonus/Deduction</span>
                    <span className="font-bold font-mono text-green-400">+20</span>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-3 bg-white rounded-2xl border border-gray-100 p-5">
                <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Radar — 3 chiều cạnh</div>
                <div className="text-xs text-gray-400 mb-2">Advisory Fit thấp do V3 (Interview) chưa thực hiện — sẽ tăng mạnh sau phỏng vấn</div>
                <ResponsiveContainer width="100%" height={185}>
                  <RadarChart data={radarData} margin={{ top: 10, right: 25, left: 25, bottom: 10 }}>
                    <PolarGrid stroke="#EDD9C8" strokeWidth={1} />
                    <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11, fontWeight: 700, fill: DG, fontFamily: "'Be Vietnam Pro'" }} />
                    <Radar dataKey="value" stroke={O} fill={O} fillOpacity={0.18} strokeWidth={2.5} dot={false} />
                  </RadarChart>
                </ResponsiveContainer>
                <div className="grid grid-cols-3 gap-2.5">
                  {dimDefs.map(d => {
                    const earned = ME.dimPts[d.key]
                    const max = DIM_MAX[d.key]
                    return (
                      <div key={d.label} className="rounded-xl p-3" style={{ backgroundColor: "#FEF6F0" }}>
                        <div className="flex items-end justify-between mb-1.5">
                          <span className="text-[10px] font-bold text-gray-500 uppercase leading-tight">{d.label}</span>
                          <span className="text-base font-black font-mono" style={{ color: d.color }}>{d.pct}%</span>
                        </div>
                        <div className="h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: "#EDD9C8" }}>
                          <div className="h-full rounded-full transition-all duration-700" style={{ width: `${d.pct}%`, backgroundColor: d.color }} />
                        </div>
                        <div className="flex justify-between text-[10px] mt-1.5">
                          <span className="text-gray-400 font-mono">{earned}/{max} pts</span>
                          <span className={`font-semibold ${d.pct >= 70 ? "text-green-600" : d.pct >= 55 ? "text-amber-600" : "text-red-500"}`}>
                            {d.pct >= 70 ? "✓ Tốt" : d.pct >= 55 ? "△ Khá" : "✗ Cần V3"}
                          </span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* Dimension breakdown by round */}
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-50">
                <div className="text-xs font-bold text-gray-400 uppercase tracking-widest">Điểm từng dimension theo vòng</div>
                <div className="text-xs text-gray-400 mt-0.5">Mỗi round đóng góp khác nhau vào từng dimension</div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead><tr className="border-b border-gray-50">
                    {["Round","Max pts","Capability","Commitment","Advisory Fit","% đạt","Status"].map(h => (
                      <th key={h} className="text-left px-4 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-wider whitespace-nowrap">{h}</th>
                    ))}
                  </tr></thead>
                  <tbody>
                    {rounds.map((r, i) => (
                      <tr key={r.id} className={`border-b border-gray-50 ${r.status === "in_progress" ? "bg-orange-50/20" : r.status === "locked" ? "opacity-50" : "hover:bg-gray-50/40"}`}>
                        <td className="px-4 py-3.5">
                          <div className="font-bold text-xs" style={{ color: DG }}>{r.name}</div>
                          <div className="text-[10px] text-gray-400">{r.question.slice(0,30)}…</div>
                        </td>
                        <td className="px-4 py-3.5 font-mono font-bold text-xs" style={{ color: DG }}>{r.max}</td>
                        {(["cap","com","fit"] as const).map(k => (
                          <td key={k} className="px-4 py-3.5 text-center">
                            {r.earnedDim[k] > 0
                              ? <span className="font-bold font-mono text-sm" style={{ color: dimDefs.find(d=>d.key===k)!.color }}>{r.earnedDim[k]}</span>
                              : <span className="text-gray-200">—</span>}
                          </td>
                        ))}
                        <td className="px-4 py-3.5 text-center">
                          {r.candidatePct != null
                            ? <span className={`font-black font-mono text-sm ${r.candidatePct >= r.threshold ? "text-green-600" : "text-red-500"}`}>{r.candidatePct}%</span>
                            : <span className="text-gray-200">—</span>}
                        </td>
                        <td className="px-4 py-3.5">
                          <StatusBadge status={r.status} />
                        </td>
                      </tr>
                    ))}
                    {/* Total row */}
                    <tr className="border-t-2" style={{ borderColor: "#EDD9C8" }}>
                      <td className="px-4 py-3.5 font-black text-sm" style={{ color: DG }}>Tổng</td>
                      <td className="px-4 py-3.5 font-black font-mono" style={{ color: DG }}>1000</td>
                      {dimDefs.map(d => (
                        <td key={d.key} className="px-4 py-3.5 text-center">
                          <span className="font-black font-mono text-sm" style={{ color: d.color }}>{ME.dimPts[d.key]}</span>
                        </td>
                      ))}
                      <td className="px-4 py-3.5 text-center font-black font-mono" style={{ color: O }}>{ME.totalScore}</td>
                      <td className="px-4 py-3.5"><StatusBadge status="qualified" /></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ── Scoring Mechanics ── */}
        {tab === "mechanics" && (
          <div className="p-4 lg:p-6 space-y-6 max-w-5xl mx-auto w-full">
            {/* Round breakdown */}
            <div className="space-y-3">
              <div className="text-xs font-bold text-gray-400 uppercase tracking-widest px-1">Chi tiết từng vòng</div>
              {rounds.map(r => (
                <div key={r.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                  <button
                    onClick={() => setExpandedRound(expandedRound === r.id ? null : r.id)}
                    className="w-full flex items-center gap-4 px-5 py-4 hover:bg-gray-50/40 transition-colors">
                    <div className="w-11 h-11 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                      style={{ backgroundColor: `${r.color}20`, border: `2px solid ${r.color}40` }}>
                      {r.emoji}
                    </div>
                    <div className="flex-1 text-left">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold" style={{ color: DG }}>{r.name}</span>
                        <span className="text-xs px-2 py-0.5 rounded-full font-semibold"
                          style={{ backgroundColor: `${r.color}15`, color: r.color }}>Max {r.max} pts</span>
                        <span className="text-xs text-gray-400">· Threshold ≥{r.threshold}%</span>
                      </div>
                      <div className="text-xs text-gray-500 mt-0.5 italic">"{r.question}"</div>
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0">
                      {r.candidatePct != null && (
                        <div className="text-right">
                          <div className="text-lg font-black font-mono" style={{ color: r.candidatePct >= r.threshold ? "#16A34A" : "#D93025" }}>{r.candidatePct}%</div>
                          <div className="text-[10px] text-gray-400">{r.candidatePts} pts</div>
                        </div>
                      )}
                      {r.status === "locked" && <Lock className="w-4 h-4 text-gray-300" />}
                      {r.status === "completed" && <CheckCircle2 className="w-5 h-5 text-green-500" />}
                      {r.status === "in_progress" && <CircleDot className="w-5 h-5" style={{ color: O }} />}
                      <ChevronRight className={`w-4 h-4 text-gray-300 transition-transform ${expandedRound === r.id ? "rotate-90" : ""}`} />
                    </div>
                  </button>

                  {expandedRound === r.id && (
                    <div className="px-5 pb-5 border-t border-gray-50">
                      {/* Dimension weight bar */}
                      <div className="mt-4 mb-4">
                        <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Phân bổ theo dimension (% of {r.max} max pts)</div>
                        <div className="flex h-5 rounded-lg overflow-hidden gap-px">
                          {(() => {
                            const totals = r.activities.reduce((acc, a) => ({
                              cap: acc.cap + a.cap, com: acc.com + a.com, fit: acc.fit + a.fit
                            }), { cap: 0, com: 0, fit: 0 })
                            return [
                              { label: "Cap", pct: totals.cap, color: O },
                              { label: "Com", pct: totals.com, color: LG },
                              { label: "Fit", pct: totals.fit, color: BL },
                            ].map(s => s.pct > 0 ? (
                              <div key={s.label} className="flex items-center justify-center text-white text-[10px] font-bold transition-all"
                                style={{ width: `${s.pct}%`, backgroundColor: s.color }}>
                                {s.pct >= 15 ? `${s.label} ${s.pct}%` : s.pct >= 8 ? `${s.pct}%` : ""}
                              </div>
                            ) : null)
                          })()}
                        </div>
                      </div>

                      {/* Activity table */}
                      <div className="overflow-x-auto rounded-xl border border-gray-100">
                        <table className="w-full text-xs">
                          <thead style={{ backgroundColor: "#FEF6F0" }}>
                            <tr>
                              <th className="text-left px-4 py-3 font-bold text-gray-500 uppercase tracking-wider">Hoạt động</th>
                              <th className="text-center px-3 py-3 font-bold text-gray-500 uppercase">% weight</th>
                              <th className="text-center px-3 py-3 font-bold uppercase" style={{ color: O }}>Cap</th>
                              <th className="text-center px-3 py-3 font-bold uppercase" style={{ color: "#22A262" }}>Com</th>
                              <th className="text-center px-3 py-3 font-bold uppercase" style={{ color: BL }}>Fit</th>
                            </tr>
                          </thead>
                          <tbody>
                            {r.activities.map((act, i) => (
                              <tr key={i} className={`border-t border-gray-50 ${i % 2 === 1 ? "bg-gray-50/30" : ""}`}>
                                <td className="px-4 py-3 font-medium" style={{ color: DG }}>{act.name}</td>
                                <td className="px-3 py-3 text-center">
                                  <span className="font-mono font-bold" style={{ color: r.color }}>{act.pct}%</span>
                                </td>
                                <td className="px-3 py-3 text-center font-mono">{act.cap > 0 ? <span style={{ color: O }}>{act.cap}%</span> : <span className="text-gray-200">—</span>}</td>
                                <td className="px-3 py-3 text-center font-mono">{act.com > 0 ? <span style={{ color: "#22A262" }}>{act.com}%</span> : <span className="text-gray-200">—</span>}</td>
                                <td className="px-3 py-3 text-center font-mono">{act.fit > 0 ? <span style={{ color: BL }}>{act.fit}%</span> : <span className="text-gray-200">—</span>}</td>
                              </tr>
                            ))}
                            {/* Total row */}
                            <tr className="border-t-2" style={{ borderColor: "#EDD9C8", backgroundColor: "#FEF6F0" }}>
                              <td className="px-4 py-3 font-black" style={{ color: DG }}>Total</td>
                              <td className="px-3 py-3 text-center font-black font-mono">100%</td>
                              {[
                                r.activities.reduce((s,a)=>s+a.cap,0),
                                r.activities.reduce((s,a)=>s+a.com,0),
                                r.activities.reduce((s,a)=>s+a.fit,0),
                              ].map((t, i) => (
                                <td key={i} className="px-3 py-3 text-center font-black font-mono" style={{ color: [O,"#22A262",BL][i] }}>{t}%</td>
                              ))}
                            </tr>
                          </tbody>
                        </table>
                      </div>

                      {r.id === "v2" && (
                        <div className="mt-3 text-xs rounded-xl px-4 py-3 border" style={{ backgroundColor: "#FEF3E8", borderColor: `${O}30`, color: O }}>
                          ⚡ <strong>Early completion bonus +10 pts</strong> — First come, first served. Nộp sớm trước deadline để nhận điểm thưởng.
                        </div>
                      )}

                      {/* Candidate performance bar */}
                      {r.candidatePct != null && (
                        <div className="mt-4 pt-4 border-t border-gray-100">
                          <div className="flex items-center justify-between mb-2 text-xs">
                            <span className="font-bold text-gray-500">Kết quả của bạn</span>
                            <span className="font-black font-mono" style={{ color: r.candidatePct >= r.threshold ? "#16A34A" : "#D93025" }}>
                              {r.candidatePct}% {r.candidatePct >= r.threshold ? "✓ PASS" : "✗ FAIL"}
                            </span>
                          </div>
                          <div className="relative h-4 rounded-full overflow-hidden" style={{ backgroundColor: "#F5E8DC" }}>
                            <div className="h-full rounded-full transition-all duration-700"
                              style={{ width: `${r.candidatePct}%`, backgroundColor: r.candidatePct >= r.threshold ? "#16A34A" : "#D93025" }} />
                            {/* Threshold marker */}
                            <div className="absolute top-0 bottom-0 w-0.5 bg-amber-500"
                              style={{ left: `${r.threshold}%` }} />
                            <div className="absolute top-full mt-0.5 text-[9px] font-bold text-amber-600" style={{ left: `${r.threshold}%`, transform: "translateX(-50%)" }}>
                              {r.threshold}%
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Dimension weight summary table */}
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-50">
                <div className="text-xs font-bold text-gray-400 uppercase tracking-widest">Ma trận trọng số Dimension × Round</div>
                <div className="text-xs text-gray-400 mt-0.5">% điểm của mỗi round được phân bổ vào từng dimension</div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead style={{ backgroundColor: "#FEF6F0" }}>
                    <tr className="border-b border-gray-100">
                      <th className="text-left px-5 py-3.5 text-xs font-bold text-gray-500 uppercase">Round</th>
                      <th className="text-center px-5 py-3.5 text-xs font-bold uppercase" style={{ color: O }}>Capability</th>
                      <th className="text-center px-5 py-3.5 text-xs font-bold uppercase" style={{ color: "#22A262" }}>Commitment</th>
                      <th className="text-center px-5 py-3.5 text-xs font-bold uppercase" style={{ color: BL }}>Advisory Fit</th>
                      <th className="text-center px-5 py-3.5 text-xs font-bold text-gray-500 uppercase">Max</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { round: "V1 – CREATE", cap: 55, com: 10, fit: 35, max: 500, capMax: 275, comMax: 50, fitMax: 175 },
                      { round: "V2 – BUILD",  cap: 35, com: 30, fit: 35, max: 250, capMax: 87,  comMax: 75, fitMax: 87  },
                      { round: "V3 – PROVE",  cap: 25, com: 15, fit: 60, max: 250, capMax: 62,  comMax: 37, fitMax: 150 },
                    ].map((row, i) => (
                      <tr key={i} className="border-b border-gray-50 hover:bg-gray-50/30">
                        <td className="px-5 py-3.5 font-semibold text-sm" style={{ color: DG }}>{row.round}</td>
                        {[{v:row.cap,max:row.capMax,c:O},{v:row.com,max:row.comMax,c:"#22A262"},{v:row.fit,max:row.fitMax,c:BL}].map((d,j) => (
                          <td key={j} className="px-5 py-3.5 text-center">
                            <div className="font-black font-mono text-base" style={{ color: d.c }}>{d.v}%</div>
                            <div className="text-[10px] text-gray-400 mt-0.5">{d.max} pts max</div>
                          </td>
                        ))}
                        <td className="px-5 py-3.5 text-center font-bold font-mono" style={{ color: DG }}>{row.max}</td>
                      </tr>
                    ))}
                    <tr style={{ backgroundColor: O }}>
                      <td className="px-5 py-3.5 font-black text-white text-sm">Tổng max</td>
                      {[{l:"425 pts",c:O},{l:"163 pts",c:LG},{l:"413 pts",c:BL}].map((d,i) => (
                        <td key={i} className="px-5 py-3.5 text-center">
                          <div className="font-black font-mono text-sm" style={{ color: d.c }}>{d.l}</div>
                        </td>
                      ))}
                      <td className="px-5 py-3.5 text-center font-black text-white font-mono">1000</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Bonus / Deduction rules */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                <div className="px-5 py-4 border-b" style={{ backgroundColor: "#EDFAF5", borderColor: "#B2EDD8" }}>
                  <div className="text-xs font-black uppercase tracking-widest text-green-700">Earn Points ⬆</div>
                </div>
                <div className="divide-y divide-gray-50">
                  {bonusRules.filter(r => r.type === "earn").map((r, i) => (
                    <div key={i} className="flex items-center gap-3 px-5 py-3.5">
                      <span className="text-lg font-black text-green-500 font-mono w-10 flex-shrink-0 text-right">{r.pts}</span>
                      <div className="flex-1">
                        <div className="text-sm font-semibold" style={{ color: DG }}>{r.rule}</div>
                        <div className="text-xs text-gray-400 mt-0.5">→ {r.dim}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                <div className="px-5 py-4 border-b" style={{ backgroundColor: "#FEF2F2", borderColor: "#FECACA" }}>
                  <div className="text-xs font-black uppercase tracking-widest text-red-700">Lose Points ⬇</div>
                </div>
                <div className="divide-y divide-gray-50">
                  {bonusRules.filter(r => r.type === "lose").map((r, i) => (
                    <div key={i} className="flex items-center gap-3 px-5 py-3.5">
                      <span className="text-lg font-black text-red-500 font-mono w-10 flex-shrink-0 text-right">{r.pts}</span>
                      <div className="flex-1">
                        <div className="text-sm font-semibold" style={{ color: DG }}>{r.rule}</div>
                        <div className="text-xs text-gray-400 mt-0.5">→ {r.dim}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Candidate current bonus log */}
            <div className="rounded-2xl p-5" style={{ backgroundColor: O }}>
              <div className="text-white/40 text-xs font-bold uppercase tracking-widest mb-3">Bonus/Deduction của bạn</div>
              <div className="space-y-2">
                {[
                  { rule: "Hoàn thành tất cả challenges V1", pts: "+10", earned: true },
                  { rule: "Hoàn thành nội dung học tập V1",  pts: "+5",  earned: true },
                  { rule: "Đóng góp Q&A",                    pts: "+5",  earned: true },
                  { rule: "Early completion V2",              pts: "+5",  earned: true },
                  { rule: "Incomplete submission (LinkedIn)", pts: "−5",  earned: false },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <span className={`font-black font-mono text-sm w-10 text-right flex-shrink-0 ${item.earned ? "text-green-400" : "text-red-400"}`}>{item.pts}</span>
                    <span className="text-white/70 text-sm">{item.rule}</span>
                    {item.earned ? <CheckCircle2 className="w-4 h-4 text-green-400 ml-auto flex-shrink-0" /> : <AlertTriangle className="w-4 h-4 text-red-400 ml-auto flex-shrink-0" />}
                  </div>
                ))}
                <div className="flex items-center justify-between border-t border-white/10 mt-3 pt-3">
                  <span className="text-white/50 text-sm">Tổng bonus/deduction</span>
                  <span className="text-white font-black font-mono text-lg">+20</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── Round Status ── */}
        {tab === "status" && (
          <div className="p-4 lg:p-6 max-w-2xl mx-auto w-full space-y-3">
            {roundStatuses.map((r, i) => (
              <div key={i} className={`bg-white rounded-2xl border overflow-hidden ${r.status === "in_progress" ? "border-orange-200" : "border-gray-100"}`}>
                <div className="flex items-center gap-4 p-5">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center font-bold text-white flex-shrink-0 text-lg"
                    style={{ backgroundColor: r.status === "completed" ? LG : r.status === "in_progress" ? O : "#EDD9C8" }}>
                    {r.status === "completed" ? <CheckCircle2 className="w-6 h-6" /> :
                     r.status === "in_progress" ? <CircleDot className="w-6 h-6" /> :
                     <Lock className="w-5 h-5 text-gray-400" />}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold" style={{ color: DG }}>{r.round}</span>
                      {r.threshold && <span className="text-xs text-gray-400">Threshold: ≥{r.threshold}%</span>}
                    </div>
                    <div className="text-sm text-gray-500 mt-0.5 italic">"{r.desc}"</div>
                  </div>
                  <div className="flex-shrink-0 text-right">
                    {r.pct != null ? (
                      <>
                        <div className="text-xl font-black font-mono" style={{ color: r.pct >= (r.threshold ?? 0) ? "#16A34A" : "#D93025" }}>{r.pct}%</div>
                        <div className="text-xs font-bold" style={{ color: r.pct >= (r.threshold ?? 0) ? "#16A34A" : "#D93025" }}>
                          {r.pct >= (r.threshold ?? 0) ? "PASS ✓" : "FAIL ✗"}
                        </div>
                      </>
                    ) : (
                      <span className="text-xs font-bold text-gray-300">{r.status === "locked" ? "LOCKED" : "—"}</span>
                    )}
                  </div>
                </div>
                {r.pct != null && r.threshold && (
                  <div className="px-5 pb-4">
                    <div className="relative h-2.5 rounded-full overflow-hidden" style={{ backgroundColor: "#F5E8DC" }}>
                      <div className="h-full rounded-full" style={{ width: `${r.pct}%`, backgroundColor: r.pct >= r.threshold ? LG : "#D93025" }} />
                      <div className="absolute top-0 bottom-0 w-0.5 bg-amber-400" style={{ left: `${r.threshold}%` }} />
                    </div>
                    <div className="flex justify-between text-[10px] mt-1 text-gray-400">
                      <span>0%</span>
                      <span className="text-amber-600 font-semibold">Threshold {r.threshold}%</span>
                      <span>100%</span>
                    </div>
                  </div>
                )}
              </div>
            ))}
            {/* Projection for V3 */}
            <div className="rounded-2xl p-5 border-2 border-dashed" style={{ borderColor: `${LG}60`, backgroundColor: "#EDFAF5" }}>
              <div className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: "#22A262" }}>💡 Dự báo sau V3 – PROVE</div>
              <p className="text-sm text-gray-600 leading-relaxed">
                Advisory Fit hiện tại của bạn là <strong style={{ color: BL }}>55%</strong> (226/413 pts).
                Nếu đạt <strong>85%</strong> trong interview (50pts weight · 60% Advisory Fit):
                Advisory Fit có thể tăng lên <strong style={{ color: "#22A262" }}>~82%</strong> — vượt threshold Graduate.
              </p>
            </div>
          </div>
        )}

        {/* ── History ── */}
        {tab === "history" && (
          <div className="p-4 lg:p-6 max-w-3xl mx-auto w-full">
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-50 flex items-center justify-between">
                <div className="text-xs font-bold text-gray-400 uppercase tracking-widest">Lịch sử tích lũy điểm</div>
                <div className="text-xs text-gray-400">Tổng: <span className="font-bold" style={{ color: O }}>{ME.totalScore} pts</span></div>
              </div>
              <div className="divide-y divide-gray-50">
                {scoreHistory.map((item, i) => (
                  <div key={i} className="flex items-start gap-4 px-5 py-4 hover:bg-gray-50/40 transition-colors">
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${item.type === "pos" ? "bg-green-50" : "bg-red-50"}`}>
                      {item.type === "pos" ? <TrendingUp className="w-4 h-4 text-green-600" /> : <AlertTriangle className="w-4 h-4 text-red-500" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold" style={{ color: DG }}>{item.activity}</div>
                      <div className="text-xs text-gray-400 mt-0.5">{item.reason}</div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className={`text-base font-bold font-mono ${item.type === "pos" ? "text-green-600" : "text-red-500"}`}>{item.delta}</div>
                      <div className="text-xs text-gray-400">{item.date}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Support Q&A ──────────────────────────────────────────────────────────────

function Support() {
  const [cat, setCat] = useState("Chương trình")
  const [msg, setMsg] = useState("")
  const [sent, setSent] = useState(false)
  const [viewId, setViewId] = useState<number | null>(null)

  const cats = ["Chương trình","Round","Bài tập","Điểm số","Phỏng vấn","Kỹ thuật","Team","Nội dung chung"]

  const handleSend = () => {
    if (!msg.trim()) return
    setSent(true); setMsg("")
    setTimeout(() => setSent(false), 3000)
  }

  return (
    <div className="p-4 lg:p-6 space-y-5 max-w-4xl mx-auto w-full">
      {/* Send question */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5">
        <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Gửi câu hỏi cho Ban tổ chức</div>
        <div className="mb-4">
          <label className="text-xs font-semibold text-gray-500 mb-2 block">Nhóm câu hỏi</label>
          <div className="flex flex-wrap gap-2">
            {cats.map(c => (
              <button key={c} onClick={() => setCat(c)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${cat === c ? "text-white" : "text-gray-500 hover:text-gray-700"}`}
                style={cat === c ? { backgroundColor: O } : { backgroundColor: "#F5E8DC" }}>
                {c}
              </button>
            ))}
          </div>
        </div>
        <div className="mb-3">
          <label className="text-xs font-semibold text-gray-500 mb-2 block">Nội dung câu hỏi</label>
          <textarea
            value={msg}
            onChange={e => setMsg(e.target.value)}
            rows={4}
            placeholder="Nhập câu hỏi hoặc phản hồi của bạn tại đây..."
            className="w-full rounded-xl px-4 py-3 text-sm border-2 outline-none resize-none transition-all"
            style={{
              borderColor: "#EDD9C8",
              color: DG,
              backgroundColor: "white",
            }}
            onFocus={e => (e.currentTarget as HTMLElement).style.borderColor = O}
            onBlur={e => (e.currentTarget as HTMLElement).style.borderColor = "#EDD9C8"}
          />
        </div>
        <div className="flex items-center justify-between">
          <button className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-600 transition-colors">
            <Paperclip className="w-4 h-4" />Đính kèm file
          </button>
          <button
            onClick={handleSend}
            disabled={!msg.trim()}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white transition-all ${msg.trim() ? "hover:opacity-90 active:scale-95" : "opacity-40 cursor-not-allowed"}`}
            style={{ backgroundColor: O }}>
            <Send className="w-4 h-4" />
            {sent ? "Đã gửi! ✓" : "Gửi câu hỏi"}
          </button>
        </div>
      </div>

      {/* History */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-50 text-xs font-bold text-gray-400 uppercase tracking-widest">Lịch sử câu hỏi</div>
        <div className="divide-y divide-gray-50">
          {supportHistory.map(item => (
            <div key={item.id}>
              <div
                className="flex items-start gap-3.5 px-5 py-4 cursor-pointer hover:bg-gray-50/40 transition-colors"
                onClick={() => setViewId(viewId === item.id ? null : item.id)}>
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 text-xs font-bold text-white`}
                  style={{ backgroundColor: item.status === "answered" ? LG : O }}>
                  {item.status === "answered" ? "✓" : "…"}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ backgroundColor: "#F5E8DC", color: DG }}>{item.cat}</span>
                    <StatusBadge status={item.status} />
                  </div>
                  <div className="text-sm font-semibold mt-1.5" style={{ color: DG }}>{item.q}</div>
                  <div className="text-xs text-gray-400 mt-0.5">{item.time}</div>
                </div>
                <ChevronRight className={`w-4 h-4 text-gray-300 flex-shrink-0 transition-transform mt-1 ${viewId === item.id ? "rotate-90" : ""}`} />
              </div>
              {viewId === item.id && item.ans && (
                <div className="px-5 pb-5">
                  <div className="rounded-xl p-4 border border-green-100 bg-green-50 text-sm leading-relaxed text-green-800">
                    <span className="font-semibold">Phản hồi từ BTC: </span>{item.ans}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Program info */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5">
        <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Thông tin chương trình</div>
        {[
          { icon: "📋", title: "Thể lệ & Quy định", desc: "Điều kiện tham gia, quy tắc ứng xử, chính sách nộp bài" },
          { icon: "📅", title: "Timeline chi tiết",  desc: "Lịch mở/đóng từng vòng, các milestone quan trọng" },
          { icon: "🎯", title: "Tiêu chí đánh giá",  desc: "Rubric 3 dimensions: Capability, Commitment, Advisory Fit" },
          { icon: "❓", title: "FAQ",                  desc: "Câu hỏi thường gặp được cập nhật liên tục" },
        ].map((item, i) => (
          <div key={i} className="flex items-center gap-3.5 py-3 border-b border-gray-50 last:border-0 cursor-pointer hover:bg-gray-50/40 -mx-5 px-5 transition-colors">
            <span className="text-xl">{item.icon}</span>
            <div className="flex-1">
              <div className="text-sm font-semibold" style={{ color: DG }}>{item.title}</div>
              <div className="text-xs text-gray-400">{item.desc}</div>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-300" />
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Round Detail page ────────────────────────────────────────────────────────

function RoundDetail({ setPage }: { setPage: (p: Page) => void }) {
  const r = roundDetails[1] // current round = R2

  return (
    <div className="flex flex-col h-full">
      {/* Round sub-nav */}
      <div className="bg-white border-b border-gray-100 px-4 lg:px-6 py-3 flex-shrink-0 overflow-x-auto">
        <div className="flex gap-2 min-w-max">
          {roundDetails.map((rd, i) => (
            <button key={rd.id}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${rd.id === "r2" ? "text-white" : rd.status === "completed" ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-400"}`}
              style={rd.id === "r2" ? { backgroundColor: O } : {}}>
              {rd.status === "completed" ? <CheckCircle2 className="w-3 h-3" /> : rd.status === "locked" ? <Lock className="w-3 h-3" /> : <CircleDot className="w-3 h-3" />}
              {rd.name.split(" – ")[0]}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 lg:p-6 space-y-5 max-w-4xl mx-auto w-full">
        {/* At-risk banner — shown when score margin < 5% from threshold */}
        {r.candidatePct != null && r.threshold != null && r.candidatePct - r.threshold < 5 && (
          <div className="rounded-2xl px-5 py-4 border-2" style={{ backgroundColor: "#FEF3E8", borderColor: `${O}50` }}>
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: O }} />
              <div>
                <div className="font-bold" style={{ color: O }}>Cảnh báo: Biên độ an toàn thấp</div>
                <div className="text-sm text-gray-600 mt-1 leading-relaxed">
                  Bạn đang ở {r.candidatePct}% — chỉ hơn threshold {r.threshold}% một biên độ nhỏ.
                  Hoàn thành Learning Center và Social Challenge để tăng điểm trước deadline.
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Round header */}
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="px-5 py-5" style={{ background: `linear-gradient(135deg, ${O}, #E84800)` }}>
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-white/50 text-xs font-bold uppercase tracking-widest mb-1">{r.period}</div>
                <h2 className="text-xl font-black text-white">{r.name}</h2>
                <p className="text-white/70 text-sm mt-2 leading-relaxed max-w-lg">{r.objective}</p>
              </div>
              <div className="flex-shrink-0 text-right">
                <div className="text-white/40 text-xs">Còn lại</div>
                <div className="text-3xl font-black" style={{ color: YL }}>{r.candidateQuota}</div>
                <div className="text-white/40 text-xs">suất</div>
              </div>
            </div>
          </div>
          <div className="px-5 py-4">
            <div className="flex items-center justify-between mb-2">
              <div className="text-xs font-bold text-gray-500">Điểm vòng này</div>
              <div className="flex items-center gap-2">
                {r.threshold && <span className="text-xs text-gray-400">Threshold: ≥{r.threshold}%</span>}
                {r.candidatePct != null && <span className="font-black font-mono text-lg" style={{ color: r.candidatePct >= (r.threshold ?? 0) ? "#22A262" : "#D93025" }}>{r.candidatePct}%</span>}
              </div>
            </div>
            {r.candidatePct != null && r.threshold && (
              <>
                <div className="relative h-5 rounded-full overflow-hidden" style={{ backgroundColor: "#F5E8DC" }}>
                  <div className="h-full rounded-full transition-all duration-700 flex items-center justify-end pr-2"
                    style={{ width: `${r.candidatePct}%`, backgroundColor: r.candidatePct >= r.threshold ? LG : r.candidatePct >= r.threshold - 10 ? YL : "#D93025" }}>
                    <span className="text-xs font-black text-white">{r.candidatePct}%</span>
                  </div>
                  <div className="absolute top-0 bottom-0 w-0.5 bg-amber-500" style={{ left: `${r.threshold}%` }} />
                </div>
                <div className="flex justify-between text-[10px] mt-1 text-gray-400">
                  <span>0%</span>
                  <span className="text-amber-600 font-semibold">Threshold {r.threshold}%</span>
                  <span>100%</span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Early Completion banner (R2 specific) */}
        {r.id === "r2" && (r as any).earlySlots != null && (
          <div className="rounded-2xl px-5 py-4 border-2" style={{ backgroundColor: "#FFFBEB", borderColor: `${YL}80` }}>
            <div className="flex items-center gap-3">
              <span className="text-2xl">⚡</span>
              <div className="flex-1">
                <div className="font-bold" style={{ color: "#92400E" }}>Early Completion Bonus — còn {(r as any).earlySlots} slot!</div>
                <div className="text-sm text-amber-800 mt-0.5">Nộp bài sớm trước hạn để nhận +10đ (first-come-first-served). Cổng nộp bài có thể đóng sớm khi đủ số lượng qualified.</div>
              </div>
              <button onClick={() => setPage("tasks")} className="flex-shrink-0 text-white text-xs font-bold px-4 py-2 rounded-xl hover:opacity-90 transition-all" style={{ backgroundColor: O }}>
                Nộp ngay →
              </button>
            </div>
          </div>
        )}

        {/* Activity checklist */}
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-50">
            <div className="text-xs font-bold text-gray-400 uppercase tracking-widest">Danh sách hoạt động</div>
            <div className="text-xs text-gray-400 mt-0.5">Hoàn thành tất cả để đạt điểm tối đa</div>
          </div>
          <div className="divide-y divide-gray-50">
            {r.activities.map((act, i) => (
              <div key={i} className={`px-5 py-4 ${act.status === "in_progress" ? "bg-orange-50/20" : ""}`}>
                <div className="flex items-start gap-3.5">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                    act.status === "done" ? "bg-green-50" : act.status === "in_progress" ? "bg-orange-50" : "bg-gray-50"
                  }`}>
                    {act.status === "done" ? <CheckCircle2 className="w-4 h-4 text-green-600" /> :
                     act.status === "in_progress" ? <CircleDot className="w-4 h-4" style={{ color: O }} /> :
                     <Clock className="w-4 h-4 text-gray-300" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-sm" style={{ color: DG }}>{act.name}</span>
                      {(act as any).isBonus && <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: `${YL}40`, color: "#92400E" }}>BONUS</span>}
                    </div>
                    <div className="text-xs text-gray-500 mt-0.5">{act.sub}</div>
                    <div className="flex items-center gap-3 mt-2 flex-wrap">
                      <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: "#FEF3E8", color: O }}>{act.weight}% weight</span>
                      {act.cap > 0 && <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full" style={{ backgroundColor: `${O}10`, color: O }}>Cap {act.cap}%</span>}
                      {act.com > 0 && <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full" style={{ backgroundColor: `${LG}20`, color: "#22A262" }}>Com {act.com}%</span>}
                      {act.fit > 0 && <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full" style={{ backgroundColor: `${BL}15`, color: BL }}>Fit {act.fit}%</span>}
                      <span className="text-[10px] text-gray-400">Deadline: {act.deadline}</span>
                    </div>
                  </div>
                  <div className="flex-shrink-0">
                    <StatusBadge status={act.status === "in_progress" ? "in_progress" : act.status} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick links */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { label: "Học tập ngay", sub: "Learning Center", page: "learning" as Page, color: BL },
            { label: "Nộp bài CV", sub: "Submission Center", page: "tasks" as Page, color: O },
            { label: "Social Challenge", sub: "Nộp link bài đăng", page: "tasks" as Page, color: LG },
          ].map(l => (
            <button key={l.label} onClick={() => setPage(l.page)}
              className="bg-white rounded-2xl border border-gray-100 p-4 text-left hover:shadow-md transition-all group">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-bold text-sm" style={{ color: DG }}>{l.label}</div>
                  <div className="text-xs text-gray-400 mt-0.5">{l.sub}</div>
                </div>
                <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-gray-600 transition-colors" />
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── Graduation page (R4) ─────────────────────────────────────────────────────

function Graduation() {
  const [certStep, setCertStep] = useState<Record<string, boolean>>({})

  const certSteps = [
    { id: "s1", label: "Đăng ký thi với cơ quan quản lý nhà nước", done: false },
    { id: "s2", label: "Hoàn thành khóa đào tạo nghiệp vụ FWD (2 tuần)", done: false },
    { id: "s3", label: "Ôn luyện đề thi chứng chỉ Agent (60 câu hỏi)", done: false },
    { id: "s4", label: "Nộp hồ sơ xin cấp chứng chỉ hành nghề", done: false },
    { id: "s5", label: "Thi và nhận chứng chỉ Đại lý bảo hiểm", done: false },
  ]

  const pathway = "GAD" // from direction choice in R2
  const pathwaySteps = pathway === "GAD" ? [
    { step: "Tháng 1-2", title: "Xây dựng danh mục khách hàng đầu tiên", sub: "Mục tiêu: 5 hợp đồng đầu tiên" },
    { step: "Tháng 3-6", title: "Phát triển đội nhóm nhỏ (3-5 Advisor)", sub: "Được đào tạo kỹ năng recruitment" },
    { step: "Tháng 7-12", title: "Đủ điều kiện thăng cấp Group Agency Director", sub: "KPI: doanh thu nhóm ≥ 500tr/quý" },
  ] : [
    { step: "Tháng 1-2", title: "Chuyên sâu sản phẩm & quy trình", sub: "Mục tiêu: 3 hợp đồng chất lượng cao" },
    { step: "Tháng 3-6", title: "Unit Manager candidate", sub: "Bắt đầu recruit và quản lý 1-2 Advisor" },
    { step: "Tháng 7-12", title: "Agency Director (AD+) chính thức", sub: "KPI: team size ≥ 5, doanh thu ≥ 1 tỷ/quý" },
  ]

  return (
    <div className="p-4 lg:p-6 space-y-6 max-w-3xl mx-auto w-full">
      {/* Celebratory hero */}
      <div className="rounded-2xl overflow-hidden" style={{ background: `linear-gradient(135deg, ${O} 0%, #E84800 60%, #F26522 100%)` }}>
        <div className="px-6 py-10 text-center relative">
          {/* Stars decoration */}
          {["absolute top-3 left-4 text-2xl","absolute top-6 right-8 text-xl","absolute bottom-4 left-8 text-lg","absolute bottom-3 right-4 text-2xl"].map((cls,i) => (
            <span key={i} className={cls} style={{ opacity: 0.4 }}>✦</span>
          ))}
          <div className="text-6xl mb-4">🎓</div>
          <h2 className="text-3xl font-black text-white">R4 – Graduation</h2>
          <p className="text-white/70 mt-2 text-sm">25/5/2027 · Văn phòng FWD HN/HCMC</p>
          <div className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold"
            style={{ backgroundColor: `${LG}25`, color: LG, border: `1px solid ${LG}40` }}>
            <CheckCircle2 className="w-4 h-4" />
            60 ứng viên ưu tú — {pathway} Track
          </div>
        </div>
      </div>

      {/* Locked notice */}
      <div className="rounded-2xl p-4 border-2 border-dashed" style={{ borderColor: "#EDD9C8", backgroundColor: "#FEF6F0" }}>
        <div className="flex items-center gap-3">
          <Lock className="w-5 h-5 text-gray-300" />
          <div>
            <div className="font-semibold text-sm" style={{ color: DG }}>Vòng này chưa mở</div>
            <div className="text-xs text-gray-400 mt-0.5">R4 Graduation sẽ mở sau khi bạn vượt qua R3 – Make your own F với ≥75%.</div>
          </div>
        </div>
      </div>

      {/* 2-month program info */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-50">
          <div className="text-xs font-bold text-gray-400 uppercase tracking-widest">Chương trình 2 tháng tại HN/HCMC</div>
        </div>
        <div className="divide-y divide-gray-50">
          {[
            { week: "Tuần 1-2", title: "Onboarding & Training cơ bản", desc: "Giới thiệu quy trình FWD, sản phẩm, hệ thống CRM và quy tắc đạo đức nghề", icon: "📚" },
            { week: "Tuần 3-4", title: "Thực hành tư vấn có hướng dẫn", desc: "Shadow Agent Senior, joint meetings với khách hàng thực, feedback 1-1 hàng tuần", icon: "👥" },
            { week: "Tuần 5-6", title: "Độc lập có giám sát", desc: "Tự tiếp cận khách hàng với sự hỗ trợ của Mentor, đặt KPI cá nhân đầu tiên", icon: "🎯" },
            { week: "Tuần 7-8", title: "Ôn thi chứng chỉ & Office Matching", desc: "Chuẩn bị thi chứng chỉ Đại lý bảo hiểm, xác nhận văn phòng địa phương theo pathway", icon: "🏆" },
          ].map((item, i) => (
            <div key={i} className="flex gap-4 px-5 py-4">
              <div className="text-2xl flex-shrink-0">{item.icon}</div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-xs font-black px-2 py-0.5 rounded-full" style={{ backgroundColor: `${O}15`, color: O }}>{item.week}</span>
                </div>
                <div className="font-semibold text-sm" style={{ color: DG }}>{item.title}</div>
                <div className="text-xs text-gray-500 mt-0.5 leading-relaxed">{item.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Certification tracker */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-50">
          <div className="text-xs font-bold text-gray-400 uppercase tracking-widest">Tracker thi chứng chỉ Agent</div>
          <div className="text-xs text-gray-400 mt-0.5">Chứng chỉ Đại lý bảo hiểm nhân thọ — bắt buộc để hành nghề</div>
        </div>
        <div className="divide-y divide-gray-50">
          {certSteps.map((step, i) => {
            const checked = certStep[step.id] ?? false
            return (
              <div key={step.id} className="flex items-center gap-3.5 px-5 py-3.5 hover:bg-gray-50/40 transition-colors cursor-pointer"
                onClick={() => setCertStep(prev => ({ ...prev, [step.id]: !checked }))}>
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${checked ? "text-white" : ""}`}
                  style={{ borderColor: checked ? LG : "#EDD9C8", backgroundColor: checked ? LG : "white" }}>
                  {checked && <CheckCircle2 className="w-3.5 h-3.5" />}
                </div>
                <span className={`text-sm flex-1 ${checked ? "line-through text-gray-400" : ""}`} style={{ color: checked ? undefined : DG }}>
                  {i+1}. {step.label}
                </span>
              </div>
            )
          })}
        </div>
        <div className="px-5 py-3 border-t border-gray-50 bg-gray-50/30">
          <div className="flex justify-between text-xs text-gray-400">
            <span>{Object.values(certStep).filter(Boolean).length}/{certSteps.length} bước hoàn thành</span>
            <span className="font-semibold" style={{ color: O }}>Mục tiêu: thi trong tháng 7/2027</span>
          </div>
        </div>
      </div>

      {/* Pathway info */}
      <div className="rounded-2xl p-5 border-2" style={{ borderColor: `${O}40`, background: `linear-gradient(135deg, #FEF3E8, white)` }}>
        <div className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: O }}>Pathway của bạn — {pathway} Track</div>
        <div className="space-y-3">
          {pathwaySteps.map((item, i) => (
            <div key={i} className="flex gap-3">
              <span className="text-xs font-black px-2.5 py-1 rounded-full h-fit flex-shrink-0 mt-0.5" style={{ backgroundColor: `${O}15`, color: O }}>{item.step}</span>
              <div>
                <div className="font-semibold text-sm" style={{ color: DG }}>{item.title}</div>
                <div className="text-xs text-gray-500 mt-0.5">{item.sub}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Social challenge for R4 */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5">
        <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Social Challenge — Graduation</div>
        <div className="flex flex-wrap gap-2 mb-3">
          {["#FWD","#FProgram","#GraduationContent"].map(h => (
            <span key={h} className="text-xs font-semibold px-2.5 py-1 rounded-full" style={{ backgroundColor: `${BL}15`, color: BL }}>{h}</span>
          ))}
        </div>
        <p className="text-sm text-gray-600 leading-relaxed">Chia sẻ câu chuyện hành trình của bạn qua F Program — UGC content về những gì bạn học được và kỳ vọng bước vào nghề Advisor.</p>
        <div className="mt-3 flex items-center gap-2 text-xs text-gray-400">
          <Lock className="w-3.5 h-3.5" />Mở sau khi tốt nghiệp R3
        </div>
      </div>
    </div>
  )
}

// ─── Rounds Page ─────────────────────────────────────────────────────────────

type RoundTab = "r1" | "r2" | "r3" | "r4"

function RoundsPage({ setPage }: { setPage: (p: Page) => void }) {
  const [activeRound, setActiveRound] = useState<RoundTab>("r2")

  const roundMeta = [
    { id: "r1" as RoundTab, label: "R1", sub: "DISCOVER",    dates: "1/4–22/4",  status: "completed",   score: 88 },
    { id: "r2" as RoundTab, label: "R2", sub: "EXPERIENCE",  dates: "22/4–6/5",  status: "in_progress", score: 82 },
    { id: "r3" as RoundTab, label: "R3", sub: "PROVE",       dates: "6/5–20/5",  status: "locked",      score: null },
    { id: "r4" as RoundTab, label: "R4", sub: "BECOME",      dates: "25/5",      status: "locked",      score: null },
  ]

  const r1Tasks = [
    { id: "t1", label: "Discover Your Agent F Assessment", sub: "30-min · One attempt", status: "completed", pts: "+440" },
    { id: "t2", label: "Social Challenge submission", sub: "#MyPerspectiveOnLifeInsurance · TikTok / FB / LinkedIn", status: "completed", pts: "+25" },
  ]

  const r2Tasks = [
    { id: "t1", label: "CV Upload", sub: "Personal resume · PDF format", status: "approved", pts: "+95" },
    { id: "t2", label: "Personal Direction Essay", sub: "Agent Track pathway statement", status: "approved", pts: "+88" },
    { id: "t3", label: "LinkedIn Profile Link", sub: "Public profile required", status: "needs_revision", pts: null },
    { id: "t4", label: "60-second Introduction Video", sub: "MP4 or YouTube link", status: "submitted", pts: null },
    { id: "t5", label: "Social Challenge", sub: "#PersonalBranding · Any platform", status: "pending", pts: null },
  ]

  const r1 = (
    <div className="p-4 lg:p-6 space-y-4 max-w-3xl mx-auto w-full">
      <div className="rounded-2xl p-5 text-white" style={{ background: `linear-gradient(135deg, ${BL}, #006a78)` }}>
        <div className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: `${LG}` }}>R1 · DISCOVER · Completed</div>
        <div className="text-2xl font-black mb-1">Mission F</div>
        <div className="text-white/60 text-sm">1/4/2027 – 22/4/2027</div>
        <div className="mt-4 text-3xl font-black">{roundMeta[0].score}%</div>
        <div className="text-white/60 text-sm">Your score · <span style={{ color: LG }}>✓ PASS</span></div>
      </div>
      <div className="bg-white rounded-2xl border border-gray-100 p-5">
        <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Tasks & Submissions</div>
        <div className="space-y-3">
          {r1Tasks.map(t => (
            <div key={t.id} className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${LG}20` }}>
                <CheckCircle2 className="w-4 h-4" style={{ color: LG }} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold" style={{ color: DG }}>{t.label}</div>
                <div className="text-xs text-gray-400">{t.sub}</div>
              </div>
              <StatusBadge status={t.status} />
            </div>
          ))}
        </div>
      </div>
      <div className="bg-white rounded-2xl border border-gray-100 p-5">
        <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Feedback</div>
        <p className="text-sm text-gray-600 leading-relaxed">Strong performance in the assessment. Communication style shows natural advisory potential. Keep building on your perspective.</p>
      </div>
    </div>
  )

  const r2 = (
    <div className="p-4 lg:p-6 space-y-4 max-w-3xl mx-auto w-full">
      <div className="rounded-2xl p-5 text-white" style={{ background: `linear-gradient(135deg, ${O}, #c45e10)` }}>
        <div className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: YL }}>R2 · EXPERIENCE · In Progress</div>
        <div className="text-2xl font-black mb-1">What kind of F are you?</div>
        <div className="text-white/60 text-sm">22/4/2027 – 6/5/2027 · 4 days left</div>
        <div className="mt-4 flex items-end gap-3">
          <div className="text-3xl font-black">{roundMeta[1].score}%</div>
          <div className="text-white/60 text-sm mb-1">current score</div>
        </div>
        <div className="mt-3 h-2 rounded-full overflow-hidden" style={{ backgroundColor: "rgba(255,255,255,0.2)" }}>
          <div className="h-full rounded-full" style={{ width: `${roundMeta[1].score}%`, backgroundColor: YL }} />
        </div>
      </div>

      {/* At-risk banner for LinkedIn */}
      <div className="rounded-xl px-4 py-3 flex items-center gap-3" style={{ backgroundColor: "#FEF3E8", border: `1px solid ${O}40` }}>
        <AlertTriangle className="w-4 h-4 flex-shrink-0" style={{ color: O }} />
        <p className="text-sm text-orange-800">Your LinkedIn profile needs revision. Update it before the deadline to avoid losing points.</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-5">
        <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Tasks & Submissions</div>
        <div className="space-y-3">
          {r2Tasks.map(t => {
            const icon = t.status === "approved" || t.status === "completed"
              ? <CheckCircle2 className="w-4 h-4" style={{ color: LG }} />
              : t.status === "needs_revision"
              ? <AlertTriangle className="w-4 h-4" style={{ color: O }} />
              : t.status === "submitted"
              ? <Clock className="w-4 h-4" style={{ color: BL }} />
              : <CircleDot className="w-4 h-4 text-gray-300" />
            return (
              <div key={t.id} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: "#FEF6F0" }}>
                  {icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold" style={{ color: DG }}>{t.label}</div>
                  <div className="text-xs text-gray-400">{t.sub}</div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  {t.pts && <span className="text-xs font-bold text-green-600">{t.pts}</span>}
                  <StatusBadge status={t.status} />
                </div>
              </div>
            )
          })}
        </div>
        <button className="w-full mt-4 py-3 rounded-xl font-bold text-sm text-white transition-all hover:opacity-90"
          style={{ backgroundColor: O }}>
          Submit / Update →
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-5">
        <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Social Challenge — #PersonalBranding</div>
        <p className="text-sm text-gray-600 leading-relaxed mb-3">Share your personal branding journey on TikTok, Facebook, or LinkedIn using the required hashtags.</p>
        <div className="flex flex-wrap gap-2 mb-4">
          {["#FWD", "#FProgram", "#PersonalBranding"].map(h => (
            <span key={h} className="text-xs font-semibold px-2.5 py-1 rounded-full" style={{ backgroundColor: `${BL}15`, color: BL }}>{h}</span>
          ))}
        </div>
        <div className="flex gap-2">
          <input type="url" placeholder="Paste your post link here..." className="flex-1 px-3 py-2.5 rounded-xl border text-sm" style={{ borderColor: "#EDD9C8" }} />
          <button className="px-4 py-2.5 rounded-xl font-bold text-sm text-white" style={{ backgroundColor: BL }}>Submit</button>
        </div>
      </div>
    </div>
  )

  const r3 = (
    <div className="p-4 lg:p-6 flex flex-col items-center justify-center min-h-[400px]">
      <Lock className="w-12 h-12 text-gray-300 mb-4" />
      <div className="text-lg font-bold text-gray-400 mb-2">R3 – PROVE · Locked</div>
      <div className="text-sm text-gray-400 text-center max-w-sm">This round opens on 6/5/2027 after R2 results are announced. Complete R2 to unlock.</div>
    </div>
  )

  const r4 = (
    <div className="p-4 lg:p-6 flex flex-col items-center justify-center min-h-[400px]">
      <Lock className="w-12 h-12 text-gray-300 mb-4" />
      <div className="text-lg font-bold text-gray-400 mb-2">R4 – BECOME · Locked</div>
      <div className="text-sm text-gray-400 text-center max-w-sm">The final stage opens on 25/5/2027 for candidates who pass R3.</div>
    </div>
  )

  const content = { r1, r2, r3, r4 }

  return (
    <div className="flex flex-col h-full">
      {/* Round tab bar */}
      <div className="bg-white border-b border-gray-100 px-4 lg:px-6 flex-shrink-0">
        <div className="flex">
          {roundMeta.map(r => (
            <button key={r.id}
              onClick={() => r.status !== "locked" && setActiveRound(r.id)}
              className={`flex flex-col items-center px-5 py-3.5 border-b-2 transition-all ${
                activeRound === r.id ? "border-[#F26522]" : "border-transparent"
              } ${r.status === "locked" ? "opacity-40 cursor-not-allowed" : "cursor-pointer hover:bg-gray-50/50"}`}>
              <span className={`text-xs font-black ${activeRound === r.id ? "text-[#F26522]" : "text-gray-400"}`}>{r.label}</span>
              <span className={`text-[10px] font-bold uppercase tracking-wider ${activeRound === r.id ? "text-[#183028]" : "text-gray-300"}`}>{r.sub}</span>
            </button>
          ))}
        </div>
      </div>
      <div className="flex-1 overflow-y-auto">
        {content[activeRound]}
      </div>
    </div>
  )
}

// ─── App ──────────────────────────────────────────────────────────────────────

// ─── Chat Widget ─────────────────────────────────────────────────────────────

const initMessages = [
  { from: "admin" as const, text: "Xin chào! BTC F Program sẵn sàng hỗ trợ bạn. Bạn cần giúp gì không? 👋", time: "09:00" },
]

function ChatWidget() {
  const [open, setOpen] = useState(false)
  const [msgs, setMsgs] = useState(initMessages)
  const [input, setInput] = useState("")
  const [unread, setUnread] = useState(1)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (open) {
      setUnread(0)
      bottomRef.current?.scrollIntoView({ behavior: "smooth" })
    }
  }, [open, msgs])

  const send = () => {
    const text = input.trim()
    if (!text) return
    const now = new Date()
    const time = `${String(now.getHours()).padStart(2,"0")}:${String(now.getMinutes()).padStart(2,"0")}`
    setMsgs(m => [...m, { from: "user" as const, text, time }])
    setInput("")
    setTimeout(() => {
      setMsgs(m => [...m, { from: "admin" as const, text: "BTC đã nhận câu hỏi của bạn. Chúng tôi sẽ phản hồi trong vòng 24 giờ làm việc! 🙌", time }])
    }, 800)
  }

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-3">
      {/* Chat panel */}
      {open && (
        <div className="w-80 bg-white rounded-2xl shadow-[0_8px_40px_rgba(24,48,40,0.18)] border border-gray-100 overflow-hidden flex flex-col" style={{ height: "420px" }}>
          {/* Header */}
          <div className="flex items-center gap-3 px-4 py-3.5 flex-shrink-0" style={{ backgroundColor: O }}>
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0" style={{ backgroundColor: O }}>BTC</div>
            <div className="flex-1 min-w-0">
              <div className="text-white text-sm font-bold leading-none">Hỗ trợ BTC</div>
              <div className="text-white/50 text-[11px] mt-0.5 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block" />Online
              </div>
            </div>
            <button onClick={() => setOpen(false)} className="text-white/50 hover:text-white transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
            {msgs.map((m, i) => (
              <div key={i} className={`flex gap-2 ${m.from === "user" ? "flex-row-reverse" : ""}`}>
                {m.from === "admin" && (
                  <div className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0 mt-0.5" style={{ backgroundColor: O }}>B</div>
                )}
                <div className={`max-w-[80%] px-3 py-2 rounded-2xl text-sm leading-relaxed ${
                  m.from === "user"
                    ? "text-white rounded-tr-sm"
                    : "text-gray-700 rounded-tl-sm"
                }`} style={{
                  backgroundColor: m.from === "user" ? O : "#F5E8DC",
                }}>
                  {m.text}
                  <div className={`text-[10px] mt-1 ${m.from === "user" ? "text-white/60 text-right" : "text-gray-400"}`}>{m.time}</div>
                </div>
              </div>
            ))}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="flex items-center gap-2 px-3 py-3 border-t border-gray-100 flex-shrink-0">
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && send()}
              placeholder="Nhắn tin cho BTC..."
              className="flex-1 text-sm px-3 py-2 rounded-xl outline-none"
              style={{ backgroundColor: "#F5E8DC", color: DG }}
            />
            <button onClick={send} disabled={!input.trim()}
              className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 transition-all disabled:opacity-40 hover:opacity-80"
              style={{ backgroundColor: O }}>
              <Send className="w-3.5 h-3.5 text-white" />
            </button>
          </div>
        </div>
      )}

      {/* FAB */}
      <button
        onClick={() => setOpen(v => !v)}
        className="w-14 h-14 rounded-full flex items-center justify-center shadow-xl transition-all hover:scale-105 active:scale-95 relative"
        style={{ backgroundColor: O, boxShadow: `0 4px 20px rgba(24,48,40,0.35)` }}>
        {open
          ? <X className="w-5 h-5 text-white" />
          : <MessageSquare className="w-5 h-5 text-white" />}
        {!open && unread > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full text-white text-[10px] font-bold flex items-center justify-center" style={{ backgroundColor: O }}>
            {unread}
          </span>
        )}
      </button>
    </div>
  )
}

export default function App() {
  const [page, setPage] = useState<Page>("dashboard")
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const toggle = () => setSidebarOpen(v => !v)

  // Full-screen pages bypass the sidebar/header layout
  if (page === "discover") {
    return (
      <>
        <DiscoverPage setPage={setPage} />
        <ChatWidget />
      </>
    )
  }

  const fullHeight = page === "learning" || page === "rounds"

  return (
    <div className="flex h-screen overflow-hidden" style={{ fontFamily: "'Be Vietnam Pro', sans-serif", backgroundColor: "#FEF6F0" }}>
      <Sidebar page={page} setPage={setPage} open={sidebarOpen} toggle={toggle} />
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <Header page={page} toggleSidebar={toggle} />
        <main className={`flex-1 ${fullHeight ? "overflow-hidden flex flex-col" : "overflow-y-auto"}`}>
          {page === "dashboard"  && <Dashboard setPage={setPage} />}
          {page === "rounds"     && <RoundsPage setPage={setPage} />}
          {page === "learning"   && <LearningCenter />}
          {page === "interview"  && <Interview />}
        </main>
      </div>
      <ChatWidget />
    </div>
  )
}
