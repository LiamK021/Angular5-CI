-- phpMyAdmin SQL Dump
-- version 4.7.7
-- https://www.phpmyadmin.net/
--
-- Host: sql.envision.morscad.com
-- Generation Time: Aug 07, 2018 at 07:26 AM
-- Server version: 5.6.34-log
-- PHP Version: 7.1.17

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `envision_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `donors`
--

CREATE TABLE `donors` (
  `id` int(64) NOT NULL,
  `donorKey` varchar(64) NOT NULL,
  `donorName` text NOT NULL,
  `letter` varchar(16) NOT NULL,
  `donor_order` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `donors_category`
--

CREATE TABLE `donors_category` (
  `id` int(11) NOT NULL,
  `donorKey` varchar(64) NOT NULL,
  `donorCategoryTitle` varchar(256) NOT NULL,
  `author` varchar(256) NOT NULL,
  `date` varchar(64) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `playlist`
--

CREATE TABLE `playlist` (
  `id` int(12) NOT NULL,
  `playlist_key` varchar(16) NOT NULL,
  `placement` varchar(16) NOT NULL,
  `name` varchar(256) NOT NULL,
  `author` varchar(256) NOT NULL,
  `date` varchar(256) NOT NULL,
  `startDate` varchar(256) NOT NULL,
  `endDate` varchar(256) NOT NULL,
  `startTime` varchar(256) NOT NULL,
  `endTime` varchar(256) NOT NULL,
  `active` varchar(256) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `playlist_layout`
--

CREATE TABLE `playlist_layout` (
  `id` int(11) NOT NULL,
  `sequence_id` int(11) NOT NULL,
  `layout` varchar(64) NOT NULL,
  `Caption` varchar(256) NOT NULL,
  `Cta` varchar(256) NOT NULL,
  `Title` varchar(256) NOT NULL,
  `Text` varchar(256) NOT NULL,
  `Quote` varchar(256) NOT NULL,
  `Asset` varchar(256) NOT NULL,
  `Donorlevel` varchar(128) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `playlist_layouts_by_placement`
--

CREATE TABLE `playlist_layouts_by_placement` (
  `id` int(11) NOT NULL,
  `placement` varchar(16) NOT NULL,
  `layout` varchar(64) NOT NULL,
  `element` varchar(64) NOT NULL,
  `element_attributes` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `playlist_sequence`
--

CREATE TABLE `playlist_sequence` (
  `id` int(11) NOT NULL,
  `playlist_id` int(11) NOT NULL,
  `play_order` int(11) NOT NULL,
  `layout` varchar(64) NOT NULL,
  `layoutTitle` varchar(128) NOT NULL,
  `bgMovie` varchar(128) NOT NULL,
  `solo` int(11) NOT NULL DEFAULT '0',
  `duration` int(11) NOT NULL,
  `transition_type` varchar(256) NOT NULL,
  `transition_time` int(11) NOT NULL,
  `transition_asset` varchar(128) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `session`
--

CREATE TABLE `session` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `session_key` varchar(256) NOT NULL,
  `created_on` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `email` varchar(64) NOT NULL,
  `password` varchar(64) NOT NULL,
  `first_name` varchar(64) NOT NULL,
  `last_name` varchar(64) NOT NULL,
  `admin` int(11) NOT NULL DEFAULT '0',
  `last_login` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `media`
--

CREATE TABLE `media` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `path` varchar(64) NOT NULL,
  `type` varchar(64) NOT NULL,
  `aspectRatio`varchar(64) NOT NULL,
  `resolution` varchar(64) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `donors`
--
ALTER TABLE `donors`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `donors_category`
--
ALTER TABLE `donors_category`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `playlist`
--
ALTER TABLE `playlist`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `playlist_layout`
--
ALTER TABLE `playlist_layout`
  ADD PRIMARY KEY (`id`),
  ADD KEY `sequence_id` (`sequence_id`);

--
-- Indexes for table `playlist_layouts_by_placement`
--
ALTER TABLE `playlist_layouts_by_placement`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `playlist_sequence`
--
ALTER TABLE `playlist_sequence`
  ADD PRIMARY KEY (`id`),
  ADD KEY `playlist_id` (`playlist_id`);

--
-- Indexes for table `session`
--
ALTER TABLE `session`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `media`
--
ALTER TABLE `media`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `donors`
--
ALTER TABLE `donors`
  MODIFY `id` int(64) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4104;

--
-- AUTO_INCREMENT for table `donors_category`
--
ALTER TABLE `donors_category`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- AUTO_INCREMENT for table `playlist`
--
ALTER TABLE `playlist`
  MODIFY `id` int(12) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT for table `playlist_layout`
--
ALTER TABLE `playlist_layout`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=54;

--
-- AUTO_INCREMENT for table `playlist_layouts_by_placement`
--
ALTER TABLE `playlist_layouts_by_placement`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `playlist_sequence`
--
ALTER TABLE `playlist_sequence`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=32;

--
-- AUTO_INCREMENT for table `session`
--
ALTER TABLE `session`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=77;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `media`
--
ALTER TABLE `media`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `playlist_layout`
--
ALTER TABLE `playlist_layout`
  ADD CONSTRAINT `playlist_layout_ibfk_1` FOREIGN KEY (`sequence_id`) REFERENCES `playlist_sequence` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `playlist_sequence`
--
ALTER TABLE `playlist_sequence`
  ADD CONSTRAINT `playlist_sequence_ibfk_1` FOREIGN KEY (`playlist_id`) REFERENCES `playlist` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `session`
--
ALTER TABLE `session`
  ADD CONSTRAINT `session_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `media`
--
ALTER TABLE `media`
  ADD CONSTRAINT `media_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
