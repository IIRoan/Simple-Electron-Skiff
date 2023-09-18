const { app, BrowserWindow, Notification } = require('electron')
const { ipcMain } = require('electron');
const path = require('path');

app.whenReady().then(() => {
    // Makes the window
    const mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        icon: path.join(__dirname, './public/app.png'),
        webPreferences: {
            nodeIntegration: true, // is default value after Electron v5
            contextIsolation: true, // protect against prototype pollution
            enableRemoteModule: false, // turn off remote
        }
    })

    // Checks if platform is windows, if it is, gives the app a name.
    if (process.platform === 'win32') {
        app.setAppUserModelId("Skiff Electron");
    }

    // Loads the URL
    mainWindow.loadURL('https://app.skiff.com/mail')

    // Add event listener to the console object
    mainWindow.webContents.on('console-message', (event, level, message, line, sourceId) => {
        if (message.includes('emails, requerying')) {
            // Executes function on recieving Mail
            MailNotifier();
        }
    });

    function MailNotifier() {
        // New email notification
        const NOTIFICATION_TITLE = 'Skiff Mail'
        const NOTIFICATION_BODY = 'You recieved a new mail'
        new Notification({ title: NOTIFICATION_TITLE, body: NOTIFICATION_BODY, icon: './public/app.png' }).show()
    }
});