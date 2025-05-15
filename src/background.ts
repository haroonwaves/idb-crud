/**
 * This file is part of idb-crud.
 *
 * idb-crud is licensed under the GNU General Public License v3.0.
 * See the LICENSE file for more details.
 */

chrome.action.onClicked.addListener((tab) => {
	if (tab.id) void chrome.tabs.sendMessage(tab.id, { action: 'icon_clicked' });
});
