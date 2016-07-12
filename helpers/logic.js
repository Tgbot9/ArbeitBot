let strings = require('./strings');
let keyboards = require('./keyboards');
let dbmanager = require('./dbmanager');
let check = require('./messageParser');
let bot = require('./telegramBot');
let categoryPicker = require('./categoryPicker');

// Handle messages

bot.on('message', msg => {
	if (check.botCommandStart(msg)) {
		dbmanager.addUser(msg.from, err => {
			sendMainMenu(msg.chat.id);
		});
	} else if (check.replyMarkup(msg)) {
		handleInline(msg);
	} else {
		console.log(msg);
	}
});

bot.on('inline.callback.query', msg => {
	if (msg.data.indexOf(strings.categoryInline) > -1) {
		categoryPicker.handleInline(bot, msg);
	}
});

// Helpers

function handleInline(msg) {
	let text = msg.text;
	let mainMenuOptions = strings.mainMenuOptions;
	let freelanceMenuOptions = strings.freelanceMenuOptions;

	// Check main menu
	if (text == mainMenuOptions.findJobs) {
		sendFreelanceMenu(msg.chat.id);
	} else if (text == mainMenuOptions.findContractors) {

	} else if (text == mainMenuOptions.changeLanguage) {
		sendChangeLanguage(msg.chat.id);
	} else if (text == mainMenuOptions.help) {
		sendHelp(msg.chat.id);
	}
	// Check freelance menu
	else if (text == freelanceMenuOptions.editBio) {

	} else if (text == freelanceMenuOptions.editCategories) {
		categoryPicker.sendCategories(bot, msg.chat.id);
	} else if (text == freelanceMenuOptions.editHourlyRate) {
		sendEditHourlyRate(msg.chat.id);
	} else if (text == freelanceMenuOptions.back) {
		sendMainMenu(msg.chat.id);
	} else if (text == freelanceMenuOptions.busy || text == freelanceMenuOptions.available) {
		toggleUserAvailability(msg.chat.id);
	}
};

// Sending messages

function sendMainMenu(chatId) {
	keyboards.sendKeyboard(
		bot,
		chatId, 
		strings.mainMenuMessage, 
		keyboards.mainMenuKeyboard);
};

function sendFreelanceMenu(chatId) {
	dbmanager.getUser(chatId, (err, user) => {
		if (err) {
			// todo: handle error
		} else if (user) {
			let keyboard = (user.busy ? 
				keyboards.freelanceBusyMenuKeyboard : 
				keyboards.freelanceAvailableMenuKeyboard)
			keyboards.sendKeyboard(
				bot,
				chatId,
				strings.findJobsMessage,
				keyboard);
		} else {
			// todo: handle case when user doesn't exist – basically impossible one
		}
	});
};

function sendEditHourlyRate(chatId) {
	keyboards.sendInline(
		bot,
		chatId,
		strings.editHourlyRateMessage,
		keyboards.hourlyRateKeyboard);
};

function sendChangeLanguage(chatId) {
	keyboards.sendInline(
		bot,
		chatId,
		strings.languageMessage,
		keyboards.languageKeyboard);
};

function sendHelp(chatId) {
	keyboards.sendInline(
		bot,
		chatId,
		strings.helpMessage,
		keyboards.helpKeyboard);
};

function sendCategories(chatId) {

}

// Helpers

function toggleUserAvailability(chatId) {
	dbmanager.toggleUserAvailability(chatId, (err, user) => {
		if (err) {
			// todo: handle error
		} else if (user) {
			let keyboard = (user.busy ? 
				keyboards.freelanceBusyMenuKeyboard : 
				keyboards.freelanceAvailableMenuKeyboard)
			let message = (user.busy ? 
				strings.becameBusyMessage : 
				strings.becameAvailableMessage)
			keyboards.sendKeyboard(
				bot,
				chatId,
				message,
				keyboard);
		} else {
			// todo: handle case when user doesn't exist – basically impossible one
		}
	});
};