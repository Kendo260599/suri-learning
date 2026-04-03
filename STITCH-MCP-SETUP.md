# Stitch MCP — Cấu hình cho Cursor

## Tổng quan

Stitch MCP Server cho phép **Cursor AI gọi trực tiếp Stitch như một tool** — không cần mở trình duyệt, chỉ cần chat với Cursor và Stitch tự sinh UI.

## Cách 1: Cấu hình MCP Server (Tự làm — cần 5 phút)

Cursor hỗ trợ MCP servers qua file cấu hình JSON. Bạn cần tìm đúng file MCP settings của Cursor:

### Tìm file cấu hình MCP

Mở **Cursor → Settings (Ctrl+,)** → gõ `mcp` trong search → xem mục **MCP Servers** hoặc **Model Context Protocol**.

Nếu có giao diện MCP settings, thêm server mới với:

```
Name: stitch
Command: npx
Arguments: -y @_davideast/stitch-mcp proxy
```

### Tạo file MCP thủ công

Nếu Cursor chưa có giao diện MCP, tạo file:

**Đường dẫn:** `%APPDATA%\Cursor\User\globalStorage\user-data\mcp.json`

**Nội dung:**

```json
{
  "mcpServers": {
    "stitch": {
      "command": "npx",
      "args": ["-y", "@_davideast/stitch-mcp", "proxy"]
    }
  }
}
```

Restart Cursor sau khi thêm.

### Kiểm tra MCP hoạt động

Trong Cursor AI Chat, hỏi:

```
Dùng Stitch MCP tạo một màn hình dashboard cho app học tiếng Anh
```

Nếu Cursor nhận ra Stitch tool → đã kết nối thành công.

---

## Cách 2: Dùng Stitch qua SDK (Không cần MCP)

Nếu MCP không hoạt động, dùng SDK trực tiếp trong code:

```bash
# Chạy script setup
node scripts/stitch-setup.cjs
```

Sau đó trong code:

```typescript
import { stitch } from '@google/stitch-sdk';

const project = stitch.project('YOUR_PROJECT_ID');
const screen = await project.generate(
  'Mobile flashcard screen with flip animation, hearts, XP bar, streak counter',
  'MOBILE'
);

const html = await screen.getHtml();
// html là URL tải file HTML — copy vào src/components/generated/
```

---

## Cách 3: Stitch Web (Khuyến nghị cho người mới)

1. Mở **https://stitch.withgoogle.com/**
2. Đăng nhập Google → Tạo project "Suri Learning"
3. Tạo từng màn hình bằng prompt tiếng Việt
4. Export code → copy vào project

Ưu điểm: Không cần cài gì, thấy preview ngay, export được nhiều format.

---

## Lấy Stitch API Key (bắt buộc cho SDK/MCP)

1. Mở **https://console.cloud.google.com/apis/credentials**
2. Chọn project (hoặc tạo project mới tại **https://console.cloud.google.com/projectcreate**)
3. **Create Credentials** → **API Key**
4. Copy key (bắt đầu bằng `AIza...`)
5. Thêm vào `.env.local`:

```
STITCH_API_KEY=AIzaSy.................
GOOGLE_CLOUD_PROJECT=your-project-id
```

---

## Xử lý lỗi thường gặp

| Lỗi | Cách sửa |
|---|---|
| `AUTH_FAILED` | Kiểm tra `STITCH_API_KEY` đúng chưa |
| `NOT_FOUND` | Sai Project ID — xem URL trên stitch.withgoogle.com |
| `RATE_LIMITED` | Đợi 1-2 phút, Stitch có giới hạn request |
| `MCP not found` | Cần restart Cursor sau khi thêm MCP config |
| `gcloud not found` | Cài **Google Cloud SDK**: https://cloud.google.com/sdk/docs/install |

---

## Prompt mẫu cho Suri Learning

```
Tạo màn hình Home cho app học tiếng Anh IELTS gamification:
- Top bar: streak flame (3 ngày), 5 trái tim đỏ, 250 XP / 500 XP bar
- Nút "Học bài hôm nay" màu xanh lá lớn
- 3 lesson cards: checkmark xanh (hoàn thành), lock (khóa), play (sẵn sàng)
- Bottom nav: Home, Learn, AI Chat, Leaderboard, Profile
- Font: Inter, màu brand orange #ea580c
- Mobile-first, safe area iOS/Android
- Export: Tailwind CSS + React
```

```
Tạo màn hình Quiz với:
- Timer 30 giây ở top
- C��u hỏi word meaning
- 4 nút đáp án A/B/C/D
- Progress bar 2/10
- Animation đúng (lách tay xanh) / sai (rung đỏ) kèm sound cue
- Background trắng, accent brand
```