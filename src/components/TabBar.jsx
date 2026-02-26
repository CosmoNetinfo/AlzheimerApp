import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, CheckCircle2, MessageSquare, Users, User } from 'lucide-react';
import styles from './TabBar.module.css';

const TabBar = () => {
    return (
        <nav className={`${styles.tabBar} bottom-navbar`} aria-label="Navigazione principale">
            <NavLink
                to="/"
                className={({ isActive }) => `${styles.tab} ${isActive ? styles.active : ''}`}
            >
                <Home size={24} />
                <span className={styles.label}>HOME</span>
            </NavLink>

            <NavLink
                to="/chat"
                className={({ isActive }) => `${styles.tab} ${isActive ? styles.active : ''}`}
            >
                <MessageSquare size={24} />
                <span className={styles.label}>Chat</span>
            </NavLink>

            <NavLink
                to="/feed"
                className={({ isActive }) => `${styles.tab} ${isActive ? styles.active : ''}`}
            >
                <Users size={24} />
                <span className={styles.label}>Social</span>
            </NavLink>

            <NavLink
                to="/profilo"
                className={({ isActive }) => `${styles.tab} ${isActive ? styles.active : ''}`}
            >
                <User size={24} />
                <span className={styles.label}>Profilo</span>
            </NavLink>
        </nav>
    );
};

export default TabBar;

