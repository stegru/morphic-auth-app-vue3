import { HTTP } from "@/services/index";
import i18n from "@/i18n/i18n";

/**
 * @typedef {String} GUID
 */

/**
 * Get a list of communities the user belongs to.
 * @see https://github.com/raisingthefloor/morphic-api-server/blob/master/Documentation/API.md#v1usersidcommunities
 * @param {GUID} userId The user ID.
 * @return {Promise<AxiosResponse<Any>>} Response
 */
export function getUserCommunities(userId) {
    return HTTP.get(`/v1/users/${userId}/communities`, {action: "get user communities"});
}

/**
 * Creates a new community.
 * @see https://github.com/raisingthefloor/morphic-api-server/blob/master/Documentation/API.md#v1communities
 * @param {String} name Community name.
 * @return {Promise<AxiosResponse<Any>>} Response.
 */
export function createNewCommunity(name) {
    const data = {
        name: name
    };
    return HTTP.post("/v1/communities", data, {action: "create new community"});
}

/**
 * Gets a community details.
 * @see https://github.com/raisingthefloor/morphic-api-server/blob/master/Documentation/API.md#v1communitiesid
 * @param {GUID} communityId The community ID.
 * @return {Promise<AxiosResponse<Community>>} Response
 */
export function getCommunity(communityId) {
    return HTTP.get(`/v1/communities/${communityId}`, {action: "get community"});
}

/**
 * Update a community (only the name and default bar).
 * @see https://github.com/raisingthefloor/morphic-api-server/blob/master/Documentation/API.md#v1communitiesid
 * @param {Community} communityId The community.
 * @param {Community} name The new community name.
 * @param {Community} defaultBarId The new default bar for the community.
 * @return {Promise<AxiosResponse<Community>>} Response
 */
export function updateCommunity(communityId, name, defaultBarId) {
    return HTTP.put(`/v1/communities/${communityId}`, {
        name: name,
        default_bar_id: defaultBarId
    }, {action: "update community"});
}

/**
 * Delete a community.
 * @see https://github.com/raisingthefloor/morphic-api-server/blob/master/Documentation/API.md#delete
 * @param {GUID} communityId The community ID.
 * @return {Promise<AxiosResponse<Any>>} Response
 */
export function deleteUserCommunity(communityId) {
    return HTTP.delete(`/v1/communities/${communityId}`, {action: "delete user community"});
}

/**
 * Saves a community bar.
 * @see https://github.com/raisingthefloor/morphic-api-server/blob/master/Documentation/API.md#put-4
 * @param {GUID} communityId The community ID.
 * @param {GUID} barId The bar ID.
 * @param {BarDetails} barDetails The bar.
 * @return {Promise<AxiosResponse<Any>>} Response
 */
export function saveCommunityBar(communityId, barId, barDetails) {
    return HTTP.put(`/v1/communities/${communityId}/bars/${barId}`, storeBar(barDetails), {action: "save bar"});
}

/**
 * Updates a community bar.
 * (appears to be a duplicate of saveCommunityBar)
 * @see https://github.com/raisingthefloor/morphic-api-server/blob/master/Documentation/API.md#put-4
 * @deprecated Use saveCommunityBar
 * @param {GUID} communityId The community ID.
 * @param {GUID} barId The bar ID.
 * @param {BarDetails} bar The bar.
 * @return {Promise<AxiosResponse<Any>>} Response
 */
export function updateCommunityBar(communityId, barId, bar) {
    return saveCommunityBar(communityId, barId, bar);
}

/**
 * Deletes a community bar.
 * @see https://github.com/raisingthefloor/morphic-api-server/blob/master/Documentation/API.md#delete-2
 * @param {GUID} communityId The community ID.
 * @param {GUID} barId The bar ID.
 * @return {Promise<AxiosResponse<Any>>} Response
 */
export function deleteCommunityBar(communityId, barId) {
    return HTTP.delete(`/v1/communities/${communityId}/bars/${barId}`, {action: "delete bar"});
}

/**
 * @typedef {Object} CommunityMembersResult
 * @property {Array<CommunityMember>} members The members.
 */

/**
 * Gets the list of community members.
 * @see https://github.com/raisingthefloor/morphic-api-server/blob/master/Documentation/API.md#endpoint-community-member
 * @param {GUID} communityId The community ID.
 * @return {Promise<AxiosResponse<{CommunityMembersResult}>>} Response.
 */
export function getCommunityMembers(communityId) {
    return HTTP.get(`/v1/communities/${communityId}/members`).then((r) => {
        var userId = localStorage.getItem("userId");
        r.data.members.forEach(member => makeMember(member, userId));
        return r;
    }, {action: "get members"});
}

/**
 * Add a new community member.
 * @see https://github.com/raisingthefloor/morphic-api-server/blob/master/Documentation/API.md#v1communitiesidmembers
 * @param {GUID} communityId The community ID.
 * @param {CommunityMember} member The new member (only first_name and last_name is used).
 * @return {Promise<AxiosResponse<CommunityMember>>} Result
 */
export function addCommunityMember(communityId, member) {
    return HTTP.post(`/v1/communities/${communityId}/members`, member, {action: "add member"}).then(r => {
        makeMember(r.data.member);
        return r;
    });
}

/**
 * Gets a community member's details.
 * @see https://github.com/raisingthefloor/morphic-api-server/blob/master/Documentation/API.md#endpoint-community-member
 * @param {GUID} communityId The community ID.
 * @param {GUID} memberId The member ID.
 * @return {Promise<AxiosResponse<CommunityMember>>} Response.
 */
export function getCommunityMember(communityId, memberId) {
    return HTTP.get(`/v1/communities/${communityId}/members/${memberId}`, {action: "get member"}).then(r => {
        makeMember(r.data);
        return r;
    });
}

/**
 * Updates a community member's details.
 * @see https://github.com/raisingthefloor/morphic-api-server/blob/master/Documentation/API.md#endpoint-community-member
 * @param {GUID} communityId The community ID.
 * @param {GUID} memberId The member ID.
 * @param {CommunityMember} member The member details.
 * @return {Promise<AxiosResponse<Any>>} Response.
 */
export function updateCommunityMember(communityId, memberId, member) {
    return HTTP.put(`/v1/communities/${communityId}/members/${memberId}`, member, {action: "update member"});
}

/**
 * Removes a member from a community.
 * @see https://github.com/raisingthefloor/morphic-api-server/blob/master/Documentation/API.md#v1communitiescidmembersid
 * @param {GUID} communityId The community ID.
 * @param {GUID} memberId The member ID.
 * @return {Promise<AxiosResponse<Any>>} Response.
 */
export function deleteCommunityMember(communityId, memberId) {
    return HTTP.delete(`/v1/communities/${communityId}/members/${memberId}`, {action: "delete member"});
}

/**
 * Send a new invitation for a community member.
 * @see https://github.com/raisingthefloor/morphic-api-server/blob/master/Documentation/API.md#v1communitiesidinvitations
 * @param {GUID} communityId The community ID.
 * @param {GUID} memberId The member ID.
 * @param {String} email The member's email address, if not already added.
 * @param {String} message Additional information.
 * @return {Promise<AxiosResponse<Any>>} Response.
 */
export function inviteCommunityMember(communityId, memberId, email, message) {
    return HTTP.post(`/v1/communities/${communityId}/invitations`, { member_id: memberId, email: email, message: message }, {action: "invite member"});
}

/**
 * Accept an invitation for a community member.
 * @see https://github.com/raisingthefloor/morphic-api-server/blob/master/Documentation/API.md#v1communitiesidinvitations
 * @param {GUID} communityId The community ID.
 * @param {GUID} invitationId The member ID.
 * @return {Promise<AxiosResponse<Any>>} Response.
 */
export function acceptCommunityMemberInvite(communityId, invitationId) {
    return HTTP.post(`/v1/communities/${communityId}/invitations/${invitationId}/accept`, { }, {action: "accept invite"});
}

/**
 * Performs some tweaks to the bar before it gets stored.
 * @param {BarDetails} bar The bar.
 * @return {BarDetails} The bar.
 */
function storeBar(bar) {
    /** @type {BarDetails} */
    const togo = JSON.parse(JSON.stringify(bar));

    // Make sure it has a name
    if (!togo.name) {
        togo.name = "Unnamed";
    }

    togo.items.forEach(item => {
        item.is_primary = !!item.is_primary;
        if (item.kind === "application") {
            // For application items, remove the exe or default - only 1 is needed.
            if (item.configuration.default) {
                delete item.configuration.exe;
            } else {
                delete item.configuration.default;
            }
        }

        item.configuration._webapp = item.data;
        delete item.data;
    });

    return togo;
}

/**
 * Adds some intelligence to a member object returned from the API server.
 * @param {CommunityMember} member The member object.
 * @param {GUID} [currentUserId] The current user id
 */
function makeMember(member, currentUserId) {
    var userId = currentUserId || localStorage.getItem("userId");
    const noName = "(no name)";
    member.isCurrent = userId && member.userId === userId;

    Object.defineProperty(member, "fullName", {
        get() {
            return !this.first_name && !this.last_name
                ? noName
                : `${this.first_name || ""} ${this.last_name || ""}`.trim();
        }
    });

    Object.defineProperty(member, "displayName", {
        get() {
            let togo;
            if (this.isCurrent) {
                togo = this.fullName === noName
                    ? "You"
                    : `${this.fullName} (You)`;
            } else {
                togo = this.fullName;
            }
            return togo;
        }
    });

    Object.defineProperty(member, "stateText", {
        get() {
            const key = `General.member-state.${this.state}`;
            return i18n.t(key);
        }
    });
}
