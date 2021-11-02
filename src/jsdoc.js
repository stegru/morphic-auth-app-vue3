// Documentation for some types used throughout the site.

/* eslint-disable jsdoc/require-property-description */

/**
 * The button catalog
 * @typedef {Object<String,ButtonCatalogItem>} ButtonCatalog
 */

/**
 * A category in the button catalog
 * @typedef {Object} ButtonCatalogItem
 * @property {String} title The title in the list.
 * @property {String} defaultIcon The icon to use if a bar item doesn't specify it.
 * @property {String} editTitle The title of the edit dialog, for this subkind.
 * @property {String} editItemField The field of the item, in the edit dialog.
 * @property {String} selectionText Text for the drop-down field when no item is selected
 * @property {String} selectionError Error message if an item has not been selected.
 * @property {Boolean} allowReselection true to allow the app/link to be changed after it was created.
 * @property {String} kind The kind of all items (undefined if any differ)
 * @property {Boolean} related True if the items are related (shows the group tab in the edit dialog)
 * @property {Boolean} hasSecondary True there are secondary items in the group (item.is_primary is false)
 * @property {Boolean} hidden true to not display this group.
 * @property {BarItemConfiguration} more Configuration for the more item.
 * @property {Object<String,BarItem>} items The buttons.
 */

/**
 * A bar
 * @typedef {Object} BarDetails
 * @property {String} id Bar ID.
 * @property {String} name Display name.
 * @property {Boolean} is_shared Whether the bar is shown in the list of preconfigured bars that can be shared across
 *   multiple users.
 * @property {Array<BarItem>} items The bar items
 * @property {Array<BarError>} errors
 */

/**
 * Bar error
 * @typedef {Object} BarError
 * @property {BarItem|Array<BarItem>} item The problematic bar item.
 * @property {String} type "duplicate" | "validation"
 * @property {String} level "warn" | "error" (default)
 * @property {String} message The error message.
 * @property {Array<BarItem>} duplicates The duplicated items.
 */

/**
 * Item of a bar.
 *
 * @typedef {Object} BarItem
 * @property {GUID} barId The bar this item belongs to.
 * @property {String} id Unique identifier.
 * @property {String} kind The kind of item (url, application, action).
 * @property {Boolean} is_primary
 * @property {Boolean?} production true for production only, false for never in production. undefined for both.
 * @property {BarItemData} data Web-app data.
 * @property {BarItemConfiguration} configuration Bar item options
 */

/**
 * BarItem data for the web-app
 * @typedef {Object} BarItemData
 * @property {String} buttonKey Key in the buttons object, where this item was taken from.
 * @property {String} subkind The item category (email, news).
 * @property {Boolean} [isPlaceholder] true if this button is a place-holder, where the site has not been chosen.
 * @property {Boolean} [isExpander] true if this item is used in the catalog to show the secondary items.
 * @property {Boolean} [showEdit] true/false to always/never show the editor dialog when the item is added.
 * @property {Boolean} catalogItem true if this instance is in the catalog (not added to the bar)
 * @property {String} catalogLabel Label in the catalog (if different to `label`).
 * @property {String} category Category in the catalog
 * @property {Boolean} [hasError] true if one of the parameter values has a validation error.
 * @property {Boolean} isNew true if the item has been just added from the catalog, before the customisation dialog has
 *  been displayed.
 * @property {Object<String,String>} parameters Values of the named parameters used in fields.
 * @property {Array<String>} paramFields The field names of this object which are parameterised.
 * @property {Object<String,ItemProblem>} problems Results of the last problem check.
 */

/**
 * Configuration options of a BarItem
 * @typedef {BarItemConfiguration_Url|BarItemConfiguration_Application} BarItemConfiguration
 */

/**
 * General configuration options of a BarItem
 *
 * @typedef {Object} BarItemConfigurationBase
 * @property {String} label Button text
 * @property {String} color Button color (html string)
 * @property {String} image_url Link to the image (relative or absolute)
 * @property {String} image_path Path to the icon file on the webserver (used by the client if it doesn't have a local image for image_url).
 * @property {String} description More info.
 */

/**
 * Options of a `kind = "url"` BarItem.
 *
 * @typedef {BarItemConfigurationBase} BarItemConfiguration_Url
 * @property {String} url The address.
 */

/**
 * Options of a `kind = "application"` BarItem.
 *
 * @typedef {BarItemConfigurationBase} BarItemConfiguration_Application
 * @property {String} default
 * @property {String} exe
 */


/**
 * Community
 * @typedef {Object} Community
 * @property {String} id The community id.
 * @property {String} name The new community name.
 * @property {String} default_bar_id The default bar for this community.
 * @property {Number} member_count The number of members in the community that count towards the plan maximum.
 * @property {Number} member_limit The maximum number of members allowed according to the plan.
 * @property {Boolean} is_locked Indicates the community is locked because of payment issues.
 */

/**
 * Community member
 * @typedef {Object} CommunityMember
 * @property {String} id The member's unique id.
 * @property {String} first_name The member's first name.
 * @property {String} last_name The member's last name.
 * @property {String} fullName The member's full name (auto-generated).
 * @property {String} displayName The member's full name, for displaying (adds "(you)" for the current user).
 * @property {String} role The member's role ("manager" or "member").
 * @property {"active"|"invited"|"uninvited"} state The member's state.
 * @property {String} stateText The member's state, for displaying (auto-generated).
 * @property {Array<GUID>} bar_ids The member's bars
 * @property {String} userId The member's userId.
 * @property {Boolean} isCurrent true if this member is the current user accessing the site.
 */

/**
 * Invitation details
 * @typedef {Object} Invitation
 * @property {GUID} invitationId The invitation id.
 * @property {GUID} communityId The community id.
 * @property {String} communityName The community name.
 * @property {String} email The invitee's email.
 * @property {String} name The invitee's name.
 */

/**
 * User details
 * @typedef {Object} UserDetails
 * @property {GUID} id user id.
 * @property {String} email The email address.
 * @property {Boolean} email_verified true if the email address is verified.
 * @property {String} first_name The first name.
 * @property {String} last_name The last name.
 * @property {String} fullName The full name (auto-generated).
 */
