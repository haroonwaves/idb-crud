export default defineBackground(() => {
	(browser.action ?? browser.browserAction).onClicked.addListener(async (tab) => {
		if (tab.id) void browser.tabs.sendMessage(tab.id, { type: 'MOUNT_UI' });
	});
});
