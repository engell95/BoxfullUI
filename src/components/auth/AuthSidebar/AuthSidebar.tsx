'use client';

import React from 'react';
import { Col } from 'antd';
import styles from './AuthSidebar.module.css';

export default function AuthSidebar() {
  return (
    <Col xs={0} md={14} lg={14} xl={14} className={styles.container}>
      {/* Imagen Principal */}
      <div className={styles.image} />

      {/* Cintilla Roja (NextDay Envíos) */}
      <div className={`${styles.ribbon} ${styles.ribbonRed}`}>
        NextDay Envíos
      </div>

      {/* Patrón inferior "X >>>" - Franja Verde Oscuro */}
      <div className={styles.patternContainer}>
        <div className={styles.patternText}>
          X{">>>"}X{">>>"}X{">>>"}X{">>>"}X{">>>"}X{">>>"}
        </div>
      </div>
    </Col>
  );
}
