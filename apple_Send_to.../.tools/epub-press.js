/* Just a copy of the JS file, the original file on the official website:
 * (cs) Jen kopie JS souboru, originalni soubor na oficiální stránce:
 * "https://www.mozzafiller.com/posts/webpage-to-epub-ios"
 * @Wajsar Josef
 */

/**
 * Modified version of epub-press-js (https://github.com/haroldtreen/epub-press-clients/tree/master/packages/epub-press-js)
 * which runs in Scriptable on iOS.
 * 
 * Saves an EPUB version of the given URL to an iCloud Drive folder
 *
 * Expects these Shortcut parameters to be passed in:
 *   title: string
 *   description: string
 *   url: string
 * 
 * You must set up a directory bookmark in Scriptable called "Shortcuts", which points to the
 * "Shortcuts" directory in iCloud Drive
 */

// This script will create a folder called "EPUBs" in this bookmarked directory, and
// EPUB files will be written there
const OUTPUT_DIRECTORY_BOOKMARK_NAME = "Shortcuts";

// Validate inputs provided from Shortcuts
let inputArgs;
if (!args.shortcutParameter) {
    // We're not running as part of a shortcut, add some default args for testing
    inputArgs = {
        title: "Mac-assed Mac Apps",
        description: "",
        url: "https://daringfireball.net/linked/2020/03/20/mac-assed-mac-apps"
    };
} else {
    inputArgs = args.shortcutParameter;
}
assert(inputArgs.title !== undefined, "'title' is a required input argument");
assert(inputArgs.description !== undefined, "'description' is a required input argument");
assert(inputArgs.url !== undefined, "'url' is a required input argument");


function assert(condition, message) {
    if (!condition) {
        throw message || "Assertion failed";
    }
}

function fetch(url, params = {}) {
    const req = new Request(url);
    req.method = params.method || "GET";
    req.body = params.body;
    req.headers = params.headers || {};
    return req.load();
}

function isBrowser() {
    return typeof window !== 'undefined';
}

function log(...args) {
    if (EpubPress.DEBUG) {
        console.log(...args);
    }
}

function isDownloadable(book) {
    if (!book.getId()) {
        throw new Error('Book has no id. Have you published?');
    }
}

function saveFile(filename, data) {
    const fm = FileManager.iCloud();
    const documentsDirectory = fm.bookmarkedPath(OUTPUT_DIRECTORY_BOOKMARK_NAME);
    const ePubsDirectory = fm.joinPath(documentsDirectory, "EPUBs");
    if (!fm.fileExists(ePubsDirectory)) {
        fm.createDirectory(ePubsDirectory);
    }
    const epubPath = fm.joinPath(ePubsDirectory, filename);
    console.log(`Attempting to write to ${epubPath}`);
    fm.write(epubPath, data)
    return epubPath;
}

function getPublishParams(bookData) {
    const body = {
        title: bookData.title,
        description: bookData.description,
    };

    if (bookData.sections) {
        body.sections = bookData.sections;
    } else {
        body.urls = bookData.urls.slice();
    }

    return {
        method: 'POST',
        headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
    };
}

function trackPublishStatus(book) {
    return new Promise((resolve, reject) => {
        var checkStatusCounter = 1
        const trackingCallback = () => {
            console.log(`Checking if the EPUB is ready... Take ${checkStatusCounter}`);
            book.checkStatus().then((status) => {
                book.emit('statusUpdate', status);
                if (Number(status.progress) >= 100) {
                    resolve(book);
                } else if (checkStatusCounter >= EpubPress.CHECK_STATUS_LIMIT) {
                    reject(new Error(EpubPress.ERROR_CODES[503]));
                } else {
                    checkStatusCounter += 1;
                    Timer.schedule(EpubPress.POLL_RATE, false, trackingCallback);
                }
            }).catch(reject);
        };
        trackingCallback();
    });
}

function checkResponseStatus(response) {
    const defaultErrorMsg = EpubPress.ERROR_CODES[response.status];
    if (response.status >= 200 && response.status < 300) {
        return response;
    } else if (response.body) {
        return response.json().then((body) => {
            const hasErrorMsg = body.errors && body.errors.length > 0;
            const errorMsg = hasErrorMsg ? body.errors[0].detail : defaultErrorMsg;
            return Promise.reject(new Error(errorMsg));
        });
    }
    const error = new Error(defaultErrorMsg);
    return Promise.reject(error);
}

function normalizeError(err) {
    const knownError = EpubPress.ERROR_CODES[err.message] || EpubPress.ERROR_CODES[err.name];
    if (knownError) {
        return new Error(knownError);
    }
    return err;
}

function compareVersion(currentVersion, apiVersion) {
    const apiVersionNumber = Number(apiVersion.minCompatible.replace('.', ''));
    const currentVersionNumber = Number(currentVersion.replace('.', ''));

    if (apiVersionNumber > currentVersionNumber) {
        return apiVersion.message;
    }
    return null;
}

function buildQuery(params) {
    const query = ['email', 'filetype'].map((paramName) =>
        params[paramName] ? `${paramName}=${encodeURIComponent(params[paramName])}` : ''
    ).filter(paramStr => paramStr).join('&');
    return query ? `?${query}` : '';
}

class EpubPress {
    static getPublishUrl() {
        return this.prototype.getPublishUrl();
    }

    static getVersionUrl() {
        return `${EpubPress.BASE_API}/version`;
    }

    static getVersion() {
        return EpubPress.VERSION;
    }

    constructor(bookData) {
        const date = Date().slice(0, Date().match(/\d{4}/).index + 4);
        const defaults = {
            title: `EpubPress - ${date}`,
            description: undefined,
            sections: undefined,
            urls: undefined,
            filetype: 'epub',
        };

        this.bookData = Object.assign({}, defaults, bookData);
        this.events = {};
    }

    on(eventName, callback) {
        if (!this.events[eventName]) {
            this.events[eventName] = [];
        }

        this.events[eventName].push(callback);
        return callback;
    }

    emit(eventName, ...args) {
        if (this.events[eventName]) {
            this.events[eventName].forEach((cb) => {
                cb(...args);
            });
        }
    }

    removeListener(eventName, callback) {
        if (!this.events[eventName]) {
            return;
        }

        const index = this.events[eventName].indexOf(callback);
        if (index >= 0) {
            this.events[eventName].splice(index, 1);
        }
    }

    getUrls() {
        let bookUrls = [];
        const { urls, sections } = this.bookData;

        if (urls) {
            bookUrls = urls.slice();
        } else if (sections) {
            bookUrls = sections.map((section) => section.url);
        }
        return bookUrls;
    }

    getFiletype(providedFiletype) {
        const filetype = providedFiletype || this.bookData.filetype;
        if (!filetype) {
            return 'epub';
        }

        return ['mobi', 'epub'].find((type) => filetype.toLowerCase() === type) || 'epub';
    }

    getEmail() {
        return this.bookData.email;
    }

    getTitle() {
        return this.bookData.title;
    }

    getDescription() {
        return this.bookData.description;
    }

    getId() {
        return this.bookData.id;
    }

    getStatusUrl() {
        return `${EpubPress.getPublishUrl()}/${this.getId()}/status`;
    }

    getPublishUrl() {
        return `${EpubPress.BASE_API}/books`;
    }

    getDownloadUrl(filetype = this.getFiletype()) {
        const query = buildQuery({ filetype });
        return `${this.getPublishUrl()}/${this.getId()}/download${query}`;
    }

    getEmailUrl(email = this.getEmail(), filetype = this.getFiletype()) {
        const query = buildQuery({ email, filetype });
        return `${this.getPublishUrl()}/${this.getId()}/email${query}`;
    }

    async checkStatus() {
        // const req = new Request(this.getStatusUrl())
        // const responseJson = await req.loadJSON()
        // checkResponseStatus(req.response)
        // return responseJson;
        return new Promise((resolve, reject) => {
            fetch(this.getStatusUrl())
            .then((data) => {
                return JSON.parse(data.toRawString());
            })
            .then((body) => {
                resolve(body);
            })
            .catch((e) => {
                const error = normalizeError(e);
                reject(error);
            });
        });
    }

    publish() {
        if (this.isPublishing) {
            return Promise.reject(new Error('Publishing in progress'));
        } else if (this.getId()) {
            return Promise.resolve(this.getId());
        }
        this.isPublishing = true;
        const publishUrl = this.getPublishUrl();
        const publishParams = getPublishParams(this.bookData);
        return new Promise((resolve, reject) => {
            fetch(publishUrl, publishParams)
            .then((data) => {
                const dataString = data.toRawString();
                return JSON.parse(dataString);
            })
            .then(({ id }) => {
                this.bookData.id = id;
                return trackPublishStatus(this).then(() => {
                    resolve(id);
                });
            })
            .catch((e) => {
                this.isPublishing = false;
                const error = normalizeError(e);
                log('EbupPress: Publish failed', error);
                reject(error);
            });
        });
    }

    download(filetype) {
        return new Promise((resolve, reject) => {
            isDownloadable(this);
            console.log("Downloading EPUB...")
            fetch(this.getDownloadUrl(filetype))
            .then((response) => {
                console.log("Attempting to save file");
                const sanitizedTitle = sanitize(this.getTitle(), "_");
                const filename = `${sanitizedTitle}.${filetype || this.getFiletype()}`;
                const filePath = saveFile(filename, response);
                console.log("Finished saving file");
                resolve(filename);
            })
            .catch((e) => {
                const error = normalizeError(e);
                log('EpubPress: Download failed', error);
                reject(error);
            });
        });
    }
}

EpubPress.BASE_URL = "https://epub.press";
EpubPress.BASE_API = `${EpubPress.BASE_URL}/api/v1`;

EpubPress.VERSION = "0.5.3";
EpubPress.POLL_RATE = 3000;
EpubPress.CHECK_STATUS_LIMIT = 40;

EpubPress.DEBUG = true;

EpubPress.ERROR_CODES = {
    // Book Create Errors
    0: 'Server is down. Please try again later.',
    'Failed to fetch': 'Server is down. Please try again later.',
    'FetchError': 'Server is down. Please try again later.',
    400: 'There was a problem with the request. Is EpubPress up to date?',
    404: 'Resource not found.',
    422: 'Request contained invalid data.',
    500: 'Unexpected server error.',
    503: 'Server took too long to respond.',
    timeout: 'Request took too long to complete.',
    error: undefined,
    // Download Errors
    SERVER_FAILED: 'Server error while downloading.',
    SERVER_BAD_CONTENT: 'Book could not be found',
};

// Filename sanitisation util function taken from https://github.com/parshap/node-sanitize-filename

var illegalRe = /[\/\?<>\\:\*\|"]/g;
var controlRe = /[\x00-\x1f\x80-\x9f]/g;
var reservedRe = /^\.+$/;
var windowsReservedRe = /^(con|prn|aux|nul|com[0-9]|lpt[0-9])(\..*)?$/i;
var windowsTrailingRe = /[\. ]+$/;

function sanitize(input, replacement) {
  if (typeof input !== 'string') {
    throw new Error('Input must be string');
  }
  var sanitized = input
    .replace(illegalRe, replacement)
    .replace(controlRe, replacement)
    .replace(reservedRe, replacement)
    .replace(windowsReservedRe, replacement)
    .replace(windowsTrailingRe, replacement);
  return sanitized.substring(0, 255);
}

// export default EpubPress;

const ebook = new EpubPress({
    title: inputArgs.title,
    description: inputArgs.description,
    urls: [ inputArgs.url ]
});

const filename = await ebook.publish().then(() => {
    return ebook.download();
})
.then((filename) => {
    console.log(`Success! File was named '${filename}'`);
    return filename;
})
.catch((error) => {
    console.log(`Error: ${error}`);
});

const shortcutsCallbackUrl = new CallbackURL("shortcuts://run-shortcut");
shortcutsCallbackUrl.addParameter("name", "Add Downloaded EPUB To Books");
shortcutsCallbackUrl.addParameter("input", "text");
shortcutsCallbackUrl.addParameter("text", filename);
shortcutsCallbackUrl.open();

return filename;