-- MySQL dump 10.11
--
-- Host: localhost    Database: imuseweb_dev
-- ------------------------------------------------------
-- Server version	5.0.70-log

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `conditions`
--

DROP TABLE IF EXISTS `conditions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `conditions` (
  `conditionid` int(10) unsigned NOT NULL auto_increment,
  `conditiontext` varchar(200) NOT NULL default '',
  `projectid` int(32) unsigned NOT NULL default '0',
  PRIMARY KEY  (`conditionid`),
  KEY `projectid` (`projectid`)
) ENGINE=InnoDB AUTO_INCREMENT=69 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `domain_concept`
--

DROP TABLE IF EXISTS `domain_concept`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `domain_concept` (
  `domainid` int(11) NOT NULL auto_increment,
  `name` varchar(100) NOT NULL default '',
  `info` text NOT NULL,
  `projectid` int(32) unsigned NOT NULL default '0',
  PRIMARY KEY  (`domainid`),
  KEY `projectid` (`projectid`)
) ENGINE=InnoDB AUTO_INCREMENT=64 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `domain_concept_relations`
--

DROP TABLE IF EXISTS `domain_concept_relations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `domain_concept_relations` (
  `relationid` int(10) unsigned NOT NULL auto_increment,
  `domainid` int(10) unsigned NOT NULL default '0',
  `related_domainid` int(10) unsigned NOT NULL default '0',
  PRIMARY KEY  (`relationid`),
  KEY `domainid` (`domainid`)
) ENGINE=InnoDB AUTO_INCREMENT=32 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `events`
--

DROP TABLE IF EXISTS `events`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `events` (
  `eventid` int(10) unsigned NOT NULL auto_increment,
  `info` text NOT NULL,
  `name` varchar(200) NOT NULL default '',
  `hasimage` tinyint(1) unsigned NOT NULL default '0',
  `projectid` int(32) unsigned NOT NULL default '0',
  PRIMARY KEY  (`eventid`),
  KEY `projectid` (`projectid`)
) ENGINE=InnoDB AUTO_INCREMENT=111 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `projects`
--

DROP TABLE IF EXISTS `projects`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `projects` (
  `projectid` int(32) unsigned NOT NULL auto_increment,
  `name` varchar(100) NOT NULL default '',
  `info` text NOT NULL,
  `domainname` varchar(100) NOT NULL default '',
  PRIMARY KEY  (`projectid`),
  UNIQUE KEY `domainname` (`domainname`)
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `stories`
--

DROP TABLE IF EXISTS `stories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `stories` (
  `storyid` int(10) unsigned NOT NULL auto_increment,
  `name` varchar(100) NOT NULL default '',
  `storyjson` text NOT NULL,
  `projectid` int(32) unsigned NOT NULL default '0',
  PRIMARY KEY  (`storyid`),
  KEY `projectid` (`projectid`)
) ENGINE=InnoDB AUTO_INCREMENT=36 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2010-04-27 21:16:04
