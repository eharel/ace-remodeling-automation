# 🛠️ Ace Remodeling Automation

A comprehensive monorepo of Google Apps Script tools and automations built to streamline operations for [Ace Remodeling](https://aceremodelingtx.com/), a remodeling business based in Austin, TX.

These scripts power dashboards, project management, vendor onboarding, lead analysis, and more — all inside Google Sheets with robust form handling and data processing.

## 🚀 Features

### 📋 **Form Processing System**

- **Vendor Onboarding Form** - Multi-tab vendor registration with smart categorization
- **General Onboarding Form** - Trade professional onboarding with profession-based routing
- **Robust Field Matching** - Handles inconsistent form field formatting automatically
- **Smart Data Processing** - Phone normalization, clickable links, tab-specific data

### 🏗️ **Project Management Toolkit**

- **Active Project Dashboards** - Real-time project status and metrics
- **Lead Management** - Comprehensive lead tracking and analysis
- **Project Lifecycle Management** - From lead to completion
- **Auto-generated Reports** - Charts, summaries, and insights

### 📊 **Data Management**

- **Multi-tab Writing** - Intelligent routing to appropriate sheet tabs
- **Smart Chip Formatting** - Clickable addresses, emails, and websites
- **Phone Number Normalization** - Handles messy input intelligently
- **Title Canonicalization** - Robust bilingual field matching

## 📁 Project Structure

```
ace-remodeling/
├── src/
│   ├── apps-scripts/           # Deployed Google Apps Script libraries
│   │   ├── forms-library/      # Form processing system
│   │   └── pm-toolkit/         # Project management tools
│   ├── domains/                # Business domain logic
│   │   ├── onboarding/         # General onboarding form processing
│   │   ├── pm-toolkit/         # Project management domain
│   │   └── vendors/            # Vendor management domain
│   ├── forms/                  # Shared form processing utilities
│   │   ├── core/               # Form routing and extraction
│   │   ├── utils/              # Form-specific utilities
│   │   └── config/             # Form configurations
│   ├── utils/                  # Shared utilities
│   │   ├── phone.ts            # Phone number normalization
│   │   ├── sheets.ts           # Google Sheets utilities
│   │   └── debounce.ts         # Performance utilities
│   ├── tables/                 # Table rendering system
│   ├── ui/                     # UI components and sidebars
│   └── config/                 # Environment configurations
├── esbuild.config.js           # Build configuration
└── package.json                # Dependencies and scripts
```

## 🛠️ Tech Stack

- **Google Apps Script** (JavaScript / V8 Runtime)
- **TypeScript** - Type safety and developer experience
- **esbuild** - Fast bundling and compilation
- **[clasp](https://github.com/google/clasp)** - Local development and deployment
- **Monorepo Architecture** - Modular, maintainable codebase
- **Git + GitHub** - Version control and collaboration

## 📦 Deployed Libraries

### **Forms Library** (`src/apps-scripts/forms-library/`)

Handles all form submissions with robust processing:

- **Vendor Form** - Multi-category vendor registration
- **Onboarding Form** - Trade professional onboarding
- **Smart Field Matching** - Handles form inconsistencies
- **Multi-tab Routing** - Intelligent data distribution

### **PM Toolkit** (`src/apps-scripts/pm-toolkit/`)

Comprehensive project management system:

- **Lead Management** - Track and analyze leads
- **Project Dashboards** - Real-time project status
- **Executive Reports** - High-level business insights
- **Menu System** - User-friendly navigation

## 🔧 Development

### **Prerequisites**

- Node.js (v16+)
- Google Apps Script CLI (`clasp`)
- Google Cloud Project with Apps Script API enabled

### **Setup**

```bash
# Install dependencies
npm install

# Login to Google Apps Script
clasp login

# Build and deploy
npm run build:forms    # Build forms library
npm run push:forms     # Deploy forms library
npm run build:pm       # Build PM toolkit
npm run push:pm        # Deploy PM toolkit
```

### **Available Scripts**

```bash
# Build commands
npm run build:all      # Build all domains
npm run build:forms    # Build forms library only
npm run build:pm       # Build PM toolkit only

# Deploy commands
npm run push:forms     # Build and deploy forms library
npm run push:pm        # Build and deploy PM toolkit

# Clean commands
npm run clean:all      # Clean all build directories
npm run clean:forms    # Clean forms build
npm run clean:pm       # Clean PM toolkit build
```

## 🏗️ Architecture

### **Domain-Driven Design**

Each business domain is isolated with clear boundaries:

- **onboarding/** - General onboarding form processing
- **vendors/** - Vendor management and categorization
- **pm-toolkit/** - Project management and lead tracking

### **Shared Utilities**

Common functionality is centralized:

- **forms/** - Form processing and validation
- **utils/** - General utilities (phone, sheets, etc.)
- **tables/** - Table rendering and formatting
- **ui/** - User interface components

### **Build System**

- **esbuild** for fast TypeScript compilation
- **Path aliases** for clean imports
- **Environment-specific** configurations
- **Source maps** for debugging

## 🔄 Form Processing Flow

1. **Form Submission** → Google Apps Script trigger
2. **Field Extraction** → Canonicalize and validate fields
3. **Data Processing** → Transform and categorize data
4. **Multi-tab Routing** → Write to appropriate sheet tabs
5. **Smart Formatting** → Apply clickable links and formatting

## 🎯 Key Features

### **Robust Form Handling**

- Handles inconsistent field spacing around bilingual slashes
- Normalizes phone numbers intelligently
- Creates clickable links for addresses, emails, and websites
- Supports optional fields gracefully

### **Intelligent Data Routing**

- Routes vendors to appropriate categories (Rough/Finish/Other)
- Routes onboarding submissions to profession-specific tabs
- Maintains tab-specific data integrity

### **Production-Ready**

- Environment-specific configurations (dev/staging/prod)
- Comprehensive error handling and logging
- Thread-safe sheet operations
- Performance optimizations

## 📈 Business Impact

- **Automated Vendor Onboarding** - Streamlined vendor registration
- **Real-time Project Tracking** - Live project status updates
- **Data Quality** - Consistent, formatted data across all sheets
- **User Experience** - Clickable links and intuitive interfaces
- **Scalability** - Modular architecture supports growth

## 🙋‍♂️ About

Built by [Eli Harel](https://eliharel.vercel.app), software developer and contributor to operational efficiency at Ace Remodeling, CO.

---

_This monorepo represents a modern approach to Google Apps Script development, combining the power of TypeScript, modular architecture, and robust tooling to create maintainable, scalable business automation solutions._
