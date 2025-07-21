export default defineBackground(() => {
	(browser.action ?? browser.browserAction).onClicked.addListener((tab) => {
		if (tab.id) void browser.tabs.sendMessage(tab.id, { type: 'MOUNT_UI' });
	});
});
