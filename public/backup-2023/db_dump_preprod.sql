-- MySQL dump 10.19 Distrib 8.0.34, for Linux (x86_64)
-- Host: db-master.internal.platanosdelnorte.es    Database: platanos_preprod_db
-- ------------------------------------------------------
-- Server version	8.0.34-0ubuntu0.22.04.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;

--
-- Table structure for table `usuarios_admin`
--

DROP TABLE IF EXISTS `usuarios_admin`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuarios_admin` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `password_clear_temp` varchar(100) DEFAULT NULL,
  `rol` varchar(30) DEFAULT 'operador',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuarios_admin`
--

LOCK TABLES `usuarios_admin` WRITE;
/*!40000 ALTER TABLE `usuarios_admin` DISABLE KEYS */;
INSERT INTO `usuarios_admin` VALUES 
(1,'admin','admin@platanosdelnorte.es','$2b$12$KIXsJk3eQxI4x8B2lP.W2eZJmN.eA7uH1jC6v2w8910aBcDeFgHi','PlatanosAdmin2023!','superadmin'),
(2,'cmendizabal','c.mendizabal@platanosdelnorte.es','$2b$12$yT6fWp9rL1zC3v5b7n8m0k2j4h6g8f1d3s5a7q9w1e3r5t7y9','PlatanosCandina2023*!','devops_systems'),
(3,'rarango','r.arango@platanosdelnorte.es','$2b$12$mN5b8v1c3x7z9a2s4d6f8h0j2k4l6q8w0e2r4t6y8u0i2o4p6','ArangoFinanzas#2024','cfo'),
(4,'esoto','elena.soto@platanosdelnorte.es','$2b$12$pO0i9u8y7t6r5e4w3q2a1s2d3f4g5h6j7k8l9z8x7c6v5b4n3','EtilenoCalidad2023$','calidad');
/*!40000 ALTER TABLE `usuarios_admin` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `claves_api`
--

DROP TABLE IF EXISTS `claves_api`;
CREATE TABLE `claves_api` (
  `servicio` varchar(50) NOT NULL,
  `token_secreto` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `claves_api` VALUES
('slack_alertas_it','https://hooks.slack.com/services/T05PDN981/B06AB1908/38f90ab9c9018e19ba'),
('api_maduracion_scada','pltn_live_sec_994812a4b8891040faec91');

-- Token de credenciales OSINT:
-- FLAG-04-PASSWORD-IN-FILE

-- Dump completed on 2023-11-02  3:00:11
