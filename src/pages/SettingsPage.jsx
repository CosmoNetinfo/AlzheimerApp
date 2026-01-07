import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  LogOut,
  User,
  ChevronLeft,
  Bell,
  Type,
  ShieldAlert,
  HelpCircle,
  Info,
  ChevronRight,
  Camera,
} from "lucide-react";

const SettingsPage = () => {
  const navigate = useNavigate();

  // 1. Stato Utente (Recuperato da LocalStorage)
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("alzheimer_user");
    return saved
      ? JSON.parse(saved)
      : { name: "Utente", surname: "", photo: null };
  });

  // 2. Stati Preferenze
  const [notifications, setNotifications] = useState(
    () => localStorage.getItem("setting_notifications") === "true"
  );
  const [largeText, setLargeText] = useState(
    () => localStorage.getItem("setting_largeText") === "true"
  );

  // 3. Salvataggio Automatico Preferenze
  useEffect(() => {
    localStorage.setItem("setting_notifications", notifications);
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem("setting_largeText", largeText);
    if (largeText) {
      document.body.classList.add("large-text-mode");
    } else {
      document.body.classList.remove("large-text-mode");
    }
  }, [largeText]);

  const handleLogout = () => {
    if (window.confirm("Vuoi davvero uscire dall'account?")) {
      localStorage.removeItem("alzheimer_user");
      window.location.href = "/login";
    }
  };

  // Stili interni ottimizzati
  const styles = {
    container: {
      backgroundColor: "var(--color-bg-primary)",
      minHeight: "100%",
      padding: "16px",
      paddingBottom: "120px",
    },
    header: {
      display: "flex",
      alignItems: "center",
      marginBottom: "24px",
      gap: "12px",
    },
    backBtn: {
      padding: "8px",
      background: "white",
      borderRadius: "50%",
      color: "var(--color-primary)",
      boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      border: "none",
      cursor: "pointer",
    },
    pageTitle: {
      fontSize: "24px",
      fontWeight: "800",
      color: "var(--color-primary)",
      margin: 0,
    },
    profileSection: {
      backgroundColor: "white",
      borderRadius: "24px",
      padding: "20px",
      display: "flex",
      alignItems: "center",
      gap: "16px",
      marginBottom: "32px",
      boxShadow: "0 4px 12px rgba(0,0,0,0.03)",
      position: "relative",
      border: "none",
    },
    avatar: {
      width: "80px",
      height: "80px",
      borderRadius: "50%",
      backgroundColor: "#F0F0F0",
      backgroundImage: user.photo ? `url(${user.photo})` : "none",
      backgroundSize: "cover",
      backgroundPosition: "center",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      border: "3px solid white",
      boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
    },
    sectionLabel: {
      fontSize: "14px",
      fontWeight: "700",
      color: "#A0A0A0",
      textTransform: "uppercase",
      letterSpacing: "1px",
      margin: "0 0 12px 8px",
    },
    menuCard: {
      backgroundColor: "white",
      borderRadius: "20px",
      overflow: "hidden",
      boxShadow: "0 4px 12px rgba(0,0,0,0.03)",
      marginBottom: "24px",
    },
    menuItem: {
      display: "flex",
      alignItems: "center",
      padding: "16px 20px",
      borderBottom: "1px solid #F5F5F5",
      cursor: "pointer",
      transition: "background-color 0.2s",
      justifyContent: "space-between",
      background: "none",
      width: "100%",
      textAlign: "left",
      border: "none",
    },
    iconWrapper: (color) => ({
      width: "36px",
      height: "36px",
      borderRadius: "10px",
      backgroundColor: color,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "white",
      marginRight: "16px",
    }),
    itemContent: {
      flex: 1,
      display: "flex",
      flexDirection: "column",
    },
    itemLabel: {
      fontSize: "17px",
      fontWeight: "600",
      color: "var(--color-text-primary)",
    },
    itemSubLabel: {
      fontSize: "13px",
      color: "#8E8E93",
    },
    switch: (isOn) => ({
      width: "51px",
      height: "31px",
      backgroundColor: isOn ? "#34C759" : "#E9E9EA",
      borderRadius: "16px",
      position: "relative",
      transition: "0.3s",
    }),
    knob: (isOn) => ({
      width: "27px",
      height: "27px",
      backgroundColor: "white",
      borderRadius: "50%",
      position: "absolute",
      top: "2px",
      left: isOn ? "22px" : "2px",
      transition: "0.3s",
      boxShadow: "0 3px 8px rgba(0,0,0,0.15)",
    }),
    logoutBtn: {
      width: "100%",
      padding: "18px",
      backgroundColor: "#FF3B30",
      color: "white",
      borderRadius: "16px",
      fontSize: "18px",
      fontWeight: "700",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "12px",
      marginTop: "10px",
      boxShadow: "0 4px 12px rgba(255, 59, 48, 0.2)",
      border: "none",
      cursor: "pointer",
    },
  };

  return (
    <div style={styles.container}>
      {/* Header con tasto indietro */}
      <div style={styles.header}>
        <button onClick={() => navigate(-1)} style={styles.backBtn}>
          <ChevronLeft size={24} />
        </button>
        <h1 style={styles.pageTitle}>Impostazioni</h1>
      </div>

      {/* Profilo Utente */}
      <div style={styles.profileSection}>
        <div style={styles.avatar}>
          {!user.photo && <User size={40} color="#CCC" />}
        </div>
        <div>
          <h2 style={{ fontSize: "20px", margin: 0 }}>
            {user.name} {user.surname}
          </h2>
          <p
            style={{ color: "#8E8E93", margin: "4px 0 0 0", fontSize: "14px" }}
          >
            Account Caregiver / Paziente
          </p>
        </div>
        <button
          style={{
            position: "absolute",
            top: 20,
            right: 20,
            background: "none",
            color: "var(--color-primary)",
            border: "none",
            cursor: "pointer",
          }}
        >
          <Info size={20} />
        </button>
      </div>

      {/* Preferenze App */}
      <h3 style={styles.sectionLabel}>Preferenze</h3>
      <div style={styles.menuCard}>
        <div
          style={styles.menuItem}
          onClick={() => setNotifications(!notifications)}
        >
          <div style={{ display: "flex", alignItems: "center" }}>
            <div style={styles.iconWrapper("#007AFF")}>
              <Bell size={20} />
            </div>
            <div style={styles.itemContent}>
              <span style={styles.itemLabel}>Notifiche Medicine</span>
              <span style={styles.itemSubLabel}>Avvisi orari e farmaci</span>
            </div>
          </div>
          <div style={styles.switch(notifications)}>
            <div style={styles.knob(notifications)}></div>
          </div>
        </div>

        <div
          style={{ ...styles.menuItem, borderBottom: "none" }}
          onClick={() => setLargeText(!largeText)}
        >
          <div style={{ display: "flex", alignItems: "center" }}>
            <div style={styles.iconWrapper("#5856D6")}>
              <Type size={20} />
            </div>
            <div style={styles.itemContent}>
              <span style={styles.itemLabel}>Testo Grande</span>
              <span style={styles.itemSubLabel}>Migliora la leggibilità</span>
            </div>
          </div>
          <div style={styles.switch(largeText)}>
            <div style={styles.knob(largeText)}></div>
          </div>
        </div>
      </div>

      {/* Sicurezza e Supporto */}
      <h3 style={styles.sectionLabel}>Sicurezza</h3>
      <div style={styles.menuCard}>
        <button style={styles.menuItem}>
          <div style={{ display: "flex", alignItems: "center" }}>
            <div style={styles.iconWrapper("#FF9500")}>
              <ShieldAlert size={20} />
            </div>
            <div style={styles.itemContent}>
              <span style={styles.itemLabel}>Contatti SOS</span>
              <span style={styles.itemSubLabel}>
                Imposta numeri di emergenza
              </span>
            </div>
          </div>
          <ChevronRight size={20} color="#C7C7CC" />
        </button>

        <button
          style={{ ...styles.menuItem, borderBottom: "none" }}
          onClick={() => window.open("tel:02809767")}
        >
          <div style={{ display: "flex", alignItems: "center" }}>
            <div style={styles.iconWrapper("#34C759")}>
              <HelpCircle size={20} />
            </div>
            <div style={styles.itemContent}>
              <span style={styles.itemLabel}>Supporto Tecnico</span>
              <span style={styles.itemSubLabel}>
                Aiuto gratuito Pronto Alzheimer
              </span>
            </div>
          </div>
          <ChevronRight size={20} color="#C7C7CC" />
        </button>
      </div>

      {/* Info App */}
      <div style={{ textAlign: "center", marginBottom: "32px" }}>
        <p style={{ color: "#8E8E93", fontSize: "13px" }}>
          Versione App 1.1.0
          <br />
          AlzheimerApp &copy; 2026
        </p>
      </div>

      {/* Logout Button */}
      <button style={styles.logoutBtn} onClick={handleLogout}>
        <LogOut size={22} />
        Disconnetti account
      </button>
    </div>
  );
};

export default SettingsPage;
