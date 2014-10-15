-- phpMyAdmin SQL Dump
-- version 4.0.6deb1
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: Oct 15, 2014 at 09:56 AM
-- Server version: 5.5.32-0ubuntu7
-- PHP Version: 5.5.3-1ubuntu2.6

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Database: `staffing`
--

-- --------------------------------------------------------

--
-- Table structure for table `application`
--

CREATE TABLE IF NOT EXISTS `application` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `candidate_id` bigint(20) NOT NULL,
  `vacancy_id` bigint(20) NOT NULL,
  `company_id` bigint(20) NOT NULL,
  `status` varchar(30) NOT NULL,
  `created_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_time` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `created_by` varchar(256) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=37 ;

-- --------------------------------------------------------

--
-- Table structure for table `application_h`
--

CREATE TABLE IF NOT EXISTS `application_h` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `application_id` bigint(20) NOT NULL,
  `prevstatus` varchar(30) NOT NULL,
  `curstatus` varchar(30) NOT NULL,
  `updated_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=75 ;

-- --------------------------------------------------------

--
-- Table structure for table `candidate`
--

CREATE TABLE IF NOT EXISTS `candidate` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `name` varchar(256) NOT NULL,
  `title` varchar(4000) NOT NULL,
  `email` varchar(256) NOT NULL,
  `alt_email` varchar(256) DEFAULT NULL,
  `exp` int(11) NOT NULL,
  `phone` varchar(40) NOT NULL,
  `alt_phone` varchar(40) DEFAULT NULL,
  `skills` varchar(2000) NOT NULL,
  `city` varchar(256) NOT NULL,
  `country` varchar(256) NOT NULL,
  `cvpath` varchar(4000) NOT NULL,
  `company_id` int(11) NOT NULL,
  `status` varchar(30) NOT NULL,
  `active` varchar(5) NOT NULL,
  `comments` varchar(4000) NOT NULL,
  `created_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_time` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `created_by` varchar(256) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=62 ;

-- --------------------------------------------------------

--
-- Table structure for table `city`
--

CREATE TABLE IF NOT EXISTS `city` (
  `city` varchar(500) NOT NULL,
  UNIQUE KEY `city` (`city`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `comments`
--

CREATE TABLE IF NOT EXISTS `comments` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `application_h_id` bigint(20) NOT NULL,
  `comment` varchar(4000) NOT NULL,
  `created_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `created_by` varchar(256) NOT NULL,
  `posting_h_id` bigint(20) DEFAULT NULL,
  `posting_note` varchar(2000) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=41 ;

-- --------------------------------------------------------

--
-- Table structure for table `company`
--

CREATE TABLE IF NOT EXISTS `company` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `name` varchar(256) NOT NULL,
  `description` varchar(4000) NOT NULL,
  `created_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_time` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `created_by` varchar(256) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=11 ;

-- --------------------------------------------------------

--
-- Table structure for table `posting`
--

CREATE TABLE IF NOT EXISTS `posting` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `candidate_id` bigint(20) NOT NULL,
  `title` varchar(4000) CHARACTER SET latin1 NOT NULL,
  `description` varchar(4000) NOT NULL,
  `type` varchar(30) NOT NULL,
  `employment_type` varchar(2000) NOT NULL,
  `status` varchar(30) NOT NULL,
  `skills` varchar(4000) CHARACTER SET latin1 NOT NULL,
  `exp_min` int(11) NOT NULL,
  `exp_max` int(11) NOT NULL,
  `city` varchar(256) CHARACTER SET latin1 NOT NULL,
  `country` varchar(256) NOT NULL,
  `company_id` int(11) NOT NULL,
  `comments` varchar(4000) NOT NULL,
  `created_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_time` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `created_by` varchar(256) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=20 ;

-- --------------------------------------------------------

--
-- Table structure for table `posting_h`
--

CREATE TABLE IF NOT EXISTS `posting_h` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `posting_id` bigint(20) DEFAULT NULL,
  `prevstatus` varchar(200) CHARACTER SET utf8 NOT NULL,
  `curstatus` varchar(200) CHARACTER SET utf8 NOT NULL,
  `updated_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=91 ;

-- --------------------------------------------------------

--
-- Table structure for table `roles`
--

CREATE TABLE IF NOT EXISTS `roles` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(128) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=6 ;

-- --------------------------------------------------------

--
-- Table structure for table `search_log`
--

CREATE TABLE IF NOT EXISTS `search_log` (
  `user_id` text NOT NULL,
  `date` date NOT NULL,
  `searchQuery` varchar(2500) NOT NULL,
  `count` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `status`
--

CREATE TABLE IF NOT EXISTS `status` (
  `id` varchar(30) NOT NULL,
  `name` varchar(256) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE IF NOT EXISTS `user` (
  `email` varchar(128) NOT NULL,
  `username` varchar(256) NOT NULL,
  `password` varchar(4000) NOT NULL,
  `name` varchar(4000) NOT NULL,
  `description` varchar(1024) DEFAULT NULL,
  `mobile_number` varchar(18) NOT NULL,
  `region` int(1) NOT NULL,
  `role` varchar(128) NOT NULL,
  `status` varchar(5) NOT NULL,
  PRIMARY KEY (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `vacancy`
--

CREATE TABLE IF NOT EXISTS `vacancy` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `title` varchar(4000) CHARACTER SET latin1 NOT NULL,
  `name` varchar(4000) CHARACTER SET latin1 NOT NULL,
  `description` varchar(4000) NOT NULL,
  `status` varchar(30) NOT NULL,
  `skills` varchar(4000) CHARACTER SET latin1 NOT NULL,
  `exp_min` int(11) NOT NULL,
  `exp_max` int(11) NOT NULL,
  `city` varchar(256) CHARACTER SET latin1 NOT NULL,
  `country` varchar(256) NOT NULL,
  `company_id` int(11) NOT NULL,
  `created_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_time` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `created_by` varchar(256) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=42 ;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
