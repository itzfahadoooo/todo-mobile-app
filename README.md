# TodoApp - Modern Todo List with Real-time Sync

A sophisticated, pixel-perfect Todo List application built with **React Native**, **Expo Router**, **Convex**, and **TypeScript**. Features beautiful light/dark themes, real-time synchronization, and a responsive design that works flawlessly on mobile, tablet, and desktop.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React Native](https://img.shields.io/badge/React%20Native-0.73-61DAFB.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg)
![Expo](https://img.shields.io/badge/Expo-~50.0-000020.svg)

---

## ✨ Features

- 🎨 **Theme Switching** - Beautiful light and dark themes with smooth transitions
- ⚡ **Real-time Sync** - Powered by Convex for instant updates across devices
- 📱 **Fully Responsive** - Pixel-perfect design on mobile (327px) and desktop (540px)
- ✅ **Full CRUD Operations** - Create, Read, Update, and Delete todos seamlessly
- 🔍 **Filter & Search** - Filter by All/Active/Completed status
- 👆 **Swipe to Delete** - Intuitive gesture-based interactions
- 💾 **Persistent Preferences** - Theme choice saved across app restarts
- 🎯 **Empty States** - Context-aware messages for better UX
- ♿ **Accessible** - Proper contrast, touch targets, and screen reader support

---

## 🛠️ Tech Stack

- **Framework:** React Native with Expo
- **Routing:** Expo Router
- **Backend:** Convex (Real-time database)
- **Language:** TypeScript
- **Styling:** React Native StyleSheet
- **UI Components:** Custom components with Ionicons
- **State Management:** React Context API + Convex
- **Storage:** AsyncStorage for theme persistence
- **Gestures:** React Native Gesture Handler
- **Fonts:** Josefin Sans (Google Fonts)

---

## 📁 Project Structure

```
TodoApp/
├── app/
│   ├── (tabs)/
│   │   ├── index.tsx          # Main todo screen
│   │   └── _layout.tsx        # Tab navigation layout
│   └── _layout.tsx            # Root layout with providers
├── assets/
│   └── fonts/
│       ├── JosefinSans-Regular.ttf
│       └── JosefinSans-Bold.ttf
├── components/
│   ├── TodoItem.tsx           # Individual todo with swipe-to-delete
│   ├── ThemeToggle.tsx        # Theme switcher button
│   └── EmptyState.tsx         # Empty state UI
├── contexts/
│   └── ThemeContext.tsx       # Theme management & persistence
├── convex/
│   ├── schema.ts              # Database schema
│   ├── todos.ts               # CRUD operations & queries
│   └── _generated/            # Auto-generated Convex files
├── constants/
│   └── theme.ts               # Light/dark theme colors
├── .env.local                 # Environment variables (Convex URL)
├── app.json                   # Expo configuration
├── package.json               # Dependencies
└── tsconfig.json              # TypeScript configuration
```

---

## 🚀 Installation & Setup

### Prerequisites

- Node.js 16+ and npm/yarn
- Expo CLI (`npm install -g expo-cli`)
- A Convex account (https://convex.dev)

### Steps

1. **Clone or download the project:**

```bash
git clone <repository-url>
cd TodoApp
```

2. **Install dependencies:**

```bash
npm install
```

3. **Set up Convex backend:**

```bash
# Install Convex CLI globally
npm install -g convex

# Initialize Convex (creates .env.local automatically)
npx convex dev
```

This will:
- Create a new Convex project
- Generate your `CONVEX_URL`
- Start the Convex development server

4. **Configure environment variables:**

Create a `.env` file in the root directory:

```bash
EXPO_PUBLIC_CONVEX_URL=https://your-project.convex.cloud
```

5. **Add fonts to assets folder:**

Download Josefin Sans from Google Fonts:
- Visit: https://fonts.google.com/specimen/Josefin+Sans
- Download and extract
- Copy `JosefinSans-Regular.ttf` and `JosefinSans-Bold.ttf` to `assets/fonts/`

6. **Start development server:**

```bash
npm start
```

Then choose your platform:
- Press `w` for web
- Press `a` for Android emulator
- Press `i` for iOS simulator
- Scan QR code with Expo Go app for physical device

7. **Build for production:**

```bash
# Install EAS CLI
npm install -g eas-cli

# Login to Expo
eas login

# Configure the project
eas build:configure

# Build APK for Android
eas build --platform android --profile preview

# Build for iOS
eas build --platform ios --profile preview
```

---

## 📖 Usage

### Theme Switching

- Click the sun/moon icon in the top right to toggle themes
- Theme preference is automatically saved to device storage
- Smooth animated transitions between themes

### Creating Todos

1. Type your todo in the input box at the top
2. Press Enter or tap the checkmark to add
3. Todo appears instantly with real-time sync

### Managing Todos

- **Mark as Complete:** Tap the circle checkbox
- **Delete:** Swipe left on a todo item or tap the X button
- **Edit:** Tap on the todo text (future enhancement)

### Filtering Todos

- **All:** View all todos
- **Active:** Show only incomplete todos
- **Completed:** Show only finished todos
- Mobile: Filters appear in a separate card below the list
- Desktop: Filters appear inline in the bottom bar

### Clearing Completed

- Click "Clear Completed" to remove all finished todos at once

---

## 🎨 Design System

### Colors

| Theme Element | Light Mode | Dark Mode |
|---------------|------------|-----------|
| Background | `#FFFFFF` | `#1A1A2E` |
| Card Background | `#FFFFFF` | `#16213E` |
| Input Background | `#F8F8F8` | `#0F1624` |
| Text | `#2C2C2C` | `#EAEAEA` |
| Primary | `#6C63FF` | `#6C63FF` |
| Border | `#E0E0E0` | `#2A2A4E` |

### Typography

- **Font Family:** Josefin Sans
- **Headers:** Bold, 28px
- **Body Text:** Regular, 12px
- **Letter Spacing:** -0.17px to -0.19px

### Layout

- **Mobile Width:** 327px max
- **Desktop Width:** 540px max
- **Border Radius:** 5px
- **Shadows:** 10px offset, 0.2 opacity, 20px blur

---

## ⚡ Convex Backend

### Database Schema

```typescript
todos: {
  title: string,
  description?: string,
  completed: boolean,
  dueDate?: string,
  createdAt: number,
  order: number
}
```

### API Functions

- **getTodos** - Query all todos (real-time)
- **createTodo** - Add a new todo
- **updateTodo** - Modify existing todo
- **toggleTodo** - Toggle completion status
- **deleteTodo** - Remove a todo
- **updateTodoOrder** - Reorder todos (drag & drop ready)

### Real-time Features

- Automatic updates when data changes
- Optimistic UI updates
- Offline-first with automatic sync
- Multi-device synchronization

---

## 📱 Responsive Design

### Mobile (< 768px)

- 327px content width
- 200px header background
- Separate filter card
- Vertical layout
- Touch-optimized targets

### Desktop (≥ 768px)

- 540px content width
- 300px header background
- Inline filters in bottom bar
- Centered content
- Hover states

---

## ♿ Accessibility Features

- Semantic component structure
- High contrast color combinations (WCAG AA compliant)
- Touch targets minimum 44x44px
- Clear focus states
- Screen reader friendly labels
- Keyboard navigation support

---

## 🗂️ State Management

### ThemeContext

- Manages light/dark theme state
- Stores preference in AsyncStorage
- Provides theme colors and toggle function
- Shows loading spinner while fetching saved preference

### Convex Real-time State

- Automatic query updates
- Optimistic mutations
- Built-in error handling
- Offline support with sync

---

## 🌐 Platform Support

- ✅ **Web** - Chrome, Firefox, Safari, Edge (latest)
- ✅ **iOS** - iOS 13+ (with Expo Go or standalone build)
- ✅ **Android** - Android 5.0+ (with Expo Go or APK)

---

## 📦 Key Dependencies

```json
{
  "expo": "~50.0.0",
  "react": "18.2.0",
  "react-native": "0.73.0",
  "expo-router": "~3.4.0",
  "convex": "^1.9.0",
  "@react-native-async-storage/async-storage": "1.21.0",
  "react-native-gesture-handler": "~2.14.0",
  "expo-linear-gradient": "~12.7.0",
  "expo-font": "~11.10.0",
  "@expo/vector-icons": "^14.0.0"
}
```

---

## 🚧 Future Enhancements

- [ ] Drag and drop reordering
- [ ] Todo categories/tags
- [ ] Due date reminders
- [ ] Recurring todos
- [ ] User authentication
- [ ] Collaboration features
- [ ] Export/Import functionality
- [ ] Priority levels
- [ ] Subtasks
- [ ] Analytics dashboard

---

## ⚠️ Known Limitations

- Theme toggle animation may not be smooth on older devices
- Background images require internet connection
- Web version has limited gesture support
- Font loading requires manual download and setup

---

## 🔧 Troubleshooting

### Convex Connection Issues
- Ensure `EXPO_PUBLIC_CONVEX_URL` is set correctly in `.env`
- Run `npx convex dev` to start development backend
- Check Convex dashboard for deployment status

### Font Not Loading
- Verify font files exist in `assets/fonts/`
- Clear cache: `npx expo start -c`
- Reinstall dependencies: `rm -rf node_modules && npm install`

### Build Errors
- Update Expo: `npm install expo@latest`
- Clear cache: `npx expo start -c`
- Delete `.expo` folder and restart

---

## 📹 Demo & Submission

For Frontend Wizards Stage 3 submission:

1. **Record video** demonstrating all features with voiceover
2. **Build APK** using EAS: `eas build --platform android --profile preview`
3. **Upload** video and APK to Google Drive
4. **Share** the drive link

### Video should show:
- ✅ Theme switching (light/dark)
- ✅ Creating new todos
- ✅ Marking todos as complete
- ✅ Filtering (All/Active/Completed)
- ✅ Swipe to delete
- ✅ Real-time sync (if possible, show on 2 devices)
- ✅ Responsive design (mobile & desktop)
- ✅ Empty states

---

## 📄 License

MIT License – feel free to use this project for learning and development.

---

## 🙏 Acknowledgments

Built with ❤️ as part of the Frontend Wizards Stage 3 challenge.

Design inspired by Frontend Mentor's Todo App challenge.

Powered by Convex for seamless real-time synchronization.

---

**Happy Coding! 🎉**#   t o d o - m o b i l e - a p p  
 