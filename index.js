const express = require("express");
const cors = require("cors");
const sequelize = require("./config/database");
const catatanRoutes = require("./routes/catatanRoutes");
const path = require("path");

const app = express();

// 1. Middleware CORS
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
}));

// 2. Middleware JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 3. Serve frontend static files
app.use(express.static(path.join(__dirname, '..', 'frontend')));

// 4. Route dasar untuk testing
app.get("/", (req, res) => {
  res.send("Hello World!");
});

// 5. Load schema/model agar tabel otomatis terbuat
require("./schema/Catatan");

// 6. Setting Routes
app.use("/api/catatan", catatanRoutes);

// 7. Serve frontend untuk route lainnya
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'frontend', 'index.html'));
});

// 8. Sync Database dan Jalankan Server
const port = process.env.PORT || 3000;

sequelize.sync({ force: false }).then(() => {
  console.log("✅ Database synced");
  app.listen(port, '0.0.0.0', () => {
    console.log(`🚀 Server berjalan di http://localhost:${port}`);
    console.log(`📝 API tersedia di http://localhost:${port}/api/catatan`);
  });
}).catch((err) => {
  console.error("❌ Gagal sinkronisasi database:", err.message);
});
