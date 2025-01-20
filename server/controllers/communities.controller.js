const Community = require("../models/community.model");

/**
 * Réccupère jusqu'à 10 communautés auxquelles l'utilisateur n'appartient pas
 * Inclu leur noms, leur bannière, le nombre de membres
 * Elles sont triées par nombre de membres décroissant
 * 
 * @route GET /communities/notmember
 */
exports.getNotMemberCommunities = (req, res, next) => {};

/**
 * Réccupère toutes les communautés auxquelles l'utilisateur appartient
 * Inclu les ID des communautés, leur noms, leur bannière, le nombre de membres et leur description
 * 
 * @route GET /communities/member
 */
exports.getMemberCommunities = (req, res, next) => {};

/**
 * Réccupère les membres d'une communauté
 * 
 * @route GET /communities/:name/members 
 */
exports.getCommunityMembers = (req, res, next) => {};

/**
 * Réccupère les informations d'une communauté
 * 
 * @route GET /communities/:name
 */
exports.getCommunity = (req, res, next) => {};

/**
 * Réccupère TOUTES les communautés
 * 
 * @route GET /communities
 */
exports.getCommunities = (req, res, next) => {};

/**
 * Rejoindre une communauté
 * 
 * @route POST /communities/:name/join
 */
exports.joinCommunity = (req, res, next) => {};

/**
 * Quitter une communauté
 * 
 * @route POST /communities/:name/leave
 */
exports.leaveCommunity = (req, res, next) => {};



