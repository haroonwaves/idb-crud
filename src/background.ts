chrome.action.onClicked.addListener((tab) => {
	if (tab.id) void chrome.tabs.sendMessage(tab.id, { action: 'icon_clicked' });
});
