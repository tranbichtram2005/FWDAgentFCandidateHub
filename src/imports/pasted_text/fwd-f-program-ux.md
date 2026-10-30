Thiết kế UI/UX cho một web app dành cho "Advisor Candidate" (ứng viên tư vấn tài chính) 
tham gia chương trình tuyển chọn "F Program" của FWD, đi qua 4 round có ngày cụ thể, 
mỗi round có threshold điểm để pass, chấm theo 3 dimensions.

PRODUCT CONTEXT:
- Đối tượng dùng: Gen Z (22-27 tuổi), tham gia challenge tuyển chọn Agent/Advisor, 
  cạnh tranh qua từng round để lọt vào vòng sau (2000 → 500 → 250 → 60 → Graduate).
- Mục tiêu UX: candidate phải LUÔN biết rõ 3 điều ở mọi thời điểm: (1) mình đang ở 
  round nào, còn bao nhiêu ngày, (2) điểm hiện tại của mình so với threshold cần đạt, 
  (3) mình cần làm gì tiếp theo để không bị loại/trừ điểm. Cảm giác như 1 gamified 
  career journey có độ căng thẳng vừa phải (cạnh tranh thật, deadline thật).
- Tone & style: trẻ trung, năng động, professional. Màu chủ đạo cam FWD (#FF6B00) 
  kết hợp trắng/xám nhạt, xanh lá cho đạt/pass, vàng cảnh báo, đỏ cho rớt/trễ hạn/mất điểm. 
  Typography sans-serif hiện đại (Inter/Be Vietnam Pro).
- Thiết bị: responsive, ưu tiên desktop, tối ưu tốt cho mobile (làm test, nộp social 
  chủ yếu trên điện thoại).

CƠ CHẾ ĐIỂM SỐ (bắt buộc thể hiện đúng trong UI, đây là core mechanic của sản phẩm):
Flow: Activities => Earn/Lose Points => 3 Dimensions (Capability, Commitment, 
Advisory Fit) => Scorecard => Qualified Candidate => Office Matching

- R1 – Mission F (1/4–22/4/2027, 3 tuần, còn tối đa 500 candidate)
  Format: AI Test Center (30 phút, 4 mission: M1 & M2 - case study 5 câu hỏi, 
  M3 Classified Game, M4 Find F) + Social Challenge (#MyPerspectiveOnLifeInsurance)
  Điểm: Behavior 95đ (Capability 55 / Advisory Fit 35... quy đổi), Completion 5đ 
  (Commitment 10)
  Threshold pass: ≥ 60/100

- R2 – What kind of F are you (22/4–6/5/2027, 2 tuần, còn tối đa 250 candidate)
  Format: Learning Center 4 module (CV, Personal Branding, AI+MKT tools, Career 
  pathway) + Nộp CV + Bài luận (chọn hướng GAD/AD+) + Social Challenge 
  (#PersonalBranding)
  Điểm: CV enhancement & Essay 60đ (Capability 15/Commitment 20/Advisory Fit 25), 
  Learning 40đ (Capability 20/Commitment 10/Advisory Fit 10)
  Có cơ chế Early Completion +10đ (first-come-first-served) — nộp sớm được ưu tiên, 
  cổng nộp bài có thể đóng sớm nếu đủ số lượng qualified
  Threshold pass: ≥ 70/100

- R3 – Make your own F (6/5–20/5/2027, 2 tuần, còn tối đa 60 candidate)
  Format: Learning Center 2 module (Product, Skill Building) + Tham gia team 
  activities/GA company tour/Q&A + Interview trực tiếp (GA Lead + AD+ Manager) 
  + Social Challenge (Field Experience Content)
  Điểm: Learning 30đ (Capability 15/Commitment 5/Advisory Fit 10), Participation 20đ 
  (Commitment 10/Advisory Fit 10), Interview 50đ (Capability 10/Advisory Fit 40)
  Threshold pass: ≥ 75/100

- R4 – Graduation (25/5/2027, 1 ngày, direct evaluation — không còn threshold điểm)
  Không chấm điểm nữa, chuyển thẳng sang: trải nghiệm 2 tháng làm việc tại văn phòng 
  HN/HCMC, được đào tạo + hỗ trợ thi chứng chỉ Agent, sau đó chuyển về văn phòng địa 
  phương theo pathway GAD hoặc AD+ đã chọn từ R2. Social Challenge: Graduation 
  Content (candidate story/UGC).

CƠ CHẾ CỘNG/TRỪ ĐIỂM (áp dụng xuyên suốt R1–R3, hiển thị dạng activity log):
- Earn: Hoàn thành tất cả challenge (+10) | Hoàn thành learning (+5) | 
  Đóng góp Q&A (+5) | Bonus challenge (+5)
- Lose: Trễ deadline (−5) | Bỏ lỡ hoạt động bắt buộc (−10) | Nộp bài thiếu (−5) | 
  Vi phạm compliance (−20)

INFORMATION ARCHITECTURE (Sitemap):

1. Trang chủ / Dashboard cá nhân
   - Header: round hiện tại (VD "R2 - What kind of F are you"), countdown ngày còn lại 
     đến deadline round, khung ngày cụ thể (22/4 - 6/5/2027)
   - Khối "Điểm số của bạn": tổng điểm hiện tại /100, so sánh trực quan với vạch 
     threshold cần đạt (VD dạng thanh ngang có mốc "70" đánh dấu rõ, điểm hiện tại 
     là 1 con trỏ chạy trên thanh, đổi màu đỏ/vàng/xanh tùy vị trí so với threshold)
   - Radar chart hoặc 3 progress bar riêng cho Capability / Commitment / Advisory Fit
   - Timeline ngang 4 chấm tròn R1 → R2 → R3 → R4 với ngày cụ thể dưới mỗi chấm, 
     chấm đã qua = check xanh, chấm hiện tại = pulse animation, chấm chưa tới = xám
   - CTA nổi bật: nhiệm vụ tiếp theo cần làm + deadline gần nhất

2. Trang chi tiết Round hiện tại (Round Detail)
   - Objective của round (1 câu mô tả mục tiêu, VD "Build essential career, personal 
     branding and digital skills")
   - Danh sách activity trong round dạng checklist, mỗi activity hiện: tên, base points, 
     trạng thái (chưa làm/đã nộp/đã chấm), breakdown điểm rơi vào dimension nào
   - Banner cảnh báo nếu đang có nguy cơ không đạt threshold (dựa trên điểm đã có + 
     điểm tối đa còn lại có thể kiếm)

3. Trang Làm bài Test / AI Test Center
   - Màn hình bắt đầu: hiển thị rõ "30 phút - 4 Mission", nút Start có countdown timer 
     hiện ngay khi bắt đầu làm
   - Mission dạng case study (M1, M2): 1 case + 5 câu hỏi, hiển thị case content bên trên, 
     câu hỏi bên dưới, progress "Câu 2/5"
   - Mission dạng game (M3 Classified Game, M4 Find F): giao diện interactive/kéo-thả 
     hoặc chọn nhanh, có timer trực quan
   - Màn hình kết quả: điểm đạt được, breakdown theo dimension, so với threshold

4. Trang Learning Center
   - Danh sách module dạng card grid (VD R2: CV / Personal Branding / AI+MKT tools / 
     Career pathway), mỗi card hiện trạng thái hoàn thành + điểm learning tích lũy
   - Trang chi tiết module: video/tài liệu + mini quiz cuối module + nút đánh dấu hoàn thành

5. Trang Nộp bài (Submission Center)
   - Form nộp CV (upload file), Bài luận (rich text editor, có gợi ý tiêu chí chấm: 
     professional communication, idea articulation...)
   - Nếu đang trong giai đoạn Early Completion: hiển thị rõ banner "Nộp sớm +10đ - 
     còn X slot trước khi đóng cổng" để tạo động lực nộp nhanh
   - Form Social Challenge: hiển thị đúng topic + hashtag bắt buộc theo từng round 
     (VD R1: "My Perspective on Life Insurance" #FWD #TenChuongTrinh), ô nhập link 
     bài đăng, chọn nền tảng (TikTok/FB/LinkedIn)
   - Trạng thái mỗi bài nộp: Pending review / Approved / Rejected + feedback từ BTC

6. Trang Chọn hướng phát triển (GAD vs AD+) — xuất hiện ở R2
   - 2 card so sánh song song: GAD (BHNT/Tài chính/Brand track) vs AD+, nêu rõ 
     quyền lợi/điều kiện mỗi hướng, nút "Chọn hướng này" (khóa lựa chọn sau khi chọn 
     hoặc cho phép đổi trong thời hạn nhất định)

7. Trang Phỏng vấn (R3)
   - Thông tin lịch phỏng vấn: ngày giờ, hình thức, người phỏng vấn (GA Lead/AD+ 
     Manager), địa điểm văn phòng
   - Checklist chuẩn bị phỏng vấn (self-presentation, storytelling, behavioral questions)
   - Sau phỏng vấn: hiển thị điểm/feedback nếu đã được công bố

8. Trang Scorecard tổng hợp
   - Bảng/biểu đồ điểm qua từng round đã hoàn thành, breakdown theo 3 dimensions
   - Activity log dạng timeline: mỗi dòng ghi hoạt động + điểm +/- + lý do 
     (VD "Trễ deadline nộp CV -5đ", "Hoàn thành learning +5đ")
   - So sánh trực quan điểm hiện tại vs threshold của round đang/đã qua

9. Trang Graduation (R4)
   - Màn hình celebratory khi Graduate thành công (illustration/confetti nhẹ)
   - Thông tin chương trình 2 tháng tại HN/HCMC: lịch trình, nội dung đào tạo
   - Tracker chuẩn bị thi chứng chỉ Agent (checklist tài liệu/lịch thi)
   - Thông tin pathway địa phương sau 2 tháng (dựa theo GAD/AD+ đã chọn ở R2)

10. Trang Thông báo & Hỗ trợ
    - Inbox thông báo phân loại: deadline round/kết quả chấm điểm/announcement chung
    - Form gửi câu hỏi cho BTC + lịch sử hội thoại

UX REQUIREMENTS:
- Mọi màn hình trong round đều phải hiển thị được: điểm hiện tại / threshold cần đạt / 
  số ngày còn lại — đây là 3 chỉ số neo tâm lý quan trọng nhất, không được ẩn sâu
- Countdown ngày/giờ dùng màu chuyển dần xanh → vàng → đỏ khi deadline đến gần
- Điểm số +/- phải có animation/toast nhỏ ngay khi phát sinh (VD "+5đ - Hoàn thành 
  learning module") để tạo phản hồi tức thời
- Banner cảnh báo rõ ràng khi candidate có nguy cơ rớt threshold (không chỉ hiển thị 
  số, cần cảnh báo chủ động)
- Mobile-first cho: làm AI Test, nộp Social Challenge, xem điểm/thông báo
- Giữ nhất quán màu trạng thái toàn hệ thống: xanh lá = đạt/pass, vàng = cảnh báo/gần 
  deadline, đỏ = rớt/trễ hạn/mất điểm

Hãy tạo wireframe/UI chi tiết cho: Dashboard (ưu tiên số 1, có đủ threshold bar + 
timeline 4 round), trang AI Test Center, trang Submission Center (có Social Challenge), 
và trang Scorecard tổng hợp trước tiên.