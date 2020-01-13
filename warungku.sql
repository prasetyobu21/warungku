-- phpMyAdmin SQL Dump
-- version 4.9.2
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: Jan 13, 2020 at 06:29 AM
-- Server version: 10.3.20-MariaDB
-- PHP Version: 7.3.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `warungku`
--

-- --------------------------------------------------------

--
-- Table structure for table `complain`
--

DROP TABLE IF EXISTS `complain`;
CREATE TABLE IF NOT EXISTS `complain` (
  `sender` varchar(50) DEFAULT NULL,
  `reciever` varchar(50) DEFAULT NULL,
  `message` varchar(1000) DEFAULT NULL,
  `complainID` varchar(1000) DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
CREATE TABLE IF NOT EXISTS `users` (
  `userEmail` varchar(100) DEFAULT NULL,
  `userPassword` varchar(50) DEFAULT NULL,
  `userType` varchar(10) DEFAULT NULL,
  `userAddress` varchar(100) DEFAULT NULL,
  `phoneNumber` int(11) DEFAULT NULL,
  `userStatus` varchar(15) DEFAULT NULL,
  `information` varchar(100) DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`userEmail`, `userPassword`, `userType`, `userAddress`, `phoneNumber`, `userStatus`, `information`) VALUES
('tyo', 'qwerty', 'warung', NULL, NULL, NULL, NULL),
('agust', 'qwerty', 'agen', NULL, NULL, NULL, NULL),
('admin', 'admin', 'admin', NULL, NULL, NULL, NULL);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
