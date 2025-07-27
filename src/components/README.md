# Components Structure - Atomic Design

Dự án này sử dụng mô hình **Atomic Design** để tổ chức components, giúp tạo ra một hệ thống thiết kế nhất quán và dễ bảo trì.

## 📁 Cấu trúc thư mục

```
src/components/
├── atoms/          # Các component cơ bản nhất
├── molecules/      # Kết hợp các atoms
├── organisms/      # Kết hợp molecules và atoms
├── templates/      # Layout templates
├── pages/          # Các trang hoàn chỉnh
└── index.js        # Export tổng hợp
```

## ⚛️ Atoms (Nguyên tử)

Các component cơ bản nhất, không thể chia nhỏ hơn:

- **Button**: Nút bấm với nhiều variant (primary, secondary, outline, ghost, danger)
- **Text**: Component text với các variant (heading, body, caption)
- **Icon**: Component icon SVG
- **Input**: Input field với validation states

### Sử dụng:
```jsx
import { Button, Text, Icon, Input } from '../components/atoms';

<Button variant="primary" size="medium">Click me</Button>
<Text variant="heading" size="xl">Title</Text>
<Icon name="dashboard" size="medium" />
<Input placeholder="Enter text..." />
```

## 🧬 Molecules (Phân tử)

Kết hợp các atoms để tạo thành component phức tạp hơn:

- **SidebarItem**: Item trong sidebar (Icon + Text + Button)

### Sử dụng:
```jsx
import { SidebarItem } from '../components/molecules';

<SidebarItem 
  icon="dashboard" 
  label="Dashboard" 
  isActive={true}
  onClick={handleClick}
/>
```

## 🦠 Organisms (Sinh vật)

Kết hợp molecules và atoms để tạo thành các phần lớn của UI:

- **Sidebar**: Thanh điều hướng bên trái
- **Header**: Header của trang

### Sử dụng:
```jsx
import { Sidebar, Header } from '../components/organisms';

<Sidebar isOpen={true} onToggle={toggleSidebar} />
<Header title="Dashboard" onMenuToggle={toggleSidebar} />
```

## 📄 Templates

Layout templates cho các trang:

- **DashboardLayout**: Layout chính với sidebar và header

### Sử dụng:
```jsx
import { DashboardLayout } from '../components/templates';

<DashboardLayout title="My Page">
  <div>Page content here</div>
</DashboardLayout>
```

## 📱 Pages

Các trang hoàn chỉnh:

- **Dashboard**: Trang dashboard chính

## 🎨 Styling

- Sử dụng **Tailwind CSS** cho styling
- Font: **Manrope** từ Google Fonts
- Sử dụng **clsx** để quản lý className động

## 🚀 Cách sử dụng

1. Import components từ thư mục tương ứng:
```jsx
import { Button } from './components/atoms';
import { SidebarItem } from './components/molecules';
import { Sidebar } from './components/organisms';
```

2. Hoặc import từ file index tổng hợp:
```jsx
import { Button, SidebarItem, Sidebar } from './components';
```

## 📋 Quy tắc

1. **Atoms** không được import components khác
2. **Molecules** chỉ được import atoms
3. **Organisms** có thể import atoms và molecules
4. **Templates** có thể import tất cả các loại component
5. **Pages** có thể import tất cả các loại component

## 🔧 Mở rộng

Để thêm component mới:

1. Tạo thư mục trong category phù hợp
2. Tạo file component chính (VD: `Button.jsx`)
3. Tạo file `index.js` để export
4. Cập nhật file `index.js` của category
5. Cập nhật file `index.js` tổng hợp nếu cần
