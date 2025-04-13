chrome.action.onClicked.addListener((tab) => {
	if (tab.id) chrome.tabs.sendMessage(tab.id, { action: 'icon_clicked' });
});
