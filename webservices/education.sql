-- phpMyAdmin SQL Dump
-- version 3.3.9
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: Nov 28, 2011 at 07:19 AM
-- Server version: 5.5.8
-- PHP Version: 5.3.5

SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Database: `education`
--

-- --------------------------------------------------------

--
-- Table structure for table `ngo`
--

CREATE TABLE IF NOT EXISTS `ngo` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `address` varchar(255) NOT NULL,
  `mobile_no` varchar(255) NOT NULL,
  `telephone_no` varchar(255) NOT NULL,
  `description` varchar(255) NOT NULL,
  `motive` varchar(255) NOT NULL,
  `location` varchar(255) NOT NULL,
  `area_work` varchar(255) NOT NULL,
  `image` varchar(500) NOT NULL,
  `website` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=3 ;

--
-- Dumping data for table `ngo`
--

INSERT INTO `ngo` (`id`, `username`, `password`, `address`, `mobile_no`, `telephone_no`, `description`, `motive`, `location`, `area_work`, `image`, `website`) VALUES
(1, 'nomi', 'nomi', 'nlknkl', 'nklnkln', 'kln', 'klnkl', 'nkl', 'nklnlknl', 'lknlkn', 'abc', 'abc'),
(2, 'ads', 'fsf', '', '', '', 'dsd', 'dasdas', 'adasd', 'dsda', 'dASDA', 'asdasd');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE IF NOT EXISTS `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `age` varchar(255) NOT NULL,
  `country` varchar(255) NOT NULL,
  `city` varchar(255) NOT NULL,
  `address` varchar(255) NOT NULL,
  `wishes` varchar(255) NOT NULL,
  `reason` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=7 ;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `age`, `country`, `city`, `address`, `wishes`, `reason`) VALUES
(1, 'hkhkh', '787', '', 'jbkjb', 'khkhj', 'kbgb', 'kbk'),
(2, 'hil', 'ilhilhl', 'ihilhilh', 'ilhilh', 'ilhil', 'hilhh', 'lhlh'),
(3, 'sasdas', '5', '', 'karachi', 'asdf', 'No Financial Support', 'asdf'),
(4, 'sadsa', '12', 'asdf', 'asdf', 'asdf', 'asdf', 'asdf'),
(5, 'rwe1', '234', 'asdf', 'gfdsa', 'asdf', 'sdf', 'gfds'),
(6, 'Sameer', '20', 'Pakistan', 'karachi', 'Ghar', 'No Financial Support', 'Nikal diya');

-- --------------------------------------------------------

--
-- Table structure for table `users_ngo`
--

CREATE TABLE IF NOT EXISTS `users_ngo` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `uid` varchar(255) NOT NULL,
  `ngoid` varchar(255) NOT NULL,
  `is_progress` varchar(255) NOT NULL,
  `is_supported` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=4 ;

--
-- Dumping data for table `users_ngo`
--

INSERT INTO `users_ngo` (`id`, `uid`, `ngoid`, `is_progress`, `is_supported`) VALUES
(1, '1', '2', '.,m.m', '.,m.,m'),
(2, '2', '1', '1', '0'),
(3, '3', '1', '0', '1');
