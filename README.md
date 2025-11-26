

# **CommunetNew**

## 🏢 Community & Apartment Management System

**CommunetNew** is a full-stack web application built to provide a modern digital solution for apartment-based communities.
It helps streamline day-to-day community operations, improve communication, and make management tasks easier for both residents and administrators.

This system is designed as a complete platform that allows members to interact, share information, manage resources, and stay updated within their apartment community.

---

## ✨ **Key Features**

* 👤 **User / Member Management**
  Residents can register, log in, and manage their profile.

* 🏘️ **Community Announcements & Notices**
  Admins can publish updates, notices, and reminders for all residents.

* 📊 **Polls & Voting (if included)**
  Only admins can create polls, and residents can vote. Useful for community decisions.

* 🧾 **Reports / Complaints Handling**
  Users can submit issues or service requests; admins can respond and track them.

* 🎟️ **Event or Resource Management**
  (If included — e.g., booking common areas, event notifications.)

* 🔐 **Secure Authentication**
  Token-based login and optional OTP verification for added security.

* 📸 **Profile Image Uploads**
  Integrated with Cloudinary (or similar) for secure image hosting.

* 💬 **Smooth Communication Between Admin & Residents**

You can tell me if you want to add/remove any feature sections based on what is actually in your project.

---

## 🧰 **Technology Stack**

### **Frontend**

* React.js
* Modern UI components
* Responsive design for mobile & desktop

### **Backend**

* Node.js & Express.js
* REST API architecture

### **Database**

* MongoDB + Mongoose

### **Other Integrations**

* Cloudinary (image upload)
* JWT (authentication)
* Environment variables for secrets & configs

---

## 📁 **Project Structure**

```
CommunetNew/
├── BACKEND/      # Server-side code (APIs, models, routes)
├── frontend/     # Client-side code (React app)
└── .vscode/      # Editor settings (optional)
```

---

## 🚀 **Getting Started**

### **1️⃣ Clone the repository**

```bash
git clone https://github.com/SandunDulanjana/CommunetNew.git
```

### **2️⃣ Backend Setup**

```bash
cd CommunetNew/BACKEND
npm install
```

Create a `.env` file and include values such as:

```
MONGO_URI=your_mongodb_link
JWT_SECRET=your_secret
CLOUDINARY_API_KEY=your_key
CLOUDINARY_API_SECRET=your_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
```

Start the backend:

```bash
npm start
```

### **3️⃣ Frontend Setup**

```bash
cd ../frontend
npm install
npm start
```

The frontend will usually run at:

```
http://localhost:3000
```

---

## 🧑‍💻 **How to Use**

1. Open the frontend in your browser.
2. Register or login as a community member or admin.
3. Access community features such as:

   * Reading announcements
   * Voting in polls
   * Updating your profile
   * Submitting requests / complaints
4. Admin users can manage notices, polls, and resident information.

---

## 🤝 **Contributing**

1. Fork this repository
2. Create a feature branch
3. Commit your improvements
4. Submit a Pull Request



