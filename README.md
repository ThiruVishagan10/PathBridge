# 🌉 PathBridge Portfolio Generator  

> 🚀 A modern, **AI-powered portfolio generator** built with Next.js that creates personalized portfolio websites from user input.  

![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)  
![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=white)  
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-06B6D4?style=for-the-badge&logo=tailwindcss)  
![Framer Motion](https://img.shields.io/badge/Framer_Motion-Animations-ff0050?style=for-the-badge&logo=framer)  
![Authentication](https://img.shields.io/badge/Auth-Secure-orange?style=for-the-badge&logo=auth0)  

---

```
 ____       _   _     ____       _     _            
|  _ \ __ _| |_| |__ | __ ) _ __(_) __| | __ _  ___ 
| |_) / _` | __| '_ \|  _ \| '__| |/ _` |/ _` |/ _ \
|  __/ (_| | |_| | | | |_) | |  | | (_| | (_| |  __/
|_|   \__,_|\__|_| |_|____/|_|  |_|\__,_|\__, |\___|
                                        |___/      
```

## 🎯 Project Objective  

PathBridge **simplifies portfolio creation** by allowing users to input their personal information, skills, projects, and experiences through an **intuitive form interface**.  
The app generates **professional portfolio websites** in multiple formats (**HTML** and **code**) that users can **download & deploy instantly**.  

---

<img src="https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/rainbow.png" width="100%">

```
 _____          _                       
|  ___|__  __ _| |_ _   _ _ __ ___  ___  
| |_ / _ \/ _` | __| | | | '__/ _ \/ __| 
|  _|  __/ (_| | |_| |_| | | |  __/\__ \ 
|_|  \___|\__,_|\__|\__,_|_|  \___||___/ 
```

## ✨ Features  

- 🎨 **Dynamic Form Interface** — Glass morphism design with **video background**  
- 🔐 **Authentication System** — Cookie-based auth with route protection  
- ⚡ **Real-time Validation** — Scroll-to-field validation feedback  
- 📦 **Multi-format Export** — Download portfolios as **HTML** or **Code files**  
- 📱 **Responsive Design** — Mobile-first with smooth animations  
- 🔗 **Social Integration** — LinkedIn & GitHub profile linking  
- ➕ **Dynamic Sections** — Add/remove **projects, experiences, certifications**  

---

<img src="https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/colored.png" width="100%">

```
 _____         _       ____  _             _    
|_   _|__  ___| |__   / ___|| |_ __ _  ___| | __
  | |/ _ \/ __| '_ \  \___ \| __/ _` |/ __| |/ /
  | |  __/ (__| | | |  ___) | || (_| | (__|   < 
  |_|\___|\___|_| |_| |____/ \__\__,_|\___|_|\_\
```

## 🛠 Tech Stack  

| Layer       | Technologies |
|-------------|--------------|
| **Frontend** | Next.js 14, React 18, Tailwind CSS, Framer Motion |
| **Auth**     | Cookie-based authentication middleware |
| **Backend**  | REST API (Flask/FastAPI) @ `localhost:8000` |
| **Styling**  | Glass morphism effects + backdrop blur |

---

<img src="https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/water.png" width="100%">

```
  ____      _   _   _               ____  _             _           _ 
 / ___| ___| |_| |_(_)_ __   __ _  / ___|| |_ __ _ _ __| |_ ___  __| |
| |  _ / _ \ __| __| | '_ \ / _` | \___ \| __/ _` | '__| __/ _ \/ _` |
| |_| |  __/ |_| |_| | | | | (_| |  ___) | || (_| | |  | ||  __/ (_| |
 \____|\___|\__|\__|_|_| |_|\__, | |____/ \__\__,_|_|   \__\___|\__,_|
                            |___/                                     
```

## 🚀 Getting Started  

1. **Install dependencies**  
   ```bash
   npm install
   # or
   yarn install
   ```

2. **Run the dev server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

3. **Start the backend server** (required for generation)
   ```bash
   # Ensure backend runs at http://localhost:8000
   ```

4. **Open** ➝ [http://localhost:3000](http://localhost:3000)

---

<img src="https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/rainbow.png" width="100%">

```
 ____            _           _     ____  _                   _                  
|  _ \ _ __ ___ (_) ___  ___| |_  / ___|| |_ _ __ _   _  ___| |_ _   _ _ __ ___  
| |_) | '__/ _ \| |/ _ \/ __| __| \___ \| __| '__| | | |/ __| __| | | | '__/ _ \ 
|  __/| | | (_) | |  __/ (__| |_   ___) | |_| |  | |_| | (__| |_| |_| | | |  __/ 
|_|   |_|  \___// |\___|\___|\__| |____/ \__|_|   \__,_|\___|\__|\__,_|_|  \___| 
               |__/                                                              
```

## 📂 Project Structure
```
pathbridge/
├── src/
│   ├── app/
│   │   ├── auth/           # Authentication pages
│   │   └── page.js         # Main portfolio form
│   ├── components/
│   │   ├── Auth/           # Auth components
│   │   └── portfolio/      # Portfolio form components
│   └── middleware.js       # Authentication middleware
├── public/
│   └── videos/             # Background video assets
└── README.md
```

---

<img src="https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/colored.png" width="100%">

```
    _    ____ ___   ___       _                       _   _             
   / \  |  _ \_ _| |_ _|_ __ | |_ ___  __ _ _ __ __ _| |_(_) ___  _ __  
  / _ \ | |_) | |   | || '_ \| __/ _ \/ _` | '__/ _` | __| |/ _ \| '_ \ 
 / ___ \|  __/| |   | || | | | ||  __/ (_| | | | (_| | |_| | (_) | | | |
/_/   \_\_|  |___| |___|_| |_|\__\___|\__, |_|  \__,_|\__|_|\___/|_| |_|
                                     |___/                             
```

## 🔗 API Integration
- **POST /** → Submit portfolio data for generation
- **GET /download-txt** → Download portfolio as code/text  
- **GET /download-html** → Download portfolio as HTML

---

<img src="https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/fire.png" width="100%">

```
 _____                       ____        _           ____  _                   _                  
|  ___|__  _ __ _ __ ___   |  _ \  __ _| |_ __ _   / ___|| |_ _ __ _   _  ___| |_ _   _ _ __ ___ 
| |_ / _ \| '__| '_ ` _ \  | | | |/ _` | __/ _` |  \___ \| __| '__| | | |/ __| __| | | | '__/ _ \
|  _| (_) | |  | | | | | | | |_| | (_| | || (_| |  ___) | |_| |  | |_| | (__| |_| |_| | | |  __/
|_|  \___/|_|  |_| |_| |_| |____/ \__,_|\__\__,_| |____/ \__|_|   \__,_|\___|\__|\__,_|_|  \___|
## 📝 Form Data Structure
```json
{
  "name": "string",
  "about": "string",
  "degree": "string",
  "collegeName": "string",
  "yearOfPassing": "string",
  "skills": "string",
  "linkedinUrl": "string",
  "githubUrl": "string",
  "projects": [
    { "name": "string", "description": "string" }
  ],
  "experiences": [
    { "companyName": "string", "role": "string", "duration": "string" }
  ],
  "certifications": ["string"]
}
```

---

<img src="https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/water.png" width="100%">

```
 _  __           ____                                             _       
| |/ /___ _   _ / ___|___  _ __ ___  _ __   ___  _ __   ___ _ __ | |_ ___ 
| ' // _ \ | | | |   / _ \| '_ ` _ \| '_ \ / _ \| '_ \ / _ \ '_ \| __/ __|
| . \  __/ |_| | |__| (_) | | | | | | |_) | (_) | | | |  __/ | | | |_\__ \
|_|\_\___|\__, |\____\___/|_| |_| |_| .__/ \___/|_| |_|\___|_| |_|\__|___/
          |___/                     |_|                                  
```

## 🔑 Key Components
- **PortfolioForm** → Dynamic portfolio form with validation
- **AuthForm** → Secure login & registration interface  
- **Middleware** → Route protection and authentication

---

<img src="https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/rainbow.png" width="100%">

```
 ____             _                                  _   
|  _ \  ___ _ __ | | ___  _   _ _ __ ___   ___ _ __ | |_ 
| | | |/ _ \ '_ \| |/ _ \| | | | '_ ` _ \ / _ \ '_ \| __|
| |_| |  __/ |_) | | (_) | |_| | | | | | |  __/ | | | |_ 
|____/ \___| .__/|_|\___/ \__, |_| |_| |_|\___|_| |_|\__|
           |_|            |___/                         
```

## 📦 Deployment
Deploy easily on **Vercel**:

```bash
npm run build
```

➡️ **Ensure backend API is accessible from the deployed environment.**

🔗 **[Deploy on Vercel](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme)**